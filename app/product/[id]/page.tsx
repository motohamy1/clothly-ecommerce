import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductById, getRelatedProducts } from '@/lib/products';
import ProductDetail from '@/components/ProductDetail';
import ClothingCard from '@/components/ClothingCard';
import ShoeCard from '@/components/ShoeCard';
import GsapCarousel from '@/components/GsapCarousel';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  return {
    title: product ? `${product.name} — Clothly` : 'Product Not Found — Clothly',
    description: product?.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product, 6);

  return (
    <div className="pb-24">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-8 md:mt-12">
          <span
            className="mb-3 inline-block rounded-full border px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em]"
            style={{ color: 'oklch(0.48 0.03 98)', borderColor: 'oklch(0.2 0.03 98 / 0.2)' }}
          >
            You Might Also Like
          </span>
          <h2
            className="mb-6 text-2xl font-extrabold md:text-3xl"
            style={{ color: 'oklch(0.15 0.02 98)', letterSpacing: '-0.01em' }}
          >
            Complete the Look
          </h2>
          <GsapCarousel itemWidth={product.category === 'shoe' ? 180 : 260} gap={20}>
            {related.map((p) =>
              p.category === 'shoe' ? (
                <ShoeCard key={p.id} product={p} />
              ) : (
                <ClothingCard key={p.id} product={p} />
              ),
            )}
          </GsapCarousel>
        </section>
      )}
    </div>
  );
}
