import React, { useState } from 'react';
import { Trash2, RefreshCw, Play, Eye, EyeOff, Maximize2 } from 'lucide-react';
import { AnalysisResult, DetectedFace } from '../types';

interface ImagePreviewWithBoxesProps {
  imageSrc: string;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onRemove: () => void;
  onReplace: () => void;
  selectedFaceId?: number | null;
  onSelectFace?: (id: number | null) => void;
}

export const ImagePreviewWithBoxes: React.FC<ImagePreviewWithBoxesProps> = ({
  imageSrc,
  analysisResult,
  isAnalyzing,
  onAnalyze,
  onRemove,
  onReplace,
  selectedFaceId,
  onSelectFace,
}) => {
  const [showBoxes, setShowBoxes] = useState(true);
  const [hoveredFaceId, setHoveredFaceId] = useState<number | null>(null);

  return (
    <div className="rounded-3xl bg-[#0a1410] border border-emerald-900/40 p-4 sm:p-6 shadow-xl space-y-4">
      {/* Top action toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-emerald-950">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">پێشبینینی وێنە (Preview)</span>
          {analysisResult && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
              {analysisResult.detectedFacesCount} ڕووخسار دۆزرایەوە
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {analysisResult && analysisResult.faces.length > 0 && (
            <button
              type="button"
              onClick={() => setShowBoxes(!showBoxes)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                showBoxes
                  ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300'
                  : 'bg-[#060c0a] border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {showBoxes ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showBoxes ? 'شاردنەوەی چوارچێوەکان' : 'پیشاندانی چوارچێوەکان'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReplace}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 bg-[#070e0b] border border-emerald-900/50 hover:bg-emerald-950/40 hover:text-emerald-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>گۆڕین (Replace)</span>
          </button>

          <button
            type="button"
            onClick={onRemove}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-300 bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900/40 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>سڕینەوە (Remove)</span>
          </button>
        </div>
      </div>

      {/* Image Container with Face Bounding Boxes */}
      <div className="relative w-full max-h-[540px] flex items-center justify-center rounded-2xl overflow-hidden bg-[#050a08] border border-emerald-950">
        <div className="relative inline-block max-w-full">
          <img
            src={imageSrc}
            alt="Uploaded Preview"
            className="max-h-[500px] w-auto object-contain block select-none mx-auto rounded-xl"
          />

          {/* Bounding Boxes Layer */}
          {showBoxes &&
            analysisResult?.faces?.map((face: DetectedFace) => {
              const { ymin, xmin, ymax, xmax } = face.box;
              const top = (ymin / 10).toFixed(2);
              const left = (xmin / 10).toFixed(2);
              const height = ((ymax - ymin) / 10).toFixed(2);
              const width = ((xmax - xmin) / 10).toFixed(2);

              const isSelected = selectedFaceId === face.id;
              const isHovered = hoveredFaceId === face.id;
              const isHighlighted = isSelected || isHovered;

              return (
                <div
                  key={face.id}
                  onClick={() => onSelectFace && onSelectFace(isSelected ? null : face.id)}
                  onMouseEnter={() => setHoveredFaceId(face.id)}
                  onMouseLeave={() => setHoveredFaceId(null)}
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                  }}
                  className={`absolute rounded-xl transition-all duration-200 cursor-pointer ${
                    isHighlighted
                      ? 'border-2 border-emerald-300 bg-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.6)] z-20'
                      : 'border-2 border-emerald-500/80 bg-emerald-500/10 hover:border-emerald-300 z-10'
                  }`}
                >
                  {/* Face Tag Badge */}
                  <div className="absolute -top-7 right-0 whitespace-nowrap px-2 py-0.5 rounded-md bg-[#05110c]/90 border border-emerald-500/70 text-[11px] font-semibold text-emerald-300 shadow-lg flex items-center gap-1.5 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{face.labelKu}</span>
                    <span className="text-zinc-400 text-[10px]">
                      {face.dominantExpressionKu || face.dominantExpression} ({face.expressionConfidence || 85}%)
                    </span>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white rounded-tl" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white rounded-br" />
                </div>
              );
            })}
        </div>
      </div>

      {/* Main Analysis Button (unless already analyzed) */}
      {!analysisResult && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-[1px] shadow-lg shadow-emerald-950/80 hover:shadow-emerald-900/50 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            <div className="w-full py-4 px-6 rounded-[15px] bg-[#0c1813] hover:bg-transparent transition-colors flex items-center justify-center gap-3">
              <Play className="w-5 h-5 text-emerald-400 fill-emerald-400 group-hover:text-black group-hover:fill-black transition-colors" />
              <span className="text-base sm:text-lg font-bold text-white group-hover:text-black transition-colors">
                دەستپێکردنی شیکردنەوە
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
