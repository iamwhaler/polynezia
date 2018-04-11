
export const resources = {
    'fruits': {name: 'Fruits', is_nature: true, locked_till: true, difficulty: 1, max_cap: 10000, regen: 1},
    'roots': {name: 'Roots', is_nature: true, locked_till: 'field', difficulty: 1, max_cap: 10000, regen: 1.5},
    'fish': {name: 'Fish', is_nature: true, locked_till: 'pier', difficulty: 1.5, max_cap: 10000, regen: 2},
    'wildfowl': {name: 'Meat', is_nature: true, locked_till: 'lodge', difficulty: 2, max_cap: 10000, regen: 2.5},

    'wood': {name: 'Wood', is_nature: true, locked_till: true, difficulty: 1, max_cap: 10000, regen: 2},
    'stone': {name: 'Stone', is_nature: false, locked_till: 'quarry', difficulty: 10, max_cap: 2500, regen: 0.1},
    'iron': {name: 'Iron', is_nature: false, locked_till: 'mine', difficulty: 100, max_cap: 500, regen: 0.01},
    'moai': {name: 'Moai', is_nature: false, locked_till: 'ahu', difficulty: 10000, max_cap: 100, regen: 0.0}
};

export const items = {
    'meals': {name: 'Cooked Meal'},
    'tools': {name: 'Tools'},
    'human_meat': {name: 'Human Meat'},
};

export const buildings = {
    'hut': {name: 'Hut', worker: null, cost: {'wood': 50}, locked_till: true, text: 'Home for Two.'},
    'house': {name: 'House', worker: null, cost: {'wood': 100, 'stone': 10}, locked_till: 'quarry', text: 'Home for Five.'},
    'bonfire': {name: 'Bonfire', worker: 'cook', cost: {'wood': 10}, locked_till: 'hut', text: 'Attracts new residents. Each bonfire accelerates the speed of one cook.'},
    'keep': {name: 'Keep', worker: 'keeper', cost: {'wood': 100}, locked_till: 'garden', text: 'Increases living nature regeneration. Each field accelerates the speed of one keeper.'},

    'garden': {name: 'Garden', worker: 'gardener', cost: {'fruits': 10}, locked_till: 'hut', text: 'Provide fruits. Each garden accelerates the speed of one gardener.'},
    'field': {name: 'Field', worker: 'fielder', cost: {'wood': 100}, locked_till: 'keep', text: 'Provide roots. Each field accelerates the speed of one fielder.'},
    'pier': {name: 'Pier', worker: 'fisherman', cost: {'wood': 100, 'stone': 10}, locked_till: 'quarry', text: 'Provide fist. Each pier accelerates the speed of one fisherman.'},
    'lodge': {name: 'Lodge', worker: 'hunter', cost: {'wood': 100, 'iron': 10}, locked_till: 'forge', text: 'Provide hunt. Each lodge accelerates the speed of one hunter.'},

    'sawmill': {name: 'Sawmill', worker: 'woodcutter', cost: {'wood': 250, 'iron': 10}, locked_till: 'mine', text: 'Each sawmill accelerates the speed of one woodcutter.'},
    'quarry': {name: 'Quarry', worker: 'mason', cost: {'wood': 500}, locked_till: 'bonfire', text: 'Provide stone. Each quarry accelerates the speed of one mason.'},
    'mine': {name: 'Mine', worker: 'miner', cost: {'wood': 1000, 'stone': 100}, locked_till: 'quarry', text: 'Provide iron and stone. Each mine accelerates the speed of one miner.'},
    'forge': {name: 'Forge', worker: 'smith', cost: {'stone': 100, 'iron': 50}, locked_till: 'mine', text: 'Each forge accelerates the speed of one smith.'},

    'ahu': {name: 'Ahu', worker: 'builder', cost: {'stone': 1000}, locked_till: 'mine', text: 'Each Ahu accelerates the speed of one moai builder. Moai will attracts new residents.'},
};

export const professions = {
    'cook': {name: 'Cook', resource: null, home: 'bonfire', locked_till: 'bonfire', text: 'The cook makes cooked food from raw, consuming wood at the bonfire.'},
    'keeper': {name: 'Keeper', resource: null, home: 'keep', locked_till: 'keep', text: 'The keeper improves the regeneration of natural resources: fruits, roots, fish, animals and wood.'},

    'gardener': {name: 'Gardener', resource: 'fruits', home: 'garden', locked_till: 'garden', text: 'The gardener produces fruits. The garden will improve its work.'},
    'fielder': {name: 'Fielder', resource: 'roots', home: 'field', locked_till: 'field', text: 'The fielder produces roots. The field will improve its work.'},
    'fisherman': {name: 'Fisherman', resource: 'fish', home: 'pier', locked_till: 'pier', text: 'The fisherman produces fish. The pier will improve its work.'},
    'hunter': {name: 'Hunter', resource: 'wildfowl', home: 'lodge', locked_till: 'lodge', text: 'The hunter produces meat. The lodge will improve its work.'},

    'woodcutter': {name: 'Woodcutter', resource: 'wood', home: 'sawmill', locked_till: 'hut', text: 'The woodcutter produces fruits. The sawmill will improve its work.'},
    'mason': {name: 'Mason', resource: 'stone', home: 'quarry', locked_till: 'quarry', text: 'The mason produces stone. The quarry will improve its work.'},
    'miner': {name: 'Miner', resource: 'iron', home: 'mine', locked_till: 'mine', text: 'The miner produces iron. The mine will improve its work and add stone to extraction.'},
    'smith': {name: 'Smith', resource: null, home: 'forge', locked_till: 'forge', text: 'The smith produces tools. The garden will improve its work.'},

    'builder': {name: 'Builder', resource: 'moai', home: 'ahu', locked_till: 'ahu', text: 'Builders build the majestic statues Moai, the legacy of your civilization.'}
};
