
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GridCell as GridCellType } from '@/types';
import { getSelectedCells } from '@/utils/gameUtils';
import { useGame } from '@/store/GameContext';
import { hapticService } from '@/services/hapticService';

interface Props {
    grid: GridCellType[][];
    onWordFound: (word: string, cells: { row: number, col: number }[]) => void;
    foundWordsCells: { row: number, col: number, color: string }[];
    rotation?: number;
}

// Memoized cell component to prevent unnecessary re-renders
interface CellProps {
    letter: string;
    row: number;
    col: number;
    isActive: boolean;
    isHinted: boolean;
    foundColors: string[];
    selectionColor: string;
    rotation: number;
    fontSize: number;
}

const GridCell = React.memo<CellProps>(({
    letter,
    row,
    col,
    isActive,
    isHinted,
    foundColors,
    selectionColor,
    rotation,
    fontSize
}) => {
    return (
        <div
            className="relative flex items-center justify-center font-black select-none pointer-events-none"
            style={{ fontSize: `${fontSize}px` }}
        >
            {/* Selection Highlight */}
            {isActive && (
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-[2%] opacity-60 rounded-lg z-0 ring-2"
                    style={{
                        backgroundColor: selectionColor,
                        borderColor: selectionColor,
                        boxShadow: `0 0 0 2px ${selectionColor}33`
                    }}
                />
            )}

            {/* Hint Highlight */}
            {isHinted && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-[10%] border-2 border-dashed border-[#fbbf24] rounded-full z-0 animate-[spin_8s_linear_infinite]"
                />
            )}

            {/* Found Word Highlights */}
            {foundColors.map((color, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.7 }}
                    className={`absolute inset-[8%] rounded-md z-0 ring-1 ring-[#0f172a]/5 ${document.documentElement.classList.contains('dark') ? 'mix-blend-lighten opacity-40' : 'mix-blend-multiply opacity-70'}`}
                    style={{ backgroundColor: color }}
                />
            ))}

            <motion.span
                animate={{ rotate: -rotation }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className={`relative z-10 transition-all duration-200 ${isActive ? 'text-[var(--color-ink)] scale-125 font-black' :
                    isHinted ? 'text-[var(--color-ink)] font-black' :
                        'text-[var(--color-text-secondary)]'
                    }`}
            >
                {letter}
            </motion.span>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for better performance
    return (
        prevProps.letter === nextProps.letter &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.isHinted === nextProps.isHinted &&
        prevProps.rotation === nextProps.rotation &&
        prevProps.selectionColor === nextProps.selectionColor &&
        prevProps.fontSize === nextProps.fontSize &&
        prevProps.foundColors.length === nextProps.foundColors.length &&
        prevProps.foundColors.every((c, i) => c === nextProps.foundColors[i])
    );
});

GridCell.displayName = 'GridCell';

const WordSearchGrid: React.FC<Props> = ({ grid, onWordFound, foundWordsCells, rotation = 0 }) => {
    const [selection, setSelection] = useState<{ start: { row: number, col: number } | null, end: { row: number, col: number } | null }>({
        start: null,
        end: null
    });
    const [activeCells, setActiveCells] = useState<{ row: number, col: number }[]>([]);
    const [selectionColor, setSelectionColor] = useState<string>('#fde047');
    const containerRef = useRef<HTMLDivElement>(null);
    const { state } = useGame();
    const prevActiveCellsCount = useRef(0);

    // Memoize grid dimensions
    const gridSize = grid.length;
    const fontSize = useMemo(() => Math.max(16, 160 / gridSize), [gridSize]);

    // Create a lookup map for found cells for O(1) access
    const foundCellsMap = useMemo(() => {
        const map = new Map<string, string[]>();
        foundWordsCells.forEach(fc => {
            const key = `${fc.row}-${fc.col}`;
            const existing = map.get(key) || [];
            existing.push(fc.color);
            map.set(key, existing);
        });
        return map;
    }, [foundWordsCells]);

    // Create a lookup set for hinted cells for O(1) access
    const hintedCellsSet = useMemo(() => {
        return new Set(state.hintedCells.map(hc => `${hc.row}-${hc.col}`));
    }, [state.hintedCells]);

    // Create a lookup set for active cells for O(1) access
    const activeCellsSet = useMemo(() => {
        return new Set(activeCells.map(ac => `${ac.row}-${ac.col}`));
    }, [activeCells]);

    const getGridPos = useCallback((clientX: number, clientY: number) => {
        if (!containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        let x = clientX - rect.left;
        let y = clientY - rect.top;

        // Account for rotation (specifically 180 degree flips)
        const isFlipped = (Math.round(rotation / 180) % 2) !== 0;
        if (isFlipped) {
            x = rect.width - x;
            y = rect.height - y;
        }

        const cellSize = rect.width / grid[0].length;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
            return { row, col };
        }
        return null;
    }, [grid, rotation]);

    const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (state.isPaused) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const pos = getGridPos(clientX, clientY);
        if (pos) {
            setSelection({ start: pos, end: pos });
            setActiveCells([pos]);
            hapticService.selection(); // Haptic feedback for selection start

            // Determine selection color based on potential word start/end
            const wordStartingHere = state.wordsInfo.find(w => {
                if (!w.cells) return false;
                const first = w.cells[0];
                const last = w.cells[w.cells.length - 1];
                return (first.row === pos.row && first.col === pos.col) ||
                    (last.row === pos.row && last.col === pos.col);
            });

            if (wordStartingHere) {
                setSelectionColor(wordStartingHere.color);
            } else {
                setSelectionColor('#fde047');
            }
        }
    }, [getGridPos, state.isPaused, state.wordsInfo]);

    const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!selection.start || state.isPaused) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const pos = getGridPos(clientX, clientY);

        if (pos && (pos.row !== selection.end?.row || pos.col !== selection.end?.col)) {
            const newActiveCells = getSelectedCells(selection.start, pos);
            setSelection(prev => ({ ...prev, end: pos }));
            setActiveCells(newActiveCells);
        }
    }, [selection.start, selection.end, getGridPos, state.isPaused]);

    const handleEnd = useCallback(() => {
        if (!selection.start || !selection.end) return;
        const word = activeCells.map(cell => grid[cell.row][cell.col].letter).join('');
        const reversedWord = [...word].reverse().join('');

        onWordFound(word, activeCells);
        onWordFound(reversedWord, activeCells);

        setSelection({ start: null, end: null });
        setActiveCells([]);
    }, [selection.start, selection.end, activeCells, grid, onWordFound]);

    // Haptic feedback when selection length changes
    useEffect(() => {
        if (activeCells.length > prevActiveCellsCount.current && activeCells.length > 1) {
            hapticService.selection();
        }
        prevActiveCellsCount.current = activeCells.length;
    }, [activeCells.length]);

    useEffect(() => {
        const preventDefault = (e: TouchEvent) => { if (selection.start) e.preventDefault(); };
        document.addEventListener('touchmove', preventDefault, { passive: false });
        return () => document.removeEventListener('touchmove', preventDefault);
    }, [selection.start]);

    return (
        <div className="relative w-full max-w-[min(95vw,480px)] aspect-square mx-auto">
            <motion.div
                ref={containerRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full h-full bg-[var(--color-surface)] border-4 border-[var(--color-ink)] rounded-2xl p-2 no-select touch-none shadow-[8px_8px_0px_0px_var(--shadow-color)]"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            >
                <div
                    className="grid h-full w-full relative z-10"
                    style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}
                >
                    {grid.map((row, rIdx) => (
                        row.map((cell, cIdx) => {
                            const cellKey = `${rIdx}-${cIdx}`;
                            const isActive = activeCellsSet.has(cellKey);
                            const isHinted = hintedCellsSet.has(cellKey);
                            const foundColors = foundCellsMap.get(cellKey) || [];

                            return (
                                <GridCell
                                    key={cellKey}
                                    letter={cell.letter}
                                    row={rIdx}
                                    col={cIdx}
                                    isActive={isActive}
                                    isHinted={isHinted}
                                    foundColors={foundColors}
                                    selectionColor={selectionColor}
                                    rotation={rotation}
                                    fontSize={fontSize}
                                />
                            );
                        })
                    ))}
                </div>

                {/* Grid Lines for that classic puzzle look */}
                <div className="absolute inset-2 pointer-events-none opacity-[0.03] flex flex-col justify-between">
                    {Array.from({ length: grid.length - 1 }).map((_, i) => (
                        <div key={i} className="w-full h-[1px] bg-[var(--color-ink)]" />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default React.memo(WordSearchGrid);
