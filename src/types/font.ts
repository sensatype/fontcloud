export interface FontMetadata {
  familyName: string;
  styleName: string;
  designer?: string;
  version?: string;
  license?: string;
  copyright?: string;
}

export interface Glyph {
  name: string;
  unicode: number;
  index: number;
  path: string;
  category?: string;
}

export interface OpenTypeFeature {
  tag: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Font {
  id: string;
  buffer: ArrayBuffer;
  metadata: FontMetadata;
  glyphs: Glyph[];
  features: OpenTypeFeature[];
}