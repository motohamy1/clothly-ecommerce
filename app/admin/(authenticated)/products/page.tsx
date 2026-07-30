import Link from 'next/link';
import { backendFetch } from '@/lib/backend';
import type { Product } from '@/lib/products';
import ProductListTable from '@/components/admin/product-list-table';

export default async function ProductsListPage() {
  const data = await backendFetch('/shop/products');
  const products: Product[] = Array.isArray(data?.products) ? data.products : [];

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-[24px] font-semibold text-[#1A1814]">No products yet</h2>
        <p className="mt-2 text-[15px] text-[rgba(26,24,20,0.6)]">
          Start by adding one.
        </p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center mt-6 h-12 px-6 rounded-lg bg-[#1A1814] text-[#FAF7F2] font-medium"
        >
          New product
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[24px] font-semibold text-[#1A1814]">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center h-10 px-4 rounded-lg bg-[#1A1814] text-[#FAF7F2] font-medium"
        >
          New product
        </Link>
      </div>
      <ProductListTable products={products} />
    </>
  );
}
