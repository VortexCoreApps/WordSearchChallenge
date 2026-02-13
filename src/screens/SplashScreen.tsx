
import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Loader2 } from 'lucide-react';

import { t } from '@/utils/i18n';

const SplashScreen: React.FC = () => {
    return (
        <div className="h-full bg-[var(--color-background)] flex flex-col items-center justify-center p-6 pt-[var(--safe-top)] text-center overflow-x-hidden">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12"
            >
                <div className="relative mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-[var(--color-surface)] border-4 border-[var(--color-ink)] rounded-[2.5rem] flex items-center justify-center shadow-[12px_12px_0px_0px_var(--shadow-color)] rotate-[-6deg] relative overflow-hidden">
                        <span className="text-5xl font-black text-[var(--color-ink)] italic" style={{ fontFamily: "'Outfit', sans-serif" }}>W</span>
                    </div>
                </div>

                <h1 className="text-5xl font-black text-[var(--color-text-primary)] italic tracking-tighter uppercase leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {t('appTitle')}<br />
                    <span className="text-[var(--color-text-primary)]">{t('appSubtitle')}</span>
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
                    <Loader2 className="w-8 h-8 text-[var(--color-text-muted)]" />
                </motion.div>
                <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.6em] animate-pulse">
                    {t('loading')}
                </p>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
