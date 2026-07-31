'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'This field is required.'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        router.push(next);
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => ({}));
      setFormError(
        typeof data.error === 'string'
          ? data.error
          : 'That email and password don\'t match. Try again.',
      );
    } catch {
      setFormError('The shop can\'t sign anyone in right now. Try again in a few minutes.');
    }
  };

  return (
    <Card className="max-w-[380px] w-full border border-[rgba(26,24,20,0.12)] shadow-sm !bg-white">
      <CardContent className="p-8">
        <div className="h-[2px] bg-[#B8763A] mb-6" />

        <h1 className="text-[28px] font-medium leading-[1.25] mb-2 text-[#1A1814]">
          Welcome back.
        </h1>
        <p className="text-[13px] text-[rgba(26,24,20,0.6)] mb-6">
          Sign in to your Clothly account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[13px] text-[#1A1814]">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-[13px] text-[#8B2E1F]">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[13px] text-[#1A1814]">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-[13px] text-[#8B2E1F]">{errors.password.message}</p>
            )}
          </div>

          {formError && (
            <p className="text-[13px] text-[#8B2E1F]">{formError}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A1814] text-[#FAF7F2] hover:bg-[#1A1814]/90 rounded-lg h-12"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-[13px] text-[rgba(26,24,20,0.6)] text-center">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-[#B8763A] underline underline-offset-2">
            Create one
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}
