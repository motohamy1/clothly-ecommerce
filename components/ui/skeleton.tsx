import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type SkeletonProps = ComponentProps<'div'>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-[rgba(26,24,20,0.08)] motion-reduce:animate-none', className)}
    />
  );
}
