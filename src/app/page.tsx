'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, History, Download, Sparkles, Copy, Save, Menu } from 'lucide-react';
import { ColorPicker } from '@/components/ColorPicker';
import { AIPaletteGenerator } from '@/components/AIPaletteGenerator';
import { PaletteGrid } from '@/components/PaletteGrid';
import { generatePalette, getColorInfo, ColorInfo, resizePalette } from '@/lib/colors';
import { saveToHistory } from '@/lib/history';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type PaletteType = 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'splitComplementary' | 'tetradic';

export default function Home() {
  const [baseColor, setBaseColor] = useState('#a855f7');
  const [currentPalette, setCurrentPalette] = useState<ColorInfo[]>([]);
  const [paletteType, setPaletteType] = useState<PaletteType>('monochromatic');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [paletteSize, setPaletteSize] = useState<number>(5);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    generateNewPalette(baseColor, paletteType, paletteSize);
  }, [baseColor, paletteType, paletteSize]);

  const generateNewPalette = (color: string, type: PaletteType, size: number = paletteSize) => {
    setIsLoading(true);
    
    // Simular carga para mejor UX
    setTimeout(() => {
      try {
        const palette = generatePalette(color, size);
        const colors = palette[type].map(getColorInfo);
        setCurrentPalette(colors);
      } catch (error) {
        console.error('Error generating palette:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleColorSelect = (color: string) => {
    setBaseColor(color);
    setActiveTab('manual');
  };

  const handleAIPaletteGenerate = (colorInfos: ColorInfo[]) => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const resized = resizePalette(colorInfos.map(c => c.hex), paletteSize).map(getColorInfo);
        setCurrentPalette(resized);
      } catch (error) {
        console.error('Error setting AI palette:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleOpenSaveModal = () => {
    if (currentPalette.length === 0) return;
    setSaveName('');
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (currentPalette.length === 0) return;
    const name = saveName.trim() || (activeTab === 'ai' ? 'Generado por IA' : `Paleta ${getPaletteTypeLabel(paletteType)}`);
    saveToHistory({
      baseColor: (activeTab === 'ai' ? currentPalette[0]?.hex : baseColor) || baseColor,
      colors: currentPalette.map(c => c.hex),
      name,
      type: activeTab === 'ai' ? 'ai' : 'manual',
      size: currentPalette.length
    });
    setIsSaveModalOpen(false);
  };

  const handleColorCopy = (color: string) => {
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const paletteTypes: { key: PaletteType; label: string; description: string; }[] = [
    { key: 'monochromatic', label: 'Monocromática', description: 'Variaciones de un solo color' },
    { key: 'analogous', label: 'Análoga', description: 'Colores adyacentes en el círculo cromático' },
    { key: 'complementary', label: 'Complementario', description: 'Colores opuestos para alto contraste' },
    { key: 'triadic', label: 'Triádica', description: 'Tres colores equidistantes' },
    { key: 'splitComplementary', label: 'Complementario Dividido', description: 'Base + dos colores adyacentes al complemento' },
    { key: 'tetradic', label: 'Tetrádica', description: 'Cuatro colores formando rectángulo' },
  ];

  const getPaletteTypeLabel = (type: PaletteType) => {
    return paletteTypes.find(t => t.key === type)?.label || type;
  };

  const exportPalette = () => {
    const paletteData = {
      name: `Paleta Chromora - ${new Date().toLocaleString('es-ES')}`,
      baseColor,
      paletteType: activeTab === 'ai' ? 'ai-generated' : paletteType,
      colors: currentPalette.map(color => ({
        hex: color.hex,
        rgb: color.rgb,
        rgba: color.rgba,
        hsl: color.hsl,
        name: color.name
      })),
      generatedAt: new Date().toISOString(),
      source: 'Chromora Color Generator'
    };

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chromora-palette-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyPaletteAsJSON = () => {
    const paletteData = {
      colors: currentPalette.map(color => color.hex),
      baseColor,
      type: activeTab === 'ai' ? 'ai-generated' : paletteType
    };
    
    navigator.clipboard.writeText(JSON.stringify(paletteData, null, 2));
    setCopiedColor('Paleta copiada como JSON');
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-carbon via-dark-charcoal to-dark-titanium relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-purple-900/10 to-pink-900/10 animate-gradient-x" />
      
      {/* Partículas de fondo (oculto en mobile para vista más compacta) */}
      <div className="absolute inset-0 opacity-30 hidden md:block">
        {[...Array(20)].map((_, i) => {
          // Usar valores completamente determinísticos y enteros para evitar hidratación mismatch
          const positions = [
            [100, 200], [300, 150], [500, 300], [200, 400], [600, 100],
            [150, 500], [400, 250], [700, 350], [250, 600], [550, 200],
            [800, 450], [350, 100], [650, 500], [200, 300], [450, 600],
            [750, 150], [300, 450], [600, 300], [150, 200], [500, 550]
          ];
          
          const [initialX, initialY] = positions[i] || [100, 100];
          const [animateX, animateY] = positions[(i + 1) % positions.length] || [200, 200];
          const duration = 20 + (i % 3) * 10; // Duración determinística
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500 rounded-full blur-sm"
              initial={{
                x: initialX,
                y: initialY,
              }}
              animate={{
                x: animateX,
                y: animateY,
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          );
        })}
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-dark-charcoal/80 backdrop-blur-xl z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <motion.div 
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Palette className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Chromora
                </h1>
                <p className="text-white/60 text-sm">Generador de Paletas de Colores Inteligente</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              {/* Desktop actions */}
              <div className="hidden sm:flex items-center gap-3">
                {currentPalette.length > 0 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyPaletteAsJSON}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-titanium hover:bg-dark-slate text-white transition-all duration-300 border border-white/10"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar JSON
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportPalette}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-all duration-300 border border-primary-400/30 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenSaveModal}
                      disabled={currentPalette.length === 0}
                      className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white transition-all duration-300 border border-white/10 shadow-[0_10px_30px_-10px_rgba(168,85,247,0.7)] hover:shadow-[0_15px_40px_-10px_rgba(236,72,153,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity" />
                      <Save className="w-4 h-4 drop-shadow" />
                      <span className="font-semibold">Guardar</span>
                    </motion.button>
                  </>
                )}
                <Link
                  href="/history"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-titanium hover:bg-dark-slate text-white transition-all duration-300 border border-white/10"
                >
                  <History className="w-4 h-4" />
                  Historial
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg bg-dark-titanium border border-white/10"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
          {/* Mobile dropdown */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="sm:hidden mt-3 grid gap-2"
            >
              {currentPalette.length > 0 && (
                <>
                  <button
                    onClick={copyPaletteAsJSON}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-titanium hover:bg-dark-slate text-white transition-all duration-300 border border-white/10"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar JSON
                  </button>
                  <button
                    onClick={exportPalette}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-all duration-300 border border-primary-400/30"
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                  <button
                    onClick={handleOpenSaveModal}
                    disabled={currentPalette.length === 0}
                    className="w-full group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white transition-all duration-300 hover:shadow-[0_15px_40px_-10px_rgba(236,72,153,0.6)] disabled:opacity-50"
                  >
                    <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <Save className="w-4 h-4 drop-shadow" />
                    <span className="font-semibold">Guardar</span>
                  </button>
                </>
              )}
              <Link
                href="/history"
                className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-titanium hover:bg-dark-slate text-white transition-all duration-300 border border-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <History className="w-4 h-4" />
                Historial
              </Link>
            </motion.div>
          )}
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-6 md:py-8 z-10">
        {/* Tabs principales */}
        <div className="flex gap-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('manual')}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 border-2",
              "backdrop-blur-sm",
              activeTab === 'manual' 
                ? 'bg-primary-600 text-white shadow-2xl border-primary-500/50' 
                : 'bg-dark-titanium/50 text-white/60 hover:text-white hover:bg-dark-titanium/80 border-white/10'
            )}
          >
            <Palette className="w-5 h-5" />
            Modo Manual
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('ai')}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 border-2",
              "backdrop-blur-sm",
              activeTab === 'ai' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl border-purple-500/50' 
                : 'bg-dark-titanium/50 text-white/60 hover:text-white hover:bg-dark-titanium/80 border-white/10'
            )}
          >
            <Sparkles className="w-5 h-5" />
            IA Generativa
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Panel de Control */}
          <div className="lg:col-span-1 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'manual' ? (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-dark-charcoal/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl"
                >
                  <ColorPicker 
                    onColorSelect={handleColorSelect}
                    currentColor={baseColor}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-dark-charcoal/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl"
                >
                  <AIPaletteGenerator onPaletteGenerate={handleAIPaletteGenerate} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cantidad de colores (mueve al lugar del tipo de paleta) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-dark-charcoal/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-white/90 mb-4">Cantidad de colores</h3>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={1}
                  value={paletteSize}
                  onChange={(e) => setPaletteSize(parseInt(e.target.value))}
                  className="flex-1 accent-purple-500"
                />
                <div className="w-12 text-center font-mono text-white/80">{paletteSize}</div>
              </div>
              <p className="mt-2 text-xs text-white/50">Ajusta cuántos colores tendrá tu paleta (3 a 12).</p>
            </motion.div>
          </div>

          {/* Visualización de Paleta */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${paletteType}-${currentPalette.length}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full"
                    />
                  </div>
                ) : currentPalette.length > 0 ? (
                  <>
                    <PaletteGrid
                      colors={currentPalette}
                      title={activeTab === 'ai' 
                        ? '🎨 Paleta Generada por IA' 
                        : `🎨 Paleta ${getPaletteTypeLabel(paletteType)}`
                      }
                      onColorCopy={handleColorCopy}
                    />

                    {/* Selector de Tipo de Paleta en cards debajo de la paleta generada */}
                    {activeTab === 'manual' && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-white/80 mb-3">
                          Tipo de Paleta
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {paletteTypes.map((type) => (
                            <motion.button
                              key={type.key}
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setPaletteType(type.key)}
                              className={cn(
                                "p-4 rounded-xl text-left transition-all duration-300 border-2 backdrop-blur-sm",
                                "group hover:border-primary-500/30",
                                paletteType === type.key
                                  ? 'bg-primary-600/20 border-primary-500/50 text-white shadow-lg'
                                  : 'bg-dark-titanium/30 border-white/5 text-white/70 hover:bg-dark-titanium/50 hover:text-white'
                              )}
                            >
                              <div className="font-medium text-sm mb-1">{type.label}</div>
                              <div className="text-xs opacity-60 group-hover:opacity-80 transition-opacity">
                                {type.description}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Información adicional (más compacta y oculta en mobile) */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="hidden md:block bg-dark-charcoal/50 rounded-2xl p-4 border border-white/10 backdrop-blur-sm"
                    >
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div>
                          <div className="text-white/60">Colores</div>
                          <div className="text-white font-semibold">{currentPalette.length}</div>
                        </div>
                        <div>
                          <div className="text-white/60">Modo</div>
                          <div className="text-white font-semibold truncate">
                            {activeTab === 'ai' ? 'IA Generativa' : getPaletteTypeLabel(paletteType)}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60">Base</div>
                          <div className="text-white font-semibold font-mono truncate">{baseColor}</div>
                        </div>
                        <div>
                          <div className="text-white/60">Estado</div>
                          <div className="text-green-400 font-semibold">✓ Listo</div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl">
                      <Palette className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white/90 mb-3">
                      Bienvenido a Chromora
                    </h3>
                    <p className="text-white/60 max-w-md mx-auto">
                      {activeTab === 'manual' 
                        ? 'Selecciona un color o escribe uno para generar una paleta armónica.'
                        : 'Describe la paleta que deseas y nuestra IA la creará para ti.'
                      }
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Notificación de color copiado */}
        <AnimatePresence>
          {copiedColor && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="fixed bottom-6 right-6 bg-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-primary-400/30 backdrop-blur-sm z-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-medium">{copiedColor}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Guardar */}
        <AnimatePresence>
          {isSaveModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 grid place-items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSaveModalOpen(false)} />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-md px-4 sm:px-6 py-6 rounded-2xl bg-dark-charcoal border border-white/10 shadow-2xl"
              >
                <h3 className="text-lg font-semibold text-white mb-2">Guardar paleta</h3>
                <p className="text-white/60 text-sm mb-4">Asigna un nombre para guardar esta paleta en tu historial.</p>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Nombre de la paleta"
                  className="w-full px-4 py-3 rounded-xl bg-dark-titanium/60 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                />
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setIsSaveModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-dark-titanium hover:bg-dark-slate text-white border border-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmSave}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white border border-white/10 shadow-[0_10px_30px_-10px_rgba(168,85,247,0.7)] hover:shadow-[0_15px_40px_-10px_rgba(236,72,153,0.6)] transition-all"
                  >
                    Guardar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}