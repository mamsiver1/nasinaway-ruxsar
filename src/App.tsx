import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { ImagePreviewWithBoxes } from './components/ImagePreviewWithBoxes';
import { AnalysisLoading } from './components/AnalysisLoading';
import { DashboardResults } from './components/DashboardResults';
import { CompareSection } from './components/CompareSection';
import { Footer } from './components/Footer';
import { AnalysisResult } from './types';
import { AlertCircle, ScanFace } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'compare'>('analyze');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedFaceId, setSelectedFaceId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (base64: string) => {
    setImageSrc(base64);
    setAnalysisResult(null);
    setSelectedFaceId(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageSrc) return;

    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageSrc }),
      });

      if (!response.ok) {
        throw new Error('کێشەیەک لە پێوەندی لەگەڵ سێرڤەر ڕوویدا');
      }

      const data: AnalysisResult = await response.json();
      // Give users a few seconds to appreciate the multi-stage visual loader if fast
      setAnalysisResult(data);
      if (data.faces.length > 0) {
        setSelectedFaceId(data.faces[0].id);
      }
    } catch (_err: any) {
      setError('هەڵەیەک لە کاتی شیکردنەوەی وێنەکەدا ڕوویدا. تکایە دووبارە هەوڵ بدەرەوە.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemove = () => {
    setImageSrc(null);
    setAnalysisResult(null);
    setSelectedFaceId(null);
    setError(null);
  };

  const handleReplace = () => {
    setImageSrc(null);
    setAnalysisResult(null);
    setSelectedFaceId(null);
    setError(null);
  };

  const handleClear = () => {
    setImageSrc(null);
    setAnalysisResult(null);
    setSelectedFaceId(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070d0b] text-[#eef4f1] font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 18. Minimal Navigation & Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 1. Main Title & Landing Direct Header */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
            <ScanFace className="w-3.5 h-3.5" />
            <span>سیستەمی ناسینەوە و شیکردنەوەی بینراوی ڕووخسار</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ناسينەوەی ڕووخسار
          </h2>

          <p className="text-base sm:text-lg text-emerald-200/70 font-normal leading-relaxed">
            شیکردنەوەی ڕووخسار و هەڵسوکەوتی بینراو لە وێنە
          </p>

          <div className="text-xs text-zinc-400 font-normal">
            بەبێ دروستکردنی هیچ هەژمارێک • ڕاستەوخۆ وێنە دابنێ و شیکردنەوە بکە
          </div>
        </section>

        {/* Tab 1: Single Image Analysis */}
        {activeTab === 'analyze' && (
          <div className="space-y-8">
            {/* Error banner if any */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-950/50 border border-rose-800/50 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* 2. Upload Area (shown when no image selected) */}
            {!imageSrc && (
              <UploadArea onImageSelected={handleImageSelected} />
            )}

            {/* 3. Image Preview with Interactive Bounding Boxes */}
            {imageSrc && (
              <ImagePreviewWithBoxes
                imageSrc={imageSrc}
                analysisResult={analysisResult}
                isAnalyzing={isAnalyzing}
                onAnalyze={handleAnalyze}
                onRemove={handleRemove}
                onReplace={handleReplace}
                selectedFaceId={selectedFaceId}
                onSelectFace={setSelectedFaceId}
              />
            )}

            {/* 4. AI Stepwise Loading Process */}
            {isAnalyzing && (
              <AnalysisLoading />
            )}

            {/* 5-10. Dashboard Results */}
            {analysisResult && !isAnalyzing && imageSrc && (
              <DashboardResults
                result={analysisResult}
                imageSrc={imageSrc}
                onAnalyzeAnother={handleReplace}
                onClear={handleClear}
                selectedFaceId={selectedFaceId}
                onSelectFace={setSelectedFaceId}
              />
            )}
          </div>
        )}

        {/* Tab 2: Compare Images */}
        {activeTab === 'compare' && (
          <CompareSection />
        )}
      </main>

      {/* 17. Minimal Chic Footer */}
      <Footer />
    </div>
  );
}
