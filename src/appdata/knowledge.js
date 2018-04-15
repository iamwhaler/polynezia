
export const starter_pack = {meals: 100, sailor: 1, canoe: 1};

export const island_types = {
    'swamp': {name: 'Swamp',        land_rates: {shore: 40, fertile: 30, mountain: 5}, wasteland: 25, resources_rates: {'fruits': 100, 'roots': 150, 'fish': 200, 'meat': 50, 'wood': 150, 'stone': 50, 'iron': 100}, 'text': 'text'},
    'jungle': {name: 'Jungle',      land_rates: {shore: 35, fertile: 40, mountain: 15}, wasteland: 10, resources_rates: {'fruits': 100, 'roots': 75, 'fish': 100, 'meat': 100, 'wood': 200, 'stone': 75, 'iron': 100}, 'text': 'text'},
    'tropical': {name: 'Tropical',  land_rates: {shore: 35, fertile: 30, mountain: 20}, wasteland: 25, resources_rates: {'fruits': 100, 'roots': 100, 'fish': 100, 'meat': 100, 'wood': 100, 'stone': 100, 'iron': 100}, 'text': 'text'},
    'plain': {name: 'Plain',        land_rates: {shore: 30, fertile: 20, mountain: 10}, wasteland: 30, resources_rates: {'fruits': 50, 'roots': 200, 'fish': 75, 'meat': 150, 'wood': 75, 'stone': 150, 'iron': 100}, 'text': 'text'},
    'mountain': {name: 'Mountain',  land_rates: {shore: 30, fertile: 10, mountain: 30}, wasteland: 30, resources_rates: {'fruits': 150, 'roots': 75, 'fish': 50, 'meat': 150, 'wood': 50, 'stone': 200, 'iron': 100}, 'text': 'text'},
};

export const resources = {
    'fruits': {name: 'Fruits', is_nature: true, vegetation: true, locked_till: 'garden', difficulty: 1, max_cap: 7000, regen: 1},
    'roots': {name: 'Roots', is_nature: true, vegetation: true, locked_till: 'field', difficulty: 2.5, max_cap: 6000, regen: 1.5},
    'fish': {name: 'Fish', is_nature: true, vegetation: false, locked_till: 'pier', difficulty: 3, max_cap: 5000, regen: 2},
    'meat': {name: 'Meat', is_nature: true, vegetation: false, locked_till: 'lodge', difficulty: 4, max_cap: 4000, regen: 2.5},

    'wood': {name: 'Wood', is_nature: true, vegetation: true, locked_till: true, difficulty: 1, max_cap: 8000, regen: 2},
    'stone': {name: 'Stone', is_nature: false, vegetation: false, locked_till: 'quarry', difficulty: 10, max_cap: 5000, regen: 0.1},
    'iron': {name: 'Iron', is_nature: false, vegetation: false, locked_till: 'mine', difficulty: 100, max_cap: 1000, regen: 0.01},
    'moai': {name: 'Moai', is_nature: false, vegetation: false, locked_till: 'ahu', difficulty: 100000, max_cap: 100, regen: 0.0}
};

export const items = {
    'vegetables': {name: 'Vegetables'},
    'human_meat': {name: 'Human Meat'},
    'meals': {name: 'Cooked Meal'},
    'coal': {name: 'Coal'},
    'turf': {name: 'Turf'},
    'obsidian': {name: 'Obsidian'},
    'wool': {name: 'Wool'},
    'skin': {name: 'Skin'},
    'tools': {name: 'Tools'},
    'instruments': {name: 'Instrument'},
    'armor': {name: 'Armor'},
    'legacy': {name: 'Legacy'},
    'heritage': {name: 'Heritage'},
};

export const ships = {
    'canoe': {name: 'Canoe',         crew: 1, speed: 8, capacity: 100, locked_till: true, cost: {'wood': 100}, text: 'A soup boat for one.'},
    'proa': {name: 'Proa',           crew: 2, speed: 10, capacity: 300, locked_till: 'sawmill', cost: {'wood': 250, 'iron': 10}, text: 'Reliable fast boat.'},
    'catamaran': {name: 'Catamaran', crew: 3, speed: 5, capacity: 1000, locked_till: 'forge', cost: {'wood': 500, 'instruments': 25}, text: 'Stable catamaran.'}
};

export const buildings = {
    'hut': {name: 'Hut', worker: null, build_on: 'any', cost: {'wood': 25}, locked_till: 'bonfire', text: 'Home for Two.'},
    'house': {name: 'House', worker: null, build_on: 'any', cost: {'wood': 50, 'stone': 50, 'tools': 25}, locked_till: 'workshop', text: 'Home for Four. Attracts new residents.'},

    'bonfire': {name: 'Bonfire', worker: 'cook', build_on: 'shore', cost: {'wood': 10}, locked_till: true, text: 'Attracts new residents. Accelerates speed of cook.'},
    'pier': {name: 'Pier', worker: 'fisherman', build_on: 'shore', cost: {'wood': 100, 'stone': 25}, locked_till: 'quarry', text: 'Provide fishing. Accelerates speed of fisherman.'},
    'lighthouse': {name: 'Lighthouse', worker: 'navigator', build_on: 'shore', cost: {'wood': 200, 'stone': 500, 'tools': 100}, locked_till: 'pier', text: 'The lighthouse allows longer sea trips and attracts traders.'},

    'garden': {name: 'Garden', worker: 'gardener', build_on: 'fertile', cost: {'fruits': 100}, locked_till: 'hut', text: 'Provide fruits. Accelerates speed of gardener.'},
    'canal': {name: 'Canal', worker: 'aquarius', build_on: 'fertile', cost: {'meals': 200, 'tools': 25}, locked_till: 'garden', text: 'Accelerates speed of aquarius.'},
    'field': {name: 'Field', worker: 'fielder', build_on: 'fertile', cost: {'wood': 200, 'meals': 100}, locked_till: 'canal', text: 'Provide roots. Accelerates speed of fielder.'},
    'pasture': {name: 'Pasture', worker: 'herdsman', build_on: 'fertile', cost: {'wood': 200, 'meals': 200, 'stone': 50}, locked_till: 'field', text: 'Provide passive source of meat and wool. Accelerates speed of herdsman.'},
    'sawmill': {name: 'Sawmill', worker: 'woodcutter', build_on: 'fertile', cost: {'wood': 500, 'iron': 100, 'tools': 50}, locked_till: 'mine', text: 'Allows to build proa boats. Accelerates speed of woodcutter.'},
    'lodge': {name: 'Lodge', worker: 'hunter', build_on: 'fertile', cost: {'wood': 600, 'stone': 200, 'instruments': 100}, locked_till: 'forge', text: 'Provide hunt. Accelerates speed of hunter.'},

    'quarry': {name: 'Quarry', worker: 'mason', build_on: 'mountain', cost: {'wood': 500}, locked_till: 'hut', text: 'Provide stone. Accelerates speed of mason.'},
    'mine': {name: 'Mine', worker: 'miner', build_on: 'mountain', cost: {'wood': 1000, 'stone': 100, 'tools': 25}, locked_till: 'workshop', text: 'Provide iron and stone. Accelerates speed of miner.'},

    'workshop': {name: 'Workshop', worker: 'master', build_on: 'any', cost: {'wood': 200, 'stone': 100}, locked_till: 'quarry', text: 'Allows to make stone tools. Accelerates speed of master.'},
    'forge': {name: 'Forge', worker: 'smith', build_on: 'any', cost: {'stone': 250, 'iron': 100, 'tools': 100}, locked_till: 'mine', text: 'Allows to make iron tools and build catamarans. Accelerates speed of smith.'},
    'armory': {name: 'Armory', worker: 'armorer', build_on: 'any', cost: {'wood': 500, 'stone': 250, 'iron': 200, 'instruments': 100}, locked_till: 'lodge', text: 'Allows to make armors from iron, wool or skin. Accelerates speed of armorer.'},

    'ahu': {name: 'Ahu', worker: 'builder', build_on: 'any', cost: {'stone': 1000}, locked_till: 'quarry', text: 'Each Ahu allow to build one Moai. Accelerates speed of builder. Moai will attracts new residents.'},
};

export const professions = {
    'sailor': {name: 'Sailor', resource: null, home: false, locked_till: true, text: 'To swim in the sea is the life of sailors.'},

    'cook': {name: 'Cook', resource: null, home: 'bonfire', locked_till: 'bonfire', text: 'The cook makes cooked food from raw, consuming wood at the bonfire.'},
    'fisherman': {name: 'Fisherman', resource: 'fish', home: 'pier', locked_till: 'pier', text: 'The fisherman produces fish. The pier will improve its work.'},
    'navigator': {name: 'Navigator', resource: null, home: 'lighthouse', locked_till: 'lighthouse', text: 'Navigators maintain a beacon light, attracting traders and directing ships in distant wanderings.'},

    'gardener': {name: 'Gardener', resource: 'fruits', home: 'garden', locked_till: 'garden', text: 'The gardener produces fruits. The garden will improve its work.'},
    'aquarius': {name: 'Aquarius', resource: null, home: 'canal', locked_till: 'canal', text: 'The aquarius improves the regeneration of natural resources: fruits, roots and wood.'},
    'fielder': {name: 'Fielder', resource: 'roots', home: 'field', locked_till: 'field', text: 'The fielder produces roots. The field will improve its work.'},
    'herdsman': {name: 'Herdsman', resource: null, home: 'pasture', locked_till: 'pasture', text: 'The herdsman produces meat and wool. The pasture will improve its work.'},
    'woodcutter': {name: 'Woodcutter', resource: 'wood', home: 'sawmill', locked_till: 'hut', text: 'The woodcutter produces fruits. The sawmill will improve its work.'},
    'hunter': {name: 'Hunter', resource: 'meat', home: 'lodge', locked_till: 'lodge', text: 'The hunter produces meat. The lodge will improve its work.'},

    'mason': {name: 'Mason', resource: 'stone', home: 'quarry', locked_till: 'quarry', text: 'The mason produces stone. The quarry will improve its work.'},
    'miner': {name: 'Miner', resource: 'iron', home: 'mine', locked_till: 'mine', text: 'The miner produces iron. The mine will improve its work and add stone to extraction.'},

    'master': {name: 'Master', resource: null, home: 'workshop', locked_till: 'workshop', text: 'The master produces stone tools. The workshop will improve its work.'},
    'smith': {name: 'Smith', resource: null, home: 'forge', locked_till: 'forge', text: 'The smith produces iron tools. The forge will improve its work.'},
    'armorer': {name: 'Armorer', resource: null, home: 'armory', locked_till: 'armory', text: 'The armorer produces armor from iron, wool or skin. The armory will improve its work.'},

    'builder': {name: 'Builder', resource: 'moai', home: 'ahu', locked_till: 'ahu', text: 'Builders build the majestic statues Moai, the legacy of your civilization.'}
};
