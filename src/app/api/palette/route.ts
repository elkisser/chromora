import { NextRequest, NextResponse } from 'next/server';
import { generatePalette, getColorInfo, parseColor } from '@/lib/colors';

export async function POST(request: NextRequest) {
  try {
    const { color } = await request.json();

    if (!color || typeof color !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere un color válido' },
        { status: 400 }
      );
    }

    const parsedColor = parseColor(color);
    if (!parsedColor) {
      return NextResponse.json(
        { error: 'Formato de color no válido. Usa nombres, HEX, RGB o HSL.' },
        { status: 400 }
      );
    }

    const palette = generatePalette(parsedColor);
    const result: Record<string, any> = {};

    // Convertir todas las paletas a formato ColorInfo
    for (const [key, colors] of Object.entries(palette)) {
      result[key] = colors.map((color: string) => getColorInfo(color));
    }

    // Agregar información del color base
    result.baseColor = getColorInfo(parsedColor);

    return NextResponse.json({
      success: true,
      data: result,
      baseColor: parsedColor
    });
  } catch (error) {
    console.error('Error en generación de paleta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido. Usa POST.' },
    { status: 405 }
  );
}