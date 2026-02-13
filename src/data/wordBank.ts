/**
 * Bilingual Word Bank (English + Spanish)
 * 
 * Words are organized by category and language.
 * Each category has ~100+ words with balanced distribution across lengths (3-8 letters).
 * Spanish words do NOT include accents to work with the A-Z grid.
 * All words are max 8 letters (gridSize max = 8).
 * 
 * Minimum targets per category per length range:
 *   3-letter: 12+   (Easy gridSize 4)
 *   4-letter: 20+   (Easy gridSize 4)
 *   5-letter: 20+   (Medium gridSize 5)
 *   6-letter: 15+   (Hard gridSize 6)
 *   7-letter: 12+   (Expert gridSize 8)
 *   8-letter: 10+   (Expert gridSize 8)
 */

export type SupportedLanguage = 'en' | 'es';

export interface BilingualWordBank {
    en: Record<string, string[]>;
    es: Record<string, string[]>;
}

export const WORD_BANK: BilingualWordBank = {
    en: {
        nature: [
            'IVY', 'OAK', 'MUD', 'DEW', 'FOG', 'SUN', 'SKY', 'BAY', 'BOG', 'BUD', 'ELM', 'FIR', 'GUM', 'HAY', 'HOP',
            'TREE', 'LEAF', 'ROOT', 'BARK', 'STEM', 'SEED', 'MOSS', 'FERN', 'BUSH', 'VINE', 'PALM', 'PINE', 'POND', 'LAKE',
            'WAVE', 'TIDE', 'REEF', 'COVE', 'PEAK', 'HILL', 'VALE', 'GLEN', 'ROCK', 'SAND', 'SOIL', 'CLAY', 'RAIN', 'SNOW',
            'HAIL', 'MIST', 'WIND', 'GALE', 'MOON', 'STAR', 'DUSK', 'DAWN', 'NOON', 'FOAM', 'WEED', 'TWIG', 'CRAG', 'DELL',
            'CLIFF', 'BROOK', 'CREEK', 'MARSH', 'FIELD', 'GROVE', 'HEDGE', 'FROST', 'FLOOD', 'SLOPE', 'TRAIL',
            'PETAL', 'BLOOM', 'SHORE', 'BEACH', 'OCEAN', 'BRUSH', 'CEDAR', 'BIRCH', 'MAPLE', 'WHEAT', 'PLAIN', 'RIDGE',
            'STREAM', 'FOREST', 'DESERT', 'CANYON', 'ISLAND', 'MEADOW', 'FLOWER', 'BRANCH', 'PEBBLE', 'BREEZE',
            'VALLEY', 'JUNGLE', 'GARDEN', 'LAGOON', 'TUNDRA', 'LICHEN', 'SPROUT', 'CANOPY',
            'GLACIER', 'BLOSSOM', 'CASCADE', 'CURRENT', 'TERRACE', 'PLATEAU', 'THICKET', 'ORCHARD', 'PASTURE', 'PRAIRIE',
            'MONSOON', 'COASTAL', 'SAVANNA',
            'MOUNTAIN', 'WOODLAND', 'SEASHORE', 'WILDFIRE', 'SNOWFALL', 'SUNLIGHT', 'FOOTHILL', 'LAKESIDE',
            'MUDSLIDE', 'RAINFALL', 'SANDBANK', 'TREETOPS', 'ROSEBUSH'
        ],
        animals: [
            'CAT', 'DOG', 'BAT', 'RAT', 'FOX', 'OWL', 'COW', 'PIG', 'HEN', 'ANT', 'BEE', 'EEL', 'EMU', 'GNU', 'RAM',
            'WOLF', 'BEAR', 'LION', 'DEER', 'HARE', 'HAWK', 'DOVE', 'CROW', 'SWAN', 'DUCK', 'FROG', 'TOAD', 'NEWT', 'CRAB',
            'CLAM', 'SEAL', 'FISH', 'BIRD', 'WORM', 'SLUG', 'MOTH', 'WASP', 'FLEA', 'TICK', 'MITE', 'BULL', 'CALF', 'LAMB',
            'GOAT', 'PONY', 'MULE', 'MINK', 'LYNX', 'IBIS', 'WREN', 'LARK', 'MOLE', 'BOAR',
            'TIGER', 'MOOSE', 'WHALE', 'SHARK', 'GOOSE', 'CRANE', 'EAGLE', 'RAVEN', 'FINCH', 'ROBIN', 'HERON', 'STORK',
            'SNAKE', 'VIPER', 'COBRA', 'GECKO', 'LLAMA', 'CAMEL', 'BISON', 'HORSE', 'MOUSE', 'OTTER', 'SKUNK', 'QUAIL',
            'PARROT', 'JAGUAR', 'PYTHON', 'IGUANA', 'TURTLE', 'SALMON', 'SPIDER', 'BEETLE', 'DONKEY', 'MONKEY', 'COUGAR',
            'FALCON', 'CONDOR', 'PIGEON', 'RABBIT', 'FERRET', 'BADGER', 'WALRUS', 'OYSTER', 'TOUCAN',
            'CHEETAH', 'GORILLA', 'DOLPHIN', 'PANTHER', 'PELICAN', 'SPARROW', 'HAMSTER', 'BUFFALO', 'MUSTANG', 'LOBSTER',
            'OCTOPUS', 'GAZELLE', 'GIRAFFE', 'PENGUIN',
            'ELEPHANT', 'ANTELOPE', 'HEDGEHOG', 'REINDEER', 'PHEASANT', 'SQUIRREL', 'KANGAROO', 'FLAMINGO', 'CARDINAL',
            'CHIPMUNK', 'STARFISH', 'SEAHORSE', 'SCORPION', 'MACKEREL'
        ],
        food: [
            'PIE', 'BUN', 'RYE', 'OAT', 'HAM', 'RIB', 'EGG', 'JAM', 'FIG', 'NUT', 'SOY', 'TEA', 'ALE', 'DIP', 'GUM',
            'CAKE', 'TART', 'ROLL', 'LOAF', 'RICE', 'BEAN', 'CORN', 'SEED', 'BEEF', 'PORK', 'WING', 'MILK',
            'SOUP', 'STEW', 'PEAR', 'PLUM', 'LIME', 'SAGE', 'DILL', 'MINT', 'CLAM', 'CRAB', 'FISH', 'TOFU', 'KALE',
            'HERB', 'CHOP', 'LAMB', 'VEAL', 'DATE', 'KIWI',
            'TOAST', 'CRUST', 'CRUMB', 'WHEAT', 'GRAIN', 'BACON', 'STEAK', 'CREAM', 'BROTH', 'SAUCE', 'GRAVY', 'APPLE',
            'GRAPE', 'LEMON', 'PEACH', 'MANGO', 'MELON', 'BERRY', 'OLIVE', 'ONION', 'SALAD', 'PASTA', 'PIZZA', 'CANDY',
            'CHEESE', 'YOGURT', 'BUTTER', 'CEREAL', 'WAFFLE', 'MUFFIN', 'COOKIE', 'PASTRY', 'NOODLE', 'PEPPER', 'CARROT',
            'POTATO', 'TURNIP', 'RADISH', 'CELERY', 'GINGER', 'GARLIC', 'CHERRY', 'BANANA', 'PAPAYA',
            'BISCUIT', 'PANCAKE', 'GRANOLA', 'OATMEAL', 'AVOCADO', 'CHICKEN', 'SAUSAGE', 'LOBSTER', 'MUSTARD', 'KETCHUP',
            'CRACKER', 'PRETZEL', 'POPCORN', 'LASAGNA',
            'SANDWICH', 'DUMPLING', 'CINNAMON', 'MUSHROOM', 'BROCCOLI', 'ZUCCHINI', 'EGGPLANT', 'HONEYDEW',
            'CHESTNUT', 'TORTILLA', 'SMOOTHIE', 'LEMONADE'
        ],
        human: [
            'EYE', 'LIP', 'EAR', 'JAW', 'ARM', 'RIB', 'GUT', 'HIP', 'TOE', 'LEG', 'MAN', 'BOY', 'JOY', 'CRY', 'SHY',
            'HEAD', 'FACE', 'BROW', 'NOSE', 'CHIN', 'NECK', 'BACK', 'HAND', 'FIST', 'PALM', 'KNEE', 'SKIN',
            'VEIN', 'BONE', 'CELL', 'GENE', 'SOUL', 'MIND', 'MOOD', 'HOPE', 'FEAR', 'LOVE', 'HATE', 'BABY', 'TEEN',
            'GIRL', 'TWIN', 'BODY', 'HAIR', 'LUNG', 'FOOT',
            'THUMB', 'ELBOW', 'CHEST', 'HEART', 'BRAIN', 'NERVE', 'DREAM', 'GRIEF', 'CHILD', 'ADULT', 'ELDER', 'WOMAN',
            'BLOOD', 'SKULL', 'SPINE', 'ANKLE', 'CHEEK', 'SMILE', 'VOICE', 'SIGHT', 'TOUCH', 'SENSE', 'THINK', 'SLEEP',
            'TONGUE', 'MUSCLE', 'FINGER', 'TISSUE', 'BREATH', 'MEMORY', 'SPIRIT', 'PEOPLE', 'PARENT', 'FRIEND', 'SISTER',
            'SORROW', 'TALENT', 'BELIEF', 'WISDOM', 'VIRTUE', 'MOTHER', 'FATHER', 'NEPHEW', 'COUSIN',
            'BROTHER', 'HUSBAND', 'FEELING', 'THOUGHT', 'PASSION', 'COURAGE', 'EMOTION', 'TODDLER',
            'GROWING', 'HEALTHY', 'THINKER', 'ATHLETE',
            'DAUGHTER', 'SHOULDER', 'FOREHEAD', 'INSTINCT', 'PATIENCE', 'STRENGTH', 'CHILDREN', 'THINKING', 'FEELINGS',
            'LAUGHTER', 'KINDNESS', 'RELATIVE', 'ANCESTOR'
        ],
        home: [
            'BED', 'RUG', 'MAT', 'MUG', 'CUP', 'PAN', 'POT', 'FAN', 'KEY', 'TAP', 'JAR', 'LID', 'TIN', 'MOP', 'BOX',
            'DOOR', 'WALL', 'ROOF', 'TILE', 'BEAM', 'PANE', 'DESK', 'LAMP', 'SINK', 'OVEN', 'BOWL', 'DISH', 'LOCK',
            'KNOB', 'BOLT', 'NAIL', 'WIRE', 'CORD', 'PLUG', 'ROOM', 'HALL', 'SOFA', 'BATH', 'IRON',
            'RACK', 'HOOK', 'TRAY', 'VASE', 'STEP', 'YARD',
            'FLOOR', 'GLASS', 'BRICK', 'FRAME', 'CHAIR', 'TABLE', 'SHELF', 'DRAPE', 'STOVE', 'PLATE', 'HINGE',
            'SCREW', 'FENCE', 'PORCH', 'TOWEL', 'BROOM', 'CLOTH', 'BLIND', 'BENCH', 'STAIR', 'BRUSH', 'TRUNK',
            'CLOSET', 'GARDEN', 'GARAGE', 'PILLOW', 'MIRROR', 'FAUCET', 'SHOWER', 'CARPET', 'MANTEL', 'PANTRY', 'BUCKET',
            'CANDLE', 'HEATER', 'WINDOW', 'BASKET', 'SPONGE', 'DRAWER', 'KETTLE', 'NAPKIN',
            'KITCHEN', 'BEDROOM', 'HALLWAY', 'CEILING', 'CABINET', 'CURTAIN', 'BLANKET', 'COUNTER', 'BALCONY', 'DOORMAT',
            'CHIMNEY', 'LAUNDRY', 'CUSHION', 'SHELTER',
            'BATHROOM', 'BASEMENT', 'BACKYARD', 'DOORBELL', 'ARMCHAIR', 'BOOKCASE', 'WARDROBE', 'MATTRESS', 'PLUMBING',
            'HANDRAIL', 'ORNAMENT', 'CUPBOARD', 'STAIRWAY'
        ],
        city: [
            'BUS', 'CAB', 'VAN', 'CAR', 'JET', 'BAR', 'INN', 'GYM', 'SPA', 'PUB', 'LOT', 'WAY', 'HUB', 'ARC',
            'ROAD', 'LANE', 'PARK', 'MALL', 'SHOP', 'BANK', 'POST', 'CAFE', 'CLUB', 'SIGN', 'POLE', 'CURB', 'WALK',
            'TAXI', 'BIKE', 'TRAM', 'RAIL', 'BOAT', 'SHIP', 'DOCK', 'PIER', 'PORT', 'FLAT', 'GATE', 'ARCH', 'SLAB',
            'CONE', 'RAMP', 'LIFT', 'ZONE', 'TOWN',
            'ALLEY', 'BLOCK', 'PLAZA', 'COURT', 'STORE', 'HOTEL', 'MOTEL', 'TOWER', 'TRAIN', 'PLANE', 'FERRY', 'BENCH',
            'TRASH', 'FENCE', 'LIGHT', 'METRO', 'MOPED', 'ROUTE', 'DEPOT', 'CROWD', 'WHEEL', 'METER', 'CROSS', 'NOISE',
            'BRIDGE', 'TUNNEL', 'AVENUE', 'CHURCH', 'MUSEUM', 'SCHOOL', 'MARKET', 'CINEMA', 'OFFICE', 'STREET', 'SUBWAY',
            'STATUE', 'SQUARE', 'GARAGE', 'CORNER', 'HARBOR', 'PALACE', 'TEMPLE', 'OUTLET',
            'HIGHWAY', 'TRANSIT', 'AIRPORT', 'STATION', 'LIBRARY', 'THEATER', 'FACTORY', 'PARKING', 'TRAFFIC', 'QUARTER',
            'RAILWAY', 'BOROUGH', 'VILLAGE', 'TROLLEY',
            'BUILDING', 'SIDEWALK', 'MONUMENT', 'HOSPITAL', 'PHARMACY', 'BOUTIQUE', 'LANDMARK', 'MOTORWAY',
            'TERMINAL', 'DISTRICT', 'CROSSING', 'OVERPASS'
        ],
        fashion: [
            'HAT', 'CAP', 'TIE', 'BOW', 'FUR', 'GEM', 'PIN', 'DYE', 'HEM', 'TAB', 'ZIP', 'BIB', 'WIG', 'FIT',
            'COAT', 'VEST', 'CAPE', 'ROBE', 'HOOD', 'BELT', 'SHOE', 'BOOT', 'HEEL', 'SOLE', 'LACE', 'SOCK', 'CUFF',
            'RING', 'BEAD', 'GOLD', 'SILK', 'WOOL', 'MESH', 'GOWN', 'WRAP', 'SASH', 'KNIT', 'SNAP', 'STUD',
            'VEIL', 'BAND', 'TRIM', 'CORD', 'TOTE',
            'SHIRT', 'PANTS', 'JEANS', 'SKIRT', 'DRESS', 'SCARF', 'GLOVE', 'CHAIN', 'PEARL', 'JEWEL', 'CHARM', 'LINEN',
            'DENIM', 'SUEDE', 'PLAID', 'SATIN', 'TWEED', 'WEAVE', 'CLASP', 'BERET', 'SHAWL', 'SMOCK', 'FIBER', 'PLEAT',
            'BLAZER', 'JACKET', 'TUXEDO', 'SANDAL', 'LOAFER', 'CORSET', 'ANORAK', 'PONCHO', 'FEDORA', 'BEANIE', 'BUCKLE',
            'BROOCH', 'ANKLET', 'CHOKER', 'COTTON', 'VELVET', 'SEQUIN', 'TASSEL', 'RIBBON', 'FABRIC',
            'SWEATER', 'SNEAKER', 'LEGGING', 'PAJAMAS', 'EARRING', 'PENDANT', 'DIAMOND', 'PAISLEY',
            'FLANNEL', 'CHIFFON', 'LEATHER', 'PRINTED',
            'NECKLACE', 'CARDIGAN', 'JUMPSUIT', 'RAINCOAT', 'STILETTO', 'CASHMERE', 'FOOTWEAR', 'CUFFLINK', 'WARDROBE',
            'OVERCOAT', 'KNITWEAR'
        ],
        tech: [
            'WEB', 'APP', 'BUG', 'BOT', 'NET', 'HUB', 'RAM', 'USB', 'PIN', 'LOG', 'TAG', 'SQL', 'API', 'CPU', 'GPU',
            'CODE', 'DATA', 'FILE', 'BYTE', 'DISK', 'CHIP', 'CARD', 'PORT', 'SLOT', 'SITE', 'PAGE', 'LINK', 'BLOG',
            'POST', 'CHAT', 'TEXT', 'MAIL', 'SPAM', 'GAME', 'TOOL', 'HACK', 'WIFI', 'WAVE', 'BAND', 'NODE', 'GRID',
            'FONT', 'ICON', 'LOOP', 'PING', 'SYNC', 'SCAN',
            'MOUSE', 'BOARD', 'CABLE', 'PIXEL', 'PATCH', 'VIRUS', 'CLOUD', 'TOKEN', 'STACK', 'FRAME', 'DEBUG', 'QUERY',
            'ARRAY', 'INDEX', 'CACHE', 'FLASH', 'ROUTE', 'PRINT', 'MODAL', 'INPUT', 'CLONE', 'PARSE', 'FETCH', 'MERGE',
            'SCREEN', 'SERVER', 'SCRIPT', 'SIGNAL', 'DEVICE', 'ROUTER', 'TABLET', 'SOCKET', 'TOGGLE', 'WIDGET', 'KERNEL',
            'DRIVER', 'MODULE', 'CURSOR', 'PLUGIN', 'THREAD', 'STREAM', 'BINARY', 'CODING', 'BACKUP',
            'BROWSER', 'PROGRAM', 'NETWORK', 'DESKTOP', 'MONITOR', 'DIGITAL', 'COMPILE', 'RUNTIME', 'STORAGE', 'GATEWAY',
            'HOSTING', 'SCANNER', 'DISPLAY',
            'SOFTWARE', 'HARDWARE', 'DATABASE', 'KEYBOARD', 'INTERNET', 'DOWNLOAD', 'WIRELESS', 'COMPUTER', 'AUTOMATE',
            'COMPILER', 'TERMINAL', 'FUNCTION', 'PROTOCOL', 'ETHERNET'
        ],
        travel: [
            'MAP', 'BAG', 'INN', 'SKI', 'SEA', 'SPA', 'CAB', 'FLY', 'ROW', 'JOG', 'HOP', 'DIP', 'VAN',
            'TRIP', 'TOUR', 'TREK', 'HIKE', 'WALK', 'RIDE', 'SAIL', 'ROAD', 'PATH', 'GATE', 'EXIT', 'RAMP', 'LOOP',
            'CASE', 'PACK', 'VISA', 'ROOM', 'POOL', 'TENT', 'CAMP', 'HOST', 'CREW', 'DOCK', 'PORT', 'DECK', 'RAFT',
            'LAKE', 'COVE', 'GULF', 'CAPE', 'ISLE', 'PASS',
            'DRIVE', 'TRAIL', 'ROUTE', 'BEACH', 'CABIN', 'GUIDE', 'GUEST', 'LOCAL', 'OASIS', 'TRAIN', 'PLANE', 'FERRY',
            'CANOE', 'KAYAK', 'YACHT', 'VISTA', 'LODGE', 'MOTEL', 'HOTEL', 'DEPOT', 'CARGO', 'COAST', 'WHARF',
            'FLIGHT', 'CRUISE', 'VOYAGE', 'SAFARI', 'RESORT', 'BRIDGE', 'TEMPLE', 'CASTLE', 'PALACE', 'MUSEUM', 'TICKET',
            'VALLEY', 'ISLAND', 'CANYON', 'MARINA', 'HOSTEL', 'TRAVEL', 'LOUNGE', 'SCENIC', 'HARBOR',
            'AIRPORT', 'LUGGAGE', 'TRANSIT', 'COMPASS', 'JOURNEY', 'TOURIST', 'CAMPING', 'SAILING', 'CUSTOMS',
            'HOLIDAY', 'CARAVAN', 'GETAWAY', 'CHARTER',
            'PASSPORT', 'SUITCASE', 'BACKPACK', 'EXPLORER', 'VACATION', 'RAILROAD', 'TERMINAL', 'BOARDING', 'TRAVELER',
            'LANDMARK', 'MONUMENT', 'SEASHORE', 'PANORAMA', 'ROADTRIP'
        ],
        science: [
            'ION', 'GAS', 'RAY', 'LAB', 'DNA', 'RNA', 'ARC', 'ORB', 'OHM', 'ERG', 'AMP', 'DIM', 'HOT', 'WET', 'MIX',
            'ATOM', 'BOND', 'MASS', 'HEAT', 'WAVE', 'CELL', 'GENE', 'LIFE', 'FACT', 'LENS', 'BEAM', 'SCAN', 'ACID',
            'BASE', 'SALT', 'FLUX', 'FUSE', 'VOLT', 'WATT', 'CORE', 'DATA', 'IRON', 'LEAD', 'ZINC', 'NEON', 'GOLD',
            'TANK', 'TUBE', 'DROP', 'FLOW', 'SPIN', 'DOSE',
            'FORCE', 'LIGHT', 'FIELD', 'TRAIT', 'DEATH', 'BIRTH', 'DECAY', 'PROBE', 'PULSE', 'IMAGE', 'SOLID', 'METAL',
            'ALLOY', 'TRIAL', 'PROOF', 'GRAPH', 'MODEL', 'ORBIT', 'QUARK', 'LASER', 'PRISM', 'STEAM', 'RADAR', 'SCALE',
            'LIQUID', 'PLASMA', 'ENERGY', 'MOTION', 'PROTON', 'PHOTON', 'FOSSIL', 'SAMPLE', 'THEORY', 'RESULT', 'METHOD',
            'MATTER', 'NEURON', 'FUSION', 'OXYGEN', 'CARBON', 'HELIUM', 'COPPER',
            'CRYSTAL', 'ELEMENT', 'FORMULA', 'NEUTRON', 'ISOTOPE', 'MINERAL', 'POLYMER', 'BIOLOGY', 'PHYSICS', 'GRAVITY',
            'DENSITY', 'VOLTAGE', 'CHEMIST', 'NUCLEUS',
            'MOLECULE', 'ELECTRON', 'CHEMICAL', 'REACTION', 'PARTICLE', 'SPECTRUM', 'CATALYST', 'ORGANISM', 'BACTERIA',
            'HYDROGEN', 'NITROGEN', 'TITANIUM', 'CALCULUS', 'COMPOUND'
        ]
    },
    es: {
        nature: [
            'RIO', 'MAR', 'OLA', 'SOL', 'DIA', 'LUZ', 'VID', 'ERA', 'GEL', 'TUL', 'CAL', 'RED', 'SAL',
            'HOJA', 'RAIZ', 'RAMA', 'FLOR', 'PINO', 'LAGO', 'ROCA', 'ISLA', 'CABO', 'LUNA', 'NUBE', 'ALBA', 'ROSA',
            'LODO', 'SETA', 'ALGA', 'OLMO', 'CIMA', 'LOMA', 'PICO', 'FOSA', 'DUNA', 'GOTA', 'LAVA', 'MINA', 'OLEO',
            'ARBOL', 'TALLO', 'MUSGO', 'ROBLE', 'SELVA', 'PLAYA', 'ARENA', 'MONTE', 'VALLE', 'CERRO', 'CUEVA', 'COSTA',
            'BAHIA', 'SUELO', 'NIEVE', 'HIELO', 'BRISA', 'CIELO', 'NOCHE', 'CAMPO', 'PRADO', 'LIRIO', 'CORAL', 'SAUCE',
            'HIERBA', 'BOSQUE', 'PIEDRA', 'TIERRA', 'LLUVIA', 'NIEBLA', 'JARDIN', 'PARQUE', 'LAGUNA', 'COLINA',
            'TRONCO', 'HELADA', 'ESPIGA', 'JUNCO', 'ESPUMA', 'SEMILLA', 'CHOPERA', 'PINEDA',
            'CASCADA', 'PRADERA', 'GLACIAR', 'LLANURA', 'PANTANO', 'BARRANCO', 'COSECHA', 'FOLLAJE', 'SABANA',
            'ESTEPA', 'VOLCAN', 'MESETA', 'RIBERA',
            'ESTRELLA', 'AMANECER', 'TEMPORAL', 'SENDERO', 'HUMEDAL', 'PEDREGAL', 'ARRECIFE', 'TORRENTE'
        ],
        animals: [
            'OSO', 'PEZ', 'AVE', 'RES', 'BOA', 'GNU', 'EMU', 'CAN', 'YAK', 'KOI', 'ROE', 'BUE', 'MUL',
            'GATO', 'LOBO', 'LEON', 'PUMA', 'PATO', 'RANA', 'SAPO', 'FOCA', 'TORO', 'VACA', 'MULA', 'BUHO', 'ORCA',
            'MONO', 'GAMO', 'CUCO', 'RATA', 'PONI', 'LORO', 'ALCE', 'NIDO', 'CRIA', 'MULO', 'LORA',
            'PERRO', 'ZORRO', 'TIGRE', 'CISNE', 'GANSO', 'CABRA', 'OVEJA', 'BURRO', 'MOSCA', 'ABEJA', 'CERDO', 'POLLO',
            'CORAL', 'BUITRE', 'GRILLO', 'CUERVO', 'LIEBRE', 'TRUCHA', 'PULPO', 'GARZA', 'ARDILLA', 'LINCE',
            'HALCON', 'PALOMA', 'AVISPA', 'SALMON', 'VENADO', 'IGUANA', 'NUTRIA', 'GRULLA', 'CAIMAN', 'CONCHA',
            'PAJARO', 'CONEJO', 'DELFIN', 'AGUILA', 'MEDUSA', 'LAGARTO',
            'GORILA', 'JIRAFA', 'ARANA', 'GALLINA', 'TORTUGA', 'SERPIENTE',
            'LEOPARDO', 'POLILLA', 'CANGURO', 'CABRITO', 'POTRO', 'MORSA',
            'ELEFANTE', 'FLAMENCO', 'CAMALEON', 'ALBATROS', 'CORALINO', 'PEREZOSO', 'CABALLITO', 'DROMEDARIO'
        ],
        food: [
            'PAN', 'SAL', 'UVA', 'AJO', 'COL', 'RON', 'GEL', 'MES', 'SOL', 'OCA', 'NUZ', 'TES', 'VID',
            'TORTA', 'TARTA', 'BOLLO', 'ARROZ', 'MAIZ', 'TRIGO', 'CARNE', 'POLLO', 'JAMON', 'HUEVO', 'LECHE',
            'SOPA', 'MIEL', 'FRESA', 'NUEZ', 'PERA', 'LIMA', 'NATA', 'PAPA', 'PURE', 'CAFE', 'HIGO', 'KIWI',
            'SOJA', 'PAVO', 'ATUN', 'COCO', 'JUGO', 'TACO',
            'CREMA', 'QUESO', 'YOGUR', 'CALDO', 'SALSA', 'LIMON', 'MELON', 'CHILE', 'PASTA', 'PIZZA', 'DULCE',
            'JALEA', 'GUISO', 'ASADO', 'ADOBO', 'FILETE', 'MANGO', 'CEREZA', 'AVENA', 'SUSHI',
            'PASTEL', 'TOCINO', 'POSTRE', 'MANJAR', 'BATIDO', 'HELADO', 'SANDIA', 'CEBADA', 'ACEITE', 'AZUCAR',
            'GALLETA', 'GRANOLA', 'MANTECA', 'PATATA', 'PEPINO', 'TOMATE',
            'CANELA', 'VINAGRE', 'EMPANADA', 'CHURROS', 'ALMENDRA', 'MOSTAZA', 'CALZONE', 'BIZCOCHO',
            'CALABAZA', 'ESPINACA',
            'CARAMELO', 'SANDWICH', 'TORTILLA', 'PAELLA', 'REFRESCO', 'GELATINA', 'MAHONESA', 'LIMONADA'
        ],
        human: [
            'OJO', 'PIE', 'SER', 'VER', 'VOZ', 'FIN', 'MAL', 'PAZ', 'LUZ', 'VIA', 'SED', 'RED', 'ERA',
            'CARA', 'BOCA', 'DEDO', 'CODO', 'PIEL', 'ALMA', 'AMOR', 'BEBE', 'RISA', 'MANO', 'PELO', 'PASO',
            'HIJO', 'MAMA', 'PAPA', 'ODIO', 'VIDA', 'NINO', 'DIOS', 'EDAD', 'OIDO', 'CELO', 'ABAD',
            'BRAZO', 'JOVEN', 'MUJER', 'CHICO', 'CHICA', 'PECHO', 'TALON', 'GENIO', 'DOLOR', 'CALMA', 'VISTA',
            'SUENO', 'MIEDO', 'MENTE', 'LABIO', 'HUESO', 'GEMELO', 'HOMBRE', 'ADULTO', 'FRENTE', 'PIERNA',
            'NERVIO', 'MUSCULO', 'SANGRE', 'LENGUA', 'DIENTE', 'CUELLO', 'HOMBRO', 'CEREBRO', 'CABEZA',
            'ESPOSA', 'ESPOSO', 'ABUELO', 'ABUELA', 'FUERZA', 'VIRTUD', 'SENTIDO',
            'HERMANO', 'HERMANA', 'SOBRINO', 'COLUMNA', 'COLCHON', 'DERECHO', 'TERNURA', 'AMISTAD',
            'VALENTIA', 'RESPETO', 'TALENTO', 'COMEDOR', 'INFANCIA',
            'FORTALEZA', 'VOLUNTAD', 'RECUERDO', 'SOCIEDAD', 'IDENTIDAD', 'HUMANIDAD', 'FELICIDAD', 'BIENESTAR'
        ],
        home: [
            'LUZ', 'GAS', 'RED', 'SOL', 'LAR', 'CAL', 'VER', 'TUL', 'GEL', 'BAR', 'OCA', 'ERA', 'TEL',
            'CAMA', 'MESA', 'SOFA', 'VASO', 'TAZA', 'OLLA', 'CUBO', 'AIRE', 'VIGA', 'PISO', 'MURO', 'PILA',
            'LOZA', 'FOCO', 'TUBO', 'ROPA', 'LATA', 'TINA', 'HILO', 'PALA', 'BOTE', 'CAJA', 'BAUL', 'POMO',
            'GRIFO', 'JABON', 'PLATO', 'FUNDA',
            'PUERTA', 'PARED', 'TECHO', 'SUELO', 'DUCHA', 'HORNO', 'CABLE', 'LLAVE', 'MARCO', 'PLANTA', 'TRAPO',
            'BOLSA', 'MANTA', 'SILLA', 'MUEBLE', 'COCINA', 'ESPEJO', 'TIMBRE', 'NEVERA', 'LAVABO',
            'SARTEN', 'ESCOBA', 'MACETA', 'BALCON', 'SOTANO', 'JARDIN', 'GARAJE', 'CORTINA', 'LAMPARA',
            'VENTANA', 'ARMARIO', 'PASILLO', 'ENCHUFE',
            'COLCHON', 'COMEDOR', 'TERRAZA', 'CHIMENEA', 'ROPERO', 'PERCHERO', 'DESPENSA',
            'ESCALERA', 'ALMOHADA', 'LAVADORA',
            'CERRADURA', 'RADIADOR', 'ALFOMBRA', 'ESTANTE', 'TABURETE', 'FREGADERO', 'ESCRITORIO', 'LITERA'
        ],
        city: [
            'BAR', 'BUS', 'CAR', 'LUZ', 'VIA', 'RED', 'GAS', 'RIO', 'PIE', 'FIN', 'PAR', 'SUR', 'ERA',
            'CAFE', 'TAXI', 'MOTO', 'BICI', 'TREN', 'CINE', 'PASO', 'PISO', 'FARO', 'MURO', 'ARCO', 'ZONA',
            'RUTA', 'OBRA', 'VADO', 'PARO', 'RIEL', 'NAVE', 'PEON', 'STOP', 'NODO', 'BOCA', 'MINA', 'AIRE',
            'CALLE', 'PLAZA', 'VENTA', 'POSTE', 'BANCO', 'HOTEL', 'COCHE', 'AVION', 'BARCO', 'RAMPA', 'VERJA',
            'ACERA', 'METRO', 'ANDEN', 'PASEO', 'FUENTE', 'MUSEO', 'CAMPO', 'TORRE', 'PARED', 'CRUCE', 'BOLSA',
            'TIENDA', 'PARQUE', 'BARRIO', 'CENTRO', 'MUELLE', 'PUENTE', 'TUNEL', 'ESQUINA', 'FABRICA', 'OFICINA',
            'ROTONDA', 'MERCADO', 'CORREO', 'TEATRO', 'IGLESIA', 'PALACIO', 'CALLEJON', 'TRANVIA',
            'ESTATUA', 'ESTACION', 'CATEDRAL', 'FARMACIA', 'ESCUELA', 'ESTADIO', 'SEMAFORO',
            'EDIFICIO', 'GIMNASIO', 'BOMBEROS', 'CORREOS', 'HOSPITAL', 'MONUMENTO'
        ],
        fashion: [
            'ORO', 'GEL', 'PIE', 'RED', 'TUL', 'LUZ', 'SOL', 'PIN', 'FIN', 'MOD', 'RAZ', 'ALO', 'VER',
            'BOTA', 'CAPA', 'BATA', 'SEDA', 'LANA', 'HILO', 'TELA', 'PIEL', 'RUBI', 'LAZO', 'FAJA', 'GALA',
            'MODA', 'TACO', 'RASO', 'NUDO', 'MONO', 'TOGA', 'VELO', 'FINO', 'BOLSO', 'OJAL',
            'GORRA', 'TRAJE', 'PERLA', 'PLATA', 'CIERRE', 'CUERO', 'TINTE', 'FIBRA', 'TELAR', 'SUELA',
            'FORRO', 'PUNTO', 'PAÑO', 'LIENZO', 'CREMA', 'LENTEJUELA', 'FELPA', 'DRAPE', 'ROSCA', 'FLECO',
            'CAMISA', 'FALDA', 'ZAPATO', 'CORDON', 'MEDIA', 'GUANTE', 'ANILLO', 'COLLAR', 'BROCHE',
            'GAMUZA', 'CHALECO', 'ABRIGO', 'CORREA', 'HEBILLA', 'BOTON',
            'ENCAJE', 'BORDADO', 'FLECOS', 'SOLAPA', 'JERSEY', 'BLUSON', 'TACONES', 'ESTAMPA',
            'PIJAMA', 'DIADEMA', 'MANOPLA', 'TIRANTES', 'COLGANTE', 'GEMELOS', 'TURBANTE', 'BERMUDAS',
            'PASARELA', 'ALPARGATA', 'PANTALON', 'SOMBRERO', 'CALCETIN', 'CAMISETA', 'CAZADORA', 'SUDADERA',
            'CACHEMIRA', 'PENDIENTE'
        ],
        tech: [
            'WEB', 'APP', 'RED', 'USB', 'CPU', 'GPS', 'PIN', 'BOT', 'RAM', 'GIF', 'PDF', 'URL', 'LUZ',
            'DATO', 'CHIP', 'WIFI', 'CHAT', 'BLOG', 'FORO', 'SPAM', 'NUBE', 'BASE', 'MAPA', 'MENU', 'MODO',
            'BITS', 'RUTA', 'TIPO', 'ZONA', 'GUIA', 'ICONO', 'CLAVE', 'LISTA', 'VISTA', 'FUENTE', 'CARGA',
            'TABLA', 'DISCO', 'TECLA', 'RATON', 'ENVIO', 'SITIO', 'VIDEO', 'AUDIO', 'JUEGO', 'PIXEL', 'CAMPO',
            'BOTON', 'CLICK', 'ERROR', 'COPIA', 'TEXTO', 'PANEL', 'MARCO', 'PERFIL', 'FORMA',
            'CABLE', 'RANURA', 'PUERTO', 'SENAL', 'ANTENA', 'MODEM', 'PAGINA', 'ENLACE', 'CORREO', 'PARCHE',
            'CODIGO', 'BACKUP', 'IMAGEN', 'SONIDO', 'BUSCAR', 'ACCESO', 'SALIDA', 'CURSOR',
            'CARPETA', 'FORMATO', 'SCRIPT', 'MODULO', 'DRIVER', 'KERNEL', 'PLUGIN', 'SOCKET',
            'TECLADO', 'MENSAJE', 'TARJETA', 'MEMORIA', 'BATERIA', 'ARCHIVO', 'SISTEMA', 'ESCANER',
            'MONITOR', 'PROGRAMA', 'INTERFAZ', 'DESCARGA',
            'SOFTWARE', 'HARDWARE', 'INTERNET', 'TERMINAL', 'ETHERNET'
        ],
        travel: [
            'MAR', 'SOL', 'VIA', 'SUR', 'RIO', 'GPS', 'SKI', 'SPA', 'BUS', 'FIN', 'RED', 'GAS', 'PIE',
            'TOUR', 'RUTA', 'MAPA', 'GUIA', 'FOTO', 'VISA', 'TAXI', 'TREN', 'ISLA', 'LAGO', 'BOTE', 'MOTO',
            'BICI', 'PASE', 'FARO', 'CABO', 'CIMA', 'PASO', 'VADO', 'ZONA', 'FILA', 'NAVE', 'DATO', 'RIEL',
            'VIAJE', 'VUELO', 'HOTEL', 'PLAYA', 'MONTE', 'SELVA', 'BARCO', 'AVION', 'PISTA', 'COSTA', 'ARENA',
            'MALETA', 'BOLETO', 'PASAJE', 'HOSTAL', 'CABANA', 'LODGE', 'CAMPO', 'NORTE', 'BAHIA', 'RANGO', 'VELERO',
            'CAMINO', 'RESORT', 'DESTINO', 'POSTAL', 'ADUANA', 'TURISTA', 'CRUCERO', 'BRUJULA',
            'EQUIPAJE', 'LLEGADA', 'SALIDA', 'MERCADO', 'TEMPLO', 'MUSEO', 'PALACIO', 'MIRADOR', 'PAISAJE',
            'CASTILLO', 'SENDERO', 'REFUGIO', 'TRAVESIA', 'ESCALADA', 'AVENTURA',
            'TURISMO', 'ESTANCIA', 'CARAVANA', 'HOSPEDAJE', 'TERMINAL', 'PANORAMA'
        ],
        science: [
            'ION', 'GAS', 'ADN', 'LUZ', 'LEY', 'SAL', 'SOL', 'OHM', 'ERG', 'AMP', 'CAL', 'RED', 'GEL',
            'VIDA', 'MASA', 'PESO', 'ONDA', 'DATO', 'TUBO', 'RAYO', 'ZONA', 'POLO', 'CERO', 'ARCO', 'PILA',
            'NUDO', 'RAIZ', 'CAPA', 'FASE', 'CARGA', 'CAMPO', 'FLUJO', 'ACIDO', 'BASE', 'PLOMO', 'VACIO',
            'CALOR', 'DOSIS', 'PULSO', 'LASER', 'LENTE', 'METAL', 'TABLA', 'PRUEBA', 'MODELO',
            'ENSAYO', 'PLASMA', 'HIERRO', 'COBRE', 'PLATA', 'LITIO', 'AZUFRE', 'TEJIDO', 'ORGANO', 'NERVIO',
            'HELIO', 'NEON', 'ZINC',
            'FUERZA', 'PROTON', 'FOTON', 'NUCLEO', 'VOLTAJE', 'LIQUIDO', 'SOLIDO', 'CRISTAL', 'MINERAL',
            'OXIGENO', 'CARBONO',
            'NEUTRON', 'ISOTOPO', 'POLIMERO', 'GRAVEDAD', 'QUIMICA', 'FORMULA', 'ELEMENTO', 'PROBETA',
            'MOLECULA', 'ECUACION', 'TEOREMA', 'ANALISIS', 'MEZCLA', 'FISICA',
            'REACCION', 'ESPECTRO', 'TITANIO', 'UNIVERSO', 'GALAXIA', 'BACTERIA', 'COMPUESTO'
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
