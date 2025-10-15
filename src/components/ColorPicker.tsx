'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Palette, Search } from 'lucide-react';
import { parseColor, getColorInfo, isValidColor } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  currentColor?: string;
}

export function ColorPicker({ onColorSelect, currentColor = '#a855f7' }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    // Cargar colores recientes del localStorage
    const saved = localStorage.getItem('chromora-recent-colors');
    if (saved) {
      setRecentColors(JSON.parse(saved));
    }
  }, []);

  const saveToRecentColors = (color: string) => {
    const newRecent = [color, ...recentColors.filter(c => c !== color)].slice(0, 10);
    setRecentColors(newRecent);
    localStorage.setItem('chromora-recent-colors', JSON.stringify(newRecent));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim() === '') {
      setIsValid(true);
      return;
    }
    
    const parsed = parseColor(value);
    setIsValid(!!parsed);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim() === '') return;
    
    const parsed = parseColor(inputValue);
    if (parsed) {
      onColorSelect(parsed);
      saveToRecentColors(parsed);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    saveToRecentColors(color);
  };

  const presetColors = [
    '#a855f7', '#7e22ce', '#3b82f6', '#ec4899', '#10b981',
    '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16',
    '#f97316', '#64748b', '#14b8a6', '#d946ef', '#f43f5e'
  ];

  const colorInfo = getColorInfo(currentColor);

  return (
    <div className="space-y-6">
      {/* Input de color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Ingresa un color (nombre, HEX, RGB, HSL)
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ej: azul marino, #1e90ff, rgb(30,144,255), hsl(210, 100%, 56%)"
            className={cn(
              "w-full sm:flex-1 px-4 py-3 rounded-xl border-2 bg-dark-charcoal/80 backdrop-blur-sm",
              "text-white placeholder:text-white/40 focus:outline-none transition-all duration-300",
              "font-mono text-sm",
              isValid 
                ? "border-primary-500/30 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20" 
                : "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            )}
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInputSubmit}
            disabled={!isValid || inputValue.trim() === ''}
            className={cn(
              "w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all duration-300",
              "bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",
              "text-white shadow-lg hover:shadow-xl border border-primary-400/30",
              "flex items-center gap-2"
            )}
          >
            <Palette className="w-4 h-4" />
            Generar
          </motion.button>
        </div>
        
        {!isValid && inputValue.trim() !== '' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm flex items-center gap-2"
          >
            ❌ Color no válido. Intenta con: nombres (azul, rojo), HEX (#1e90ff), RGB (rgb(30,144,255)) o HSL (hsl(210, 100%, 56%))
          </motion.p>
        )}
      </div>

      {/* Selector de color nativo */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          O selecciona un color
        </label>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-dark-charcoal/50 rounded-2xl border border-white/10">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="w-20 h-20 rounded-2xl cursor-pointer border-2 border-white/20 shadow-2xl"
          />
          
          <div className="w-full sm:flex-1 space-y-2">
            <p className="text-white font-mono text-lg font-bold">{currentColor}</p>
            <div className="space-y-1 text-sm text-white/60">
              <p className="font-mono">{colorInfo.rgb}</p>
              <p className="font-mono">{colorInfo.hsl}</p>
              {colorInfo.name && (
                <p className="text-primary-300">Nombre: {colorInfo.name}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Colores predefinidos */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/80">
          Colores predefinidos
        </label>
        
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
          {presetColors.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleColorSelect(color)}
              className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-lg transition-all duration-200 hover:shadow-xl relative group"
              style={{ backgroundColor: color }}
              title={color}
            >
              <div className="absolute inset-0 rounded-xl border-2 border-white/0 group-hover:border-white/40 transition-all duration-200" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Colores recientes */}
      {recentColors.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/80">
            Colores recientes
          </label>
          
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
            {recentColors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleColorSelect(color)}
                className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-lg transition-all duration-200 hover:shadow-xl relative group"
                style={{ backgroundColor: color }}
                title={color}
              >
                <div className="absolute inset-0 rounded-xl border-2 border-white/0 group-hover:border-white/40 transition-all duration-200" />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}