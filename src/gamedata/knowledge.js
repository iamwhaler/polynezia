
export const starter_pack = {fruits: 420, population: 1, tools:5, instruments: 2};

export const mother_island = {name: 'Mountain', type: 'mountain',
    custom_space: 420, land_rates: {shore: 35, fertile: 15, mountain: 40}, wasteland: 10,
    resources_rates: {'fruits': 2500, 'roots': 2500, 'fish': 2500, 'meat': 2500, 'wood': 2500, 'stone': 10000, 'iron': 1000},
    'text': 'text'};

export const start_island = {name: 'Tropical', type: 'tropical',
    custom_space: 16, land_rates: {shore: 40, fertile: 40, mountain: 0}, wasteland: 20,
    resources_rates: {'fruits': 75, 'roots': 50, 'fish': 50, 'meat': 50, 'wood': 75, 'stone': 0, 'iron': 0},
    'text': 'text'};

export const fast_island = {name: 'Tropical', type: 'tropical',
    custom_space: 24, land_rates: {shore: 35, fertile: 30, mountain: 20}, wasteland: 15,
    resources_rates: {'fruits': 100, 'roots': 100, 'fish': 100, 'meat': 100, 'wood': 100, 'stone': 100, 'iron': 100},
    'text': 'text'};

export const island_types = {
    'swamp': {name: 'Swamp', type: 'swamp',         land_rates: {shore: 40, fertile: 30, mountain: 10}, wasteland: 20, resources_rates: {'fruits': 100, 'roots': 150, 'fish': 200, 'meat': 50, 'wood': 150, 'stone': 50, 'iron': 100}, 'text': 'text'},
    'jungle': {name: 'Jungle', type: 'jungle',      land_rates: {shore: 35, fertile: 40, mountain: 15}, wasteland: 10, resources_rates: {'fruits': 100, 'roots': 75,  'fish': 100, 'meat': 100, 'wood': 200, 'stone': 75, 'iron': 100}, 'text': 'text'},
    'tropical': {name: 'Tropical', type: 'tropical',land_rates: {shore: 35, fertile: 30, mountain: 20}, wasteland: 15, resources_rates: {'fruits': 100, 'roots': 100, 'fish': 100, 'meat': 100, 'wood': 100, 'stone': 100, 'iron': 100}, 'text': 'text'},
    'plain': {name: 'Plain', type: 'plain',         land_rates: {shore: 30, fertile: 20, mountain: 15}, wasteland: 25, resources_rates: {'fruits': 50,  'roots': 200, 'fish': 75, 'meat': 150, 'wood': 75, 'stone': 150, 'iron': 100}, 'text': 'text'},
    'mountain': {name: 'Mountain', type: 'mountain',land_rates: {shore: 30, fertile: 10, mountain: 30}, wasteland: 30, resources_rates: {'fruits': 150, 'roots': 75,  'fish': 50, 'meat': 150, 'wood': 50, 'stone': 200, 'iron': 100}, 'text': 'text'},
};

export const resources = {
    'fruits': {name: 'Fruits', style: 'bg-food',   is_nature: true,  vegetation: true, locked_till: 'embarked', difficulty: 1, max_cap: 6000, regen: 0.75, text: 'Exhaustible food from orchards.'},
    'roots': {name: 'Roots', style: 'bg-food',     is_nature: true,  vegetation: true, locked_till: 'field',    difficulty: 2.5, max_cap: 5000, regen: 1, text: 'Exhaustible food from fields.'},
    'meat': {name: 'Meat', style: 'bg-food',       is_nature: true,  vegetation: false, locked_till: 'lodge',   difficulty: 4, max_cap: 2000, regen: 2, text: 'Exhaustible food from hunting, sustainable food from pasture.'},
    'fish': {name: 'Fish', style: 'bg-food',       is_nature: true,  vegetation: false, locked_till: 'pier',    difficulty: 5, max_cap: 3000, regen: 3, text: 'Exhaustible food from piers, sustainable food by fishing from boats.'},

    'wood': {name: 'Wood', style: 'bg-fuel',       is_nature: true,  vegetation: true, locked_till: 'embarked', difficulty: 5, max_cap: 6000, regen: 1, text: 'Exhaustible material and fuel from sawmill.'},
    'stone': {name: 'Stone', style: 'bg-material', is_nature: false, vegetation: false, locked_till: 'quarry',  difficulty: 20, max_cap: 10000, regen: 0.1, text: 'Exhaustible material from quarries, sustainable material from mines.'},
    'iron': {name: 'Iron', style: 'bg-material',   is_nature: false, vegetation: false, locked_till: 'mine',    difficulty: 100, max_cap: 1000, regen: 0.01, text: 'Exhaustible material from mines.'},

    'moai': {name: 'Moai', style: 'bg-rare',       is_nature: false, vegetation: false, locked_till: 'ahu',     difficulty: 500000, max_cap: 100, regen: 0.0, text: 'Praying Moai idol is the legacy of your people. Celebrate them and let your civilization grow.'}
};

export const items = {
 //   'vegetables': {name: 'Vegetables', style: 'bg-food', locked_till: 'garden', text: 'Sustainable food from gardens.'},
    'human_meat': {name: 'Human Meat', style: 'bg-food', text: 'Fresh human meat.'},
    'meals': {name: 'Cooked Meal', style: 'bg-food', text: 'Cooked food. From a single piece of meat you can cook three dishes, from vegetables - two.'},
    'coal': {name: 'Coal', style: 'bg-fuel', locked_till: 'quarry', text: 'Coal is mined in quarry and mines and can be used as fuel.'},
 //   'turf': {name: 'Turf', style: 'bg-fuel', locked_till: 'canal', text: 'Turf is extracted in canals and can be used as fuel. Swampy islands have 5 times more turf.'},
    'obsidian': {name: 'Obsidian', style: 'bg-proxy', locked_till: 'quarry', text: 'Obsidian is mined in quarries and can be used as a material for tools, instruments and weapons. Mountainous islands have 5 times more obsidian.'},
    'wool': {name: 'Wool', style: 'bg-proxy', locked_till: 'pasture', text: 'Wool is extracted from sheep in pastures.'},
    'skin': {name: 'Skin', style: 'bg-proxy', locked_till: 'lodge', text: 'Skins are produced on the hunt.'},
    'shovels': {name: 'Shovels', style: 'bg-tools', locked_till: 'carpentry', text: 'Shovels are necessary for the construction of many buildings, which are terraforming land.'},
    'tools': {name: 'Tools', style: 'bg-tools', locked_till: 'workshop', text: 'Tools make the complexity of resource extraction three times lighter. Reduced durability in the extraction of fish, meat, stone and iron.'},
    'instruments': {name: 'Instrument', style: 'bg-tools', locked_till: 'forge', text: 'Instrument make the complexity of resource extraction ten times lighter. Reduced durability in the extraction of stone and iron.'},
 //   'weapon': {name: 'Weapon', style: 'bg-war', locked_till: 'weapon_forge', text: 'Weapons allow you to win more resources in the war.'},
    'armor': {name: 'Armor', style: 'bg-war', locked_till: 'armory', text: 'Armor allows you to reduce losses in the war.'},
    'fishing_tools': {name: 'Fishing Rods', style: 'bg-other', text: 'Increases fish catch on the journey.'},
    'storm_set': {name: 'Storm Set', style: 'bg-other', text: 'Reduces cargo loss during a storm.'},
    'skull': {name: 'Human Skull', style: 'bg-other', text: 'In your tribe it is customary to store the skull of the eaten as a sign of memory.'},
 //   'legacy': {name: 'Legacy', style: 'bg-rare', text: 'The legacy grows with every island where you built Moai. New islands have a larger size for each point of legacy.'},
  //  'heritage': {name: 'Heritage', style: 'bg-rare', text: 'The heritage grows with each Moai built. New islands are more rich in resources for each point of heritage.'},
    //   'gold': {name: 'Gold', style: 'bg-rare', text: 'Gold is a valuable resource. It is extracted in the mine and is widely used in trade'},
};

export const goods = ['fruits', 'roots', 'fish', 'meat', 'wood', 'stone', 'iron', 'vegetables', 'coal', 'turf', 'obsidian', 'wool', 'skin', 'meals', 'shovels', 'tools', 'instruments', 'weapon', 'armor'];

export const ships = {
    'canoe': {name: 'Canoe',         crew: 1, speed: 8, capacity: 100, locked_till: 'carpentry',      cost: {'wood': 100}, text: 'A soup boat for one.'},
    'proa': {name: 'Proa',           crew: 2, speed: 10, capacity: 300, locked_till: 'sawmill',       cost: {'wood': 250, 'tools': 25}, text: 'Reliable fast boat.'},
    'catamaran': {name: 'Catamaran', crew: 3, speed: 5, capacity: 1000, locked_till: 'forge',         cost: {'wood': 500, 'instruments': 50}, text: 'Stable catamaran.'}
};

export const buildings = {
    'hut': {name: 'Hut',        worker: null,   build_on: 'any',            locked_till: 'bonfire',   cost: {'wood': 25}, text: 'Home for Two.'},
    'house': {name: 'House',    worker: null,   build_on: 'any',            locked_till: 'sawmill',   cost: {'wood': 100, 'stone': 50, 'tools': 25}, text: 'Home for Four. Attracts new residents.'},

    'bonfire': {name: 'Bonfire', worker: 'cook', build_on: 'shore',         locked_till: true,        cost: {'wood': 10}, text: 'Attracts new residents. Accelerates speed of cook.'},
    'pier': {name: 'Pier',      worker: 'fisherman', build_on: 'shore',     locked_till: 'quarry',    cost: {'wood': 200, 'stone': 50}, text: 'Provide fishing. Accelerates speed of fisherman.'},
    'lighthouse': {name: 'Lighthouse', worker: 'navigator', build_on: 'shore', locked_till: 'pier',   cost: {'wood': 500, 'stone': 500, 'tools': 100}, text: 'The lighthouse allows longer sea trips and attracts traders.'},

    'orchard': {name: 'Orchard', worker: 'keeper',  build_on: 'fertile',    locked_till: 'hut',       cost: {'fruits': 50}, text: 'Provide fruits. Accelerates speed of gatherers.'},
    'canal': {name: 'Canal',    worker: 'aquarius', build_on: 'fertile',    locked_till: 'carpentry', cost: {'meals': 200, 'shovels': 100}, text: 'Improves the regeneration of natural resources: fruits, roots and wood. Accelerates speed of aquarius.'},
    'field': {name: 'Field',    worker: 'fielder',  build_on: 'fertile',    locked_till: 'canal',     cost: {'meals': 400, 'shovels': 200}, text: 'Provide roots. Accelerates speed of fielders.'},
    'pasture': {name: 'Pasture', worker: 'herdsman', build_on: 'fertile',   locked_till: 'canal',     cost: {'wood': 400, 'meals': 400, 'roots': 400, 'shovels': 100}, text: 'Provide passive source of meat and wool. Accelerates speed of herdsman.'},

    'lodge': {name: 'Lodge',    worker: 'hunter',   build_on: 'any',        locked_till: 'hut',       cost: {'wood': 100,}, text: 'Provide hunt and robbery. Accelerates speed of hunter.'},

    'quarry': {name: 'Quarry', worker: 'mason',     build_on: 'mountain',   locked_till: 'carpentry', cost: {'wood': 500, 'meals': 1000, 'shovels': 100}, text: 'Provide stone. Accelerates speed of mason.'},
    'sawmill': {name: 'Sawmill', worker: 'woodcutter', build_on: 'fertile', locked_till: 'workshop',  cost: {'wood': 500, 'tools': 100}, text: 'Allows to build proa boats. Accelerates speed of woodcutter.'},
    'mine': {name: 'Mine',      worker: 'miner',    build_on: 'mountain',   locked_till: 'workshop',  cost: {'wood': 1000, 'stone': 200, 'shovels': 500, 'tools': 100},  text: 'Provide iron, stone and gold. Accelerates speed of miner.'},

    'carpentry': {name: 'Carpentry', worker: 'carpenter', build_on: 'any',  locked_till: 'hut',       cost: {'wood': 250}, text: 'Allows to make shovels. Accelerates speed of carpenter.'},
    'workshop': {name: 'Workshop', worker: 'master', build_on: 'any',       locked_till: 'quarry',    cost: {'wood': 500, 'stone': 100}, text: 'Allows to make stone tools. Accelerates speed of master.'},
    'forge': {name: 'Forge',    worker: 'smith',    build_on: 'any',        locked_till: 'mine',      cost: {'stone': 1000, 'tools': 400, 'iron': 200},text: 'Allows to make iron tools and build catamarans. Accelerates speed of smith.'},
    'armory': {name: 'Armory', worker: 'armorer',   build_on: 'any',        locked_till: 'forge',     cost: {'wood': 500, 'stone': 500, 'iron': 200, 'instruments': 100}, text: 'Allows to make armors from iron, wool or skin. Accelerates speed of armorer.'},

    'ahu': {name: 'Ahu',    worker: 'builder',      build_on: 'any',        locked_till: 'quarry',    cost: {'stone': 1000},text: 'Each Ahu allow to build one Moai. Accelerates speed of builder. Moai will attracts new residents.'},
};