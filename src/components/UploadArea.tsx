import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { SAMPLE_IMAGES, ensurePngDataUrl } from '../utils/sampleImages';

interface UploadAreaProps {
  onImageSelected: (base64: string, fileInfo?: { name: string; size: number }) => void;
  title?: string;
  subtitle?: string;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onImageSelected,
  title = 'وێنەکەت لێرە دابنێ',
  subtitle = 'وێنەیەکی ڕوونتر بۆ ئەنجامی باشتر بەکاربهێنە.',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('تکایە تەنها فۆرماتەکانی JPG, JPEG, PNG, WEBP بەکاربهێنە.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('قەبارەی وێنەکە لە ٢٠ مێگابایت زیاترە. تکایە وێنەیەکی بچووکتر هەڵبژێرە.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (result) {
        const clean = await ensurePngDataUrl(result);
        onImageSelected(clean, { name: file.name, size: file.size });
      }
    };
    reader.onerror = () => {
      setErrorMessage('کێشەیەک لە خوێندنەوەی وێنەکە ڕوویدا.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center cursor-pointer flex flex-col items-center justify-center ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/40 shadow-xl shadow-emerald-950/60 scale-[1.005]'
            : 'border-emerald-800/40 bg-[#0c1612]/70 hover:border-emerald-500/60 hover:bg-[#0e1a15]/90 shadow-lg'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Upload Icon with Glowing effect */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-2xl bg-emerald-950/80 border border-emerald-700/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-500 transition-all duration-300 shadow-md shadow-emerald-950">
            <UploadCloud className="w-10 h-10 group-hover:text-emerald-300 transition-colors" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-1 rounded-lg">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Primary Prompt */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-zinc-500">یان</span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-semibold text-sm border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-black transition-all">
            هەڵبژاردنی وێنە
          </span>
        </div>

        {/* Subtitle instructions */}
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          {subtitle}
        </p>

        {/* Supported formats */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-300/60 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-900/40">
          <span>پشتیوانی دەکرێت:</span>
          <span className="font-mono font-medium text-emerald-300">JPG • JPEG • PNG • WEBP</span>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-rose-300 bg-rose-950/40 border border-rose-800/40 p-3.5 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Privacy Notice Required by Prompt */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-zinc-400 bg-[#09120e] p-3 rounded-xl border border-emerald-950/60">
        <div className="flex items-center gap-2 text-emerald-400/90 font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>تکایە تەنها وێنەیەک Upload بکە کە مافی بەکارهێنانی هەیە.</span>
        </div>
        <div className="text-[11px] text-zinc-500">
          بە شێوەیەکی خۆکار دوای شیکردنەوە بە بەکارهێنانی میوان دەپارێزرێت
        </div>
      </div>

      {/* Sample Quick-Test Gallery */}
      <div className="pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400/80 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>یان یەکێک لەم وێنانەی نموونە تاقی بکەرەوە:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={async () => {
                const clean = await ensurePngDataUrl(sample.dataUrl);
                onImageSelected(clean, { name: sample.nameKu, size: 45000 });
              }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0b1410] border border-emerald-900/30 hover:border-emerald-500/50 hover:bg-[#0f1c16] text-right transition-all group cursor-pointer"
            >
              <img
                src={sample.dataUrl}
                alt={sample.nameKu}
                className="w-12 h-12 rounded-lg object-cover border border-emerald-800/30 shrink-0"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-zinc-200 truncate group-hover:text-emerald-300">
                  {sample.nameKu}
                </div>
                <div className="text-[11px] text-emerald-400/70 font-mono">
                  {sample.categoryKu}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
