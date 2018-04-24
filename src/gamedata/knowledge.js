
export const starter_pack = {meals: 42, population: 1, sailor: 1};

export const mother_island = {name: 'Mountain', type: 'mountain',
    custom_space: 420, land_rates: {shore: 35, fertile: 15, mountain: 40}, wasteland: 10,
    resources_rates: {'fruits': 2500, 'roots': 2500, 'fish': 2500, 'meat': 2500, 'wood': 2500, 'stone': 10000, 'iron': 1000},
    'text': 'text'};

export const start_island = {name: 'Tropical', type: 'tropical',
    custom_space: 16, land_rates: {shore: 40, fertile: 40, mountain: 0}, wasteland: 20,
    resources_rates: {'fruits': 75, 'roots': 50, 'fish': 50, 'meat': 50, 'wood': 75, 'stone': 0, 'iron': 0},
    'text': 'text'};

export const island_types = {
    'swamp': {name: 'Swamp', type: 'swamp',         land_rates: {shore: 40, fertile: 30, mountain: 10}, wasteland: 20, resources_rates: {'fruits': 100, 'roots': 150, 'fish': 200, 'meat': 50, 'wood': 150, 'stone': 50, 'iron': 100}, 'text': 'text'},
    'jungle': {name: 'Jungle', type: 'jungle',      land_rates: {shore: 35, fertile: 40, mountain: 15}, wasteland: 10, resources_rates: {'fruits': 100, 'roots': 75,  'fish': 100, 'meat': 100, 'wood': 200, 'stone': 75, 'iron': 100}, 'text': 'text'},
    'tropical': {name: 'Tropical', type: 'tropical',land_rates: {shore: 35, fertile: 30, mountain: 20}, wasteland: 15, resources_rates: {'fruits': 100, 'roots': 100, 'fish': 100, 'meat': 100, 'wood': 100, 'stone': 100, 'iron': 100}, 'text': 'text'},
    'plain': {name: 'Plain', type: 'plain',         land_rates: {shore: 30, fertile: 20, mountain: 15}, wasteland: 25, resources_rates: {'fruits': 50,  'roots': 200, 'fish': 75, 'meat': 150, 'wood': 75, 'stone': 150, 'iron': 100}, 'text': 'text'},
    'mountain': {name: 'Mountain', type: 'mountain',land_rates: {shore: 30, fertile: 10, mountain: 30}, wasteland: 30, resources_rates: {'fruits': 150, 'roots': 75,  'fish': 50, 'meat': 150, 'wood': 50, 'stone': 200, 'iron': 100}, 'text': 'text'},
};

export const resources = {
    'fruits': {name: 'Fruits', style: 'bg-food',   is_nature: true,  vegetation: true, locked_till: 'embarked', difficulty: 1, max_cap: 8000, regen: 0.5, text: 'Exhaustible food from orchards.'},
    'roots': {name: 'Roots', style: 'bg-food',     is_nature: true,  vegetation: true, locked_till: 'field',    difficulty: 2.5, max_cap: 7000, regen: 1.25, text: 'Exhaustible food from fields.'},
    'fish': {name: 'Fish', style: 'bg-food',       is_nature: true,  vegetation: false, locked_till: 'pier',    difficulty: 3, max_cap: 5000, regen: 2, text: 'Exhaustible food from piers, sustainable food by fishing from boats.'},
    'meat': {name: 'Meat', style: 'bg-food',       is_nature: true,  vegetation: false, locked_till: 'lodge',   difficulty: 4, max_cap: 4000, regen: 2.5, text: 'Exhaustible food from hunting, sustainable food from pasture.'},

    'wood': {name: 'Wood', style: 'bg-fuel',       is_nature: true,  vegetation: true, locked_till: 'embarked', difficulty: 1, max_cap: 6000, regen: 2, text: 'Exhaustible material and fuel from sawmill.'},
    'stone': {name: 'Stone', style: 'bg-material', is_nature: false, vegetation: false, locked_till: 'quarry',  difficulty: 20, max_cap: 10000, regen: 0.1, text: 'Exhaustible material from quarries, sustainable material from mines.'},
    'iron': {name: 'Iron', style: 'bg-material',   is_nature: false, vegetation: false, locked_till: 'mine',    difficulty: 100, max_cap: 1000, regen: 0.01, text: 'Exhaustible material from mines.'},

    'moai': {name: 'Moai', style: 'bg-rare',       is_nature: false, vegetation: false, locked_till: 'ahu',     difficulty: 500000, max_cap: 100, regen: 0.0, text: 'Praying Moai idol is the legacy of your people. Celebrate them and let your civilization grow.'}
};

export const items = {
    'vegetables': {name: 'Vegetables', style: 'bg-food', locked_till: 'garden', text: 'Sustainable food from gardens.'},
    'human_meat': {name: 'Human Meat', style: 'bg-food', text: 'Fresh human meat.'},
    'meals': {name: 'Cooked Meal', style: 'bg-food', text: 'Cooked food. From a single piece of meat you can cook three dishes, from vegetables - two.'},
    'coal': {name: 'Coal', style: 'bg-fuel', locked_till: 'quarry', text: 'Coal is mined in quarry and mines and can be used as fuel.'},
    'turf': {name: 'Turf', style: 'bg-fuel', locked_till: 'canal', text: 'Turf is extracted in canals and can be used as fuel. Swampy islands have 5 times more turf.'},
    'obsidian': {name: 'Obsidian', style: 'bg-proxy', locked_till: 'quarry', text: 'Obsidian is mined in quarries and can be used as a material for tools, instruments and weapons. Mountainous islands have 5 times more obsidian.'},
    'wool': {name: 'Wool', style: 'bg-proxy', locked_till: 'pasture', text: 'Wool is extracted from sheep in pastures.'},
    'skin': {name: 'Skin', style: 'bg-proxy', locked_till: 'lodge', text: 'Skins are produced on the hunt.'},
    'shovels': {name: 'Shovels', style: 'bg-tools', locked_till: 'carpentry', text: 'Shovels are necessary for the construction of many buildings, which are terraforming land.'},
    'tools': {name: 'Tools', style: 'bg-tools', locked_till: 'workshop', text: 'Tools make the complexity of resource extraction three times lighter. Reduced durability in the extraction of fish, meat, stone and iron.'},
    'instruments': {name: 'Instrument', style: 'bg-tools', locked_till: 'forge', text: 'Instrument make the complexity of resource extraction ten times lighter. Reduced durability in the extraction of stone and iron.'},
    'weapon': {name: 'Weapon', style: 'bg-war', locked_till: 'weapon_forge', text: 'Weapons allow you to win more resources in the war.'},
    'armor': {name: 'Armor', style: 'bg-war', locked_till: 'armory', text: 'Armor allows you to reduce losses in the war.'},
    'fishing_tools': {name: 'Fishing Rods', style: 'bg-other', text: 'Increases fish catch on the journey.'},
    'storm_set': {name: 'Storm Set', style: 'bg-other', text: 'Reduces cargo loss during a storm.'},
    'skull': {name: 'Human Skull', style: 'bg-other', text: 'In your tribe it is customary to store the skull of the eaten as a sign of memory.'},
    'legacy': {name: 'Legacy', style: 'bg-rare', text: 'The legacy grows with every island where you built Moai. New islands have a larger size for each point of legacy.'},
    'heritage': {name: 'Heritage', style: 'bg-rare', text: 'The heritage grows with each Moai built. New islands are more rich in resources for each point of heritage.'},
    'gold': {name: 'Gold', style: 'bg-rare', text: 'Gold is a valuable resource. It is extracted in the mine and is widely used in trade'},
};

export const goods = ['fruits', 'roots', 'fish', 'meat', 'wood', 'stone', 'iron', 'vegetables', 'coal', 'turf', 'obsidian', 'wool', 'skin', 'meals', 'shovels', 'tools', 'instruments', 'weapon', 'armor'];

export const ships = {
    'canoe': {name: 'Canoe',         crew: 1, speed: 8, capacity: 100, locked_till: true, cost: {'wood': 100}, text: 'A soup boat for one.'},
    'proa': {name: 'Proa',           crew: 2, speed: 10, capacity: 300, locked_till: 'sawmill', cost: {'wood': 250, 'tools': 25}, text: 'Reliable fast boat.'},
    'catamaran': {name: 'Catamaran', crew: 3, speed: 5, capacity: 1000, locked_till: 'forge', cost: {'wood': 500, 'instruments': 50}, text: 'Stable catamaran.'}
};

export const buildings = {
    'hut': {name: 'Hut',        worker: null, build_on: 'any',              cost: {'wood': 50}, locked_till: 'bonfire', text: 'Home for Two.'},
    'house': {name: 'House',    worker: null, build_on: 'any',              cost: {'wood': 100, 'stone': 50, 'tools': 25}, locked_till: 'sawmill', text: 'Home for Four. Attracts new residents.'},
    'monastery': {name: 'Monastery', worker: null, build_on: 'mountain',    cost: {'wood': 400, 'stone': 200, 'gold': 100}, locked_till: 'mine', text: 'Home for Nine. Attracts new residents.'},

    'bonfire': {name: 'Bonfire', worker: 'cook', build_on: 'shore',         cost: {'wood': 10}, locked_till: true, text: 'Attracts new residents. Accelerates speed of cook.'},
    'pier': {name: 'Pier',      worker: 'fisherman', build_on: 'shore',     cost: {'wood': 200, 'stone': 50}, locked_till: 'quarry', text: 'Provide fishing. Accelerates speed of fisherman.'},
    'lighthouse': {name: 'Lighthouse', worker: 'navigator', build_on: 'shore', cost: {'wood': 500, 'stone': 500, 'tools': 100}, locked_till: 'pier', text: 'The lighthouse allows longer sea trips and attracts traders.'},

    'orchard': {name: 'Orchard', worker: 'keeper', build_on: 'fertile',     cost: {'fruits': 100}, locked_till: 'hut', text: 'Provide fruits. Accelerates speed of keeper.'},
    'garden': {name: 'Garden', worker: 'gardener', build_on: 'fertile',     cost: {'wood': 100}, locked_till: 'orchard', text: 'Plant vegetables. Accelerates speed of gardener.'},
    'canal': {name: 'Canal',    worker: 'aquarius', build_on: 'fertile',    cost: {'meals': 100, 'shovels': 100}, locked_till: 'orchard', text: 'Accelerates speed of aquarius.'},
    'field': {name: 'Field',    worker: 'fielder', build_on: 'fertile',     cost: {'meals': 400, 'shovels': 200}, locked_till: 'canal', text: 'Provide roots. Accelerates speed of fielder.'},
    'pasture': {name: 'Pasture', worker: 'herdsman', build_on: 'fertile',   cost: {'wood': 400, 'meals': 400, 'roots': 400, 'shovels': 200}, locked_till: 'field', text: 'Provide passive source of meat and wool. Accelerates speed of herdsman.'},
    'sawmill': {name: 'Sawmill', worker: 'woodcutter', build_on: 'fertile', cost: {'wood': 500, 'tools': 100}, locked_till: 'workshop', text: 'Allows to build proa boats. Accelerates speed of woodcutter.'},
    'lodge': {name: 'Lodge',    worker: 'hunter', build_on: 'any',          cost: {'wood': 1000, 'stone': 250, 'instruments': 100}, locked_till: 'forge', text: 'Provide hunt and robbery. Accelerates speed of hunter.'},

    'quarry': {name: 'Quarry', worker: 'mason', build_on: 'mountain',       cost: {'wood': 500, 'meals': 1000, 'shovels': 100}, locked_till: 'carpentry', text: 'Provide stone. Accelerates speed of mason.'},
    'mine': {name: 'Mine',      worker: 'miner', build_on: 'mountain',      cost: {'wood': 1000, 'stone': 200, 'shovels': 500, 'tools': 100}, locked_till: 'workshop', text: 'Provide iron, stone and gold. Accelerates speed of miner.'},
    'megalith': {name: 'Megalith', worker: 'astronomer', build_on: 'mountain', cost: {'meals': 1000, 'stone': 500, 'tools': 100}, locked_till: 'workshop', text: 'Observation of the sky allows you to predict seasons, improving the weather in sea wanderings and productivity of keeper, gardener, fielder, herdsman, fisherman and hunter. Accelerates speed of astronomer.'},

    'carpentry': {name: 'Carpentry', worker: 'carpenter', build_on: 'any',  cost: {'wood': 250}, locked_till: 'hut', text: 'Allows to make shovels. Accelerates speed of carpenter.'},
    'workshop': {name: 'Workshop', worker: 'master', build_on: 'any',       cost: {'wood': 500, 'stone': 100}, locked_till: 'quarry', text: 'Allows to make stone tools. Accelerates speed of master.'},
    'forge': {name: 'Forge',    worker: 'smith', build_on: 'any',           cost: {'stone': 1000, 'tools': 400, 'iron': 200}, locked_till: 'mine', text: 'Allows to make iron tools and build catamarans. Accelerates speed of smith.'},
    'weapon_forge': {name: 'Weapon Forge', worker: 'weaponsmith', build_on: 'any', cost: {'wood': 1000, 'iron': 300, 'instruments': 100}, locked_till: 'lodge', text: 'Allows to make weapon from iron or obsidian. Accelerates speed of weapon smith.'},
    'armory': {name: 'Armory', worker: 'armorer', build_on: 'any',          cost: {'wood': 500, 'stone': 500, 'iron': 200, 'instruments': 100}, locked_till: 'lodge', text: 'Allows to make armors from iron, wool or skin. Accelerates speed of armorer.'},
    'ground': {name: 'Training Ground', worker: 'instructor', build_on: 'any', cost: {'wood': 2000, 'stone': 1000}, locked_till: 'lodge', text: 'On the training ground, instructors will drill your soldiers, improving their training. Accelerates speed of instructor.'},

    'ahu': {name: 'Ahu',    worker: 'builder', build_on: 'any',             cost: {'stone': 1000}, locked_till: 'quarry', text: 'Each Ahu allow to build one Moai. Accelerates speed of builder. Moai will attracts new residents.'},
};

export const professions = {
    'sailor': {name: 'Sailor', resource: null, home: false, locked_till: true, text: 'To swim in the sea is the life of sailors.'},

    'cook': {name: 'Cook', resource: null, home: 'bonfire', locked_till: 'bonfire', text: 'The cook makes cooked food from raw, consuming wood at the bonfire.'},
    'fisherman': {name: 'Fisherman', resource: 'fish', home: 'pier', locked_till: 'pier', text: 'The fisherman produces fish. The pier will improve its work.'},
    'navigator': {name: 'Navigator', resource: null, home: 'lighthouse', locked_till: 'lighthouse', text: 'Navigators maintain a beacon light, attracting traders and directing ships in distant wanderings.'},

    'keeper': {name: 'Keeper', resource: 'fruits', home: 'orchard', locked_till: 'orchard', text: 'The keeper produces fruits. The orchard will improve its work.'},
    'gardener': {name: 'Gardener', resource: null, home: 'garden', locked_till: 'garden', text: 'The gardener plant vegetables. The garden will improve its work.'},
    'aquarius': {name: 'Aquarius', resource: null, home: 'canal', locked_till: 'canal', text: 'The aquarius improves the regeneration of natural resources: fruits, roots and wood.'},
    'fielder': {name: 'Fielder', resource: 'roots', home: 'field', locked_till: 'field', text: 'The fielder produces roots. The field will improve its work.'},
    'herdsman': {name: 'Herdsman', resource: null, home: 'pasture', locked_till: 'pasture', text: 'The herdsman produces meat and wool. The pasture will improve its work.'},
    'woodcutter': {name: 'Woodcutter', resource: 'wood', home: 'sawmill', locked_till: 'bonfire', text: 'The woodcutter produces wood. The sawmill will improve its work.'},
    'hunter': {name: 'Hunter', resource: 'meat', home: 'lodge', locked_till: 'lodge', text: 'The hunter produces meat. The lodge will improve its work.'},

    'mason': {name: 'Mason', resource: 'stone', home: 'quarry', locked_till: 'quarry', text: 'The mason produces stone. The quarry will improve its work.'},
    'miner': {name: 'Miner', resource: 'iron', home: 'mine', locked_till: 'mine', text: 'The miner produces iron. The mine will improve its work and add stone to extraction.'},
    'astronomer': {name: 'Astronomer', resource: null, home: 'megalith', locked_till: 'megalith', text: 'Observation of the sky allows you to predict seasons, improving the weather in sea wanderings and productivity of gardener, fielder, herdsman, fisherman and hunter. The megalith will improve its work.'},

    'carpenter': {name: 'Carpenter', resource: null, home: 'carpentry', locked_till: 'carpentry', text: 'The carpenter produces shovels. The carpentry will improve its work.'},
    'master': {name: 'Master', resource: null, home: 'workshop', locked_till: 'workshop', text: 'The master produces stone tools. The workshop will improve its work.'},
    'smith': {name: 'Smith', resource: null, home: 'forge', locked_till: 'forge', text: 'The smith produces iron tools. The forge will improve its work.'},
    'weaponsmith': {name: 'Weapon Smith', resource: null, home: 'weapon_forge', locked_till: 'weapon_forge', text: 'The weapon smith produces armor from iron, wool or skin. The weapon forge will improve its work.'},
    'armorer': {name: 'Armorer', resource: null, home: 'armory', locked_till: 'armory', text: 'The armorer produces armor from iron, wool or skin. The armory will improve its work.'},
    'instructor': {name: 'Instructor', resource: null, home: 'ground', locked_till: 'ground', text: 'Instructors will drill your soldiers, improving their training. The training ground will improve its work.'},

    'builder': {name: 'Builder', resource: 'moai', home: 'ahu', locked_till: 'ahu', text: 'Builders build the majestic statues Moai, the legacy of your civilization.'}
};
