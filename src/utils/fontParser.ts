import * as opentype from 'opentype.js';
import { FontMetadata, Glyph, OpenTypeFeature } from '../types/font';

export async function parseFontFile(buffer: ArrayBuffer) {
  let font;
  try {
    font = opentype.parse(buffer);
  } catch (error) {
    throw new Error('Invalid font file format');
  }

  if (!font) {
    throw new Error('Failed to parse font file');
  }

  try {
    const metadata: FontMetadata = {
      familyName: font.names.fontFamily?.en || 'Unknown Font',
      styleName: font.names.fontSubfamily?.en || 'Regular',
      designer: font.names.designer?.en,
      version: font.names.version?.en,
      license: font.names.license?.en,
      copyright: font.names.copyright?.en,
    };

    const glyphs: Glyph[] = Object.values(font.glyphs.glyphs)
      .filter((g: any) => g && g.unicode)
      .map((g: any) => ({
        name: g.name || '',
        unicode: g.unicode || 0,
        index: g.index,
        path: g.path?.toPathData() || '',
        category: categorizeGlyph(g),
      }));

    const features: OpenTypeFeature[] = Object.entries(font.tables.gsub?.features || {})
      .map(([tag, feature]: [string, any]) => ({
        tag,
        name: getFeatureName(tag),
        description: getFeatureDescription(tag),
        enabled: false,
      }));

    return { metadata, glyphs, features };
  } catch (error) {
    throw new Error('Error extracting font data');
  }
}

function categorizeGlyph(glyph: any): string {
  if (!glyph.unicode) return 'symbol';
  const code = glyph.unicode;
  if (code >= 0x41 && code <= 0x5A) return 'uppercase';
  if (code >= 0x61 && code <= 0x7A) return 'lowercase';
  if (code >= 0x30 && code <= 0x39) return 'number';
  if (code >= 0x20 && code <= 0x2F) return 'punctuation';
  return 'symbol';
}

function getFeatureName(tag: string): string {
  const features: Record<string, string> = {
    'liga': 'Standard Ligatures',
    'dlig': 'Discretionary Ligatures',
    'smcp': 'Small Capitals',
    'c2sc': 'Capitals to Small Capitals',
    'onum': 'Old-style Figures',
    'tnum': 'Tabular Figures',
    // Add more as needed
  };
  return features[tag] || tag.toUpperCase();
}

function getFeatureDescription(tag: string): string {
  const descriptions: Record<string, string> = {
    'liga': 'Combines certain letter pairs into single glyphs',
    'dlig': 'Optional ligatures to be used for special effect',
    'smcp': 'Converts lowercase letters to small capitals',
    'c2sc': 'Converts uppercase letters to small capitals',
    'onum': 'Changes figures to oldstyle form',
    'tnum': 'Changes figures to tabular (monospaced) form',
    // Add more as needed
  };
  return descriptions[tag] || 'OpenType feature';
}