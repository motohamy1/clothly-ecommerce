import type { ProductCategory, ProductGroup, ProductSection, ProductVariant } from '../models/product';

export interface ProductSeed {
  id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  group: ProductGroup;
  section: ProductSection;
  description: string;
  images: string[];
  sizes: string[];
  variants: ProductVariant[];
}

const menApparel = [
  '/men/57ff8bec-7a8f-4103-8d1e-4b9a0ede062b.png',
  '/men/6fbafa25-cd06-4fe1-8875-28843eb9ef2e.png',
  '/men/8340f4fa-848d-4052-980c-c9a5b11c8d47.png',
  '/men/9d02aa0e-cd98-47c8-9245-f9c1b28d7b65.png',
  '/men/c8625628-2005-465a-8940-01c13160dccc.png',
  '/men/ed872f31-8160-4c7e-be5a-651bc8d44eb0.png',
  '/men/f79767ea-6334-4809-bd07-f95c4fa65a17.png',
  '/men/f86f049b-1498-46e0-bc60-96d83c2fc4a0.png',
];

const menShoeImgs = [
  '/men/men-shoes/2bb741fb-4208-4212-a0cf-2b89b7108d37.png',
  '/men/men-shoes/3e705e68-923c-4aab-8455-b330ffaf3167.png',
  '/men/men-shoes/55950092-0c4d-4166-be6e-72ae70373812.png',
  '/men/men-shoes/5fb7e946-725a-40b2-8b4e-5fa8aa7b1bc2.png',
  '/men/men-shoes/8ffbd306-84e2-4b7b-8df9-e634ef630a00.png',
  '/men/men-shoes/c730d1d8-52ce-4f04-887f-3476f7b0335f.png',
  '/men/men-shoes/f7d0e79b-05b1-4c10-9c34-a97e73f8c123.png',
];

const womenApparel = [
  '/women/51b109c2-9b79-4184-94c2-e1d358ed12ee.png',
  '/women/64cfccf3-15dd-4624-a6fa-3e8181b7fcb9.png',
  '/women/bb3da023-48f1-454f-a832-5715081a84a4.png',
  '/women/cf3ebbb8-c17d-4a31-902e-40e167759879.png',
  '/women/d07d2744-1f2f-4cde-b6c2-c595331efb07.png',
  "/women/download.png",
  "/women/download%20(1).png",
  '/women/f3d0d027-b7cd-4ab5-aa02-7dd18836519e.png',
];

const womenShoeImgs = [
  '/women/women-shoes/09424809-6adf-45d2-86f7-4b00c74283a8.png',
  '/women/women-shoes/17f74760-c713-407f-901c-f1e439fb7370.png',
  '/women/women-shoes/1a9ab8a3-2325-4ad7-a649-29c085236b13.png',
  '/women/women-shoes/2d3f41ee-ded9-4f7d-a2b2-689d2e2d8979.png',
  '/women/women-shoes/5f44bf29-a8ff-4d0f-89fc-6eb06699730e.png',
  '/women/women-shoes/73286252-8357-4985-bf24-a073988a8676.png',
  '/women/women-shoes/adffa45a-9432-4369-8979-008a4573919d.png',
  "/women/women-shoes/download%20(2).png",
];

const kidsApparel = [
  '/kids/1ae5a3d1-633e-4680-8a41-19aed9931d6d.png',
  '/kids/1fc925f0-38b4-469c-901d-0ad81a84c2ed.png',
  '/kids/23e3a3c6-f9c9-428c-9ed9-a1e475bf4181.png',
  '/kids/3dda39ab-7800-4642-a9aa-9783cfb427ed.png',
  '/kids/5d725dff-3699-4a7a-9c6c-5e5c846c9860.png',
  '/kids/8dacc6c2-b268-4924-a0dc-06b04ad7f7ba.png',
  '/kids/9f873bbe-548a-46b7-8ec6-ecd6c5c8125d.png',
  '/kids/a3a13133-a399-4a85-aa69-88c947b4b2a1.png',
  '/kids/c1cf4d7b-4be6-4106-88f4-b37536e39a29.png',
  '/kids/ebab3a9f-8f8b-46ef-940c-ec4f2d5bcc49.png',
];

const kidsShoeImgs = [
  '/kids/kids-shoes/0879194d-8edc-41cf-8641-931e7b51b08c.png',
  '/kids/kids-shoes/0df64344-3ab1-4158-bed6-fb6779dc32cb.png',
  '/kids/kids-shoes/1777ad3b-4218-4b04-ac62-80cb0f45beb0.png',
  '/kids/kids-shoes/3cf7761e-f866-495c-99da-ea9cca75e0c5.png',
  '/kids/kids-shoes/6b3fa291-9b75-4e6f-8911-7a8afa9c80d3.png',
  '/kids/kids-shoes/7a59d1d4-2791-4e8a-9647-30c8e71c2c32.png',
  '/kids/kids-shoes/a2af3786-0285-403f-b4dd-dabb61b64428.png',
  '/kids/kids-shoes/a4726498-e0f8-4796-9139-e0554a58ac8f8.png',
  '/kids/kids-shoes/d16ca6b5-3379-4730-bcff-ca88ac789948.png',
];

const variants: ProductVariant[] = [
  { colorName: 'Onyx', colorValue: 'oklch(0.15 0.02 98)' },
  { colorName: 'Cream', colorValue: 'oklch(0.943 0.051 98.2)' },
  { colorName: 'Terracotta', colorValue: 'oklch(0.48 0.12 48)' },
  { colorName: 'Olive', colorValue: 'oklch(0.42 0.08 130)' },
];

function gallery(img: string, pool: string[], count = 3): string[] {
  const idx = pool.indexOf(img);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[(idx + i) % pool.length]);
  }
  return result;
}

function product(input: {
  id: string;
  section: ProductSection;
  group: ProductGroup;
  category: ProductCategory;
  name: string;
  price: number;
  image: string;
  imagePool: string[];
  sizes: string[];
  description: string;
}): ProductSeed {
  const { imagePool, ...rest } = input;
  return { ...rest, images: gallery(rest.image, imagePool), variants };
}

const mensSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const apparelSizes = ['XS', 'S', 'M', 'L', 'XL'];
const kidsSizes = ['4Y', '6Y', '8Y', '10Y', '12Y'];
const adultShoeSizes = ['40', '41', '42', '43', '44', '45'];
const womensShoeSizes = ['36', '37', '38', '39', '40', '41'];
const kidsShoeSizes = ['28', '29', '30', '31', '32', '33'];

export const productSeeds: ProductSeed[] = [
  product({ id: 'men-classic-linen-shirt', section: 'men', group: 'clothing', category: 'clothing', name: 'Classic Linen Shirt', price: 49.99, image: menApparel[0], imagePool: menApparel, sizes: mensSizes, description: 'Breathable European linen cut for warm days, relaxed through the shoulder and tapered at the waist.' }),
  product({ id: 'men-slim-fit-chinos', section: 'men', group: 'clothing', category: 'clothing', name: 'Slim Fit Chinos', price: 59.99, image: menApparel[1], imagePool: menApparel, sizes: mensSizes, description: 'Brushed cotton twill with a touch of stretch, tailored for days that move from desk to dinner.' }),
  product({ id: 'men-cotton-polo-tee', section: 'men', group: 'clothing', category: 'clothing', name: 'Cotton Polo Tee', price: 34.99, image: menApparel[2], imagePool: menApparel, sizes: mensSizes, description: 'Heavyweight combed cotton with a ribbed collar that keeps its shape wash after wash.' }),
  product({ id: 'men-relaxed-cargo-pants', section: 'men', group: 'clothing', category: 'clothing', name: 'Relaxed Cargo Pants', price: 54.99, image: menApparel[3], imagePool: menApparel, sizes: mensSizes, description: 'Utility-inspired ripstop cargos with reinforced pockets and a drawstring waist for all-day comfort.' }),
  product({ id: 'men-denim-jacket', section: 'men', group: 'outerwear', category: 'clothing', name: 'Denim Jacket', price: 89.99, image: menApparel[4], imagePool: menApparel, sizes: mensSizes, description: 'Rigid denim built to soften and fade with wear in a timeless layer-friendly silhouette.' }),
  product({ id: 'men-puffer-vest', section: 'men', group: 'outerwear', category: 'clothing', name: 'Puffer Vest', price: 99.99, image: menApparel[5], imagePool: menApparel, sizes: mensSizes, description: 'Lightweight recycled-fill insulation with a packable shell built to cut wind without weight.' }),
  product({ id: 'men-wool-overcoat', section: 'men', group: 'outerwear', category: 'clothing', name: 'Wool Overcoat', price: 149.99, image: menApparel[6], imagePool: menApparel, sizes: mensSizes, description: 'A double-breasted overcoat in a warm wool blend with structured shoulders and a full lining.' }),
  product({ id: 'men-canvas-sneakers', section: 'men', group: 'shoes', category: 'shoe', name: 'Canvas Sneakers', price: 64.99, image: menShoeImgs[0], imagePool: menShoeImgs, sizes: adultShoeSizes, description: 'A low-profile canvas sneaker on a cushioned rubber sole, built for everyday rotation.' }),
  product({ id: 'men-leather-loafers', section: 'men', group: 'shoes', category: 'shoe', name: 'Leather Loafers', price: 89.99, image: menShoeImgs[1], imagePool: menShoeImgs, sizes: adultShoeSizes, description: 'Hand-burnished full-grain leather loafers with a cushioned insole for long polished days.' }),
  product({ id: 'men-running-trainers', section: 'men', group: 'shoes', category: 'shoe', name: 'Running Trainers', price: 79.99, image: menShoeImgs[2], imagePool: menShoeImgs, sizes: adultShoeSizes, description: 'Responsive foam underfoot with a breathable knit upper, engineered for miles and styled for the street.' }),
  product({ id: 'women-silk-camp-shirt', section: 'women', group: 'clothing', category: 'clothing', name: 'Silk Camp Shirt', price: 69.99, image: womenApparel[0], imagePool: womenApparel, sizes: apparelSizes, description: 'Washed silk with a fluid drape, open collar, and polished finish that dresses up or down.' }),
  product({ id: 'women-tailored-wide-leg-trouser', section: 'women', group: 'clothing', category: 'clothing', name: 'Wide-Leg Trouser', price: 79.99, image: womenApparel[1], imagePool: womenApparel, sizes: apparelSizes, description: 'High-rise tailored trousers with an easy wide leg and a clean pressed front.' }),
  product({ id: 'women-rib-knit-tank', section: 'women', group: 'clothing', category: 'clothing', name: 'Rib Knit Tank', price: 29.99, image: womenApparel[2], imagePool: womenApparel, sizes: apparelSizes, description: 'Soft ribbed cotton-modal knit with a close fit and a neckline made for layering.' }),
  product({ id: 'women-midi-wrap-dress', section: 'women', group: 'clothing', category: 'clothing', name: 'Midi Wrap Dress', price: 94.99, image: womenApparel[3], imagePool: womenApparel, sizes: apparelSizes, description: 'A fluid wrap silhouette with adjustable waist ties and movement-ready skirt volume.' }),
  product({ id: 'women-cropped-trench', section: 'women', group: 'outerwear', category: 'clothing', name: 'Cropped Trench', price: 129.99, image: womenApparel[4], imagePool: womenApparel, sizes: apparelSizes, description: 'A modern cropped trench in water-resistant cotton with storm flaps and horn buttons.' }),
  product({ id: 'women-quilted-liner-jacket', section: 'women', group: 'outerwear', category: 'clothing', name: 'Quilted Liner Jacket', price: 99.99, image: womenApparel[5], imagePool: womenApparel, sizes: apparelSizes, description: 'Diamond-quilted warmth in a collarless shape that layers cleanly over knits.' }),
  product({ id: 'women-soft-wool-coat', section: 'women', group: 'outerwear', category: 'clothing', name: 'Soft Wool Coat', price: 159.99, image: womenApparel[6], imagePool: womenApparel, sizes: apparelSizes, description: 'Brushed wool blend coat with generous lapels and a relaxed, elegant shoulder.' }),
  product({ id: 'women-minimal-sneaker', section: 'women', group: 'shoes', category: 'shoe', name: 'Minimal Sneaker', price: 74.99, image: womenShoeImgs[0], imagePool: womenShoeImgs, sizes: womensShoeSizes, description: 'Clean leather sneakers with a low cupsole and softly padded collar.' }),
  product({ id: 'women-block-heel-sandal', section: 'women', group: 'shoes', category: 'shoe', name: 'Block Heel Sandal', price: 84.99, image: womenShoeImgs[1], imagePool: womenShoeImgs, sizes: womensShoeSizes, description: 'A stable block heel and slender straps make this sandal polished but walkable.' }),
  product({ id: 'women-soft-suede-boot', section: 'women', group: 'shoes', category: 'shoe', name: 'Soft Suede Boot', price: 119.99, image: womenShoeImgs[2], imagePool: womenShoeImgs, sizes: womensShoeSizes, description: 'Ankle-height suede boots with a cushioned footbed and flexible stacked sole.' }),
  product({ id: 'kids-organic-pocket-tee', section: 'kids', group: 'clothing', category: 'clothing', name: 'Organic Pocket Tee', price: 19.99, image: kidsApparel[0], imagePool: kidsApparel, sizes: kidsSizes, description: 'Soft organic cotton jersey with a sturdy pocket and playground-ready seams.' }),
  product({ id: 'kids-pull-on-chinos', section: 'kids', group: 'clothing', category: 'clothing', name: 'Pull-On Chinos', price: 29.99, image: kidsApparel[1], imagePool: kidsApparel, sizes: kidsSizes, description: 'Easy elastic-waist chinos in durable stretch twill for school days and weekend play.' }),
  product({ id: 'kids-striped-sweatshirt', section: 'kids', group: 'clothing', category: 'clothing', name: 'Striped Sweatshirt', price: 34.99, image: kidsApparel[2], imagePool: kidsApparel, sizes: kidsSizes, description: 'Cozy brushed fleece with cheerful stripes and rib trims that bounce back.' }),
  product({ id: 'kids-packable-raincoat', section: 'kids', group: 'outerwear', category: 'clothing', name: 'Packable Raincoat', price: 44.99, image: kidsApparel[3], imagePool: kidsApparel, sizes: kidsSizes, description: 'A lightweight water-resistant raincoat that packs into its pocket for backpack backup.' }),
  product({ id: 'kids-sherpa-zip-jacket', section: 'kids', group: 'outerwear', category: 'clothing', name: 'Sherpa Zip Jacket', price: 49.99, image: kidsApparel[4], imagePool: kidsApparel, sizes: kidsSizes, description: 'Plush sherpa warmth with smooth-lined sleeves and easy zipper pulls.' }),
  product({ id: 'kids-denim-overshirt', section: 'kids', group: 'outerwear', category: 'clothing', name: 'Denim Overshirt', price: 39.99, image: kidsApparel[5], imagePool: kidsApparel, sizes: kidsSizes, description: 'A sturdy denim overshirt cut roomy for layering over tees and hoodies.' }),
  product({ id: 'kids-canvas-slip-on', section: 'kids', group: 'shoes', category: 'shoe', name: 'Canvas Slip-On', price: 29.99, image: kidsShoeImgs[0], imagePool: kidsShoeImgs, sizes: kidsShoeSizes, description: 'No-fuss canvas slip-ons with elastic gores and grippy rubber outsoles.' }),
  product({ id: 'kids-playground-runner', section: 'kids', group: 'shoes', category: 'shoe', name: 'Playground Runner', price: 39.99, image: kidsShoeImgs[1], imagePool: kidsShoeImgs, sizes: kidsShoeSizes, description: 'Lightweight runners with hook-and-loop straps and cushioned soles for all-day play.' }),
  product({ id: 'kids-rain-boot', section: 'kids', group: 'shoes', category: 'shoe', name: 'Rain Boot', price: 34.99, image: kidsShoeImgs[2], imagePool: kidsShoeImgs, sizes: kidsShoeSizes, description: 'Waterproof pull-on rain boots with easy handles and a flexible lug sole.' }),
];
