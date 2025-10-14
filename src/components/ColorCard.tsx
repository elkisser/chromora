'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { ColorInfo, ColorFormat, getContrastColor } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface ColorCardProps {
  color: ColorInfo;
  onCopy?: (color: string) => void;
  className?: string;
}

const formatLabels: Record<ColorFormat, string> = {
  hex: 'HEX',
  rgb: 'RGB',
  rgba: 'RGBA',
  hsl: 'HSL',
};

export function ColorCard({ color, onCopy, className }: ColorCardProps) {
  const [currentFormat, setCurrentFormat] = useState<ColorFormat>('hex');
  const [copied, setCopied] = useState(false);

  const formats: ColorFormat[] = ['hex', 'rgb', 'rgba', 'hsl'];
  const currentColorValue = color[currentFormat];
  const contrastColor = getContrastColor(color.hex);

  const handleClick = () => {
    const currentIndex = formats.indexOf(currentFormat);
    const nextIndex = (currentIndex + 1) % formats.length;
    setCurrentFormat(formats[nextIndex]);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(currentColorValue);
      setCopied(true);
      onCopy?.(currentColorValue);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'relative group cursor-pointer rounded-2xl overflow-hidden shadow-2xl',
        'transition-all duration-300 hover:shadow-3xl border-2 border-white/10',
        'backdrop-blur-sm',
        className
      )}
      style={{ backgroundColor: color.hex }}
      onClick={handleClick}
    >
      {/* Efecto de brillo al hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Contenido de la tarjeta */}
      <div className="relative p-4 h-32 flex flex-col justify-end">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <motion.span
              key={currentFormat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-sm font-bold block truncate"
              style={{ color: contrastColor }}
            >
              {formatLabels[currentFormat]}
            </motion.span>
            <motion.span
              key={currentColorValue}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-xs block mt-1 truncate"
              style={{ color: contrastColor }}
            >
              {currentColorValue}
            </motion.span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className={cn(
              'p-2 rounded-xl backdrop-blur-sm transition-all duration-200 flex-shrink-0 ml-2',
              'hover:bg-black/20 hover:shadow-lg border border-white/20'
            )}
            style={{ color: contrastColor }}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Tooltip de copiado */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          className="absolute top-3 right-3 bg-dark-carbon text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 shadow-2xl"
        >
          ¡Copiado!
        </motion.div>
      )}
    </motion.div>
  );
}