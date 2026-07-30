'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, type Control, type FieldArray, type UseFieldArrayReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

import type { Product } from '@/lib/products';
import { useAdminToast } from '@/components/admin/toast';
import ImageDropzone from '@/components/admin/image-dropzone';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const productFormSchema = z.object({
  id: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Use lowercase letters, digits, and dashes.'),
  name: z.string().min(1, 'Name is required.'),
  price: z.coerce.number().min(0, 'Price must be 0 or more.'),
  image: z.string().min(1, 'Primary image is required.'),
  category: z.enum(['clothing', 'shoe']),
  group: z.enum(['clothing', 'outerwear', 'shoes']),
  section: z.enum(['men', 'women', 'kids']),
  description: z.string().min(1, 'Description is required.'),
  images: z.array(z.string().min(1)).default([]),
  sizes: z.array(z.string().min(1)).default([]),
  variants: z.array(z.object({
    colorName: z.string().min(1, 'Color name is required.'),
    colorValue: z.string().min(1, 'Color value is required (use an oklch string).'),
    image: z.string().optional(),
  })).default([]),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initial?: Product;
  mode: 'create' | 'edit';
}

export default function ProductForm({ initial, mode }: ProductFormProps) {
  const router = useRouter();
  const toast = useAdminToast();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initial ?? {
      id: '',
      name: '',
      price: 0,
      image: '',
      category: 'clothing',
      group: 'clothing',
      section: 'men',
      description: '',
      images: [],
      sizes: [],
      variants: [],
    },
  });

  // @ts-expect-error react-hook-form v7.83 inference quirk
  const images = useFieldArray({ control, name: 'images' });
  // @ts-expect-error react-hook-form v7.83 inference quirk
  const sizes = useFieldArray({ control, name: 'sizes' });
  const variants = useFieldArray({ control, name: 'variants' });

  const onSubmit = async (values: ProductFormValues) => {
    const url = initial
      ? `/api/admin/products/${encodeURIComponent(initial.id)}`
      : '/api/admin/products';
    const method = initial ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success(initial ? 'Product updated.' : 'Product saved.');
        router.push('/admin/products');
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(`Couldn't save. ${data?.error ?? 'Check the fields and try again.'}`);
      }
    } catch {
      toast.error("Couldn't save. Check the fields and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-[24px] font-semibold text-[#1A1814] mb-6">
        {initial ? `Edit · ${initial.name}` : 'New product'}
      </h1>

      <Tabs defaultValue="basics">
        <TabsList className="grid grid-cols-4 max-w-[520px]">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="mt-6 space-y-6">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Slug (ID)</Label>
            <Input {...register('id')} placeholder="e.g. classic-linen-shirt" />
            <p className="text-[13px] text-[rgba(26,24,20,0.6)]">Lowercase, digits, and dashes. Used in the URL.</p>
            {errors.id && <p className="text-[13px] text-[#8B2E1F]">{errors.id.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Name</Label>
            <Input {...register('name')} placeholder="e.g. Classic Linen Shirt" />
            {errors.name && <p className="text-[13px] text-[#8B2E1F]">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Price ($)</Label>
            <Input type="number" step="0.01" {...register('price')} placeholder="0.00" />
            {errors.price && <p className="text-[13px] text-[#8B2E1F]">{errors.price.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Category</Label>
            <Select
              value={watch('category')}
              onValueChange={(v) => setValue('category', v as 'clothing' | 'shoe')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="shoe">Shoe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Group</Label>
            <Select
              value={watch('group')}
              onValueChange={(v) => setValue('group', v as 'clothing' | 'outerwear' | 'shoes')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="outerwear">Outerwear</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Section</Label>
            <Select
              value={watch('section')}
              onValueChange={(v) => setValue('section', v as 'men' | 'women' | 'kids')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Description</Label>
            <Textarea {...register('description')} rows={4} placeholder="Describe the product…" />
            {errors.description && <p className="text-[13px] text-[#8B2E1F]">{errors.description.message}</p>}
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-6 space-y-6">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Primary image URL</Label>
            <Input {...register('image')} placeholder="/images/products/my-image.jpg" />
            {errors.image && <p className="text-[13px] text-[#8B2E1F]">{errors.image.message}</p>}
          </div>

          <ImageDropzone onUploaded={(path) => images.append(path as any)} />

          {images.fields.length > 0 && (
            <div className="space-y-3">
              <Label className="text-[13px] font-medium">Gallery images</Label>
              {images.fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  {watch(`images.${index}`) && (
                    <img
                      src={watch(`images.${index}`)}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <Input value={watch(`images.${index}`)} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => images.remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => images.append('' as any)}
            className="text-[#B8763A] text-[14px] font-medium"
          >
            + Add another image
          </button>
        </TabsContent>

        <TabsContent value="sizes" className="mt-6 space-y-4">
          {sizes.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <Input {...register(`sizes.${index}`)} placeholder="e.g. M" className="max-w-[120px]" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => sizes.remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => sizes.append('' as any)}
            className="text-[#B8763A] text-[14px] font-medium"
          >
            + Add a size
          </button>
        </TabsContent>

        <TabsContent value="variants" className="mt-6 space-y-4">
          {variants.fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-[rgba(26,24,20,0.08)] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[rgba(26,24,20,0.6)]">Variant {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => variants.remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium">Color name</Label>
                <Input {...register(`variants.${index}.colorName`)} placeholder="e.g. Onyx" />
                {errors.variants?.[index]?.colorName && (
                  <p className="text-[13px] text-[#8B2E1F]">{errors.variants[index]?.colorName?.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium">Color value</Label>
                <Input
                  {...register(`variants.${index}.colorValue`)}
                  placeholder="e.g. oklch(0.42 0.08 130)"
                />
                <p className="text-[13px] text-[rgba(26,24,20,0.6)]">
                  Use an oklch(...) string. The store will tint the photo.
                </p>
                {errors.variants?.[index]?.colorValue && (
                  <p className="text-[13px] text-[#8B2E1F]">{errors.variants[index]?.colorValue?.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium">Image (optional)</Label>
                <Input {...register(`variants.${index}.image`)} placeholder="/images/products/..." />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => variants.append({ colorName: '', colorValue: '', image: '' })}
            className="text-[#B8763A] text-[14px] font-medium"
          >
            + Add a variant
          </button>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 -mx-8 px-8 py-4 bg-[#FAF7F2] border-t border-[rgba(26,24,20,0.08)] mt-8">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-[200px] md:ml-auto md:block bg-[#1A1814] text-[#FAF7F2] hover:bg-[#1A1814]/90 h-12 rounded-lg font-medium"
        >
          {isSubmitting ? 'Saving…' : 'Save product'}
        </Button>
      </div>
    </form>
  );
}
