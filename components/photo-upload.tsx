"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadFoodPhoto, validatePhotoFile } from "@/lib/services/blob";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  onPhotoUploaded?: (url: string) => void;
  maxSize?: number; // in MB
  label?: string;
}

export function PhotoUpload({
  onPhotoUploaded,
  maxSize = 5,
  label = "Upload Food Photo",
}: PhotoUploadProps) {
  const { speak } = useAppState();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    console.log('[v0] File selected:', file.name);

    // Validate file
    const validation = validatePhotoFile(file);
    if (!validation.valid) {
      const errorMsg = validation.error || 'Invalid file';
      setError(errorMsg);
      speak(errorMsg);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!preview || !fileInputRef.current?.files?.[0]) {
      setError('No file selected');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      speak('Uploading photo...');

      const file = fileInputRef.current.files[0];
      const url = await uploadFoodPhoto(file);

      console.log('[v0] Photo uploaded:', url);
      setUploadedUrl(url);
      setPreview(null);
      onPhotoUploaded?.(url);
      speak('Photo uploaded successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      speak(`Upload failed: ${errorMsg}`);
      console.error('[v0] Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setError(null);
    setUploadedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <AnimatePresence mode="wait">
        {!uploadedUrl ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {!preview ? (
              // Upload Zone
              <motion.div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
                  "hover:border-primary hover:bg-primary/5",
                  error && "border-destructive bg-destructive/5"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  aria-label="Upload food photo"
                />

                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground">
                      or drag and drop
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    JPG, PNG or WebP up to {maxSize}MB
                  </p>
                </div>
              </motion.div>
            ) : (
              // Preview
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-muted">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setPreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 hover:bg-card transition-colors"
                    aria-label="Remove preview"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // Success
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-muted">
              <Image
                src={uploadedUrl}
                alt="Uploaded"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success">
              <Check className="h-5 w-5" />
              <p className="text-sm font-medium">Photo uploaded successfully</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 break-all">
              <p className="text-xs text-muted-foreground mb-1">URL:</p>
              <p className="text-xs font-mono text-foreground">{uploadedUrl}</p>
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full">
              Upload Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick photo upload button for inline usage
export function QuickPhotoUploadButton({
  onPhotoUploaded,
  label = "Add Photo",
}: {
  onPhotoUploaded?: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadFoodPhoto(file);
      onPhotoUploaded?.(url);
    } catch (err) {
      console.error('[v0] Quick upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 mr-1" />
        )}
        {label}
      </Button>
    </>
  );
}
