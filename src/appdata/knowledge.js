
export const starter_pack = {wood: 35, meals: 74, stone_tools: 1, sailor: 1, canoe: 1};

export const island_types = {
    'swamp': {name: 'Swamp',        land_rates: {shore: 40, fertile: 30, mountain: 5}, wasteland: 25, resources_rates: {'fruits': 100, 'roots': 150, 'fish': 200, 'meat': 50, 'wood': 150, 'stone': 50, 'iron': 100}, 'text': 'text'},
    'jungle': {name: 'Jungle',      land_rates: {shore: 35, fertile: 40, mountain: 15}, wasteland: 10, resources_rates: {'fruits': 100, 'roots': 75, 'fish': 100, 'meat': 100, 'wood': 200, 'stone': 75, 'iron': 100}, 'text': 'text'},
    'tropical': {name: 'Tropical',  land_rates: {shore: 35, fertile: 30, mountain: 20}, wasteland: 25, resources_rates: {'fruits': 100, 'roots': 100, 'fish': 100, 'meat': 100, 'wood': 100, 'stone': 100, 'iron': 100}, 'text': 'text'},
    'plain': {name: 'Plain',        land_rates: {shore: 30, fertile: 20, mountain: 10}, wasteland: 30, resources_rates: {'fruits': 50, 'roots': 200, 'fish': 75, 'meat': 150, 'wood': 75, 'stone': 150, 'iron': 100}, 'text': 'text'},
    'mountain': {name: 'Mountain',  land_rates: {shore: 30, fertile: 10, mountain: 30}, wasteland: 30, resources_rates: {'fruits': 150, 'roots': 75, 'fish': 50, 'meat': 150, 'wood': 50, 'stone': 200, 'iron': 100}, 'text': 'text'},
};

export const resources = {
    'fruits': {name: 'Fruits', is_nature: true, vegetation: true, locked_till: true, difficulty: 1, max_cap: 10000, regen: 1},
    'roots': {name: 'Roots', is_nature: true, vegetation: true, locked_till: 'field', difficulty: 1, max_cap: 7500, regen: 1.5},
    'fish': {name: 'Fish', is_nature: true, vegetation: false, locked_till: 'pier', difficulty: 1.5, max_cap: 5000, regen: 2},
    'meat': {name: 'Meat', is_nature: true, vegetation: false, locked_till: 'lodge', difficulty: 2, max_cap: 2500, regen: 2.5},

    'wood': {name: 'Wood', is_nature: true, vegetation: true, locked_till: true, difficulty: 1, max_cap: 10000, regen: 2},
    'stone': {name: 'Stone', is_nature: false, vegetation: false, locked_till: 'quarry', difficulty: 10, max_cap: 5000, regen: 0.1},
    'iron': {name: 'Iron', is_nature: false, vegetation: false, locked_till: 'mine', difficulty: 100, max_cap: 1000, regen: 0.01},
    'moai': {name: 'Moai', is_nature: false, vegetation: false, locked_till: 'ahu', difficulty: 100000, max_cap: 100, regen: 0.0}
};

export const items = {
    'meals': {name: 'Cooked Meal'},
    'stone_tools': {name: 'Stone Tools'},
    'iron_tools': {name: 'Iron Tools'},
    'human_meat': {name: 'Human Meat'},
    'legacy': {name: 'Legacy'},
    'heritage': {name: 'Heritage'},
};

export const ships = {
    'canoe': {name: 'Canoe',         crew: 1, speed: 10, capacity: 100, locked_till: true, cost: {'wood': 100}, text: 'A soup boat for one.'},
    'proa': {name: 'Proa',           crew: 2, speed: 8, capacity: 300, locked_till: 'sawmill', cost: {'wood': 250, 'iron': 10}, text: 'Reliable fast boat.'},
    'catamaran': {name: 'Catamaran', crew: 3, speed: 5, capacity: 1000, locked_till: 'forge', cost: {'wood': 500, 'iron_tools': 25}, text: 'Stable catamaran.'}
};

export const buildings = {
    'hut': {name: 'Hut', worker: null, build_on: 'any', cost: {'wood': 25}, locked_till: true, text: 'Home for Two.'},
    'house': {name: 'House', worker: null, build_on: 'any', cost: {'wood': 50, 'stone': 10, 'stone_tools': 10}, locked_till: 'workshop', text: 'Home for Five. Attracts new residents.'},

    'bonfire': {name: 'Bonfire', worker: 'cook', build_on: 'shore', cost: {'wood': 10}, locked_till: 'hut', text: 'Attracts new residents. Each bonfire accelerates the speed of one cook.'},
    'pier': {name: 'Pier', worker: 'fisherman', build_on: 'shore', cost: {'wood': 100, 'stone': 25}, locked_till: 'quarry', text: 'Provide fishing. Each pier accelerates the speed of one fisherman.'},
    'lighthouse': {name: 'Lighthouse', worker: 'sailor', build_on: 'shore', cost: {'wood': 100, 'stone': 50, 'stone_tools': 25}, locked_till: 'pier', text: 'The lighthouse allows longer sea trips and attracts traders.'},

    'garden': {name: 'Garden', worker: 'gardener', build_on: 'fertile', cost: {'fruits': 50}, locked_till: 'hut', text: 'Provide fruits. Each garden accelerates the speed of one gardener.'},
    'canal': {name: 'Canal', worker: 'aquarius', build_on: 'fertile', cost: {'meals': 100}, locked_till: 'garden', text: 'Each canal accelerates the speed of one aquarius.'},
    'field': {name: 'Field', worker: 'fielder', build_on: 'fertile', cost: {'wood': 50, 'meals': 50}, locked_till: 'canal', text: 'Provide roots. Each field accelerates the speed of one fielder.'},
    'sawmill': {name: 'Sawmill', worker: 'woodcutter', build_on: 'fertile', cost: {'wood': 200, 'iron': 50, 'stone_tools': 25}, locked_till: 'mine', text: 'Allows to build proa boats. Each sawmill accelerates the speed of one woodcutter.'},
    'lodge': {name: 'Lodge', worker: 'hunter', build_on: 'fertile', cost: {'wood': 250, 'stone': 100, 'iron_tools': 50}, locked_till: 'forge', text: 'Provide hunt. Each lodge accelerates the speed of one hunter.'},

    'quarry': {name: 'Quarry', worker: 'mason', build_on: 'mountain', cost: {'wood': 500}, locked_till: 'bonfire', text: 'Provide stone. Each quarry accelerates the speed of one mason.'},
    'mine': {name: 'Mine', worker: 'miner', build_on: 'mountain', cost: {'wood': 1000, 'stone_tools': 25}, locked_till: 'workshop', text: 'Provide iron and stone. Each mine accelerates the speed of one miner.'},

    'workshop': {name: 'Workshop', worker: 'master', build_on: 'any', cost: {'wood': 150, 'stone': 50}, locked_till: 'quarry', text: 'Allows to make stone tools. Each workshop accelerates the speed of one master.'},
    'forge': {name: 'Forge', worker: 'smith', build_on: 'any', cost: {'stone': 200, 'iron': 100, 'stone_tools': 100}, locked_till: 'mine', text: 'Allows to make iron tools and build catamarans. Each forge accelerates the speed of one smith.'},

    'ahu': {name: 'Ahu', worker: 'builder', build_on: 'any', cost: {'stone': 1000}, locked_till: 'quarry', text: 'Each Ahu allow to build Moai and accelerates the speed of one builder. Moai will attracts new residents.'},
};

export const professions = {
    'cook': {name: 'Cook', resource: null, home: 'bonfire', locked_till: 'bonfire', text: 'The cook makes cooked food from raw, consuming wood at the bonfire.'},
    'sailor': {name: 'Sailor', resource: null, home: 'lighthouse', locked_till: true, text: 'To swim in the sea is the life of sailors.'},
    'aquarius': {name: 'Aquarius', resource: null, home: 'canal', locked_till: 'canal', text: 'The aquarius improves the regeneration of natural resources: fruits, roots and wood.'},

    'gardener': {name: 'Gardener', resource: 'fruits', home: 'garden', locked_till: 'garden', text: 'The gardener produces fruits. The garden will improve its work.'},
    'fielder': {name: 'Fielder', resource: 'roots', home: 'field', locked_till: 'field', text: 'The fielder produces roots. The field will improve its work.'},
    'fisherman': {name: 'Fisherman', resource: 'fish', home: 'pier', locked_till: 'pier', text: 'The fisherman produces fish. The pier will improve its work.'},
    'hunter': {name: 'Hunter', resource: 'meat', home: 'lodge', locked_till: 'lodge', text: 'The hunter produces meat. The lodge will improve its work.'},

    'mason': {name: 'Mason', resource: 'stone', home: 'quarry', locked_till: 'quarry', text: 'The mason produces stone. The quarry will improve its work.'},
    'miner': {name: 'Miner', resource: 'iron', home: 'mine', locked_till: 'mine', text: 'The miner produces iron. The mine will improve its work and add stone to extraction.'},

    'master': {name: 'Master', resource: null, home: 'workshop', locked_till: 'workshop', text: 'The master produces stone tools. The workshop will improve its work.'},
    'woodcutter': {name: 'Woodcutter', resource: 'wood', home: 'sawmill', locked_till: 'hut', text: 'The woodcutter produces fruits. The sawmill will improve its work.'},
    'smith': {name: 'Smith', resource: null, home: 'forge', locked_till: 'forge', text: 'The smith produces iron tools. The forge will improve its work.'},

    'builder': {name: 'Builder', resource: 'moai', home: 'ahu', locked_till: 'ahu', text: 'Builders build the majestic statues Moai, the legacy of your civilization.'}
};
