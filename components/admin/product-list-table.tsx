'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import type { Product } from '@/lib/products';
import { useAdminToast } from '@/components/admin/toast';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ProductListTableProps {
  products: Product[];
}

export default function ProductListTable({ products }: ProductListTableProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const res = await fetch(`/api/admin/products/${pendingDelete.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Removed.');
      router.refresh();
    } else {
      toast.error("Couldn't remove. Try again.");
    }
    setPendingDelete(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Group</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id} className="hover:bg-[rgba(26,24,20,0.03)]">
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-[#1A1814] hover:underline font-medium"
                  >
                    {p.name}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="capitalize">{p.section}</TableCell>
              <TableCell className="capitalize">{p.group}</TableCell>
              <TableCell className="text-right tabular-nums">
                ${p.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-[rgba(26,24,20,0.6)] text-[13px]">&mdash;</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => router.push(`/admin/products/${p.id}`)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setPendingDelete(p)}
                      className="text-[#8B2E1F]"
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {pendingDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will take the product off the storefront immediately. You can re-add it later,
              but any product details will need to be re-entered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[#8B2E1F] hover:bg-[#8B2E1F]/90 text-[#FAF7F2]"
            >
              Remove product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
