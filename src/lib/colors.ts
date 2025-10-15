import chroma from 'chroma-js';

export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl';

export interface ColorInfo {
  hex: string;
  rgb: string;
  rgba: string;
  hsl: string;
  name?: string;
}

export function parseColor(input: string): string | null {
  try {
    // Limpiar y preparar el input
    const cleanInput = input.trim().toLowerCase();
    
    // Si es un nombre de color conocido
    if (chroma.valid(cleanInput)) {
      return chroma(cleanInput).hex();
    }
    
    // Intentar parsear como HEX
    if (cleanInput.startsWith('#')) {
      const hex = chroma(cleanInput).hex();
      return hex;
    }
    
    // Intentar parsear como RGB/RGBA
    if (cleanInput.startsWith('rgb')) {
      const color = chroma(cleanInput);
      return color.hex();
    }
    
    // Intentar parsear como HSL
    if (cleanInput.startsWith('hsl')) {
      const color = chroma(cleanInput);
      return color.hex();
    }
    
    // Intentar con nombres de colores en español/inglés
    const colorNames: Record<string, string> = {
      'rojo': '#ff0000', 'red': '#ff0000',
      'verde': '#00ff00', 'green': '#00ff00',
      'azul': '#0000ff', 'blue': '#0000ff',
      'amarillo': '#ffff00', 'yellow': '#ffff00',
      'naranja': '#ffa500', 'orange': '#ffa500',
      'rosa': '#ff69b4', 'pink': '#ff69b4',
      'morado': '#800080', 'purple': '#800080',
      'violeta': '#ee82ee', 'violet': '#ee82ee',
      'blanco': '#ffffff', 'white': '#ffffff',
      'negro': '#000000', 'black': '#000000',
      'gris': '#808080', 'gray': '#808080',
      'marron': '#a52a2a', 'brown': '#a52a2a',
      'cyan': '#00ffff', 'cian': '#00ffff',
      'magenta': '#ff00ff',
      'turquesa': '#40e0d0', 'turquoise': '#40e0d0',
      'oro': '#ffd700', 'gold': '#ffd700',
      'plateado': '#c0c0c0', 'silver': '#c0c0c0',
    };
    
    if (colorNames[cleanInput]) {
      return colorNames[cleanInput];
    }
    
    return null;
  } catch {
    return null;
  }
}

export function getColorInfo(color: string): ColorInfo {
  const chromaColor = chroma(color);
  
  return {
    hex: chromaColor.hex(),
    rgb: chromaColor.css(),
    rgba: chromaColor.alpha(1).css(),
    hsl: chromaColor.css('hsl'),
    name: chromaColor.name()
  };
}

export function generatePalette(baseColor: string, count: number = 5) {
  const color = chroma(baseColor);
  
  const basePalettes = {
    monochromatic: generateMonochromatic(color),
    analogous: generateAnalogous(color),
    complementary: generateComplementary(color),
    triadic: generateTriadic(color),
    splitComplementary: generateSplitComplementary(color),
    tetradic: generateTetradic(color),
  } as const;

  if (count === 5) return basePalettes as unknown as Record<string, string[]>;

  // Redimensionar con escala LCH para mantener armonía
  return (Object.fromEntries(
    Object.entries(basePalettes).map(([key, values]) => {
      const scaled = chroma.scale(values).mode('lch').colors(count);
      return [key, scaled];
    })
  ) as unknown) as Record<string, string[]>;
}

function generateMonochromatic(baseColor: chroma.Color) {
  return [
    baseColor.brighten(2.5).saturate(0.5).hex(),
    baseColor.brighten(1.5).saturate(0.3).hex(),
    baseColor.hex(),
    baseColor.darken(1).desaturate(0.2).hex(),
    baseColor.darken(2).desaturate(0.4).hex(),
  ];
}

function generateAnalogous(baseColor: chroma.Color) {
  const hue = baseColor.get('hsl.h');
  return [
    baseColor.set('hsl.h', (hue - 45) % 360).hex(),
    baseColor.set('hsl.h', (hue - 22.5) % 360).hex(),
    baseColor.hex(),
    baseColor.set('hsl.h', (hue + 22.5) % 360).hex(),
    baseColor.set('hsl.h', (hue + 45) % 360).hex(),
  ];
}

function generateComplementary(baseColor: chroma.Color) {
  return [
    baseColor.hex(),
    baseColor.set('hsl.h', (baseColor.get('hsl.h') + 180) % 360).hex(),
    baseColor.brighten(1).hex(),
    baseColor.set('hsl.h', (baseColor.get('hsl.h') + 180) % 360).brighten(1).hex(),
    baseColor.darken(1).hex(),
  ];
}

function generateTriadic(baseColor: chroma.Color) {
  const hue = baseColor.get('hsl.h');
  return [
    baseColor.hex(),
    baseColor.set('hsl.h', (hue + 120) % 360).hex(),
    baseColor.set('hsl.h', (hue + 240) % 360).hex(),
    baseColor.brighten(1).hex(),
    baseColor.set('hsl.h', (hue + 120) % 360).brighten(1).hex(),
  ];
}

function generateSplitComplementary(baseColor: chroma.Color) {
  const hue = baseColor.get('hsl.h');
  return [
    baseColor.hex(),
    baseColor.set('hsl.h', (hue + 150) % 360).hex(),
    baseColor.set('hsl.h', (hue + 210) % 360).hex(),
    baseColor.brighten(1).hex(),
    baseColor.darken(1).hex(),
  ];
}

function generateTetradic(baseColor: chroma.Color) {
  const hue = baseColor.get('hsl.h');
  return [
    baseColor.hex(),
    baseColor.set('hsl.h', (hue + 90) % 360).hex(),
    baseColor.set('hsl.h', (hue + 180) % 360).hex(),
    baseColor.set('hsl.h', (hue + 270) % 360).hex(),
    baseColor.brighten(1.5).hex(),
  ];
}

export function getContrastColor(color: string): string {
  const luminance = chroma(color).luminance();
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function isValidColor(color: string): boolean {
  return parseColor(color) !== null;
}

// Redimensionar cualquier paleta existente a una cantidad específica
export function resizePalette(colors: string[], count: number): string[] {
  if (!colors || colors.length === 0) return [];
  if (count <= 0) return [];
  if (colors.length === count) return colors;
  return chroma.scale(colors).mode('lch').colors(count);
}