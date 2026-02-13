
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Group, Line } from 'react-konva';
import { GridCell as GridCellType } from '@/types';
import { getSelectedCells } from '@/utils/gameUtils';
import { useGameStore } from '@/store/useGameStore';
import { hapticService } from '@/services/hapticService';
import Konva from 'konva';

interface Props {
    onWordFound: (word: string, cells: { row: number, col: number }[]) => void;
    rotation?: number;
}

const WordSearchGridCanvas: React.FC<Props> = ({ onWordFound, rotation = 0 }) => {
    const grid = useGameStore(state => state.grid);
    const foundWordsCells = useGameStore(state => state.foundWordsCells);
    const isPaused = useGameStore(state => state.isPaused);
    const wordsInfo = useGameStore(state => state.wordsInfo);
    const hintedCells = useGameStore(state => state.hintedCells);

    const [selection, setSelection] = useState<{ start: { row: number, col: number } | null, end: { row: number, col: number } | null }>({
        start: null,
        end: null
    });
    const [activeCells, setActiveCells] = useState<{ row: number, col: number }[]>([]);
    const [selectionColor, setSelectionColor] = useState<string>('#fde047');
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);

    // Track size for responsiveness
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setContainerSize({ width, height: width });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const stageSize = containerSize.width > 0 ? containerSize.width - 24 : 0; // border(4+4) + padding(8+8)
    const gridSize = grid.length;
    const cellSize = gridSize > 0 ? stageSize / gridSize : 0;
    const fontSize = gridSize > 0 ? Math.max(16, (stageSize * 0.45) / gridSize) : 16;

    // Lookup maps for performance
    const foundMap = useMemo(() => {
        const map = new Map<string, string[]>();
        foundWordsCells.forEach(fc => {
            const key = `${fc.row}-${fc.col}`;
            map.set(key, [...(map.get(key) || []), fc.color]);
        });
        return map;
    }, [foundWordsCells]);

    const activeSet = useMemo(() => new Set(activeCells.map(c => `${c.row}-${c.col}`)), [activeCells]);
    const hintedSet = useMemo(() => new Set(hintedCells.map(c => `${c.row}-${c.col}`)), [hintedCells]);

    const getPosFromEvent = (e: any) => {
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();
        if (!pointer) return null;

        let x = pointer.x;
        let y = pointer.y;

        // Account for rotation
        const isFlipped = (Math.round(rotation / 180) % 2) !== 0;
        if (isFlipped) {
            x = stageSize - x;
            y = stageSize - y;
        }

        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
            return { row, col };
        }
        return null;
    };

    const handleStart = (e: any) => {
        if (isPaused) return;
        const pos = getPosFromEvent(e);
        if (pos) {
            setSelection({ start: pos, end: pos });
            setActiveCells([pos]);
            hapticService.selection();

            const wordAtStart = wordsInfo.find(w => {
                if (!w.cells) return false;
                const first = w.cells[0];
                const last = w.cells[w.cells.length - 1];
                return (first.row === pos.row && first.col === pos.col) ||
                    (last.row === pos.row && last.col === pos.col);
            });
            setSelectionColor(wordAtStart?.color || '#fde047');
        }
    };

    const handleMove = (e: any) => {
        if (!selection.start || isPaused) return;
        const pos = getPosFromEvent(e);
        if (pos && (pos.row !== selection.end?.row || pos.col !== selection.end?.col)) {
            const newActiveCells = getSelectedCells(selection.start, pos);
            setSelection(prev => ({ ...prev, end: pos }));
            setActiveCells(newActiveCells);
            hapticService.selection();
        }
    };

    const handleEnd = () => {
        if (!selection.start || !selection.end) return;
        const word = activeCells.map(cell => grid[cell.row][cell.col].letter).join('');
        const reversedWord = [...word].reverse().join('');

        onWordFound(word, activeCells);
        onWordFound(reversedWord, activeCells);

        setSelection({ start: null, end: null });
        setActiveCells([]);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-[min(95vw,480px)] aspect-square mx-auto bg-[var(--color-surface)] border-4 border-[var(--color-ink)] rounded-2xl p-2 shadow-[8px_8px_0px_0px_var(--shadow-color)] overflow-hidden flex items-center justify-center"
        >
            {containerSize.width > 0 && (
                <Stage
                    width={stageSize}
                    height={stageSize}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                    ref={stageRef}
                    style={{ cursor: selection.start ? 'grabbing' : 'default' }}
                >
                    <Layer
                        rotation={rotation}
                        offsetX={stageSize / 2}
                        offsetY={stageSize / 2}
                        x={stageSize / 2}
                        y={stageSize / 2}
                    >
                        {/* 1. Base Grid Layer (Found words backgrounds) */}
                        {grid.map((row, rIdx) =>
                            row.map((cell, cIdx) => {
                                const key = `${rIdx}-${cIdx}`;
                                const colors = foundMap.get(key) || [];
                                const isHinted = hintedSet.has(key);
                                const x = cIdx * cellSize;
                                const y = rIdx * cellSize;

                                return (
                                    <Group key={key}>
                                        {/* Found colors backgrounds */}
                                        {colors.map((color, idx) => (
                                            <Rect
                                                key={idx}
                                                x={x + 4}
                                                y={y + 4}
                                                width={cellSize - 8}
                                                height={cellSize - 8}
                                                fill={color}
                                                opacity={0.6}
                                                cornerRadius={8}
                                            />
                                        ))}

                                        {/* Hinted highlight */}
                                        {isHinted && (
                                            <Rect
                                                x={x + 6}
                                                y={y + 6}
                                                width={cellSize - 12}
                                                height={cellSize - 12}
                                                stroke="#fbbf24"
                                                strokeWidth={2}
                                                dash={[5, 2]}
                                                cornerRadius={cellSize}
                                            />
                                        )}
                                    </Group>
                                );
                            })
                        )}

                        {/* 2. Active Selection Layer */}
                        {activeCells.map((cell, idx) => (
                            <Rect
                                key={`active-${idx}`}
                                x={cell.col * cellSize + 2}
                                y={cell.row * cellSize + 2}
                                width={cellSize - 4}
                                height={cellSize - 4}
                                fill={selectionColor}
                                opacity={0.4}
                                cornerRadius={8}
                                stroke={selectionColor}
                                strokeWidth={1}
                            />
                        ))}

                        {/* 3. Letters Layer */}
                        {grid.map((row, rIdx) =>
                            row.map((cell, cIdx) => {
                                const key = `${rIdx}-${cIdx}`;
                                return (
                                    <Text
                                        key={`text-${key}`}
                                        text={cell.letter}
                                        width={cellSize}
                                        height={cellSize}
                                        fontSize={fontSize}
                                        fontFamily="Outfit"
                                        fontStyle="900"
                                        fill="#0f172a"
                                        align="center"
                                        verticalAlign="middle"
                                        listening={false}
                                        // Counter-rotation if needed
                                        rotation={-rotation}
                                        offsetX={cellSize / 2}
                                        offsetY={cellSize / 2}
                                        x={cIdx * cellSize + cellSize / 2}
                                        y={rIdx * cellSize + cellSize / 2}
                                    />
                                );
                            })
                        )}

                        {/* Grid lines for style */}
                        {Array.from({ length: gridSize + 1 }).map((_, i) => (
                            <React.Fragment key={i}>
                                <Line
                                    points={[0, i * cellSize, stageSize, i * cellSize]}
                                    stroke="#0f172a"
                                    strokeWidth={1}
                                    opacity={0.03}
                                />
                                <Line
                                    points={[i * cellSize, 0, i * cellSize, stageSize]}
                                    stroke="#0f172a"
                                    strokeWidth={1}
                                    opacity={0.03}
                                />
                            </React.Fragment>
                        ))}
                    </Layer>
                </Stage>
            )}
        </div>
    );
};

export default React.memo(WordSearchGridCanvas);
