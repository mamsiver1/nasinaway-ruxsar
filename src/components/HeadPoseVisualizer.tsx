import React from 'react';
import { HeadPoseData } from '../types';
import { Compass, Move } from 'lucide-react';

interface HeadPoseVisualizerProps {
  headPose: HeadPoseData;
}

export const HeadPoseVisualizer: React.FC<HeadPoseVisualizerProps> = ({ headPose }) => {
  const yaw = headPose.yawDeg ?? (headPose.horizontal === 'Left' ? -25 : headPose.horizontal === 'Right' ? 25 : 0);
  const pitch = headPose.pitchDeg ?? (headPose.vertical === 'Up' ? 20 : headPose.vertical === 'Down' ? -20 : 0);
  const roll = headPose.rollDeg ?? (headPose.tilt === 'Tilted' ? 15 : 0);

  return (
    <div className="p-4 rounded-2xl bg-[#070e0b] border border-emerald-950 flex flex-col items-center justify-center text-center space-y-3">
      <div className="flex items-center justify-between w-full text-xs text-zinc-400 font-medium">
        <span className="flex items-center gap-1 text-emerald-400">
          <Compass className="w-3.5 h-3.5" />
          <span>هێڵکاری گرافیکی ئاڕاستەی سەر</span>
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-900/40">
          {headPose.directionKu || headPose.direction}
        </span>
      </div>

      {/* Graphical Head Orientation Canvas / Visual representation */}
      <div className="relative w-28 h-28 flex items-center justify-center my-1">
        {/* Outer compass grid */}
        <div className="absolute inset-0 rounded-full border border-dashed border-emerald-800/40" />
        <div className="absolute inset-2 rounded-full border border-emerald-900/30" />

        {/* Center axes */}
        <div className="absolute w-full h-[1px] bg-emerald-900/40" />
        <div className="absolute h-full w-[1px] bg-emerald-900/40" />

        {/* Dynamic 3D-styled Face model sphere */}
        <div
          style={{
            transform: `perspective(200px) rotateY(${yaw}deg) rotateX(${-pitch}deg) rotateZ(${roll}deg)`,
            transition: 'transform 0.4s ease-out',
          }}
          className="w-16 h-20 rounded-full bg-gradient-to-b from-emerald-700/80 to-teal-900/90 border-2 border-emerald-400/90 shadow-lg shadow-emerald-950/80 flex flex-col items-center justify-center relative"
        >
          {/* Facial feature lines showing direction */}
          <div className="w-7 h-1 bg-emerald-300/80 rounded-full mb-2" />
          <div className="w-1.5 h-3 bg-emerald-200/90 rounded-full mb-1" />
          <div className="w-4 h-1 bg-emerald-300/80 rounded-full" />

          {/* Direction indicator arrow */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-300">
            ▲
          </div>
        </div>
      </div>

      {/* Angle Readings */}
      <div className="grid grid-cols-3 gap-2 w-full pt-1">
        <div className="p-1.5 rounded-lg bg-[#050a08] border border-emerald-950 text-[11px]">
          <div className="text-zinc-500">Horizontal (Yaw)</div>
          <div className="font-semibold text-emerald-300 font-mono">{yaw}°</div>
        </div>
        <div className="p-1.5 rounded-lg bg-[#050a08] border border-emerald-950 text-[11px]">
          <div className="text-zinc-500">Vertical (Pitch)</div>
          <div className="font-semibold text-emerald-300 font-mono">{pitch}°</div>
        </div>
        <div className="p-1.5 rounded-lg bg-[#050a08] border border-emerald-950 text-[11px]">
          <div className="text-zinc-500">Tilt (Roll)</div>
          <div className="font-semibold text-emerald-300 font-mono">{roll}°</div>
        </div>
      </div>
    </div>
  );
};
