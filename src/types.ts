export interface BoundingBox {
  ymin: number; // 0 to 1000
  xmin: number; // 0 to 1000
  ymax: number; // 0 to 1000
  xmax: number; // 0 to 1000
}

export interface ExpressionItem {
  name: string; // e.g., 'Smile', 'Neutral-like expression'
  nameKu: string; // e.g., 'زەردەخەنە'
  confidence: number; // 0 - 100
  isDominant?: boolean;
}

export interface HeadPoseData {
  direction: string; // e.g., 'Looking toward camera', 'Looking sideways'
  directionKu: string;
  horizontal: 'Left' | 'Right' | 'Center';
  vertical: 'Up' | 'Down' | 'Center';
  tilt: 'Tilted' | 'Straight';
  yawDeg?: number; // -90 to +90
  pitchDeg?: number; // -90 to +90
  rollDeg?: number; // -45 to +45
}

export interface DetectedFace {
  id: number;
  labelKu: string; // e.g., 'ڕووخسار ١'
  box: BoundingBox;
  visibility: string; // 'بەرز' (High) | 'مامناوەند' (Medium) | 'نزم' (Low)
  imageQuality: string; // 'زۆر باش' | 'باش' | 'مامناوەند'
  occlusion: string; // 'هیچ نییە' | 'چەویلکە' | 'ماسک' | 'بەشەکی'
  expressions: ExpressionItem[];
  dominantExpression: string;
  dominantExpressionKu: string;
  expressionConfidence: number;
  headPose: HeadPoseData;
  visibleAction: string; // e.g. 'سەیری کامێرا دەکات'
}

export interface AnalysisResult {
  detectedFacesCount: number;
  faces: DetectedFace[];
  primaryExpression: string;
  primaryExpressionKu: string;
  primaryHeadPose: string;
  primaryHeadPoseKu: string;
  primaryPose: string;
  primaryPoseKu: string;
  visibleObjects: string[];
  visibleBehaviors: string[];
  overallConfidence: number;
  visualSummaryKu: string;
  ethicalComplianceNote: string;
  timestamp: string;
}

export interface CompareResult {
  image1Summary: {
    facesCount: number;
    expression: string;
    pose: string;
    headDirection: string;
    objects: string[];
  };
  image2Summary: {
    facesCount: number;
    expression: string;
    pose: string;
    headDirection: string;
    objects: string[];
  };
  differences: {
    facePositionDiff: string;
    headDirectionDiff: string;
    visibleExpressionDiff: string;
    poseDiff: string;
    visibleObjectsDiff: string;
    sceneDifferences: string;
  };
  comparisonSummaryKu: string;
}
