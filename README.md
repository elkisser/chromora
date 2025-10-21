<div align="center">

# 🎨 Chromora

### Generador Inteligente de Paletas de Colores

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

*Una aplicación moderna para crear paletas de colores hermosas y útiles, con modos manuales y asistidos por IA*

</div>

---

## ✨ Características principales

### 🎯 Generación de Paletas
- **Modo Manual**: 6 tipos de paletas armónicas (Monocromática, Análoga, Complementaria, Triádica, Complementaria Dividida, Tetrádica)
- **Modo IA**: Generación inteligente a partir de prompts en lenguaje natural
- **Cantidad Flexible**: Configura de 3 a 12 colores con reescalado armónico LCH
- **Ejemplos Dinámicos**: Prompts rotativos que se actualizan con cada generación

### 🎨 Experiencia Visual
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- **Tarjetas Interactivas**: Visualización elegante de colores con información detallada
- **Responsive Design**: Optimizado para desktop y mobile
- **Tema Oscuro**: Interfaz moderna con gradientes y efectos glassmorphism

### 💾 Gestión de Paletas
- **Exportación**: Copia como JSON o descarga archivo
- **Historial Persistente**: Guardado local con filtros y búsqueda
- **Guardado Manual**: Modal personalizado para nombrar paletas
- **Colores Recientes**: Acceso rápido a colores usados anteriormente

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|-----------|
| **Framework** | Next.js | 15.0.0 | App Router, SSR, API Routes |
| **Lenguaje** | TypeScript | 5.0+ | Tipado estático |
| **Estilos** | Tailwind CSS | 3.3+ | Utility-first CSS |
| **Animaciones** | Framer Motion | 10.16+ | Animaciones fluidas |
| **Iconos** | Lucide React | 0.294+ | Iconografía moderna |
| **Colores** | chroma-js | 2.4+ | Manipulación de colores |
| **Almacenamiento** | LocalStorage | - | Persistencia local |
| **Deploy** | Netlify | - | Hosting con plugin Next.js |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── ai-palette/route.ts    # 🤖 API para generación de paletas por IA
│   │   └── palette/route.ts       # 🎨 API para generar paletas manuales
│   ├── history/page.tsx           # 📚 Vista del historial con filtros
│   ├── layout.tsx                 # 🏗️ Layout raíz y estilos globales
│   └── page.tsx                   # 🏠 Home: UI principal
├── components/
│   ├── AIPaletteGenerator.tsx     # ✨ Prompt IA y ejemplos dinámicos
│   ├── ColorPicker.tsx            # 🎯 Selector de colores avanzado
│   ├── PaletteGrid.tsx            # 🌈 Grilla de colores animada
│   └── ColorCard.tsx              # 🃏 Tarjeta individual de color
├── lib/
│   ├── colors.ts                  # 🔬 Lógica de generación de paletas
│   ├── history.ts                 # 💾 Manejo de historial (LocalStorage)
│   └── utils.ts                   # 🛠️ Utilidades varias
└── public/
    ├── icon.png                   # 🖼️ Favicon del sitio
    └── logo_chromora.png          # 🎨 Logo principal
```

---

## 🚀 Inicio Rápido

### 📋 Requisitos Previos
- **Node.js** 18+ (configurado en `netlify.toml`)
- **npm** o **yarn** para gestión de dependencias
- No se requieren variables de entorno (IA simulada)

### ⚡ Instalación y Desarrollo

```bash
# 1️⃣ Clonar el repositorio
git clone <tu-repo-url>
cd chromora

# 2️⃣ Instalar dependencias
npm install

# 3️⃣ Iniciar servidor de desarrollo
npm run dev

# 4️⃣ Abrir en el navegador
# http://localhost:3000
```

### 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | 🟢 Inicia servidor de desarrollo |
| `npm run build` | 🔨 Compila para producción |
| `npm run start` | 🚀 Sirve build de producción |
| `npm run lint` | 🔍 Ejecuta ESLint |

---

## 🎯 Características Técnicas

### 🎨 Generación de Paletas
- **Algoritmo LCH**: Reescalado armónico que mantiene consistencia cromática
- **6 Tipos Armónicos**: Monocromática, Análoga, Complementaria, Triádica, Complementaria Dividida, Tetrádica
- **IA Simulada**: Sistema inteligente que reconoce temas y colores por palabras clave

### 💾 Persistencia de Datos
- **LocalStorage**: Historial de paletas con metadatos completos
- **Guardado Manual**: Modal personalizado para nombrar paletas
- **Colores Recientes**: Cache de colores usados anteriormente

### 🎭 Experiencia de Usuario
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Responsive Design**: Optimizado para desktop y mobile
- **Accesibilidad**: Enfoques visibles y navegación por teclado
- **Tema Oscuro**: Interfaz moderna con efectos glassmorphism

---

## 🌐 Estado de Despliegue

### ✅ Listo para Producción
- **Netlify**: Configurado con `@netlify/plugin-nextjs`
- **Build**: `npm run build` sin pasos adicionales
- **Node.js**: Versión 18 configurada
- **Favicon**: Configurado con `public/icon.png`

### 🔧 Configuración Incluida
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 📝 Notas de Implementación

### 🎨 Algoritmo de Colores
```typescript
// Generación manual con reescalado LCH
const palette = generatePalette(baseColor, count);
const scaled = chroma.scale(palette).mode('lch').colors(count);

// IA con normalización
const resized = resizePalette(aiColors, userCount);
```

### 💾 Estructura de Historial
```typescript
interface PaletteHistory {
  id: string;
  baseColor: string;
  colors: string[];
  timestamp: number;
  name?: string;
  type: 'manual' | 'ai';
  size?: number;
}
```

---

## 📄 Licencia

Este proyecto se distribuye para fines educativos y demostrativos. 

---

<div align="center">

**Hecho con ❤️ usando Next.js y TypeScript**

[⬆️ Volver al inicio](#-chromora)

</div>
