/**
 * World Themes — visual identity for each world/block
 * 
 * Shared between LevelSelection and GameScreen so that
 * each world feels visually distinct everywhere in the app.
 */

export interface WorldTheme {
    emoji: string;
    bg: string;         // Deep background color
    accent: string;     // Primary accent
    text: string;       // Text color on bg
    progressBar: string;
    glow: string;       // Decorative glow color
}

export const WORLD_THEMES: WorldTheme[] = [
    { emoji: '🌲', bg: '#166534', accent: '#22c55e', text: '#ffffff', progressBar: '#4ade80', glow: '#22c55e' },     // Bosque Verde
    { emoji: '🦁', bg: '#9a3412', accent: '#f97316', text: '#ffffff', progressBar: '#fb923c', glow: '#f97316' },     // Reino Animal
    { emoji: '🧁', bg: '#9d174d', accent: '#f472b6', text: '#ffffff', progressBar: '#f9a8d4', glow: '#ec4899' },     // Dulces Placeres
    { emoji: '🧬', bg: '#1e3a5f', accent: '#60a5fa', text: '#ffffff', progressBar: '#93c5fd', glow: '#3b82f6' },     // Humanidad
    { emoji: '🏡', bg: '#78350f', accent: '#fbbf24', text: '#ffffff', progressBar: '#fcd34d', glow: '#f59e0b' },     // Hogar Dulce Hogar
    { emoji: '🏙️', bg: '#334155', accent: '#94a3b8', text: '#ffffff', progressBar: '#cbd5e1', glow: '#64748b' },    // Jungla Urbana
    { emoji: '👗', bg: '#581c87', accent: '#c084fc', text: '#ffffff', progressBar: '#d8b4fe', glow: '#a855f7' },     // Semana de Moda
    { emoji: '🤖', bg: '#0e4d6e', accent: '#22d3ee', text: '#ffffff', progressBar: '#67e8f9', glow: '#06b6d4' },     // Futuro Cibernético
    { emoji: '✈️', bg: '#115e59', accent: '#2dd4bf', text: '#ffffff', progressBar: '#5eead4', glow: '#14b8a6' },     // Viajero Mundial
    { emoji: '🔬', bg: '#3f6212', accent: '#a3e635', text: '#ffffff', progressBar: '#bef264', glow: '#84cc16' },     // Laboratorio
    { emoji: '🍄', bg: '#3b0764', accent: '#a78bfa', text: '#ffffff', progressBar: '#c4b5fd', glow: '#8b5cf6' },     // Bosque Místico
    { emoji: '🐘', bg: '#7c2d12', accent: '#fb923c', text: '#ffffff', progressBar: '#fdba74', glow: '#ea580c' },     // Safari Salvaje
    { emoji: '👨‍🍳', bg: '#7f1d1d', accent: '#f87171', text: '#ffffff', progressBar: '#fca5a5', glow: '#ef4444' },   // Chef Gourmet
    { emoji: '🧘', bg: '#312e81', accent: '#818cf8', text: '#ffffff', progressBar: '#a5b4fc', glow: '#6366f1' },     // Cuerpo y Mente
    { emoji: '🛋️', bg: '#7c2d12', accent: '#f97171', text: '#ffffff', progressBar: '#fda4af', glow: '#fb7185' },    // Casa Soñada
    { emoji: '🌃', bg: '#0f172a', accent: '#38bdf8', text: '#ffffff', progressBar: '#7dd3fc', glow: '#0ea5e9' },     // Metrópolis
    { emoji: '💎', bg: '#701a75', accent: '#e879f9', text: '#ffffff', progressBar: '#f0abfc', glow: '#d946ef' },     // Icono de Estilo
    { emoji: '💻', bg: '#14532d', accent: '#4ade80', text: '#ffffff', progressBar: '#86efac', glow: '#22c55e' },     // Alta Tecnología
    { emoji: '🌍', bg: '#0c4a6e', accent: '#38bdf8', text: '#ffffff', progressBar: '#7dd3fc', glow: '#0284c7' },     // Trotamundos
    { emoji: '🚀', bg: '#1e1b4b', accent: '#a78bfa', text: '#ffffff', progressBar: '#c4b5fd', glow: '#7c3aed' },     // Ciencia Espacial
];

/**
 * Get the world theme for a given block index
 */
export function getWorldTheme(blockIndex: number): WorldTheme {
    return WORLD_THEMES[blockIndex % WORLD_THEMES.length];
}

/**
 * Get the block index from a level ID
 */
export function getBlockIndexFromLevelId(levelId: number): number {
    return Math.floor((levelId - 1) / 50);
}
