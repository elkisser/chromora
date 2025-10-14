import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere una descripción para generar la paleta' },
        { status: 400 }
      );
    }

    if (prompt.trim().length < 3) {
      return NextResponse.json(
        { error: 'La descripción debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    // Simulación de IA - En producción, integrar con OpenAI API
    const aiGeneratedColors = await simulateAIPaletteGeneration(prompt);
    
    return NextResponse.json({
      success: true,
      colors: aiGeneratedColors,
      prompt: prompt.trim(),
      generatedAt: new Date().toISOString(),
      note: 'Esta es una simulación. En producción, integrar con OpenAI API.'
    });

  } catch (error) {
    console.error('Error en generación de paleta IA:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al generar paleta IA' },
      { status: 500 }
    );
  }
}

// Simulación avanzada de generación de paletas por IA
async function simulateAIPaletteGeneration(prompt: string): Promise<string[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  const promptLower = prompt.toLowerCase();
  
  // Paletas temáticas más elaboradas
  const themePalettes: Record<string, string[]> = {
    // Paletas otoñales
    'otoñal': ['#8B4513', '#D2691E', '#CD853F', '#DAA520', '#B8860B'],
    'otoño': ['#8B4513', '#D2691E', '#CD853F', '#DAA520', '#B8860B'],
    'autumn': ['#8B4513', '#D2691E', '#CD853F', '#DAA520', '#B8860B'],
    'fall': ['#8B4513', '#D2691E', '#CD853F', '#DAA520', '#B8860B'],
    
    // Paletas pastel
    'pastel': ['#FFB6C1', '#87CEFA', '#98FB98', '#FFFACD', '#DDA0DD'],
    'suave': ['#FFB6C1', '#87CEFA', '#98FB98', '#FFFACD', '#DDA0DD'],
    'soft': ['#FFB6C1', '#87CEFA', '#98FB98', '#FFFACD', '#DDA0DD'],
    
    // Paletas gamer/futuristas
    'gamer': ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
    'futurista': ['#00FFFF', '#4B0082', '#9400D3', '#00BFFF', '#1E90FF'],
    'futurist': ['#00FFFF', '#4B0082', '#9400D3', '#00BFFF', '#1E90FF'],
    'tech': ['#00FFFF', '#4B0082', '#9400D3', '#00BFFF', '#1E90FF'],
    'cyber': ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0000', '#0000FF'],
    
    // Paletas frías
    'frío': ['#2F4F4F', '#4682B4', '#87CEEB', '#B0C4DE', '#F0F8FF'],
    'fría': ['#2F4F4F', '#4682B4', '#87CEEB', '#B0C4DE', '#F0F8FF'],
    'cold': ['#2F4F4F', '#4682B4', '#87CEEB', '#B0C4DE', '#F0F8FF'],
    'fresco': ['#2F4F4F', '#4682B4', '#87CEEB', '#B0C4DE', '#F0F8FF'],
    
    // Paletas cálidas
    'cálido': ['#8B0000', '#FF4500', '#FFA500', '#FFD700', '#FFF8DC'],
    'cálida': ['#8B0000', '#FF4500', '#FFA500', '#FFD700', '#FFF8DC'],
    'warm': ['#8B0000', '#FF4500', '#FFA500', '#FFD700', '#FFF8DC'],
    'calido': ['#8B0000', '#FF4500', '#FFA500', '#FFD700', '#FFF8DC'],
    
    // Paletas minimalistas
    'minimalista': ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#212121'],
    'minimalist': ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#212121'],
    'simple': ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#212121'],
    
    // Paletas vibrantes
    'vibrante': ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
    'vibrant': ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
    'energético': ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
    
    // Paletas elegantes
    'elegante': ['#2C2C54', '#474787', '#AAABB8', '#ECECEC', '#FFFFFF'],
    'elegant': ['#2C2C54', '#474787', '#AAABB8', '#ECECEC', '#FFFFFF'],
    'lujo': ['#2C2C54', '#474787', '#AAABB8', '#ECECEC', '#FFFFFF'],
    'luxury': ['#2C2C54', '#474787', '#AAABB8', '#ECECEC', '#FFFFFF'],
    
    // Paletas naturaleza
    'naturaleza': ['#228B22', '#32CD32', '#6B8E23', '#8FBC8F', '#F0FFF0'],
    'nature': ['#228B22', '#32CD32', '#6B8E23', '#8FBC8F', '#F0FFF0'],
    'natural': ['#228B22', '#32CD32', '#6B8E23', '#8FBC8F', '#F0FFF0'],
    'verde': ['#228B22', '#32CD32', '#6B8E23', '#8FBC8F', '#F0FFF0'],
    
    // Paletas verano
    'verano': ['#FF7F50', '#FFD700', '#00CED1', '#FF69B4', '#98FB98'],
    'summer': ['#FF7F50', '#FFD700', '#00CED1', '#FF69B4', '#98FB98'],
    'playa': ['#FF7F50', '#FFD700', '#00CED1', '#FF69B4', '#98FB98'],
    
    // Paletas retro
    'retro': ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7'],
    'vintage': ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7'],
    '80s': ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7'],
  };

  // Buscar coincidencias de palabras clave
  for (const [keyword, colors] of Object.entries(themePalettes)) {
    if (promptLower.includes(keyword)) {
      return colors;
    }
  }

  // Generación basada en palabras clave individuales
  const keywords = {
    'azul': ['#1E90FF', '#4169E1', '#0000FF', '#00BFFF', '#87CEEB'],
    'rojo': ['#FF0000', '#DC143C', '#B22222', '#CD5C5C', '#FF6347'],
    'verde': ['#008000', '#32CD32', '#00FF00', '#9ACD32', '#90EE90'],
    'amarillo': ['#FFFF00', '#FFD700', '#FFA500', '#FF8C00', '#FF6347'],
    'rosa': ['#FF69B4', '#FF1493', '#DB7093', '#FFB6C1', '#FFC0CB'],
    'morado': ['#800080', '#9370DB', '#8A2BE2', '#9932CC', '#BA55D3'],
    'naranja': ['#FFA500', '#FF8C00', '#FF6347', '#FF7F50', '#FF4500'],
    'cyan': ['#00FFFF', '#40E0D0', '#48D1CC', '#00CED1', '#20B2AA'],
  };

  for (const [keyword, colors] of Object.entries(keywords)) {
    if (promptLower.includes(keyword)) {
      return colors;
    }
  }

  // Paleta por defecto basada en el prompt
  const defaultPalettes = [
    ['#A855F7', '#7E22CE', '#3B82F6', '#EC4899', '#10B981'], // Violeta/tech
    ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7'], // Retro
    ['#2C2C54', '#474787', '#AAABB8', '#ECECEC', '#FFFFFF'], // Elegante
    ['#228B22', '#32CD32', '#6B8E23', '#8FBC8F', '#F0FFF0'], // Natural
    ['#FF7F50', '#FFD700', '#00CED1', '#FF69B4', '#98FB98'], // Verano
  ];

  // Seleccionar paleta basada en hash del prompt para consistencia
  const hash = promptLower.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const paletteIndex = Math.abs(hash) % defaultPalettes.length;
  return defaultPalettes[paletteIndex];
}

export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido. Usa POST.' },
    { status: 405 }
  );
}