import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Scan, Smile, Compass, UserCheck } from 'lucide-react';

interface AnalysisLoadingProps {
  onComplete?: () => void;
}

const STEPS = [
  { id: 1, text: 'وێنەکە پشکنین دەکرێت...', icon: Scan },
  { id: 2, text: 'ڕووخسارەکان دەدۆزرێنەوە...', icon: UserCheck },
  { id: 3, text: 'دەربڕینی ڕووخسار شیکردنەوە دەکرێت...', icon: Smile },
  { id: 4, text: 'ئاراستەی سەر شیکردنەوە دەکرێت...', icon: Compass },
  { id: 5, text: 'پۆز و کردارە بینراوەکان دەستنیشان دەکرێن...', icon: Sparkles },
  { id: 6, text: 'ئەنجامەکان ئامادە دەکرێن...', icon: CheckCircle2 },
];

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 900);

    return () => clearInterval(timer);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / STEPS.length) * 100));

  return (
    <div className="rounded-3xl bg-[#0a1410] border border-emerald-900/50 p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto space-y-6">
        {/* Animated Scanner Visual */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 flex items-center justify-center shadow-lg">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        </div>

        <div>
          <h4 className="text-xl font-bold text-white mb-1">
            شیکردنەوەی زیرەکانەی وێنە
          </h4>
          <p className="text-xs text-emerald-300/70">
            مۆدێلی بینین خەریکی پشکنینی پیکسڵەکان و دۆزینەوەی ڕووخسارە
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-[#050c09] rounded-full h-2.5 overflow-hidden border border-emerald-950">
            <div
              className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>پڕۆسەی هەڵسەنگاندن</span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 text-right pt-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300 shadow-sm'
                    : isCompleted
                    ? 'bg-[#060e0b] border-emerald-900/30 text-zinc-300'
                    : 'bg-transparent border-transparent text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isCompleted
                        ? 'bg-emerald-900/30 text-emerald-400'
                        : 'bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{step.text}</span>
                </div>

                <div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-zinc-800 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
