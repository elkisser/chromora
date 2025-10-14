'use client';

import { motion } from 'framer-motion';
import { ColorCard } from './ColorCard';
import { ColorInfo } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface PaletteGridProps {
  colors: ColorInfo[];
  title?: string;
  onColorCopy?: (color: string) => void;
  className?: string;
}

export function PaletteGrid({ colors, title, onColorCopy, className }: PaletteGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (colors.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-white/40 text-lg">
          No hay colores para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {title && (
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white/90 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent"
        >
          {title}
        </motion.h3>
      )}
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {colors.map((color, index) => (
          <motion.div
            key={`${color.hex}-${index}`}
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 20 },
              show: { opacity: 1, scale: 1, y: 0 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <ColorCard
              color={color}
              onCopy={onColorCopy}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}