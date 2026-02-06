
import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Loader2 } from 'lucide-react';

const SplashScreen: React.FC = () => {
    return (
        <div className="h-full bg-[var(--color-background)] flex flex-col items-center justify-center p-6 text-center pt-[var(--safe-top)] pb-[var(--safe-bottom)] pl-[var(--safe-left)] pr-[var(--safe-right)]">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8 sm:mb-12"
            >
                <div className="relative mb-6 sm:mb-8 flex justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[var(--color-surface)] border-4 border-[var(--color-ink)] rounded-[2.2rem] sm:rounded-[2.5rem] flex items-center justify-center shadow-[10px_10px_0px_0px_var(--shadow-color)] sm:shadow-[12px_12px_0px_0px_var(--shadow-color)] rotate-[-6deg] relative overflow-hidden">
                        <span className="text-4xl sm:text-5xl font-black text-[var(--color-ink)] italic" style={{ fontFamily: "'Outfit', sans-serif" }}>W</span>
                    </div>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] italic tracking-tighter uppercase leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    WORD SEARCH<br />
                    <span className="text-[var(--color-text-primary)]">CHALLENGE</span>
                </h1>
                <div className="h-1.5 w-20 sm:w-24 bg-[#fbbf24] mt-5 sm:mt-6 mx-auto rounded-full" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center mt-4"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-3 sm:mb-4"
                >
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-text-muted)]" />
                </motion.div>
                <p className="text-[9px] sm:text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.4em] sm:tracking-[0.6em] animate-pulse">
                    Loading Puzzle Engine...
                </p>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
