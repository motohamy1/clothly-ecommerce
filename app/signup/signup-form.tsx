'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const signupSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
  confirmPassword: z.string().min(8, 'Use at least 8 characters.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match.',
  path: ['confirmPassword'],
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupValues) => {
    setFormError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => ({}));
      setFormError(
        typeof data.error === 'string'
          ? data.error
          : 'We couldn\'t create your account. Try again.',
      );
    } catch {
      setFormError('The shop can\'t create accounts right now. Try again in a few minutes.');
    }
  };

  return (
    <Card className="max-w-[380px] w-full border shadow-none">
      <CardContent className="p-8">
        <div className="h-[2px] bg-[#B8763A] mb-6" />

        <h1 className="text-[28px] font-medium leading-[1.25] mb-2 text-[#1A1814]">
          Create your account.
        </h1>
        <p className="text-[13px] text-[rgba(26,24,20,0.6)] mb-6">
          Save your details for faster checkout.
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-[13px] text-[#8B2E1F]">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[13px] text-[#1A1814]">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Type the same password again"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-[13px] text-[#8B2E1F]">{errors.confirmPassword.message}</p>
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
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-[13px] text-[rgba(26,24,20,0.6)] text-center">
          Already have an account?{' '}
          <a href="/login" className="text-[#B8763A] underline underline-offset-2">
            Sign in
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}
