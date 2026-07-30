import { notFound } from 'next/navigation';
import { backendFetch } from '@/lib/backend';
import ProductForm from '@/components/admin/product-form';
import type { Product } from '@/lib/products';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  let data: { product: Product };
  try {
    data = await backendFetch(`/shop/products/${encodeURIComponent(id)}`);
  } catch {
    notFound();
  }

  const initial = data?.product;
  if (!initial) notFound();

  return <ProductForm mode="edit" initial={initial} />;
}
