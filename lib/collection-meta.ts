import type { ProductSection } from './products';

export const collectionMeta: Record<ProductSection, { label: string; headline: string }> = {
  men: { label: "Men's Collection", headline: 'Dress Well,\nLive Well.' },
  women: { label: "Women's Collection", headline: 'Soft Lines,\nSharp Presence.' },
  kids: { label: "Kids' Collection", headline: 'Ready for\nEvery Adventure.' },
};
