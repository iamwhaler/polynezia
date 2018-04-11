
export const resources = {
    'fruits': {name: 'Fruits', is_nature: true, locked_till: true, difficulty: 1, max_cap: 10000, regen: 1},
    'roots': {name: 'Roots', is_nature: true, locked_till: 'field', difficulty: 1, max_cap: 10000, regen: 2},
    'fish': {name: 'Fish', is_nature: true, locked_till: 'pier', difficulty: 1.5, max_cap: 10000, regen: 3},
    'wildfowl': {name: 'Meat', is_nature: true, locked_till: 'lodge', difficulty: 2, max_cap: 10000, regen: 4},

    'wood': {name: 'Wood', is_nature: true, locked_till: true, difficulty: 2, max_cap: 10000, regen: 2},
    'stone': {name: 'Stone', is_nature: false, locked_till: 'quarry', difficulty: 10, max_cap: 2500, regen: 0.1},
    'iron': {name: 'Iron', is_nature: false, locked_till: 'mine', difficulty: 100, max_cap: 500, regen: 0.01},
    'moai': {name: 'Moai', is_nature: false, locked_till: 'ahu', difficulty: 1000, max_cap: 1, regen: 0.0}
};

export const items = {
    'meals': {name: 'Cooked Meal'},
    'tools': {name: 'Tools'},
    'human_meat': {name: 'Human Meat'},
};

export const buildings = {
    'hut': {name: 'Hut', cost: {'wood': 50}, locked_till: true, text: 'Home for Two.'},
    'house': {name: 'House', cost: {'wood': 100, 'stone': 10}, locked_till: 'mine', text: 'Home for Five.'},
    'bonfire': {name: 'Bonfire', cost: {'wood': 10}, locked_till: 'hut', text: 'Attracts new residents. Each bonfire accelerates the speed of one cook.'},
    'keep': {name: 'Keep', cost: {'wood': 100}, locked_till: 'garden', text: 'Increases living nature regeneration. Each field accelerates the speed of one keeper.'},

    'garden': {name: 'Garden', cost: {'fruits': 10}, locked_till: 'hut', text: 'Provide fruits. Each garden accelerates the speed of one gardener.'},
    'field': {name: 'Field', cost: {'wood': 100}, locked_till: 'keep', text: 'Provide roots. Each field accelerates the speed of one fielder.'},
    'pier': {name: 'Pier', cost: {'wood': 100, 'stone': 10}, locked_till: 'quarry', text: 'Provide fist. Each pier accelerates the speed of one fisherman.'},
    'lodge': {name: 'Lodge', cost: {'wood': 100, 'iron': 10}, locked_till: 'mine', text: 'Provide hunt. Each lodge accelerates the speed of one hunter.'},

    'sawmill': {name: 'Sawmill', cost: {'wood': 250, 'iron': 10}, locked_till: 'mine', text: 'Each sawmill accelerates the speed of one woodcutter.'},
    'quarry': {name: 'Quarry', cost: {'wood': 1000}, locked_till: 'bonfire', text: 'Provide stone. Each quarry accelerates the speed of one mason.'},
    'mine': {name: 'Mine', cost: {'wood': 1000, 'stone': 100}, locked_till: 'quarry', text: 'Provide iron and stone. Each mine accelerates the speed of one miner.'},
    'forge': {name: 'Forge', cost: {'stone': 100, 'iron': 50}, locked_till: 'mine', text: 'Each forge accelerates the speed of one smith.'},

    'ahu': {name: 'Ahu', cost: {'stone': 1000}, locked_till: 'mine', text: 'Each Ahu accelerates the speed of one moai builder. Moai will attracts new residents.'},
};

export const professions = {
    'cook': {resource: null, home: 'bonfire', locked_till: 'bonfire'},
    'keeper': {resource: null, home: 'keep', locked_till: 'keep'},

    'gardener': {resource: 'fruits', home: 'garden', locked_till: 'garden'},
    'fielder': {resource: 'roots', home: 'field', locked_till: 'field'},
    'fisherman': {resource: 'fish', home: 'pier', locked_till: 'pier'},
    'hunter': {resource: 'wildfowl', home: 'lodge', locked_till: 'lodge'},

    'woodcutter': {resource: 'wood', home: 'sawmill', locked_till: 'hut'},
    'mason': {resource: 'stone', home: 'quarry', locked_till: 'quarry'},
    'miner': {resource: 'iron', home: 'mine', locked_till: 'mine'},
    'smith': {resource: null, home: 'forge', locked_till: 'forge'},

    'builder': {resource: 'moai', home: 'ahu', locked_till: 'ahu'}
};
