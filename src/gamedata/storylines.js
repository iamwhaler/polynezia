
import _ from 'lodash';

import {start_island, island_types, goods} from '../gamedata/knowledge';
import StorylineTool from '../engine/StorylineTool';



function collect(state, resource_key) {
  //  console.log(resource_key);
    let count = {'fruits': 10, 'wood': 1, 'tools': 1, 'meals': 1, 'roots': 10}[resource_key];
    //let count = resource_key === 'wood' ? 1 : 10;

    if (state.volumes[resource_key] > count) {
        state[resource_key] += count;
        state.volumes[resource_key] -= count;
        return state;
    }
    return state;
};


function storm(state, strategy = 'normal', gear = false) {
    let modifer = {'safe': 2, 'normal': 5, 'fast': 10}[strategy] * (gear ? 1 : 2);
    let cargo = {};
    let loss = {};

    _.each(goods, (key) => {
        cargo[key] = state[key];
    });

    _.each(_.keys(cargo), (key) => {
        if (_.random(0, 5 * cargo.length * (gear ? 2 : 1)) === 0) {
            let loosed = Math.floor(state[key] * 0.01 * modifer);
            loss[key] = loosed;
            state[key] -= loosed;
        }
    });

    state.weather++;
    state.storm_loss = 'Storm loss: ' + this.drawCost(loss);

    return state;
};


class prologue {
    static init(state) {
        console.log(this);

        state.environment = 'start';
        return state;
    }
    static story = {
        'start': {
            text: `You woke up from a sharp push. Part of the roof of your house collapsed and through the hole you see clouds of smoke. "I need to run to the pier to my brother's Proa boat" you thought.`,
            'on_enter': null,
            'on_tick': null,
            'actions': [
                {text: 'Take gold', style: 'btn-info', 'next': 'heritage'},
                {text: 'Search for Tools', style: 'btn-info', 'next': 'tools_street'},
                {text: 'Run out into street', style: 'btn-info', 'next': 'fast_street'}
            ]
        },
        'heritage': {
            text: `You went into the next room and took some gold. In the room you met your uncle Hohepa, he handed you an ancient family relic. "Keep it!" he said.`,
            'on_enter': function(state) { state.heritage = 1; state.gold = 10; return state; },
            'actions': [
                {text: 'Call uncle with you', style: 'btn-info', 'next': 'uncle_street'},
                {text: 'Run to pier', style: 'btn-info', 'next': 'heritage_street'}
            ]
        },
        'uncle_street': {
            text: `You called your uncle Hohepa with you. Briefly glancing at you, he nodded and left after you into the yard. "My canoes in shipyard" he said. When you went out into the yard, you saw the body of your neighbor. Half of the body and legs were crushed by a huge stone. Looking back, you saw that the mountain you were walking on as a child woke up and spewed out the fire. Next to your friend's body is a backpack.`,
            'on_enter': function(state) { state.population++; state.sailor++; return state; },
            'actions': [
                {text: 'Take backpack', style: 'btn-info', 'next': 'slow_shipyard'},
                {text: 'Run to shipyard', style: 'btn-info', 'next': 'shipyard'}
            ]
        },
        'slow_shipyard': {
            text: `The last canoes remained at the shipyard. You are lucky that there is at least something left. At the bottom of your canoe you found some wood and animal skins. There is no time to unload - so we sail.`,
            'on_enter': function(state) { state.canoe += 2; state.wood += 20; state.skin += 10; return state; },
            'actions': [
                {text: 'Sail away!', style: 'btn-info', 'next': 'end'},
            ]
        },
        'shipyard': {
            text: `At the shipyards there were excellent covered canoes. The canoe uncle was well equipped, in yours there was a stock of peat, which you did not have time to unload. Let's swim so.`,
            'on_enter': function(state) { state.canoe += 2; state.tools += 2; state.instruments += 1; return state; },
            'actions': [
                {text: 'Sail away!', style: 'btn-info', 'next': 'end'},
            ]
        },
        'heritage_street': {
            text: `An ancient relic in your bosom has added confidence to you. Perhaps now you do not fear a fire, you just need to get out of the village. When you went out into the yard, you saw the body of your neighbor. Half of the body and legs were crushed by a huge stone. Looking back, you saw that the mountain you were walking on as a child woke up and spewed out the fire. Next to your friend's body is a backpack.`,
            'actions': [
                {text: 'Take backpack', style: 'btn-info', 'next': 'take_backpack'},
                {text: 'Run to pier', style: 'btn-info', 'next': 'fast_pier'}
            ]
        },
        'tools_street': {
            text: `You carefully put all the tools that you had in your backpack. Mining, fishing or hunting - you are ready for everything. When you went out into the yard, you saw the body of your neighbor. Half of the body and legs were crushed by a huge stone. Looking back, you saw that the mountain you were walking on as a child woke up and spewed out the fire. Next to your friend's body is a backpack.`,
            'on_enter': function(state) { state.tools += 10; return state; },
            'actions': [
                {text: 'Take backpack', style: 'btn-info', 'next': 'take_backpack'},
                {text: 'Run to pier', style: 'btn-info', 'next': 'fast_pier'}
            ]
        },
        'take_backpack': {
            text: `You picked up a backpack. He was full of cooked food. "Very opportunely, thank you Patakiri".`,
            'on_enter': function(state) { state.meals += 50; return state; },
            'actions': [
                {text: 'Run to pier', style: 'btn-info', 'next': 'too_slow_pier'}
            ]
        },
        'fast_street': {
            text: `Sharply opening the door, you jumped into the yard ... and ran into your neighbor and childhood friend Patakiri. The joy of the meeting was a second - a few meters from you fell a huge stone, throwing you to the ground! Smoke puffed from the top of the mountain. Without delay, Patakiri got up and ran further towards the fishing creek, gesturing for you. "I packed the breakfast!" he shouted.`,
            'on_enter': function(state) { state.luck++; return state; },
            'actions': [
                {text: 'Run to fishing harbor', style: 'btn-info', 'next': 'friend_pier'},
                {text: 'Run to pier', style: 'btn-info', 'next': 'fast_pier'}
            ]
        },
        'friend_pier': {
            text: `Having run into the fishing harbor you hopped into the first boats that came across. You got a boat with fish. "It might come in handy," you thought.`,
            'on_enter': function(state) { state.population++; state.sailor++; state.canoe += 2; state.meals += 50; state.fish += 50; return state; },
            'actions': [
                {text: 'Sail away!', style: 'btn-info', 'next': 'end'},
            ]
        },
        'fast_pier': {
            text: `When you ran to the pier, you saw a widely deployed sail on your brother's Proa boat. After jumping from a run into the boat, you rushed into the arms of your brother. "I took some vegetables," said the brother. It was clear that he was waiting for you and was worried.`,
            'on_enter': function(state) { state.population++; state.sailor++; state.proa += 1; state.vegetables += 50; return state; },
            'actions': [
                {text: 'Sail away!', style: 'btn-info', 'next': 'end'},
            ]
        },
        'too_slow_pier': {
            text: `When you ran to the pier, you saw a widely deployed sail on your brother's Proa boat, which sailed too far into the sea. "Too late!" you thought. On the bank there is only your old broken canoe. It was necessary to take care of him more carefully. I'll have to repair it in a hurry now.`,
            'actions': [
                {text: 'Repare old canoe', style: 'btn-info', 'next': 'too_slow_pier_repair'},
            ]
        },
        'too_slow_pier_repair': {
            text: `Fortunately for you, the canoe is not in the worst condition and you need to plug only a few large holes.`,
            'on_enter': function(state) { state.splash_counter = 12; return state; },
            'on_tick': function(state) { return state.splash_counter <= 0 ? StorylineTool.step.call(this, state, 'too_slow_pier_sail') : state; },
            'actions': []
        },
        'too_slow_pier_sail': {
            text: `Canoe is ready to sail!`,
            'on_enter': function(state) { state.canoe += 1; return state; },
            'actions': [
                {text: 'Sail away!', style: 'btn-info', 'next': 'end'},
            ]
        },
        'end': {
            text: ``,
            'on_enter': function(state) {
                return this.storylineStart(state, 'first_travel');
            },
            'on_tick': null,
            'actions': []
        }
    }
}


class resettlement {
    static init(state) {
        state.firs_slide = false;
        state.trip_long = 4; //Math.floor((30 + this.getFleetPower() )  / this.fleetSpeed());
        state.trip_duration = state.trip_long;
        state.weather = 40; // 0 - storm, 100 - sun
        state.fishing_tools = 0;
        state.storm_set = 0;
        console.log({'state.trip_duration': state.trip_duration, 'state.weather': state.weather});
        return state;
    }

    static story = {
        'start': {
            text: `You sail from the island. Take a fishing tackle, storm set or sail light?`,
            'on_enter': function(state) {
                state.environment = 'departure';
                state.embarked = false;
                state.in_sea = true;
                return state;
            },
            'on_tick': null,
            'actions': [
                {text: 'Fishing Rods', style: 'btn-info', on_click: function(state) { state.fishing_tools = 1; return StorylineTool.step.call(this, state, 'selector'); }},
                {text: 'Storm Set', style: 'btn-info', on_click: function(state) { state.storm_set = 1; return StorylineTool.step.call(this, state, 'selector'); }},
                {text: 'Sail Light', style: 'btn-info', on_click: function(state) { state.trip_duration *= 0.75; return StorylineTool.step.call(this, state, 'selector'); }},
            ]
        },
        'selector': {
            text: ``,
            'on_enter': function(state) {
                if (state.trip_duration <= 0) {
                    return StorylineTool.step.call(this, state, 'end');
                }
                else {
                    state.trip_duration--;
                    return StorylineTool.step.call(this, state, _.random(1, 100) > state.weather ? 'storm' :  _.random(1, 3) === 1 ? 'rainy' :  'calm');
                }
            },
            'on_tick': null,
            'actions': []
        },
        'calm': {
            text: `Wonderful weather. You can fish, swim slowly or row at your best.`,
            'on_enter': function(state) {
                state.environment = 'calm';
                state.in_sea = true;
                state.weather -= 5;
                return state;
            },
            'on_tick': null,
            'actions': [
                {text: 'Fishing', style: 'btn-info', on_click: function(state) { state.trip_duration++; state.weather -= 5; return StorylineTool.step.call(this, state, 'fishing'); }},
                {text: 'Swim Slowly', style: 'btn-info', on_click: function(state) { return StorylineTool.step.call(this, state, 'swim_slowly'); }},
                {text: 'Row Fast', style: 'btn-info', on_click: function(state) { state.trip_duration--; state.weather--; return StorylineTool.step.call(this, state, 'row_fast'); }},
            ]
        },
        'fishing': {
            text: `Your fleet is fishing.`,
            'on_enter': function(state) {
                state.splash_counter = Math.floor((20+(state.navigation * 20)) / this.fleetSpeed());
                return state;
            },
            'on_tick': function(state) {
                if (state.splash_counter <= 0) {
                    state = StorylineTool.step.call(this, state, 'selector');
                }
                else {
                    state.fish += (state.fishing_tools ? 5 : 3) * this.getFleetPower();
                }
                return state;
            },
            'actions': []
        },
        'rainy': {
            text: `Light rain like a looming storm. However, fishing under this best.`,
            'on_enter': function(state) {
                state.environment = 'rain_in_sea';
                state.in_sea = true;
                state.weather -= 10;
                return state;
            },
            'on_tick': null,
            'actions': [
                {text: 'Fishing', style: 'btn-info', on_click: function(state) { state.weather -= 10; return StorylineTool.step.call(this, state, 'rainy_fishing'); }},
                {text: 'Swim Away', style: 'btn-info', on_click: function(state) { state.weather += 10; state.trip_duration++; return StorylineTool.step.call(this, state, 'try_to_escape'); }},
                {text: 'Swim Straight', style: 'btn-info', on_click: function(state) { state.weather -= 5; return StorylineTool.step.call(this, state, 'swim_straight'); }},
            ]
        },
        'rainy_fishing': {
            text: `Your fleet is fishing under rain.`,
            'on_enter': function(state) {
                state.splash_counter = Math.floor((20+(state.navigation * 20)) / this.fleetSpeed());
                return state;
            },
            'on_tick': function(state) {
                if (state.splash_counter <= 0) {
                    state = StorylineTool.step.call(this, state, 'selector');
                }
                else {
                    state.fish += state.fishing_tools ? 9 : 5 * this.getFleetPower();
                }
                return state;
            },
            'actions': []
        },
        'swim_slowly': {
            text: `Your fleet is sailing slowly, saving energy.`,
            'on_enter': function(state) { state.splash_counter = Math.floor((50+(state.navigation * 20)) / this.fleetSpeed()); return state; },
            'on_tick': function(state) { return state.splash_counter <= 0 ? StorylineTool.step.call(this, state, 'selector') : state; },
            'actions': []
        },
        'row_fast': {
            text: `Your fleet is swift with all its might.`,
            'on_enter': function(state) { state.splash_counter = Math.floor((20+(state.navigation * 10)) / this.fleetSpeed()); return state; },
            'on_tick': function(state) { return state.splash_counter <= 0 ? StorylineTool.step.call(this, state, 'selector') : state; },
            'actions': []
        },
        'storm': {
            text: `The storm is all around you. You can try to escape from the storm or swim carefully.`,
            'on_enter': function(state) {
                state.environment = 'storm';
                state.in_sea = true;
                state.weather += 15;
                return state;
            },
            'on_tick': function(state) {
                return storm(state, 'normal', state.storm_set);
            },
            'actions': [
                {text: 'Try to Escape', style: 'btn-info', on_click: function(state) { state.weather += 20; state.trip_duration += 2; return StorylineTool.step.call(this, state, 'try_to_escape'); }},
                {text: 'Swim Carefully', style: 'btn-info', on_click: function(state) { state.weather += 5; state.trip_duration++; return StorylineTool.step.call(this, state, 'swim_carefully'); }},
                {text: 'Swim Straight', style: 'btn-info', on_click: function(state) {  state.weather -= 5; return StorylineTool.step.call(this, state, 'swim_straight'); }},
            ]
        },
        'try_to_escape': {
            text: `Your fleet is trying to swim out of the heart of the storm.`,
            'on_enter': function(state) { state.splash_counter = Math.floor((20+(state.navigation * 10)) / this.fleetSpeed()); return state; },
            'on_tick': function(state) { return state.splash_counter <= 0 ? StorylineTool.step.call(this, state, 'selector') : storm.call(this, state, 'normal', state.storm_set); },
            'actions': []
        },
        'swim_carefully': {
            text: `Your fleet is trying to sail through the storm carefully.`,
            'on_enter': function(state) { state.splash_counter = Math.floor((50+(state.navigation * 20)) / this.fleetSpeed()); return state; },
            'on_tick': function(state) { return state.splash_counter <= 0 ? StorylineTool.step.call(this, state, 'selector') : storm.call(this, state, 'slow', state.storm_set); },
            'actions': []
        },
        'swim_straight': {
            text: `Your fleet sails through the storm, despising dangers.`,
            'on_enter': function(state) { state.splash_counter = Math.floor((20+(state.navigation * 10)) / this.fleetSpeed()); return state; },
            'on_tick': function(state) { return state.splash_counter <= 0 ? StorylineTool.step.call(this, state, 'selector') : storm.call(this, state, 'fast', state.storm_set); },
            'actions': []
        },
        'end': {
            text: `Your ship boarded on the inhabitant island.`,
            'on_enter': function(state) {
                state.environment = 'shore';
                state.fishing_tools = 0;
                state.storm_set = 0;

                return this.generateIsland(state, island_types[_.sample(_.keys(island_types))]);
            },
            'on_tick': null,
            'actions': [
                {text: 'Disembark', style: 'btn-info', on_click: function(state) { state.in_sea = false; return this.storylineStart(state, 'island'); }}
            ]
        }
    }
};


const first_travel = _.cloneDeep(resettlement);
first_travel.story.start = {
    text: `You row, holding the paddle with trembling hands. All your thoughts are occupied with family and friends. Did they survive?.`,
        'on_enter': function(state) {
        state.environment = 'departure';
        state.embarked = false;
        state.in_sea = true;
        return this.loadToFleet(state);
    },
        'on_tick': null,
        'actions': [
        {text: 'Wait for uncle', style: 'btn-info', next: 'waiting'},
        {text: 'Row Fast', style: 'btn-info', on_click: function(state) { state.trip_duration--; state.weather += 10; return StorylineTool.step.call(this, state, 'selector'); }},
    ]
};
first_travel.story.waiting = {
    text: `After some time, my uncle caught up with you in a canoe. "I took fishing gear," said Uncle.`,
    'on_enter': function(state) { state.population++; state.sailor++; state.canoe++; state.fishing_tools++; return state; },
        'on_tick': null,
        'actions': [
        {text: 'Row', style: 'btn-info', next: 'selector'},
    ]
};
first_travel.story.end = {
    text: `Your ship boarded on the inhabitant island.`,
        'on_enter': function(state) {
        state.environment = 'shore';
        state.fishing_tools = 0;
        state.storm_set = 0;

        state = this.generateIsland(state, start_island);

        return state;
    },
        'on_tick': null,
        'actions': [
        {text: 'Disembark', style: 'btn-info', on_click: function(state) { state.in_sea = false; return this.storylineStart(state, 'island'); }}
    ]
};


class island {
    static init(state) {
        state.embarked = true;
        state.environment = 'embarked';
        return state;
    }
    static story = {
        'start': {
            text: `You landed on the shore. There are fruit trees all around.`,
            'on_enter': null,
            'on_tick': null,
            'actions': [
                {text: 'Collect Fruits', style: 'btn-info', on_click: function(state) { return collect.call(this, state, 'fruits'); }},
                {text: 'Collect Wood', style: 'btn-info', on_click: function(state) { return collect.call(this, state, 'wood'); }},
            ]
        },
        'selector': {
            text: ``,
            'on_enter': function(state) { return this.storylineStart(state, 'resettlement'); },
            'on_tick': null,
            'actions': []
        }
    }
};


export const storylines = {
    'prologue': prologue,
    'first_travel': first_travel,
    'resettlement': resettlement,
    'island': island,
};
