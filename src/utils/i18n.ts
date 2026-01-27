/**
 * Internationalization (i18n) System
 * 
 * Supports English and Spanish for both UI and game words.
 * Uses device language as default, falls back to English.
 */

import { SupportedLanguage } from '../data/wordBank';

// Re-export the type for convenience
export type Language = SupportedLanguage;

export interface Translations {
    // Common
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    retry: string;

    // Menu
    appTitle: string;
    appSubtitle: string;
    levelLabel: string;
    readyToFind: string;
    trophies: string;
    freeCoins: string;
    watchAd: string;
    watchAdDescription: string;
    later: string;
    watch: string;
    removeAds: string;
    removeAdsDesc: string;
    restorePurchases: string;
    purchased: string;

    // Game
    time: string;
    progress: string;
    hints: string;
    magicalHelpers: string;
    letterHint: string;
    letterHintDesc: string;
    wordHint: string;
    wordHintDesc: string;
    gamePaused: string;
    resumeGame: string;
    quitToMenu: string;

    // Feedback messages
    perfect: string;
    goodJob: string;
    awesome: string;
    fantastic: string;
    excellent: string;
    nice: string;
    great: string;

    // Complete screen
    levelDone: string;
    challengeCompleted: string;
    totalStars: string;
    nextLevel: string;
    returnToMenu: string;
    newTrophyUnlocked: string;
    collectorsHonor: string;
    achievement_unlocked: string;

    // Trophy album
    trophyAlbum: string;
    unlockedTrophies: string;
    lockedTrophy: string;
    achievements: string;

    // Ads
    adLoadingError: string;
    noConnectionAd: string;
    rewardReceived: string;

    // Categories
    nature: string;
    animals: string;
    food: string;
    human: string;
    home: string;
    city: string;
    fashion: string;
    tech: string;
    travel: string;
    science: string;

    // Onboarding
    how_to_play: string;
    how_to_play_desc: string;
    stars_and_trophies: string;
    stars_desc: string;
    smart_hints: string;
    hints_desc: string;
    coins_and_rewards: string;
    coins_desc: string;
    get_started: string;
    get_ready: string;
    get_ready_desc: string;
}

const translations: Record<Language, Translations> = {
    en: {
        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        retry: 'Retry',

        // Menu
        appTitle: 'WORD SEARCH',
        appSubtitle: 'CHALLENGE',
        levelLabel: 'LEVEL',
        readyToFind: 'Ready to find?',
        trophies: 'Trophies',
        freeCoins: 'Free Coins',
        watchAd: 'Watch Ad?',
        watchAdDescription: 'Watch a short video to earn',
        later: 'Later',
        watch: 'Watch',
        removeAds: 'No Ads',
        removeAdsDesc: 'Remove all ads forever!',
        restorePurchases: 'Restore',
        purchased: 'Purchased',

        // Game
        time: 'Time',
        progress: 'Progress',
        hints: 'Hints',
        magicalHelpers: 'Magical Helpers',
        letterHint: 'Letter',
        letterHintDesc: 'Reveal one cell',
        wordHint: 'Full Word',
        wordHintDesc: 'Solve entire word',
        gamePaused: 'Game Paused',
        resumeGame: 'Resume Game',
        quitToMenu: 'Quit to Menu',

        // Feedback
        perfect: 'PERFECT!',
        goodJob: 'GOOD JOB!',
        awesome: 'AWESOME!',
        fantastic: 'FANTASTIC!',
        excellent: 'EXCELLENT!',
        nice: 'NICE!',
        great: 'GREAT!',

        // Complete
        levelDone: 'Done!',
        challengeCompleted: 'Challenge completed successfully',
        totalStars: 'Total Stars',
        nextLevel: 'Next Level',
        returnToMenu: 'Return to Menu',
        newTrophyUnlocked: 'New Trophy Unlocked!',
        collectorsHonor: "Collector's Honor",
        achievement_unlocked: 'Achievement Unlocked!',

        // Trophy album
        trophyAlbum: 'Trophy Collection',
        unlockedTrophies: 'Unlocked Trophies',
        lockedTrophy: 'Keep playing to unlock!',
        achievements: 'Achievements',

        // Ads
        adLoadingError: 'Could not load ad. Try again later.',
        noConnectionAd: 'No internet connection. Ads unavailable.',
        rewardReceived: '+100 COINS!',

        // Categories
        nature: 'Nature',
        animals: 'Animals',
        food: 'Food',
        human: 'Human',
        home: 'Home',
        city: 'City',
        fashion: 'Fashion',
        tech: 'Tech',
        travel: 'Travel',
        science: 'Science',

        // Onboarding
        how_to_play: 'How to Play',
        how_to_play_desc: 'Drag your finger across the grid to connect letters and find hidden words. Vertical, horizontal, and diagonal!',
        stars_and_trophies: 'Stars & Trophies',
        stars_desc: 'Find words quickly to earn up to 3 stars. Complete worlds to unlock unique trophies for your collection.',
        smart_hints: 'Smart Hints',
        hints_desc: 'Stuck? Use hints to reveal the first letter or even a whole word. Hints are smarter now and reveal the best letters first!',
        coins_and_rewards: 'Coins & Rewards',
        coins_desc: 'Earn coins by completing levels or watching ads. Use them to buy more hints when you need a push.',
        get_started: "Let's Play!",
        get_ready: 'Ready to Play?',
        get_ready_desc: 'Everything is set! Start your journey and become the ultimate Word Master.',
    },

    es: {
        // Common
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        close: 'Cerrar',
        back: 'Atrás',
        next: 'Siguiente',
        retry: 'Reintentar',

        // Menu
        appTitle: 'SOPA DE LETRAS',
        appSubtitle: 'DESAFÍO',
        levelLabel: 'NIVEL',
        readyToFind: '¿Listo para buscar?',
        trophies: 'Trofeos',
        freeCoins: 'Monedas Gratis',
        watchAd: '¿Ver Anuncio?',
        watchAdDescription: 'Mira un breve video para ganar',
        later: 'Después',
        watch: 'Ver',
        removeAds: 'Sin Anuncios',
        removeAdsDesc: '¡Quita anuncios para siempre!',
        restorePurchases: 'Restaurar',
        purchased: 'Comprado',

        // Game
        time: 'Tiempo',
        progress: 'Progreso',
        hints: 'Pistas',
        magicalHelpers: 'Ayudas Mágicas',
        letterHint: 'Letra',
        letterHintDesc: 'Revelar una celda',
        wordHint: 'Palabra',
        wordHintDesc: 'Resolver palabra completa',
        gamePaused: 'Juego Pausado',
        resumeGame: 'Continuar',
        quitToMenu: 'Salir al Menú',

        // Feedback
        perfect: '¡PERFECTO!',
        goodJob: '¡BUEN TRABAJO!',
        awesome: '¡INCREÍBLE!',
        fantastic: '¡FANTÁSTICO!',
        excellent: '¡EXCELENTE!',
        nice: '¡GENIAL!',
        great: '¡MUY BIEN!',

        // Complete
        levelDone: '¡Completado!',
        challengeCompleted: 'Desafío completado con éxito',
        totalStars: 'Estrellas Totales',
        nextLevel: 'Siguiente Nivel',
        returnToMenu: 'Volver al Menú',
        newTrophyUnlocked: '¡Nuevo Trofeo Desbloqueado!',
        collectorsHonor: "Honor del Coleccionista",
        achievement_unlocked: '¡Logro Desbloqueado!',

        // Trophy album
        trophyAlbum: 'Colección de Trofeos',
        unlockedTrophies: 'Trofeos Desbloqueados',
        lockedTrophy: '¡Sigue jugando para desbloquear!',
        achievements: 'Logros',

        // Ads
        adLoadingError: 'No se pudo cargar el anuncio. Intenta más tarde.',
        noConnectionAd: 'Sin conexión a internet. Anuncios no disponibles.',
        rewardReceived: '¡+100 MONEDAS!',

        // Categories
        nature: 'Naturaleza',
        animals: 'Animales',
        food: 'Comida',
        human: 'Humano',
        home: 'Hogar',
        city: 'Ciudad',
        fashion: 'Moda',
        tech: 'Tecnología',
        travel: 'Viajes',
        science: 'Ciencia',

        // Onboarding
        how_to_play: 'Cómo Jugar',
        how_to_play_desc: 'Desliza el dedo por la cuadrícula para conectar letras y encontrar palabras ocultas. ¡Vertical, horizontal y diagonal!',
        stars_and_trophies: 'Estrellas y Trofeos',
        stars_desc: 'Encuentra palabras rápido para ganar hasta 3 estrellas. Completa mundos para desbloquear trofeos únicos.',
        smart_hints: 'Pistas Inteligentes',
        hints_desc: '¿Atascado? Usa pistas para revelar la primera letra o una palabra completa. ¡Ahora son más inteligentes!',
        coins_and_rewards: 'Monedas y Recompensas',
        coins_desc: 'Gana monedas al completar niveles o ver anuncios. Úsalas para comprar más pistas cuando las necesites.',
        get_started: '¡A Jugar!',
        get_ready: '¿Todo listo?',
        get_ready_desc: '¡Ya conoces lo básico! Empieza tu viaje y conviértete en el Maestro de las Palabras definitivo.',
    },
};

// Storage key for language preference
const LANGUAGE_STORAGE_KEY = 'ws_challenge_language';

/**
 * Detect device/browser language and return supported language
 * Only supports 'en' and 'es', defaults to 'en'
 */
function detectDeviceLanguage(): Language {
    const deviceLang = navigator.language.split('-')[0].toLowerCase();

    // Only English and Spanish are supported
    if (deviceLang === 'es') {
        return 'es';
    }

    return 'en'; // Default to English for all other languages
}

/**
 * Get saved language preference or detect from device
 */
export function getLanguage(): Language {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'es') {
        return saved;
    }
    return detectDeviceLanguage();
}

/**
 * Set language preference
 */
export function setLanguage(lang: Language): void {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

/**
 * Get translations for current or specified language
 */
export function getTranslations(lang?: Language): Translations {
    const language = lang || getLanguage();
    return translations[language] || translations.en;
}

/**
 * Get a single translation string
 */
export function t(key: keyof Translations, lang?: Language): string {
    const trans = getTranslations(lang);
    return trans[key] || translations.en[key] || key;
}

/**
 * Get feedback messages array for current language
 */
export function getFeedbackMessages(lang?: Language): string[] {
    const trans = getTranslations(lang);
    return [
        trans.perfect,
        trans.goodJob,
        trans.awesome,
        trans.fantastic,
        trans.excellent,
        trans.nice,
        trans.great,
    ];
}

/**
 * Get available languages with their native names
 */
export function getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
    ];
}

// Export types and default
export default { t, getTranslations, getLanguage, setLanguage, getFeedbackMessages, getAvailableLanguages };
