import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Smartphone, SmartphoneNfc, Trash2, Shield, Globe } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { t, getLanguage } from '@/utils/i18n';

const SettingsScreen: React.FC = () => {
    const progress = useGameStore(state => state.progress);
    const setView = useGameStore(state => state.setView);
    const toggleSound = useGameStore(state => state.toggleSound);
    const toggleVibration = useGameStore(state => state.toggleVibration);
    const setLanguage = useGameStore(state => state.setLanguage);
    const resetProgress = useGameStore(state => state.resetProgress);

    // Dispatch shim for ease of migration
    const dispatch = React.useMemo(() => (action: any) => {
        if (action.type === 'SET_VIEW') setView(action.payload);
        if (action.type === 'TOGGLE_SOUND') toggleSound();
        if (action.type === 'TOGGLE_VIBRATION') toggleVibration();
        if (action.type === 'SET_LANGUAGE') setLanguage(action.payload);
        if (action.type === 'RESET_PROGRESS') resetProgress();
    }, [setView, toggleSound, toggleVibration, setLanguage, resetProgress]);

    const currentLang = getLanguage();

    const handleReset = () => {
        if (window.confirm(t('confirmReset') || 'Are you sure you want to reset all progress? This cannot be undone.')) {
            resetProgress();
        }
    };

    return (
        <div className="h-full bg-[var(--color-background)] flex flex-col p-6 max-w-lg mx-auto overflow-hidden">
            <header className="flex items-center justify-between mb-10 mt-4">
                <button
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
                    className="p-3 bg-[var(--color-surface)] border-2 border-[var(--color-ink)] rounded-2xl shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    <ArrowLeft className="w-6 h-6 text-[var(--color-ink)]" />
                </button>
                <h1 className="text-3xl font-black text-[var(--color-ink)] uppercase italic tracking-tighter">
                    {t('settings')}
                </h1>
                <div className="w-12 h-12" /> {/* Spacer */}
            </header>

            <main className="flex-1 space-y-6">
                <section className="bg-[var(--color-surface)] border-2 border-[var(--color-ink)] rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_var(--shadow-color)]">
                    <h2 className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-6">
                        {t('preferences')}
                    </h2>

                    <div className="space-y-4">
                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
                            className="w-full flex items-center justify-between p-4 bg-[var(--color-background)] border-2 border-[var(--color-ink)] rounded-2xl transition-all"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-xl border-2 border-[var(--color-ink)] ${progress.settings.soundEnabled ? 'bg-[#fbbf24]' : 'bg-gray-200 opacity-50'}`}>
                                    {progress.settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                </div>
                                <span className="font-black text-[var(--color-text-primary)] uppercase">
                                    {t('sound')}
                                </span>
                            </div>
                            <div className={`w-12 h-6 rounded-full border-2 border-[var(--color-ink)] relative transition-colors ${progress.settings.soundEnabled ? 'bg-[#10b981]' : 'bg-gray-200'}`}>
                                <motion.div
                                    animate={{ x: progress.settings.soundEnabled ? 24 : 4 }}
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[var(--color-ink)] rounded-full"
                                />
                            </div>
                        </button>

                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_VIBRATION' })}
                            className="w-full flex items-center justify-between p-4 bg-[var(--color-background)] border-2 border-[var(--color-ink)] rounded-2xl transition-all"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-xl border-2 border-[var(--color-ink)] ${progress.settings.hapticsEnabled ? 'bg-[#14b8a6]' : 'bg-gray-200 opacity-50'}`}>
                                    {progress.settings.hapticsEnabled ? <SmartphoneNfc className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                                </div>
                                <span className="font-black text-[var(--color-text-primary)] uppercase">
                                    {t('vibration')}
                                </span>
                            </div>
                            <div className={`w-12 h-6 rounded-full border-2 border-[var(--color-ink)] relative transition-colors ${progress.settings.hapticsEnabled ? 'bg-[#10b981]' : 'bg-gray-200'}`}>
                                <motion.div
                                    animate={{ x: progress.settings.hapticsEnabled ? 24 : 4 }}
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[var(--color-ink)] rounded-full"
                                />
                            </div>
                        </button>
                    </div>
                </section>

                <section className="bg-[var(--color-surface)] border-2 border-[var(--color-ink)] rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_var(--shadow-color)]">
                    <h2 className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-6">
                        {t('language')}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'en' })}
                            className={`p-4 border-2 border-[var(--color-ink)] rounded-2xl font-black uppercase transition-all shadow-[4px_4px_0px_0px_var(--shadow-color)] ${currentLang === 'en' ? 'bg-[#fbbf24] translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-[var(--color-background)]'}`}
                        >
                            {t('english')}
                        </button>
                        <button
                            onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'es' })}
                            className={`p-4 border-2 border-[var(--color-ink)] rounded-2xl font-black uppercase transition-all shadow-[4px_4px_0px_0px_var(--shadow-color)] ${currentLang === 'es' ? 'bg-[#14b8a6] translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-[var(--color-background)]'}`}
                        >
                            {t('spanish')}
                        </button>
                    </div>
                </section>

                <section className="bg-[var(--color-surface)] border-2 border-[var(--color-ink)] rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_var(--shadow-color)]">
                    <h2 className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-6">
                        {t('dangerZone')}
                    </h2>
                    <button
                        onClick={handleReset}
                        className="w-full flex items-center space-x-4 p-4 bg-[#fee2e2] text-[#ef4444] border-2 border-[#ef4444] rounded-2xl transition-all hover:bg-[#fecaca]"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span className="font-black uppercase">{t('resetProgress')}</span>
                    </button>
                </section>

                <div className="pt-4 text-center opacity-50">
                    <div className="flex items-center justify-center space-x-2 text-[var(--color-text-muted)] mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">v1.2.0 Neo Brutalist</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsScreen;
