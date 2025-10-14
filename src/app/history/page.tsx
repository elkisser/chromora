'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ArrowLeft, Palette, Sparkles, Search } from 'lucide-react';
import { PaletteGrid } from '@/components/PaletteGrid';
import { getHistory, clearHistory, removeFromHistory, PaletteHistory } from '@/lib/history';
import { getColorInfo } from '@/lib/colors';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const [history, setHistory] = useState<PaletteHistory[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<PaletteHistory | null>(null);
  const [filter, setFilter] = useState<'all' | 'manual' | 'ai'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
      clearHistory();
      setHistory([]);
      setSelectedPalette(null);
    }
  };

  const handleRemoveFromHistory = (id: string) => {
    removeFromHistory(id);
    loadHistory();
    if (selectedPalette?.id === id) {
      setSelectedPalette(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredHistory = history.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.baseColor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (selectedPalette) {
    const colors = selectedPalette.colors.map(getColorInfo);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-carbon via-dark-charcoal to-dark-titanium">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPalette(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-titanium hover:bg-dark-slate text-white transition-all duration-300 border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Historial
            </motion.button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedPalette.name}</h1>
              <p className="text-white/60">
                {formatDate(selectedPalette.timestamp)} • {selectedPalette.type === 'ai' ? 'IA Generativa' : 'Modo Manual'}
              </p>
            </div>
          </div>

          <PaletteGrid colors={colors} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-carbon via-dark-charcoal to-dark-titanium">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-titanium hover:bg-dark-slate text-white transition-all duration-300 border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Inicio
            </Link>
            
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05 }}
              >
                <History className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">Historial de Paletas</h1>
                <p className="text-white/60">Tus paletas generadas recientemente</p>
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all duration-300 border border-red-400/30"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar Todo
            </motion.button>
          )}
        </div>

        {/* Filtros y búsqueda */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 mb-6 p-6 bg-dark-charcoal/50 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <div className="flex gap-2">
              {(['all', 'manual', 'ai'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border",
                    filter === filterType
                      ? filterType === 'ai'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500/50'
                        : 'bg-primary-600 text-white border-primary-500/50'
                      : 'bg-dark-titanium/50 text-white/60 border-white/10 hover:text-white hover:bg-dark-titanium/80'
                  )}
                >
                  {filterType === 'all' && 'Todos'}
                  {filterType === 'manual' && 'Manual'}
                  {filterType === 'ai' && 'IA'}
                </button>
              ))}
            </div>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por nombre o color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-dark-titanium/50 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-primary-500/50 transition-all duration-300"
              />
            </div>
          </motion.div>
        )}

        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            {history.length === 0 ? (
              <>
                <Palette className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white/60 mb-2">
                  No hay paletas en el historial
                </h2>
                <p className="text-white/40 mb-6">
                  Genera algunas paletas para verlas aquí
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-all duration-300"
                >
                  <Palette className="w-4 h-4" />
                  Crear Primera Paleta
                </Link>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white/60 mb-2">
                  No se encontraron paletas
                </h2>
                <p className="text-white/40">
                  Intenta con otros términos de búsqueda o ajusta los filtros
                </p>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            <AnimatePresence>
              {filteredHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-charcoal/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedPalette(item)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {item.name || 'Paleta sin nombre'}
                        </h3>
                        <span className={cn(
                          "px-2 py-1 text-xs rounded-full font-medium",
                          item.type === 'ai' 
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-primary-600 text-white"
                        )}>
                          {item.type === 'ai' ? 'IA' : 'Manual'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>{formatDate(item.timestamp)}</span>
                        <span>•</span>
                        <span className="font-mono">{item.baseColor}</span>
                        <span>•</span>
                        <span>{item.colors.length} colores</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromHistory(item.id);
                      }}
                      className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {item.colors.slice(0, 8).map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 h-12 rounded-lg border-2 border-white/10 shadow-lg transition-all duration-300 group-hover:border-white/20"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                    {item.colors.length > 8 && (
                      <div className="flex-1 h-12 rounded-lg bg-dark-titanium/50 border-2 border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all duration-300">
                        <span className="text-white/60 text-sm">
                          +{item.colors.length - 8}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Estadísticas */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-dark-charcoal/50 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{history.length}</div>
                <div className="text-white/60 text-sm">Total Paletas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-400">
                  {history.filter(item => item.type === 'manual').length}
                </div>
                <div className="text-white/60 text-sm">Manuales</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {history.filter(item => item.type === 'ai').length}
                </div>
                <div className="text-white/60 text-sm">IA Generadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {new Set(history.flatMap(item => item.colors)).size}
                </div>
                <div className="text-white/60 text-sm">Colores Únicos</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}