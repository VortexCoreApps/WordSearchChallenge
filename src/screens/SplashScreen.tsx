
import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Loader2 } from 'lucide-react';

const SplashScreen: React.FC = () => {
    return (
        <div className="h-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12"
            >
                <div className="relative mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-white border-4 border-[#0f172a] rounded-[2.5rem] flex items-center justify-center shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] rotate-[-6deg] relative overflow-hidden">
                        <span className="text-5xl font-black text-[#0f172a] italic" style={{ fontFamily: "'Outfit', sans-serif" }}>W</span>
                    </div>
                </div>

                <h1 className="text-5xl font-black text-[#0f172a] italic tracking-tighter uppercase leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    WORD SEARCH<br />
                    <span className="text-[#0f172a]">CHALLENGE</span>
                </h1>
                <div className="h-1.5 w-24 bg-[#fbbf24] mt-6 mx-auto rounded-full" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                >
                    <Loader2 className="w-8 h-8 text-[#94a3b8]" />
                </motion.div>
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.6em] animate-pulse">
                    Loading Puzzle Engine...
                </p>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
