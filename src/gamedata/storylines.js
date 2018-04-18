
import _ from 'lodash';

import {start_island, island_types} from '../gamedata/knowledge';


export const storylineStart = (state, app, storyline_key) => {
    let storyline = storylines[storyline_key];
    console.log(storyline_key, storyline);

    state.storyline = true;
    state.storyline_name = storyline_key;
    if (storyline.init) {
        state = storyline.init(state, app);
    }
    state = storylineStep(state, app, 'start');
    return state;
};

export const  storylineStep = (state, app, step) => {
  //  console.log(step);
    state.storyline_step = step;
    console.log(state.storyline_name, state.storyline_step);
    if (storylines[state.storyline_name].story[state.storyline_step].on_enter) {
        console.log({'storylineStepExecute': step});
        return storylines[state.storyline_name].story[state.storyline_step].on_enter(state, app);
    }
    else {
        console.log({'storylineStep': step});
    }
    return state;
};


const collect = (state, app, resource_key) => {
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


const storm = (state, app, strategy = 'normal', gear = false) => {
    let modifer = 2 + {'safe': 1, 'normal': 3, 'fast': 5}[strategy] + gear ? 0 : 3;



    return state;
};


export const prologue = {
    init: (state, app) => {
        state.environment = 'start';
    //    state.embarked = true;
        console.log({'state.trip_duration': state.trip_duration, 'state.weather': state.weather});
        return state;
    },
    story: {
        'start': {
            'text': `Your island is shaking from a volcanic eruption. You need to run to the boat. What will you take with you?`,
            'on_enter': null,
            'on_tick': null,
            'actions': [
                {
                    'text': 'Collect Belongings', style: 'btn-info', 'on_click': (state, app) => {
                    state.heritage = 10;
                    state.legacy = 1;
                    state.vegetables = 10;
                    state.wood = 10;
                    return storylineStep(state, app, 'end'); }
                },
                { 'text': 'Grab Tools', style: 'btn-info', 'on_click': (state, app) => { state.tools = 5; return storylineStep(state, app, 'end'); }},
                { 'text': 'Grab Meals', style: 'btn-info', 'on_click': (state, app) => { state.meals += 50; return storylineStep(state, app, 'end'); }},
            ]
        },
        'end': {
            'text': ``,
            'on_enter': (state, app) => {
                return storylineStart(state, app, 'first_travel');
            },
            'on_tick': null,
            'actions': [
                {'text': 'Disembark', style: 'btn-info', 'on_click': (state, app) => { state.in_sea = false; return storylineStart(state, app, 'island'); }}
            ]
        }
    }
};

export const first_travel = {
    init: (state, app) => {
        state.firs_slide = false;
        state.trip_long = Math.floor(50  / app.fleetSpeed());
        state.trip_duration = state.trip_long;
        state.weather = 40; // 0 - storm, 100 - sun
        console.log({'state.trip_duration': state.trip_duration, 'state.weather': state.weather});
        return state;
    },
    story: {
        'start': {
            'text': `You row, holding the paddle with trembling hands. All your thoughts are occupied with family and friends. Did they survive?.`,
            'on_enter': (state, app) => {
                state.environment = 'departure';
                state.embarked = false;
                state.in_sea = true;
                return state;
            },
            'on_tick': null,
            'actions': [
                {'text': 'Swim Slowly', style: 'btn-info', 'on_click': (state, app) => { return storylineStep(state, app, 'storm'); }},
                {'text': 'Row Fast', style: 'btn-info', 'on_click': (state, app) => { state.trip_duration--; state.weather--; return storylineStep(state, app, 'selector'); }},
            ]
        },
        'selector': {
            'text': ``,
            'on_enter': (state, app) => {
                if (state.trip_duration <= 0) {
                    return storylineStep(state, app, 'end');
                }
                else {
                    state.trip_duration--;
                    return storylineStep(state, app, _.random(1, 100) > state.weather ? 'storm' :  _.random(1, 3) === 1 ? 'rainy' :  'calm');
                }
            },
            'on_tick': null,
            'actions': []
        },
        'calm': {
            'text': `Wonderful weather. You can fish, swim slowly or row at your best.`,
            'on_enter': (state, app) => {
                state.environment = 'calm';
                state.in_sea = true;
                return state;
            },
            'on_tick': null,
            'actions': [
                {'text': 'Fishing', style: 'btn-info', 'on_click': (state, app) => { state.trip_duration++; state.weather -= 5; return storylineStep(state, app, 'fishing'); }},
                {'text': 'Swim Slowly', style: 'btn-info', 'on_click': (state, app) => { return storylineStep(state, app, 'swim_slowly'); }},
                {'text': 'Row Fast', style: 'btn-info', 'on_click': (state, app) => { state.trip_duration--; state.weather--; return storylineStep(state, app, 'row_fast'); }},
            ]
        },
        'fishing': {
            'text': `Your fleet is fishing.`,
            'on_enter': (state, app) => {
                state.splash_counter = Math.floor((20+(state.navigation * 20)) / app.fleetSpeed());
                return state;
            },
            'on_tick': (state, app) => {
                if (state.splash_counter <= 0) {
                    state = storylineStep(state, app, 'selector');
                }
                else {
                    state.fish += state.fishing_tools ? 3 : 2 * app.getFleetPower();
                }
                return state;
            },
            'actions': []
        },
        'rainy': {
            'text': `Light rain like a looming storm. However, fishing under this best.`,
            'on_enter': (state, app) => {
                state.environment = 'rain_in_sea';
                state.in_sea = true;
                return state;
            },
            'on_tick': null,
            'actions': [
                {'text': 'Fishing', style: 'btn-info', 'on_click': (state, app) => { state.weather -= 10; return storylineStep(state, app, 'rainy_fishing'); }},
                {'text': 'Swim Away', style: 'btn-info', 'on_click': (state, app) => { state.weather += 10; return storylineStep(state, app, 'try_to_escape'); }},
                {'text': 'Swim Straight', style: 'btn-info', 'on_click': (state, app) => { state.weather -= 5; return storylineStep(state, app, 'swim_straight'); }},
            ]
        },
        'rainy_fishing': {
            'text': `Your fleet is fishing under rain.`,
            'on_enter': (state, app) => {
                state.splash_counter = Math.floor((20+(state.navigation * 20)) / app.fleetSpeed());
                return state;
            },
            'on_tick': (state, app) => {
                if (state.splash_counter <= 0) {
                    state = storylineStep(state, app, 'selector');
                }
                else {
                    state.fish += state.fishing_tools ? 5 : 3 * app.getFleetPower();
                }
                return state;
            },
            'actions': []
        },
        'swim_slowly': {
            'text': `Your fleet is sailing slowly, saving energy.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((50+(state.navigation * 20)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'row_fast': {
            'text': `Your fleet is swift with all its might.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((20+(state.navigation * 10)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'storm': {
            'text': `The storm is all around you. You can try to escape from the storm or swim carefully.`,
            'on_enter': (state, app) => {
                state.environment = 'storm';
                state.in_sea = true;
                return state;
            },
            'on_tick': null,
            'actions': [
                {'text': 'Try to Escape', style: 'btn-info', 'on_click': (state, app) => { state.weather += 10; state.trip_duration += 2; return storylineStep(state, app, 'try_to_escape'); }},
                {'text': 'Swim Carefully', style: 'btn-info', 'on_click': (state, app) => { state.weather += 5; state.trip_duration++; return storylineStep(state, app, 'swim_carefully'); }},
                {'text': 'Swim Straight', style: 'btn-info', 'on_click': (state, app) => {  state.weather -= 5; return storylineStep(state, app, 'swim_straight'); }},
            ]
        },
        'try_to_escape': {
            'text': `Your fleet is trying to swim out of the heart of the storm.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((20+(state.navigation * 10)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'swim_carefully': {
            'text': `Your fleet is trying to sail through the storm carefully.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((50+(state.navigation * 20)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'swim_straight': {
            'text': `Your fleet sails through the storm, despising dangers.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((20+(state.navigation * 10)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'end': {
            'text': `Your ship boarded on the inhabitant island.`,
            'on_enter': (state, app) => {
                state.environment = 'shore';
                state.fishing_tools = 0;
                state.storm_set = 0;

                state = app.generateIsland(state, start_island);

                return state;
            },
            'on_tick': null,
            'actions': [
                {'text': 'Disembark', style: 'btn-info', 'on_click': (state, app) => { state.in_sea = false; return storylineStart(state, app, 'island'); }}
            ]
        }
    }
};


export const resettlement = {
    init: (state, app) => {
        state.firs_slide = false;
        state.trip_duration = Math.floor(1 + _.random(10 + (state.navigation * 10), 20 + (state.navigation * 20)) / app.fleetSpeed());
        state.weather = _.random(25, 75) + (state.navigation * 0.1); // 0 - storm, 100 - sun
        state.fishing_tools = 0;
        state.storm_set = 0;
        console.log({'state.trip_duration': state.trip_duration, 'state.weather': state.weather});
        return state;
    },
    story: {
        'start': {
            'text': `You sail from the island. Take a fishing tackle, storm set or sail light?`,
            'on_enter': (state, app) => {
                state.environment = 'departure';
                state.embarked = false;
                state.in_sea = true;
                return state;
            },
            'on_tick': null,
            'actions': [
                {'text': 'Fishing Rods', style: 'btn-info', 'on_click': (state, app) => { state.fishing_tools = 1; return storylineStep(state, app, 'selector'); }},
                {'text': 'Storm Set', style: 'btn-info', 'on_click': (state, app) => { state.storm_set = 1; return storylineStep(state, app, 'selector'); }},
                {'text': 'Sail Light', style: 'btn-info', 'on_click': (state, app) => { state.trip_duration *= 0.75; return storylineStep(state, app, 'selector'); }},
            ]
        },
        'selector': {
            'text': ``,
            'on_enter': (state, app) => {
            //    console.log('storyline enter '+state.storyline_step);
                if (state.trip_duration <= 0) {
                    return storylineStep(state, app, 'end');
                }
                else {
                    state.trip_duration--;
                    return storylineStep(state, app, _.random(1, 100) > state.weather ? 'storm' : 'calm');
                }
            },
            'on_tick': null,
            'actions': []
        },
        'calm': {
            'text': `Wonderful weather. You can fish, swim slowly or row at your best.`,
            'on_enter': (state, app) => {
                state.environment = 'calm';
                state.in_sea = true;
                return state;
            },
            'on_tick': null,
            'actions': [
                {'text': 'Fishing', style: 'btn-info', 'on_click': (state, app) => { state.weather -= 5; return storylineStep(state, app, 'fishing'); }},
                {'text': 'Swim Slowly', style: 'btn-info', 'on_click': (state, app) => { return storylineStep(state, app, 'swim_slowly'); }},
                {'text': 'Row Fast', style: 'btn-info', 'on_click': (state, app) => { return storylineStep(state, app, 'row_fast'); }},
            ]
        },
        'fishing': {
            'text': `Your fleet is fishing.`,
            'on_enter': (state, app) => {
             //   console.log('storyline enter '+state.storyline_step);
                state.splash_counter = Math.floor((20+(state.navigation * 20)) / app.fleetSpeed());
                return state;
            },
            'on_tick': (state, app) => {
            //    console.log('fishing splash ', state.splash_counter);

                if (state.splash_counter <= 0) {
                    state = storylineStep(state, app, 'selector');
                }
                else {
                    state.fish += state.fishing_tools ? 2 : 1 * app.getFleetPower();
                }
                return state;
            },
            'actions': []
        },
        'swim_slowly': {
            'text': `Your fleet is sailing slowly, saving energy.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((50+(state.navigation * 20)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'row_fast': {
            'text': `Your fleet is swift with all its might.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((20+(state.navigation * 10)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'storm': {
            'text': `The storm is all around you. You can try to escape from the storm or swim carefully.`,
            'on_enter': (state, app) => {
                state.environment = 'storm';
                state.in_sea = true;
                return state;
            },
            'on_tick': null,
            'actions': [
                {'text': 'Try to Escape', style: 'btn-info', 'on_click': (state, app) => { return storylineStep(state, app, 'try_to_escape'); }},
                {'text': 'Swim Carefully', style: 'btn-info', 'on_click': (state, app) => { return storylineStep(state, app, 'swim_carefully'); }},
                {'text': 'Swim Straight', style: 'btn-info', 'on_click': (state, app) => { return storylineStep(state, app, 'swim_straight'); }},
            ]
        },
        'try_to_escape': {
            'text': `Your fleet is trying to swim out of the heart of the storm.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((20+(state.navigation * 10)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'swim_carefully': {
            'text': `Your fleet is trying to sail through the storm carefully.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((50+(state.navigation * 20)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'swim_straight': {
            'text': `Your fleet sails through the storm, despising dangers.`,
            'on_enter': (state, app) => { state.splash_counter = Math.floor((20+(state.navigation * 10)) / app.fleetSpeed()); return state; },
            'on_tick': (state, app) => { return state.splash_counter <= 0 ? storylineStep(state, app, 'selector') : state; },
            'actions': []
        },
        'end': {
            'text': `Your ship boarded on the inhabitant island.`,
            'on_enter': (state, app) => {
                state.environment = 'shore';
                state.fishing_tools = 0;
                state.storm_set = 0;

                return app.generateIsland(state, island_types[_.sample(_.keys(island_types))]);
            },
            'on_tick': null,
            'actions': [
                {'text': 'Disembark', style: 'btn-info', 'on_click': (state, app) => { state.in_sea = false; return storylineStart(state, app, 'island'); }}
            ]
        }
    }
};



export const island = {
    init: (state, app) => {
        state.embarked = true;
        state.environment = 'embarked';
        return state;
    },
    story: {
        'start': {
            'text': `You landed on the shore. There are fruit trees all around.`,
            'on_enter': null,
            'on_tick': null,
            'actions': [
                {'text': 'Collect Fruits', style: 'btn-info', 'on_click': (state, app) => { return collect(state, app, 'fruits'); }},
                {'text': 'Collect Wood', style: 'btn-info', 'on_click': (state, app) => { return collect(state, app, 'wood'); }},
            ]
        },
        'selector': {
            'text': ``,
            'on_enter': (state, app) => { return storylineStart(state, app, 'resettlement'); },
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
