
import React from 'react';
import { motion } from 'framer-motion';
import { WordInfo } from '@/types';

interface Props {
    words: WordInfo[];
    category?: string;
}

const WordList: React.FC<Props> = ({ words, category }) => {
    return (
        <div className="w-full max-w-sm mt-3 px-4">
            <div className="bg-white border-2 border-[#0f172a] rounded-2xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] overflow-hidden relative">
                {category && (
                    <div className="bg-[#14b8a6] border-b-2 border-[#0f172a] py-1.5 px-6">
                        <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] text-center">
                            {category}
                        </h4>
                    </div>
                )}
                <div className="p-4 relative z-10">
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                        {words.map((w, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="flex flex-col items-center justify-center text-center"
                            >
                                <span
                                    className={`text-[11px] font-black uppercase transition-all duration-300 relative ${w.found
                                        ? 'text-[#cbd5e1] italic scale-95'
                                        : 'text-[#0f172a]'
                                        }`}
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    {w.word}
                                    {w.found && (
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '110%' }}
                                            className="absolute top-1/2 left-[-5%] h-[2px] bg-[#94a3b8] -translate-y-1/2 opacity-50"
                                        />
                                    )}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Subtle Paper Texture Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
        </div>
    );
};

export default WordList;
