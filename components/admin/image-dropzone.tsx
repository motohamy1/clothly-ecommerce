'use client';

import { useState, useRef } from 'react';
import { useAdminToast } from '@/components/admin/toast';

interface ImageDropzoneProps {
  onUploaded: (path: string) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

export default function ImageDropzone({ onUploaded }: ImageDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastUploaded, setLastUploaded] = useState<string | null>(null);
  const toast = useAdminToast();

  const validateAndUpload = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("That file type isn't supported. Use a JPG, PNG, or WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('That image is over 5 MB. Try a smaller file.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error ?? 'Upload failed.');
        return;
      }
      const data = await res.json();
      onUploaded(data.path);
      setLastUploaded(data.path);
      toast.success('Image uploaded.');
    } catch {
      toast.error('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200 ${
          dragging
            ? 'border-[#B8763A] bg-[rgba(184,118,58,0.04)]'
            : 'border-[rgba(26,24,20,0.18)]'
        }`}
      >
        <p className="text-[15px] text-[#1A1814]">
          Drop an image here, or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[#B8763A] underline"
          >
            click to pick
          </button>
          .
        </p>
        <p className="mt-2 text-[13px] text-[rgba(26,24,20,0.6)]">
          JPG, PNG, or WebP. 5 MB max.
        </p>
        {uploading && (
          <p className="mt-4 text-[13px] text-[rgba(26,24,20,0.6)]">Uploading…</p>
        )}
      </div>
      {lastUploaded && (
        <div className="mt-4 text-[13px] text-[#3F6B47]" role="status">
          Image uploaded.
        </div>
      )}
    </div>
  );
}
