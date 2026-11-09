// Sample demo images (Canvas-generated PNG Data URLs) for immediate one-click testing
export interface SampleImage {
  id: string;
  nameKu: string;
  categoryKu: string;
  dataUrl: string;
}

// Generate high quality raster PNG data URLs using HTML5 Canvas
function generateCanvasAvatarPng(
  bg: string,
  skinTone: string,
  hairColor: string,
  expression: 'smile' | 'neutral' | 'group',
  lookDir: 'camera' | 'side'
): string {
  if (typeof document === 'undefined') {
    // SSR / Node build fallback (1x1 transparent png)
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }

  const isGroup = expression === 'group';
  const width = isGroup ? 800 : 600;
  const height = 600;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // Draw Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, bg);
  grad.addColorStop(1, '#0a120f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  if (isGroup) {
    // Person 1 (Left - Smile)
    ctx.save();
    ctx.translate(180, 100);
    // Shoulders
    ctx.fillStyle = '#2d4a3e';
    ctx.beginPath();
    ctx.moveTo(0, 500);
    ctx.quadraticCurveTo(120, 360, 240, 500);
    ctx.fill();
    // Head
    ctx.fillStyle = '#e5b895';
    ctx.beginPath();
    ctx.ellipse(120, 220, 75, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    // Hair
    ctx.fillStyle = '#2b1d14';
    ctx.beginPath();
    ctx.arc(120, 180, 76, Math.PI, 0, false);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(95, 210, 10, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(145, 210, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(95, 210, 5, 0, Math.PI * 2);
    ctx.arc(145, 210, 5, 0, Math.PI * 2);
    ctx.fill();
    // Smile mouth
    ctx.strokeStyle = '#7a3d31';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(120, 245, 22, 0.15 * Math.PI, 0.85 * Math.PI, false);
    ctx.stroke();
    ctx.restore();

    // Person 2 (Right - Neutral)
    ctx.save();
    ctx.translate(440, 120);
    // Shoulders
    ctx.fillStyle = '#1e3a47';
    ctx.beginPath();
    ctx.moveTo(0, 480);
    ctx.quadraticCurveTo(120, 350, 240, 480);
    ctx.fill();
    // Head
    ctx.fillStyle = '#dcae8b';
    ctx.beginPath();
    ctx.ellipse(120, 210, 72, 92, 0, 0, Math.PI * 2);
    ctx.fill();
    // Hair
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(120, 170, 73, Math.PI, 0, false);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(98, 205, 9, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(148, 205, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(98, 205, 4.5, 0, Math.PI * 2);
    ctx.arc(148, 205, 4.5, 0, Math.PI * 2);
    ctx.fill();
    // Neutral mouth
    ctx.strokeStyle = '#7a3d31';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(102, 260);
    ctx.lineTo(138, 260);
    ctx.stroke();
    ctx.restore();

    return canvas.toDataURL('image/png');
  }

  // Single Portrait (600x600)
  const eyeOffset = lookDir === 'side' ? 14 : 0;

  // Shoulders
  ctx.fillStyle = '#1c3328';
  ctx.beginPath();
  ctx.moveTo(40, 600);
  ctx.quadraticCurveTo(300, 430, 560, 600);
  ctx.fill();

  // Neck
  ctx.fillStyle = skinTone;
  ctx.fillRect(260, 350, 80, 110);

  // Head
  ctx.beginPath();
  ctx.ellipse(300, 280, 130, 160, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.arc(300, 230, 132, Math.PI * 0.85, Math.PI * 2.15, false);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(250 + eyeOffset, 270, 18, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(350 + eyeOffset, 270, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.arc(250 + eyeOffset, 270, 8, 0, Math.PI * 2);
  ctx.arc(350 + eyeOffset, 270, 8, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.strokeStyle = hairColor;
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(230 + eyeOffset, 245);
  ctx.quadraticCurveTo(250 + eyeOffset, 235, 270 + eyeOffset, 245);
  ctx.moveTo(330 + eyeOffset, 245);
  ctx.quadraticCurveTo(350 + eyeOffset, 235, 370 + eyeOffset, 245);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = '#b08160';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(300 + eyeOffset * 0.5, 275);
  ctx.lineTo(294 + eyeOffset * 0.5, 325);
  ctx.lineTo(306 + eyeOffset * 0.5, 325);
  ctx.stroke();

  // Mouth
  ctx.strokeStyle = '#934636';
  ctx.lineWidth = 5.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (expression === 'smile') {
    ctx.arc(300 + eyeOffset * 0.3, 360, 36, 0.15 * Math.PI, 0.85 * Math.PI, false);
  } else {
    ctx.moveTo(265 + eyeOffset * 0.3, 385);
    ctx.lineTo(335 + eyeOffset * 0.3, 385);
  }
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-1',
    nameKu: 'ڕووخساری ١: زەردەخەنە بەرەو کامێرا',
    categoryKu: 'تاکەکەس (Smile)',
    dataUrl: generateCanvasAvatarPng('#143527', '#e8bc99', '#2a1a12', 'smile', 'camera'),
  },
  {
    id: 'sample-2',
    nameKu: 'ڕووخساری ٢: بێلایەن بە ڕوانینی لا',
    categoryKu: 'تاکەکەس (Neutral)',
    dataUrl: generateCanvasAvatarPng('#1a2f3a', '#dfae88', '#1c1b24', 'neutral', 'side'),
  },
  {
    id: 'sample-3',
    nameKu: 'ڕووخساری ٣: وێنەی دوو کەس (کۆمەڵ)',
    categoryKu: 'فرە ڕووخسار (Group)',
    dataUrl: generateCanvasAvatarPng('#1d2b24', '#e2b390', '#3b2518', 'group', 'camera'),
  },
];

// Helper to ensure any input is converted to a clean PNG data URL if needed
export function ensurePngDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (
      dataUrl.startsWith('data:image/png;base64,') ||
      dataUrl.startsWith('data:image/jpeg;base64,') ||
      dataUrl.startsWith('data:image/webp;base64,')
    ) {
      return resolve(dataUrl);
    }
    if (typeof window === 'undefined') {
      return resolve(dataUrl);
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
          return;
        }
      } catch (_e) {
        // Fallback to original dataUrl
      }
      resolve(dataUrl);
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}
