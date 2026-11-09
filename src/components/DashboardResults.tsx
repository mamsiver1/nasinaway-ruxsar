import React, { useState } from 'react';
import {
  Users,
  Smile,
  Compass,
  UserCheck,
  Smartphone,
  BarChart3,
  ShieldCheck,
  Download,
  FileJson,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  Eye,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { AnalysisResult, DetectedFace } from '../types';
import { HeadPoseVisualizer } from './HeadPoseVisualizer';

interface DashboardResultsProps {
  result: AnalysisResult;
  imageSrc: string;
  onAnalyzeAnother: () => void;
  onClear: () => void;
  selectedFaceId: number | null;
  onSelectFace: (id: number | null) => void;
}

export const DashboardResults: React.FC<DashboardResultsProps> = ({
  result,
  imageSrc,
  onAnalyzeAnother,
  onClear,
  selectedFaceId,
  onSelectFace,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const activeFace =
    result.faces.find((f) => f.id === selectedFaceId) || result.faces[0] || null;

  // Export handlers
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `face-analysis-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('ڕاپۆرتی JSON دابەزێنرا');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportPng = () => {
    // Generate snapshot canvas containing image and stats
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0a1410';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title & Header
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('ڕاپۆرتی ناسینەوەی ڕووخسار - SIVER IT', 50, 60);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '18px sans-serif';
    ctx.fillText(`ڕووخسارە دۆزراوەکان: ${result.detectedFacesCount} | دڵنیایی گشتی: ${result.overallConfidence}% | کات: ${new Date().toLocaleDateString()}`, 50, 100);

    // Draw uploaded image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 50, 140, 500, 500);

      // Draw bounding boxes on canvas
      result.faces.forEach((face) => {
        const x = 50 + (face.box.xmin / 1000) * 500;
        const y = 140 + (face.box.ymin / 1000) * 500;
        const w = ((face.box.xmax - face.box.xmin) / 1000) * 500;
        const h = ((face.box.ymax - face.box.ymin) / 1000) * 500;

        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = '#064e3b';
        ctx.fillRect(x, y - 24, 120, 24);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.fillText(`${face.labelKu}`, x + 6, y - 6);
      });

      // Stats panel on the right side
      ctx.fillStyle = '#0e1f18';
      ctx.fillRect(590, 140, 560, 500);
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 1;
      ctx.strokeRect(590, 140, 560, 500);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('ئەنجامە سەرەکییەکان (Key Results)', 620, 185);

      ctx.fillStyle = '#e5e7eb';
      ctx.font = '18px sans-serif';
      ctx.fillText(`• دەربڕینی سەرەکی: ${result.primaryExpressionKu} (${result.primaryExpression})`, 620, 235);
      ctx.fillText(`• ئاڕاستەی ڕووخسار: ${result.primaryHeadPoseKu}`, 620, 275);
      ctx.fillText(`• پۆز و وەستان: ${result.primaryPoseKu}`, 620, 315);
      ctx.fillText(`• شتە بینراوەکان: ${result.visibleObjects.join('، ') || 'هیچ شتێکی تایبەت نییە'}`, 620, 355);

      // Summary text wrapping
      ctx.fillStyle = '#9ca3af';
      ctx.font = '15px sans-serif';
      ctx.fillText('کورتەی بینراو:', 620, 410);

      // Wrap summary text
      const words = result.visualSummaryKu.split(' ');
      let line = '';
      let yPos = 440;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 500 && n > 0) {
          ctx.fillText(line, 620, yPos);
          line = words[n] + ' ';
          yPos += 26;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 620, yPos);

      // Footer branding
      ctx.fillStyle = '#059669';
      ctx.font = '14px sans-serif';
      ctx.fillText('دروستکراو لەلایەن سیڤەر ئایتی - SIVER IT', 620, 615);

      // Trigger download
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `face-analysis-summary-${Date.now()}.png`;
      link.href = pngUrl;
      link.click();
      setDownloadSuccess('وێنەی PNG دابەزێنرا');
      setTimeout(() => setDownloadSuccess(null), 3000);
    };
    img.onerror = () => {
      setDownloadSuccess(null);
    };
    img.src = imageSrc;
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Success Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-sm">
        <div className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>شیکردنەوە تەواو بوو ✓</span>
        </div>
        <div className="text-xs text-emerald-400/80 font-mono">
          ئەنجامی پشتڕاستکراوی Vision AI
        </div>
      </div>

      {/* 9. Analysis Result Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Faces count */}
        <div className="p-4 rounded-2xl bg-[#0a1410] border border-emerald-900/40 hover:border-emerald-700/50 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">ڕووخسارە دۆزراوەکان</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {result.detectedFacesCount}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-medium">
            {result.detectedFacesCount === 1 ? 'یەک ڕووخسار' : `${result.detectedFacesCount} ڕووخسار`}
          </div>
        </div>

        {/* Metric 2: Expression */}
        <div className="p-4 rounded-2xl bg-[#0a1410] border border-emerald-900/40 hover:border-emerald-700/50 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">دەربڕین</span>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white truncate" title={result.primaryExpressionKu}>
            {result.primaryExpressionKu}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 truncate">
            {result.primaryExpression}
          </div>
        </div>

        {/* Metric 3: Head Direction */}
        <div className="p-4 rounded-2xl bg-[#0a1410] border border-emerald-900/40 hover:border-emerald-700/50 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">ئاڕاستەی ڕووخسار</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white truncate" title={result.primaryHeadPoseKu}>
            {result.primaryHeadPoseKu}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 truncate">
            {result.primaryHeadPose}
          </div>
        </div>

        {/* Metric 4: Pose */}
        <div className="p-4 rounded-2xl bg-[#0a1410] border border-emerald-900/40 hover:border-emerald-700/50 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">پۆز</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white truncate" title={result.primaryPoseKu}>
            {result.primaryPoseKu}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 truncate">
            {result.primaryPose}
          </div>
        </div>

        {/* Metric 5: Visible Objects */}
        <div className="p-4 rounded-2xl bg-[#0a1410] border border-emerald-900/40 hover:border-emerald-700/50 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">شتە بینراوەکان</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white truncate" title={result.visibleObjects[0] || 'دیاریکراو نییە'}>
            {result.visibleObjects[0] || 'هیچ نییە'}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 truncate">
            {result.visibleObjects.length > 1 ? `+${result.visibleObjects.length - 1} شتی تر` : 'تەنها بینراو'}
          </div>
        </div>

        {/* Metric 6: Overall Confidence */}
        <div className="p-4 rounded-2xl bg-[#0a1410] border border-emerald-900/40 hover:border-emerald-700/50 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">دڵنیایی</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {result.overallConfidence}%
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">
            Confidence score
          </div>
        </div>
      </div>

      {/* 10. Visual Summary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1813] to-[#07100c] border border-emerald-900/50 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>کورتەی بینراو (Visual Summary)</span>
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-zinc-200 font-normal bg-[#060c09] p-4 rounded-2xl border border-emerald-950">
          «{result.visualSummaryKu}»
        </p>

        {/* 8. Ethical Boundary Compliance Note */}
        <div className="flex items-start gap-2.5 pt-1 text-xs text-emerald-300/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-normal">
            <strong className="text-emerald-300 font-semibold">پابەندبوونی ئەخلاقی و بێلایەنی: </strong>
            {result.ethicalComplianceNote ||
              'سیستەمەکە تەنها لەسەر ئاماژە بینراوەکانی وێنەکە ڕاپۆرت دەکات و هیچ پێشبینییەک بۆ کەسایەتی، دەرووندروستی، ڕاستگۆیی یان بیرکردنەوەی کەسەکان ناکات.'}
          </p>
        </div>
      </div>

      {/* 5, 6, 7. Per-Face Detailed Analysis */}
      {result.faces.length > 0 && (
        <div className="rounded-3xl bg-[#0a1410] border border-emerald-900/40 p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-emerald-950">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>شیکردنەوەی وردی ڕووخسار</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {result.faces.length} دۆزراوە
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                پشکنینی وردی دەربڕین، پۆز، و ئاراستەی سەر بۆ هەر ڕووخسارێک
              </p>
            </div>

            {/* Multiple face selector buttons */}
            {result.faces.length > 1 && (
              <div className="flex items-center gap-2">
                {result.faces.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onSelectFace(f.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeFace?.id === f.id
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-950'
                        : 'bg-[#060c0a] text-zinc-300 hover:text-white border border-emerald-900/40'
                    }`}
                  >
                    {f.labelKu}
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeFace && (
            <div className="space-y-6">
              {/* Face metadata pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#070e0b] border border-emerald-950">
                  <div className="text-[11px] text-zinc-400 mb-0.5">ڕووخسار (Face detected)</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeFace.labelKu} دەستنیشانکرا</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#070e0b] border border-emerald-950">
                  <div className="text-[11px] text-zinc-400 mb-0.5">ڕوونی (Visibility)</div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {activeFace.visibility || 'ڕوون و ئاشکرا'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#070e0b] border border-emerald-950">
                  <div className="text-[11px] text-zinc-400 mb-0.5">کوالیتی وێنە (Image quality)</div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {activeFace.imageQuality || 'زۆر باش'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#070e0b] border border-emerald-950">
                  <div className="text-[11px] text-zinc-400 mb-0.5">داپۆشراوی (Occlusion)</div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {activeFace.occlusion || 'هیچ نییە'}
                  </div>
                </div>
              </div>

              {/* Grid: Expressions + Head Pose Visualizer */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 6. Facial Expressions List */}
                <div className="space-y-3 p-4 rounded-2xl bg-[#060c0a] border border-emerald-950">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Smile className="w-4 h-4" />
                      <span>دەربڕینە بینراوەکان (Facial Expressions)</span>
                    </span>
                    <span className="text-zinc-500 font-normal text-[11px]">ڕێژەی دڵنیایی</span>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {activeFace.expressions?.map((expr, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-zinc-200 flex items-center gap-1.5">
                            {expr.isDominant && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            )}
                            {expr.nameKu} <span className="text-zinc-500 text-[10px]">({expr.name})</span>
                          </span>
                          <span className="font-mono text-emerald-400 font-semibold">
                            {expr.confidence}%
                          </span>
                        </div>
                        <div className="w-full bg-[#0d1813] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              expr.confidence > 60
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : 'bg-emerald-800/60'
                            }`}
                            style={{ width: `${Math.min(100, expr.confidence)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Head & Face Pose Visualizer */}
                <div>
                  <HeadPoseVisualizer headPose={activeFace.headPose} />
                </div>
              </div>

              {/* 8. Visible Behavior & Physical Action */}
              <div className="p-4 rounded-2xl bg-[#060c0a] border border-emerald-950 space-y-2.5">
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>هەڵسوکەوت و کردارە بینراوەکان (Visible Behaviors)</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {result.visibleBehaviors?.map((behavior, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-xs font-medium text-emerald-200 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{behavior}</span>
                    </span>
                  ))}

                  {result.visibleObjects?.map((obj, idx) => (
                    <span
                      key={`obj-${idx}`}
                      className="px-3 py-1.5 rounded-xl bg-teal-950/40 border border-teal-800/40 text-xs font-medium text-teal-200 flex items-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                      <span>{obj}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 12 & 13. Download / Export & Action Controls */}
      <div className="rounded-3xl bg-[#0a1410] border border-emerald-900/40 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>داگرتن و پاشەکەوتکردنی ڕاپۆرت (Download Report)</span>
            </h4>
            <p className="text-xs text-zinc-400">
              ئەنجامی شیکردنەوەکە بە فۆرماتەکانی PDF, JSON, PNG وەربگرە
            </p>
          </div>

          {downloadSuccess && (
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700/50 animate-fade-in">
              {downloadSuccess} ✓
            </span>
          )}
        </div>

        {/* Download Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* PDF */}
          <button
            type="button"
            onClick={handleExportPdf}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#060c0a] border border-emerald-900/40 hover:border-emerald-500 hover:bg-emerald-950/30 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>داگرتن وەک PDF</span>
          </button>

          {/* JSON */}
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#060c0a] border border-emerald-900/40 hover:border-emerald-500 hover:bg-emerald-950/30 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <FileJson className="w-4 h-4 text-emerald-400" />
            <span>داگرتن وەک JSON</span>
          </button>

          {/* PNG */}
          <button
            type="button"
            onClick={handleExportPng}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#060c0a] border border-emerald-900/40 hover:border-emerald-500 hover:bg-emerald-950/30 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>داگرتن وەک PNG</span>
          </button>
        </div>

        {/* Reset & Analyze Another Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-emerald-950">
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-emerald-950"
          >
            شیکردنەوەی وێنەیەکی تر (Analyze Another)
          </button>

          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#070e0b] border border-rose-900/40 hover:bg-rose-950/40 text-rose-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>پاککردنەوە (Clear)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
