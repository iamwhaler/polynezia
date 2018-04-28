
import _ from 'lodash';

import {resources} from '../gamedata/knowledge';

function chooser (state, items, func) {
    let raw = [];
    _.each(items, (item) => {
        if (state[item] > 0) {
            raw.push(item);
        }
    });
    if (raw.length > 0) {
        return func.call(this, state, _.sample(raw));
    }
    return state;
}

function burner(state, func) {
    return chooser.call(this, state, ['wood', 'coal'], function(state, selected) {
        if (_.random(1, selected === 'coal' ? 20 : 10) === 1) {
            state[selected]--;
        }
        return func.call(this, state);
    });
}

function digger(state, func) {
    return chooser.call(this, state, ['shovels'], function(state, selected) {
        if (_.random(1, 20) === 1) {
            console.log(selected);
            state[selected]--;
        }
        return func.call(this, state);
    });
}

function transformer(state, rates, production) {
    return chooser.call(this, state, _.keys(rates), function(state, selected) {
        state[selected]--;
        state[production] += rates[selected];
        return state;
    });
}

function productor(state, profession_key, func) {
    for (let i = 0; i < this.productivity(profession_key); i++) {
        state = func.call(this, state);
    }
    return state;
}

function getter(state, profession_key) {
    let profession = professions[profession_key];
    if (state.volumes[profession.resource] > 0) {
        let productivity = this.productivity(profession_key);
        if (state.human_meat > 0) { productivity *= 2; }

        for (let i = 0; i < productivity; i++) {
            state = get.call(this, state, profession_key);
        }
    }
    return state;
}

function get(state, profession_key) {
    let profession = professions[profession_key];

    let ecofactor = state.volumes[profession.resource] / state.caps[profession.resource];
    let difficulty = resources[profession.resource].difficulty;

    if (state.tools > 0) difficulty /= 2;
    if (state.instruments > 0) difficulty /= 3;

    let top = 1 + Math.round(difficulty / ecofactor);
    let chance = Math.ceil(_.random(1, top));

    if (state.tools > 0 && _.random(1, Math.floor((250 + (state.workshop * 100)) / (resources[profession.resource].vegetation ? 1 : 3))) === 1) {
        state['tools']--;
    }
    if (state.instruments > 0 && _.random(1, Math.floor((1000 + (state.forge * 250)) / (resources[profession.resource].is_nature ? 1 : 3))) === 1) {
        state['instruments']--;
    }

    if (chance === 1) {
        if (profession.resource === 'moai') {
            if (state.moai < state.ahu) {
                state[profession.resource]++;
                state.volumes[profession.resource]--;
            }
        }
        else {
            state[profession.resource]++;
            state.volumes[profession.resource]--;  // (((

            if (state.instruments > 0) {
                if (profession.resource !== 'moai' && _.random(1, 2) === 1) {
                    state.volumes[profession.resource]++; // (((
                }
            }

        }
    }
    return state;
}

export const professions = {
    'sailor': {name: 'Sailor', resource: null, home: false, locked_till: true, text: 'To swim in the sea is the life of sailors.', onTick: false},

    'cook': {name: 'Cook', resource: null, home: 'bonfire', locked_till: 'bonfire', text: 'The cook makes cooked food from raw, consuming wood at the bonfire.',
        onTick: function(state, profession_key) {
            return productor.call(this, state, profession_key, function(state) {
                return burner.call(this, state, function(state) {
                    return (_.random(1, 5) === 1) ?
                        state = transformer.call(this, state, {
                            'fruits': 2,
                            'roots': 2,
                            'fish': 3,
                            'meat': 3,
                            'human_meat': 3
                        }, 'meals')
                        : state;
                });
            })
        }},
    'fisherman': {name: 'Fisherman', resource: 'fish', home: 'pier', locked_till: 'pier', text: 'The fisherman produces fish. The pier will improve its work.', 
        onTick: function(state, profession_key) {
            return getter.call(this, state, profession_key); }},
    'navigator': {name: 'Navigator', resource: null, home: 'lighthouse', locked_till: 'lighthouse', text: 'Navigators maintain a beacon light, attracting traders and directing ships in distant wanderings.',
        onTick: function(state, profession_key) {
            return productor.call(this, state, profession_key,
                function(state) {
                    return burner.call(this, state,
                        function(state) { state.navigation++; return state; })})}},

    'keeper': {name: 'Gatherer', resource: 'fruits', home: 'orchard', locked_till: true, text: 'The gatherer produces fruits. The orchard will improve its work.',
        onTick: function(state, profession_key) {
            return getter.call(this, state, profession_key); }},
    'aquarius': {name: 'Aquarius', resource: null, home: 'canal', locked_till: 'canal', text: 'The aquarius improves the regeneration of natural resources: fruits, roots and wood.', onTick: false},
    'fielder': {name: 'Fielder', resource: 'roots', home: 'field', locked_till: 'field', text: 'The fielder produces roots, consuming shovels. The field will improve its work.',
        onTick: function(state, profession_key) {
                return productor.call(this, state, profession_key, function(state) {
                    return digger.call(this, state, function(state) {
                        return get.call(this, state, profession_key); })})}},
    'herdsman': {name: 'Herdsman', resource: null, home: 'pasture', locked_till: 'pasture', text: 'The herdsman produces meat and wool, consuming shovels. The pasture will improve its work.',
        onTick: function(state, profession_key) {
                return productor.call(this, state, profession_key,
                    function(state) { return digger.call(this, state,
                        function(state) { if (_.random(1, 100) === 1) { state['meat'] += 10; state['wool']++; } return state; }); })}},

    'hunter': {name: 'Hunter', resource: 'meat', home: 'lodge', locked_till: 'lodge', text: 'The hunter produces meat. The lodge will improve its work.',
        onTick: function(state, profession_key) {
            state = getter.call(this, state, profession_key);
            state = productor.call(this, state, profession_key,
                function(state) { if (_.random(1, 50) === 1) state['skin']++; return state; });
            return state;
        }},

    'mason': {name: 'Mason', resource: 'stone', home: 'quarry', locked_till: 'quarry', text: 'The mason produces stone, consuming shovels. The quarry will improve its work.',
        onTick: function(state, profession_key) {
            return productor.call(this, state, profession_key, function(state) {
                return digger.call(this, state, function(state) {
                    state = get.call(this, state, profession_key);
                    if (_.random(1, 50 * (state.island_type === 'mountain' ? 1 : 5)) === 1) state['obsidian']++;
                    return state;
                })})}},
    'woodcutter': {name: 'Woodcutter', resource: 'wood', home: 'sawmill', locked_till: true, text: 'The woodcutter produces wood. The sawmill will improve its work.',
        onTick: function(state, profession_key) {
            return getter.call(this, state, profession_key); }},
    'miner': {name: 'Miner', resource: 'iron', home: 'mine', locked_till: 'mine', text: 'The miner produces iron, consuming shovels. The mine will improve its work and add stone to extraction.',
        onTick: function(state, profession_key) {
            return productor.call(this, state, profession_key, function(state) {
                return digger.call(this, state, function(state) {
                    state = get.call(this, state, profession_key);
                    state = productor.call(this, state, profession_key,
                        function(state) { if (_.random(1, 50) === 1) state['stone']++; return state; });
                    state = productor.call(this, state, profession_key,
                        function(state) { if (_.random(1, 25) === 1) state['coal']++ ; return state; });
                    return state;
                })})}},

    'carpenter': {name: 'Carpenter', resource: null, home: 'carpentry', locked_till: 'carpentry', text: 'The carpenter produces shovels. The carpentry will improve its work.',
        onTick: function(state, profession_key) {
            return productor.call(this, state, profession_key,
                function(state) { return (_.random(1, 15) === 1) ? transformer.call(this, state, {'wood': 1}, 'shovels') : state; }); }},
    'master': {name: 'Master', resource: null, home: 'workshop', locked_till: 'workshop', text: 'The master produces stone tools. The workshop will improve its work.',
        onTick: function(state, profession_key) {
            return productor.call(this, state, profession_key,
                function(state) { return (_.random(1, 30) === 1) ? transformer.call(this, state, {'stone': 1, 'obsidian': 2}, 'tools') : state; }); }},
    'smith': {name: 'Smith', resource: null, home: 'forge', locked_till: 'forge', text: 'The smith produces iron tools. The forge will improve its work.',
        onTick: function(state, profession_key) {
            return productor.call(this, state, profession_key,
                function(state) { return (_.random(1, 50) === 1) ? transformer.call(this, state, {'iron': 2, 'obsidian': 1}, 'instruments') : state; }); }},
    'armorer': {name: 'Armorer', resource: null, home: 'armory', locked_till: 'armory', text: 'The armorer produces armor from iron, wool or skin. The armory will improve its work.',
        onTick: function(state, profession_key) {
            return productor.call(this, state, profession_key,
                function(state) { return burner.call(this, state,
                    function(state) { return (_.random(1, 100) === 1) ? transformer.call(this, state, {'iron': 2, 'wool': 1, 'skin': 1}, 'armor') : state; }); })}},

    'builder': {name: 'Builder', resource: 'moai', home: 'ahu', locked_till: 'ahu', text: 'Builders build the majestic statues Moai, the legacy of your civilization.',
        onTick: function(state, profession_key) { return getter.call(this, state, profession_key); }}
};
