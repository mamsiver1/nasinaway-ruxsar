import React, { useState } from 'react';
import {
  GitCompare,
  Upload,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeftRight,
} from 'lucide-react';
import { CompareResult } from '../types';
import { SAMPLE_IMAGES, ensurePngDataUrl } from '../utils/sampleImages';

export const CompareSection: React.FC = () => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File, target: 1 | 2) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const res = e.target?.result as string;
      if (res) {
        const clean = await ensurePngDataUrl(res);
        if (target === 1) setImage1(clean);
        else setImage2(clean);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartCompare = async () => {
    if (!image1 || !image2) {
      setError('تکایە هەردوو وێنەکە هەڵبژێرە بۆ ئەنجامدانی بەراوردکردن.');
      return;
    }

    setError(null);
    setIsComparing(true);
    setCompareResult(null);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image1Base64: image1,
          image2Base64: image2,
        }),
      });

      if (!response.ok) {
        throw new Error('کێشەیەک لە بەراوردکردندا ڕوویدا');
      }

      const data: CompareResult = await response.json();
      setCompareResult(data);
    } catch (_err: any) {
      setError('هەڵەیەک لە شیکردنەوەی جیاوازییەکان ڕوویدا.');
    } finally {
      setIsComparing(false);
    }
  };

  const handleClear = () => {
    setImage1(null);
    setImage2(null);
    setCompareResult(null);
    setError(null);
  };

  const loadSamplePair = async () => {
    const s1 = await ensurePngDataUrl(SAMPLE_IMAGES[0].dataUrl);
    const s2 = await ensurePngDataUrl(SAMPLE_IMAGES[1].dataUrl);
    setImage1(s1);
    setImage2(s2);
    setCompareResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Title banner */}
      <div className="rounded-3xl bg-[#0a1410] border border-emerald-900/40 p-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ArrowLeftRight className="w-6 h-6 text-emerald-400" />
              <span>بەراوردکردنی دوو وێنە (Image Comparison)</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              شیکردنەوەی تەنها جیاوازییە بینراوەکانی پۆز، دەربڕین، و ئاڕاستەی ڕووخسار لە نێوان دوو وێنەدا
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSamplePair}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/40 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>تاقیکردنەوەی دوو نموونە</span>
            </button>

            {(image1 || image2) && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#060c0a] border border-rose-900/40 text-rose-300 text-xs font-medium hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>پاککردنەوە</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dual Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image 1 Box */}
        <div className="rounded-3xl bg-[#0a1410] border border-emerald-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-sm font-bold text-white">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">
                ١
              </span>
              <span>وێنەی یەکەم</span>
            </span>
            {image1 && (
              <button
                type="button"
                onClick={() => setImage1(null)}
                className="text-xs text-rose-400 hover:underline"
              >
                سڕینەوە
              </button>
            )}
          </div>

          {image1 ? (
            <div className="relative rounded-2xl overflow-hidden bg-[#050a08] border border-emerald-950 h-72 flex items-center justify-center">
              <img src={image1} alt="Image 1" className="h-full w-full object-contain" />
            </div>
          ) : (
            <label className="rounded-2xl border-2 border-dashed border-emerald-900/50 hover:border-emerald-500 bg-[#060c0a] h-72 flex flex-col items-center justify-center cursor-pointer p-4 text-center transition-all group">
              <Upload className="w-10 h-10 text-emerald-400/80 group-hover:scale-110 transition-transform mb-2" />
              <span className="text-sm font-semibold text-white">بارکردنی وێنەی یەکەم</span>
              <span className="text-xs text-zinc-500 mt-1">کلیک یان ڕاکێشان</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 1)}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Image 2 Box */}
        <div className="rounded-3xl bg-[#0a1410] border border-emerald-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-sm font-bold text-white">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-mono">
                ٢
              </span>
              <span>وێنەی دووەم</span>
            </span>
            {image2 && (
              <button
                type="button"
                onClick={() => setImage2(null)}
                className="text-xs text-rose-400 hover:underline"
              >
                سڕینەوە
              </button>
            )}
          </div>

          {image2 ? (
            <div className="relative rounded-2xl overflow-hidden bg-[#050a08] border border-emerald-950 h-72 flex items-center justify-center">
              <img src={image2} alt="Image 2" className="h-full w-full object-contain" />
            </div>
          ) : (
            <label className="rounded-2xl border-2 border-dashed border-emerald-900/50 hover:border-emerald-500 bg-[#060c0a] h-72 flex flex-col items-center justify-center cursor-pointer p-4 text-center transition-all group">
              <Upload className="w-10 h-10 text-teal-400/80 group-hover:scale-110 transition-transform mb-2" />
              <span className="text-sm font-semibold text-white">بارکردنی وێنەی دووەم</span>
              <span className="text-xs text-zinc-500 mt-1">کلیک یان ڕاکێشان</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 2)}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Start Compare Button */}
      {image1 && image2 && !compareResult && (
        <div>
          <button
            type="button"
            onClick={handleStartCompare}
            disabled={isComparing}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 p-[1px] shadow-lg shadow-emerald-950 hover:shadow-emerald-900/50 transition-all cursor-pointer disabled:opacity-50"
          >
            <div className="w-full py-4 px-6 rounded-[15px] bg-[#0b1612] hover:bg-transparent transition-colors flex items-center justify-center gap-3">
              {isComparing ? (
                <>
                  <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                  <span className="text-base sm:text-lg font-bold text-white">
                    بەراوردکردنی جیاوازییە بینراوەکان...
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 text-emerald-400 fill-emerald-400 group-hover:text-black group-hover:fill-black transition-colors" />
                  <span className="text-base sm:text-lg font-bold text-white group-hover:text-black transition-colors">
                    دەستپێکردنی بەراوردکردن
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Comparison Results */}
      {compareResult && (
        <div className="space-y-6 pt-2">
          {/* Summary Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1813] to-[#07100c] border border-emerald-900/50 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>کورتەی بەراوردکردنی بینراو (Visual Comparison Summary)</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-200 bg-[#060c09] p-4 rounded-2xl border border-emerald-950">
              «{compareResult.comparisonSummaryKu}»
            </p>
          </div>

          {/* 11. Difference Matrix Grid */}
          <div className="rounded-3xl bg-[#0a1410] border border-emerald-900/40 p-6 shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white">
              جیاوازییە بینراوەکان لە ڕووخسار و هەڵسوکەوت
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Face Position */}
              <div className="p-4 rounded-2xl bg-[#060c0a] border border-emerald-950 space-y-1">
                <div className="text-xs font-semibold text-emerald-400">
                  شوێنی ڕووخسار (Face Position)
                </div>
                <div className="text-xs sm:text-sm text-zinc-300 leading-normal">
                  {compareResult.differences.facePositionDiff}
                </div>
              </div>

              {/* Head Direction */}
              <div className="p-4 rounded-2xl bg-[#060c0a] border border-emerald-950 space-y-1">
                <div className="text-xs font-semibold text-emerald-400">
                  ئاڕاستەی سەر (Head Direction)
                </div>
                <div className="text-xs sm:text-sm text-zinc-300 leading-normal">
                  {compareResult.differences.headDirectionDiff}
                </div>
              </div>

              {/* Visible Expression */}
              <div className="p-4 rounded-2xl bg-[#060c0a] border border-emerald-950 space-y-1">
                <div className="text-xs font-semibold text-emerald-400">
                  دەربڕینی بینراو (Visible Expression)
                </div>
                <div className="text-xs sm:text-sm text-zinc-300 leading-normal">
                  {compareResult.differences.visibleExpressionDiff}
                </div>
              </div>

              {/* Pose */}
              <div className="p-4 rounded-2xl bg-[#060c0a] border border-emerald-950 space-y-1">
                <div className="text-xs font-semibold text-emerald-400">
                  پۆز و وەستان (Pose)
                </div>
                <div className="text-xs sm:text-sm text-zinc-300 leading-normal">
                  {compareResult.differences.poseDiff}
                </div>
              </div>

              {/* Visible Objects */}
              <div className="p-4 rounded-2xl bg-[#060c0a] border border-emerald-950 space-y-1">
                <div className="text-xs font-semibold text-emerald-400">
                  شتە دیارەکان (Visible Objects)
                </div>
                <div className="text-xs sm:text-sm text-zinc-300 leading-normal">
                  {compareResult.differences.visibleObjectsDiff}
                </div>
              </div>

              {/* Scene Differences */}
              <div className="p-4 rounded-2xl bg-[#060c0a] border border-emerald-950 space-y-1">
                <div className="text-xs font-semibold text-emerald-400">
                  جیاوازی دیمەن (Scene Differences)
                </div>
                <div className="text-xs sm:text-sm text-zinc-300 leading-normal">
                  {compareResult.differences.sceneDifferences}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
