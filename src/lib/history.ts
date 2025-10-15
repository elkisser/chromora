export interface PaletteHistory {
    id: string;
    baseColor: string;
    colors: string[];
    timestamp: number;
    name?: string;
    type: 'manual' | 'ai';
    size?: number;
  }
  
  const HISTORY_KEY = 'chromora-history';
  const MAX_HISTORY_ITEMS = 50;
  
export function saveToHistory(palette: Omit<PaletteHistory, 'id' | 'timestamp'>) {
    try {
      const history = getHistory();
      
      const historyItem: PaletteHistory = {
        ...palette,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
  
      // Evitar duplicados exactos
      const isDuplicate = history.some(item => 
        item.baseColor === historyItem.baseColor && 
        item.type === historyItem.type &&
        JSON.stringify(item.colors) === JSON.stringify(historyItem.colors)
      );
  
      if (!isDuplicate) {
        const newHistory = [historyItem, ...history].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }
  
  export function getHistory(): PaletteHistory[] {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading history:', error);
      return [];
    }
  }
  
  export function clearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
  
  export function removeFromHistory(id: string) {
    try {
      const history = getHistory();
      const newHistory = history.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    } catch (error) {
      console.error('Error removing from history:', error);
      return getHistory();
    }
  }
  
  export function getHistoryByType(type: 'manual' | 'ai'): PaletteHistory[] {
    const history = getHistory();
    return history.filter(item => item.type === type);
  }