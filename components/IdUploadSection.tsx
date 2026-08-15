import React, { useRef, useState } from 'react';
import { Camera, Upload, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IdUploadSectionProps {
  onImageCaptured: (base64Image: string | null) => void;
  error?: string;
}

export default function IdUploadSection({ onImageCaptured, error }: IdUploadSectionProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compress heavily for storage (0.5 quality JPEG)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
        setImagePreview(compressedBase64);
        onImageCaptured(compressedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setImagePreview(null);
    onImageCaptured(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-primary" /> Government ID Upload
        </h2>
        <p className="text-sm text-gray-500 mt-1">Please provide a photo of your Government ID (Aadhaar, Passport, DL, etc.).</p>
      </div>

      {!imagePreview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Camera className="w-10 h-10 text-gray-400 mb-3" />
          <h3 className="text-sm font-bold text-gray-700 mb-1">Upload or Capture ID</h3>
          <p className="text-xs text-gray-500 mb-4 max-w-[250px]">Take a clear photo of your ID card using your mobile camera or upload an image.</p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Camera className="w-4 h-4 mr-2" /> Open Camera
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative border border-emerald-200 rounded-xl bg-emerald-50 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> ID Successfully Captured
            </div>
            <button type="button" onClick={handleRemove} className="text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <img src={imagePreview} alt="ID Preview" className="w-full max-h-[200px] object-contain rounded-lg bg-white border border-gray-200" />
        </div>
      )}
      
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
