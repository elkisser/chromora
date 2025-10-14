'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader, Sparkles } from 'lucide-react';
import { getColorInfo, ColorInfo } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface AIPaletteGeneratorProps {
  onPaletteGenerate: (colors: ColorInfo[]) => void;
}

export function AIPaletteGenerator({ onPaletteGenerate }: AIPaletteGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-palette', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.colors && Array.isArray(data.colors)) {
        const colorInfos = data.colors.map((color: string) => getColorInfo(color));
        onPaletteGenerate(colorInfos);
        setPrompt('');
      } else {
        throw new Error('Formato de respuesta inválido de la IA');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al generar la paleta');
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "paleta otoñal pastel",
    "colores para una app gamer futurista",
    "tonos fríos elegantes para dashboard",
    "paleta vibrante veraniega",
    "colores minimalistas profesionales",
    "esquema de colores para landing page tech",
    "paleta naturaleza orgánica",
    "colores retro años 80",
    "esquema monocromático azul",
    "paleta lujo dorado y negro"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          Generar paleta con IA
          <span className="px-2 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
            Beta
          </span>
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
            placeholder="Describe la paleta que quieres crear..."
            disabled={isLoading}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl border-2 bg-dark-charcoal/80 backdrop-blur-sm",
              "text-white placeholder:text-white/40 focus:outline-none transition-all duration-300",
              "border-purple-500/30 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
          
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className={cn(
              "px-6 py-3 rounded-xl font-medium transition-all duration-300",
              "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
              "text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center gap-2 border border-purple-400/30"
            )}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Crear
              </>
            )}
          </motion.button>
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm flex items-center gap-2"
          >
            ❌ {error}
          </motion.p>
        )}
      </div>

      {/* Ejemplos de prompts */}
      <div className="space-y-3">
        <p className="text-sm text-white/60">Ejemplos de prompts que puedes usar:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <motion.button
              key={example}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPrompt(example)}
              disabled={isLoading}
              className={cn(
                "px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-dark-titanium to-dark-slate",
                "text-white/70 hover:text-white hover:from-dark-slate hover:to-dark-titanium",
                "transition-all duration-200 border border-white/10 hover:border-white/20",
                "disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Información de la funcionalidad IA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 bg-dark-charcoal/50 rounded-2xl border border-purple-500/20"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Cómo funciona la IA</h4>
            <p className="text-sm text-white/60">
              Describe el estilo, mood o tema de la paleta que deseas. La IA analizará tu descripción 
              y generará una paleta de colores armónica basada en tu petición.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}