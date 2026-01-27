/**
 * Bilingual Word Bank (English + Spanish)
 * 
 * Words are organized by category and language.
 * Spanish words do NOT include accents to work with the A-Z grid.
 */

export type SupportedLanguage = 'en' | 'es';

export interface BilingualWordBank {
    en: Record<string, string[]>;
    es: Record<string, string[]>;
}

export const WORD_BANK: BilingualWordBank = {
    en: {
        nature: [
            'TREE', 'LEAF', 'ROOT', 'BARK', 'STEM', 'SEED', 'MOSS', 'FERN', 'IVY', 'BUSH',
            'VINE', 'PALM', 'PINE', 'OAK', 'POND', 'LAKE', 'WAVE', 'TIDE', 'REEF', 'COVE',
            'CLIFF', 'PEAK', 'HILL', 'VALE', 'GLEN', 'ROCK', 'SAND', 'MUD', 'SOIL', 'CLAY',
            'RAIN', 'SNOW', 'HAIL', 'MIST', 'DEW', 'FOG', 'WIND', 'GALE', 'SUN', 'MOON',
            'STAR', 'SKY', 'DUSK', 'DAWN', 'NOON', 'FOAM', 'BROOK', 'CREEK', 'STREAM', 'RIVER'
        ],
        animals: [
            'CAT', 'DOG', 'BAT', 'RAT', 'FOX', 'WOLF', 'BEAR', 'LION', 'TIGER', 'PUMA',
            'DEER', 'MOOSE', 'ELK', 'HARE', 'OWL', 'HAWK', 'DOVE', 'CROW', 'SWAN', 'DUCK',
            'GOOSE', 'FROG', 'TOAD', 'NEWT', 'CRAB', 'CLAM', 'SEAL', 'WHALE', 'SHARK', 'FISH',
            'BIRD', 'WORM', 'SLUG', 'SNAIL', 'MOTH', 'WASP', 'FLEA', 'TICK', 'MITE', 'ANT',
            'PIG', 'COW', 'BULL', 'CALF', 'LAMB', 'GOAT', 'PONY', 'MULE', 'HEN', 'ROOSTER'
        ],
        food: [
            'BREAD', 'TOAST', 'CAKE', 'PIE', 'TART', 'BUN', 'ROLL', 'LOAF', 'CRUST', 'CRUMB',
            'RICE', 'BEAN', 'CORN', 'PEA', 'NUT', 'SEED', 'OAT', 'RYE', 'WHEAT', 'GRAIN',
            'BEEF', 'PORK', 'HAM', 'BACON', 'STEAK', 'CHOP', 'RIB', 'WING', 'LEG', 'EGG',
            'MILK', 'CREAM', 'CHEESE', 'BUTTER', 'YOGURT', 'SOUP', 'STEW', 'BROTH', 'SAUCE', 'GRAVY',
            'APPLE', 'PEAR', 'PLUM', 'GRAPE', 'LIME', 'LEMON', 'PEACH', 'MANGO', 'MELON', 'BERRY'
        ],
        human: [
            'HEAD', 'FACE', 'BROW', 'EYE', 'NOSE', 'MOUTH', 'LIP', 'CHIN', 'JAW', 'EAR',
            'NECK', 'BACK', 'ARM', 'HAND', 'FIST', 'PALM', 'THUMB', 'WRIST', 'ELBOW', 'CHEST',
            'HEART', 'LUNG', 'GUT', 'BONE', 'SKIN', 'VEIN', 'NERVE', 'BRAIN', 'CELL', 'GENE',
            'SOUL', 'MIND', 'MOOD', 'DREAM', 'HOPE', 'FEAR', 'LOVE', 'HATE', 'JOY', 'GRIEF',
            'BABY', 'CHILD', 'TEEN', 'ADULT', 'ELDER', 'MAN', 'WOMAN', 'BOY', 'GIRL', 'TWIN'
        ],
        home: [
            'DOOR', 'WALL', 'ROOF', 'FLOOR', 'TILE', 'BRICK', 'BEAM', 'FRAME', 'PANE', 'GLASS',
            'BED', 'DESK', 'CHAIR', 'TABLE', 'COUCH', 'SHELF', 'LAMP', 'RUG', 'MAT', 'DRAPE',
            'SINK', 'TUB', 'SHOWER', 'TOILET', 'FAUCET', 'DRAIN', 'PIPE', 'VENT', 'FAN', 'HEAT',
            'STOVE', 'OVEN', 'FRIDGE', 'PAN', 'POT', 'CUP', 'MUG', 'BOWL', 'PLATE', 'DISH',
            'KEY', 'LOCK', 'KNOB', 'HINGE', 'BOLT', 'NAIL', 'SCREW', 'WIRE', 'CORD', 'PLUG'
        ],
        city: [
            'ROAD', 'LANE', 'ALLEY', 'BLOCK', 'PLAZA', 'COURT', 'PARK', 'MALL', 'SHOP', 'STORE',
            'BANK', 'POST', 'CAFE', 'BAR', 'CLUB', 'HOTEL', 'MOTEL', 'INN', 'GYM', 'SPA',
            'TOWER', 'BRIDGE', 'TUNNEL', 'RAIL', 'METRO', 'TRAM', 'BUS', 'CAB', 'TAXI', 'VAN',
            'CAR', 'TRUCK', 'BIKE', 'MOPED', 'TRAIN', 'PLANE', 'JET', 'BOAT', 'SHIP', 'FERRY',
            'SIGN', 'POLE', 'LIGHT', 'CURB', 'GRATE', 'BENCH', 'TRASH', 'BIN', 'CONE', 'FENCE'
        ],
        fashion: [
            'SHIRT', 'PANTS', 'JEANS', 'SKIRT', 'DRESS', 'SUIT', 'COAT', 'VEST', 'CAPE', 'ROBE',
            'HAT', 'CAP', 'HOOD', 'SCARF', 'TIE', 'BOW', 'BELT', 'STRAP', 'CLASP', 'BUCKLE',
            'SHOE', 'BOOT', 'HEEL', 'SOLE', 'LACE', 'SOCK', 'HOSE', 'GLOVE', 'MITT', 'CUFF',
            'RING', 'CHAIN', 'BEAD', 'GEM', 'PEARL', 'GOLD', 'SILVER', 'STONE', 'JEWEL', 'CHARM',
            'SILK', 'WOOL', 'LINEN', 'COTTON', 'DENIM', 'SUEDE', 'FUR', 'HIDE', 'LACE', 'MESH'
        ],
        tech: [
            'CODE', 'DATA', 'FILE', 'BYTE', 'DISK', 'CHIP', 'CARD', 'PORT', 'SLOT', 'DRIVE',
            'SCREEN', 'MOUSE', 'KEY', 'PAD', 'BOARD', 'CABLE', 'WIRE', 'PLUG', 'JACK', 'HUB',
            'WEB', 'SITE', 'PAGE', 'LINK', 'BLOG', 'POST', 'CHAT', 'TEXT', 'MAIL', 'SPAM',
            'APP', 'GAME', 'TOOL', 'BOT', 'BUG', 'PATCH', 'HACK', 'VIRUS', 'WORM', 'SCRIPT',
            'CLOUD', 'SERVER', 'HOST', 'NODE', 'GRID', 'NET', 'WIFI', 'SIGNAL', 'BAND', 'WAVE'
        ],
        travel: [
            'TRIP', 'TOUR', 'TREK', 'HIKE', 'WALK', 'RIDE', 'DRIVE', 'SAIL', 'CRUISE', 'FLIGHT',
            'MAP', 'ROUTE', 'PATH', 'TRAIL', 'ROAD', 'PASS', 'GATE', 'EXIT', 'RAMP', 'LOOP',
            'BAG', 'CASE', 'PACK', 'TRUNK', 'POUCH', 'PURSE', 'WALLET', 'TICKET', 'PASS', 'VISA',
            'HOTEL', 'ROOM', 'SUITE', 'LOBBY', 'POOL', 'BEACH', 'RESORT', 'CABIN', 'TENT', 'CAMP',
            'GUIDE', 'HOST', 'GUEST', 'LOCAL', 'NATIVE', 'TOURIST', 'NOMAD', 'PILGRIM', 'CREW', 'STAFF'
        ],
        science: [
            'ATOM', 'ION', 'BOND', 'MASS', 'FORCE', 'HEAT', 'LIGHT', 'WAVE', 'FIELD', 'FLUX',
            'CELL', 'DNA', 'RNA', 'GENE', 'TRAIT', 'LIFE', 'DEATH', 'BIRTH', 'GROWTH', 'DECAY',
            'LAB', 'TEST', 'TRIAL', 'PROOF', 'FACT', 'LAW', 'RULE', 'THEORY', 'MODEL', 'GRAPH',
            'LENS', 'SCOPE', 'PROBE', 'BEAM', 'RAY', 'PULSE', 'SCAN', 'IMAGE', 'SAMPLE', 'SLIDE',
            'ACID', 'BASE', 'SALT', 'GAS', 'SOLID', 'LIQUID', 'PLASMA', 'METAL', 'ALLOY', 'CRYSTAL'
        ]
    },
    es: {
        nature: [
            'ARBOL', 'HOJA', 'RAIZ', 'RAMA', 'TALLO', 'FLOR', 'MUSGO', 'HIERBA', 'PINO', 'ROBLE',
            'SELVA', 'BOSQUE', 'LAGO', 'RIO', 'MAR', 'OLA', 'PLAYA', 'ARENA', 'ROCA', 'PIEDRA',
            'MONTE', 'VALLE', 'CERRO', 'CUEVA', 'ISLA', 'COSTA', 'BAHIA', 'CABO', 'TIERRA', 'SUELO',
            'LLUVIA', 'NIEVE', 'HIELO', 'NIEBLA', 'VIENTO', 'BRISA', 'SOL', 'LUNA', 'CIELO', 'NUBE',
            'ESTRELLA', 'AURORA', 'OCASO', 'ALBA', 'DIA', 'NOCHE', 'CAMPO', 'PRADO', 'JARDIN', 'PARQUE'
        ],
        animals: [
            'GATO', 'PERRO', 'LOBO', 'ZORRO', 'OSO', 'LEON', 'TIGRE', 'PUMA', 'CIERVO', 'ALCE',
            'LIEBRE', 'CONEJO', 'BUHO', 'AGUILA', 'HALCON', 'PALOMA', 'CUERVO', 'CISNE', 'PATO', 'GANSO',
            'RANA', 'SAPO', 'CANGREJO', 'FOCA', 'BALLENA', 'DELFIN', 'TIBURON', 'PEZ', 'PULPO', 'MEDUSA',
            'AVE', 'PAJARO', 'MOSCA', 'ABEJA', 'AVISPA', 'HORMIGA', 'ARAÑA', 'GRILLO', 'MARIPOSA', 'POLILLA',
            'CERDO', 'VACA', 'TORO', 'CABRA', 'OVEJA', 'CABALLO', 'BURRO', 'MULA', 'GALLINA', 'GALLO'
        ],
        food: [
            'PAN', 'TORTA', 'PASTEL', 'TARTA', 'BOLLO', 'ARROZ', 'FRIJOL', 'MAIZ', 'TRIGO', 'CEBADA',
            'CARNE', 'POLLO', 'CERDO', 'JAMON', 'TOCINO', 'FILETE', 'COSTILLA', 'ALA', 'HUEVO', 'LECHE',
            'CREMA', 'QUESO', 'YOGUR', 'SOPA', 'CALDO', 'SALSA', 'ACEITE', 'SAL', 'AZUCAR', 'MIEL',
            'MANZANA', 'PERA', 'UVA', 'LIMON', 'NARANJA', 'MELON', 'SANDIA', 'FRESA', 'CEREZA', 'PLATANO',
            'PAPA', 'TOMATE', 'CEBOLLA', 'AJO', 'ZANAHORIA', 'LECHUGA', 'COL', 'PEPINO', 'PIMIENTO', 'CHILE'
        ],
        human: [
            'CABEZA', 'CARA', 'FRENTE', 'OJO', 'NARIZ', 'BOCA', 'LABIO', 'LENGUA', 'DIENTE', 'OREJA',
            'CUELLO', 'HOMBRO', 'BRAZO', 'MANO', 'DEDO', 'UNA', 'CODO', 'PECHO', 'ESPALDA', 'CINTURA',
            'PIERNA', 'RODILLA', 'PIE', 'TOBILLO', 'TALON', 'CORAZON', 'PULMON', 'CEREBRO', 'HUESO', 'PIEL',
            'SANGRE', 'NERVIO', 'ALMA', 'MENTE', 'SUENO', 'MIEDO', 'AMOR', 'ODIO', 'ALEGRIA', 'TRISTEZA',
            'BEBE', 'NINO', 'JOVEN', 'ADULTO', 'ANCIANO', 'HOMBRE', 'MUJER', 'CHICO', 'CHICA', 'GEMELO'
        ],
        home: [
            'PUERTA', 'PARED', 'TECHO', 'SUELO', 'VENTANA', 'CRISTAL', 'LADRILLO', 'VIGA', 'ESCALERA', 'PASILLO',
            'CAMA', 'MESA', 'SILLA', 'SOFA', 'ARMARIO', 'ESTANTE', 'LAMPARA', 'ALFOMBRA', 'CORTINA', 'ESPEJO',
            'COCINA', 'HORNO', 'NEVERA', 'LAVABO', 'DUCHA', 'BANERA', 'GRIFO', 'TUBERIA', 'ENCHUFE', 'CABLE',
            'PLATO', 'VASO', 'TAZA', 'CUCHARA', 'TENEDOR', 'CUCHILLO', 'OLLA', 'SARTEN', 'CUBO', 'ESCOBA',
            'LLAVE', 'CANDADO', 'TIMBRE', 'CERRADURA', 'BOMBILLA', 'INTERRUPTOR', 'RADIADOR', 'CALEFACCION', 'AIRE', 'VENTILADOR'
        ],
        city: [
            'CALLE', 'AVENIDA', 'PLAZA', 'PARQUE', 'BARRIO', 'CENTRO', 'TIENDA', 'BANCO', 'CORREO', 'MERCADO',
            'CAFE', 'BAR', 'HOTEL', 'MUSEO', 'TEATRO', 'CINE', 'ESTADIO', 'HOSPITAL', 'FARMACIA', 'ESCUELA',
            'TORRE', 'PUENTE', 'TUNEL', 'METRO', 'TREN', 'AUTOBUS', 'TAXI', 'COCHE', 'MOTO', 'BICI',
            'AVION', 'BARCO', 'PUERTO', 'AEROPUERTO', 'ESTACION', 'PARADA', 'SEMAFORO', 'ACERA', 'POSTE', 'FAROLA',
            'CARTEL', 'VALLA', 'BANCO', 'FUENTE', 'ESTATUA', 'MONUMENTO', 'IGLESIA', 'CATEDRAL', 'PALACIO', 'CASTILLO'
        ],
        fashion: [
            'CAMISA', 'PANTALON', 'FALDA', 'VESTIDO', 'TRAJE', 'ABRIGO', 'CHAQUETA', 'CHALECO', 'CAPA', 'BATA',
            'SOMBRERO', 'GORRA', 'BUFANDA', 'CORBATA', 'LAZO', 'CINTURON', 'CORREA', 'HEBILLA', 'BOTON', 'CREMALLERA',
            'ZAPATO', 'BOTA', 'SANDALIA', 'TACON', 'SUELA', 'CORDON', 'CALCETIN', 'MEDIA', 'GUANTE', 'PULSERA',
            'ANILLO', 'COLLAR', 'PENDIENTE', 'BROCHE', 'PERLA', 'ORO', 'PLATA', 'DIAMANTE', 'RUBI', 'ESMERALDA',
            'SEDA', 'LANA', 'ALGODON', 'LINO', 'CUERO', 'GAMUZA', 'PIEL', 'TELA', 'HILO', 'AGUJA'
        ],
        tech: [
            'CODIGO', 'DATO', 'ARCHIVO', 'DISCO', 'CHIP', 'TARJETA', 'PUERTO', 'RANURA', 'CABLE', 'ENCHUFE',
            'PANTALLA', 'RATON', 'TECLA', 'TECLADO', 'RED', 'WIFI', 'SENAL', 'ANTENA', 'ROUTER', 'MODEM',
            'WEB', 'SITIO', 'PAGINA', 'ENLACE', 'BLOG', 'FORO', 'CHAT', 'MENSAJE', 'CORREO', 'SPAM',
            'APP', 'JUEGO', 'PROGRAMA', 'SISTEMA', 'SERVIDOR', 'NUBE', 'BASE', 'TABLA', 'CAMPO', 'REGISTRO',
            'VIRUS', 'ERROR', 'FALLO', 'PARCHE', 'VERSION', 'COPIA', 'BACKUP', 'MEMORIA', 'BATERIA', 'CARGA'
        ],
        travel: [
            'VIAJE', 'VUELO', 'CRUCERO', 'TOUR', 'RUTA', 'CAMINO', 'SENDERO', 'AUTOPISTA', 'CARRETERA', 'ATAJO',
            'MALETA', 'MOCHILA', 'BOLSO', 'BOLETO', 'PASAJE', 'VISA', 'PASAPORTE', 'RESERVA', 'BILLETE', 'EQUIPAJE',
            'HOTEL', 'HOSTAL', 'CABANA', 'TIENDA', 'CAMPING', 'RESORT', 'PLAYA', 'PISCINA', 'MONTE', 'SELVA',
            'GUIA', 'TURISTA', 'VIAJERO', 'MAPA', 'BRUJULA', 'GPS', 'FOTO', 'RECUERDO', 'POSTAL', 'SOUVENIR',
            'ADUANA', 'FRONTERA', 'EMBAJADA', 'CONSULADO', 'TERMINAL', 'SALA', 'PUERTA', 'EMBARQUE', 'LLEGADA', 'SALIDA'
        ],
        science: [
            'ATOMO', 'ION', 'MOLECULA', 'CELULA', 'GEN', 'ADN', 'VIDA', 'MUERTE', 'ENERGIA', 'FUERZA',
            'MASA', 'PESO', 'VOLUMEN', 'DENSIDAD', 'PRESION', 'CALOR', 'LUZ', 'ONDA', 'CAMPO', 'FLUJO',
            'LABORATORIO', 'PRUEBA', 'ENSAYO', 'TEORIA', 'LEY', 'FORMULA', 'ECUACION', 'GRAFICO', 'TABLA', 'MODELO',
            'LENTE', 'MICROSCOPIO', 'TELESCOPIO', 'LASER', 'RAYO', 'PULSO', 'IMAGEN', 'MUESTRA', 'TUBO', 'PROBETA',
            'ACIDO', 'BASE', 'SAL', 'GAS', 'LIQUIDO', 'SOLIDO', 'PLASMA', 'METAL', 'CRISTAL', 'MINERAL'
        ]
    }
};

// Get category names translated
export const CATEGORY_NAMES: Record<SupportedLanguage, Record<string, string>> = {
    en: {
        nature: 'Nature',
        animals: 'Animals',
        food: 'Food',
        human: 'Human',
        home: 'Home',
        city: 'City',
        fashion: 'Fashion',
        tech: 'Tech',
        travel: 'Travel',
        science: 'Science'
    },
    es: {
        nature: 'Naturaleza',
        animals: 'Animales',
        food: 'Comida',
        human: 'Humano',
        home: 'Hogar',
        city: 'Ciudad',
        fashion: 'Moda',
        tech: 'Tecnología',
        travel: 'Viajes',
        science: 'Ciencia'
    }
};

// Helper to get words for a specific language
export function getWordBank(lang: SupportedLanguage = 'en'): Record<string, string[]> {
    return WORD_BANK[lang] || WORD_BANK.en;
}

// Helper to get category name translated
export function getCategoryName(categoryKey: string, lang: SupportedLanguage = 'en'): string {
    return CATEGORY_NAMES[lang]?.[categoryKey] || CATEGORY_NAMES.en[categoryKey] || categoryKey;
}

// Get all category keys
export function getCategories(): string[] {
    return Object.keys(WORD_BANK.en);
}
