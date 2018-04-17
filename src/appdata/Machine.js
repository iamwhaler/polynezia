
import _ from 'lodash';

import {resources, professions} from '../appdata/knowledge';

export const Machine = {
    tick: (state, app) => {
        state.tick++;

        // storyline
        if (state.storyline){
            if (state.splash_counter > 0) state.splash_counter--;
         //   console.log(state.storyline, app.getStep(), app.getStep().on_tick);
            if (app.getStep().on_tick) state = app.getStep().on_tick(state, app);
        }

        /*
        if (state.firs_slide) {
            if (state.fruits > 10 + _.random(1, 10) || state.wood > 20 + _.random(1, 10) || state.tools > 3 + _.random(1, 3)) {

            }
        }

        // searching new island
        if (state.in_sea) {
            if (state.tick > 30 && state.fish > 30) {
                state.in_sea = false;
                state.shore = true;
            }
        }
         */

        // fleeting
        if (state.mission !== false) {
            if (state.mission_timer <= 0) {

                switch (state.mission) {
                    case 'fishing':
                        let reward = 10 + app.sailorsNeed() * _.random(1, state.mission_long) + Math.floor(state.mission_distance * _.random(0.7, 1 + 0.1 * state.canoe + 0.3 * state.proa + 0.7 * state.catamaran));
                        state.mission_text = "Your ships come back from fishing. Fish catch: " + reward;
                        state.fish += reward;
                        break;
                    case 'discovery':
                        switch (_.random(1, 3)) {
                            case 1:
                                let tension = Math.ceil(state.mission_long * 0.1);
                                let ships_los = {
                                    canoe: _.random(Math.min(tension, state.canoe), state.canoe),
                                    proa: _.random(Math.min(tension, state.proa), state.proa),
                                    catamaran: _.random(Math.min(tension, state.catamaran), state.catamaran)
                                };
                                let human_los = ships_los.canoe + ships_los.proa * 2 + ships_los.catamaran * 3;
                                state.mission_text = '<p>You loose your fleet:</p> ' + app.drawCost(ships_los) + ' and ' + human_los + ' member of crew.';
                                state.sailor -= human_los;
                                state.population -= human_los;
                                app.charge(ships_los);
                                break;
                            case 2:
                                let res_reward = (state.mission_distance + app.sailorsNeed()) * _.random(7, 13);
                                let new_resources = {
                                    fruits: Math.ceil((_.random(0, res_reward) / 0.1) - 50),
                                    roots: Math.ceil((_.random(0, res_reward) / 0.1) - 50),
                                    fish: Math.ceil((_.random(0, res_reward) / 0.2) - 50),
                                    meat: Math.ceil((_.random(0, res_reward) / 0.2) - 50),

                                    wood: Math.ceil((_.random(0, res_reward) / 5) - 10),
                                    stone: Math.ceil((_.random(0, res_reward) / 10) - 10),
                                    iron: Math.ceil((_.random(0, res_reward) / 25) - 50),
                                    moai: Math.ceil((_.random(0, res_reward) / 250) - 100)
                                };

                                console.log(new_resources);
                                _.each(new_resources, (count, resource) => {
                                    if (count < 1) delete new_resources[resource];
                                });

                                let achieved_resources = {};
                                let sum = _.sum(_.values(new_resources));
                                let ratio = sum > app.fleetCapacity() ? app.fleetCapacity() / sum : 1;
                                _.each(new_resources, (count, resource) => {
                                    if (count > 0) achieved_resources[resource] = Math.ceil(count * ratio);
                                });

                                _.each(achieved_resources, (count, resource) => {
                                    if (count < 1) delete achieved_resources[resource];
                                });

                                console.log(res_reward, sum, ratio, new_resources, achieved_resources);

                                if (!_.isEmpty(achieved_resources)) {
                                    state.mission_text = 'You found another island and harvest it! Resources: ' + app.drawCost(achieved_resources);
                                    _.each(achieved_resources, (value, resource_key) => {
                                        state[resource_key] += value;
                                    });
                                }
                                else {
                                    state.mission_text = 'Nothing found.';
                                }
                                break;
                            case 3:
                                let ships_reward = (state.mission_distance + app.sailorsNeed()) * _.random(7, 13);
                                let new_ships = {
                                    canoe: Math.ceil((_.random(0, ships_reward) - 10) / 25),
                                    proa: Math.ceil((_.random(0, ships_reward) - 25) / 50),
                                    catamaran: Math.ceil((_.random(0, ships_reward) - 50) / 250)
                                };

                                let reward_ships = {};
                                _.each(new_ships, (count, ship) => {
                                    if (count > 0) reward_ships[ship] = count;
                                });

                                console.log(ships_reward, new_ships, reward_ships);

                                if (!_.isEmpty(reward_ships)) {
                                    state.mission_text = 'You found new ships! Ships: ' + app.drawCost(reward_ships);
                                    _.each(reward_ships, (value, resource_key) => {
                                        state[resource_key] += value;
                                    });
                                }
                                else {
                                    state.mission_text = 'Crew just alive.';
                                }
                                break;
                            default:
                                console.log('broken discovery outcome');
                        }
                        break;
                    case 'robbery':
                        switch (_.random(1, 3)) {
                            case 1: {
                                let ships_los = { canoe: state.canoe, proa: state.proa, catamaran: state.catamaran };
                                let human_los = state.canoe + state.proa * 2 + state.catamaran * 3;
                                state.sailor -= human_los;
                                state.population -= human_los;
                                let armor_loss = Math.min(state.armor, human_los);
                                state.armor -= armor_loss;
                                state.mission_text = 'You lost the war, your entire fleet was lost. Loss: ' + app.drawCost(ships_los) + ' and ' + human_los + ' member of crew with ' + armor_loss + ' armor.';
                                state = app.chargeState(state, ships_los);
                            }
                                break;
                            case 2: {
                                let tension = Math.ceil(state.mission_long * 0.1);
                                let ships_los = {
                                    canoe: _.random(Math.min(tension, state.canoe), state.canoe),
                                    proa: _.random(Math.min(tension, state.proa), state.proa),
                                    catamaran: _.random(Math.min(tension, state.catamaran), state.catamaran)
                                };
                                let human_los = ships_los.canoe + ships_los.proa * 2 + ships_los.catamaran * 3;
                                state.sailor -= human_los;
                                state.population -= human_los;
                                let armor_loss = Math.min(state.armor, human_los);
                                state.armor -= armor_loss;
                                state.mission_text = 'your fleet retreated with losses: ' + app.drawCost(ships_los) + ' and ' + human_los + ' member of crew with ' + armor_loss + ' armor.';
                                state = app.chargeState(state, ships_los);
                            }
                                break;
                            case 3: {
                                state.mission_text = 'You found another island and conquer it! ';

                                let res_reward = (state.mission_distance + app.sailorsNeed() ) * _.random(7, 13);
                                let new_resources = {
                                    fruits: Math.ceil((_.random(0, res_reward) / 0.1) - 50),
                                    roots: Math.ceil((_.random(0, res_reward) / 0.1) - 50),
                                    fish: Math.ceil((_.random(0, res_reward) / 0.2) - 50),
                                    meat: Math.ceil((_.random(0, res_reward) / 0.2) - 50),

                                    wood: Math.ceil((_.random(0, res_reward) / 5) - 10),
                                    stone: Math.ceil((_.random(0, res_reward) / 10) - 10),
                                    iron: Math.ceil((_.random(0, res_reward) / 25) - 50),
                                    moai: Math.ceil((_.random(0, res_reward) / 250) - 100)
                                };

                                console.log(new_resources);
                                _.each(new_resources, (count, resource) => {
                                    if (count < 1) delete new_resources[resource];
                                });

                                let achieved_resources = {};
                                let sum = _.sum(_.values(new_resources));
                                let ratio = sum > app.fleetCapacity() ? app.fleetCapacity() / sum : 1;
                                _.each(new_resources, (count, resource) => {
                                    if (count > 0) achieved_resources[resource] = Math.ceil(count * ratio);
                                });
                                _.each(achieved_resources, (count, resource) => {
                                    if (count < 1) delete achieved_resources[resource];
                                });
                                console.log(res_reward, sum, ratio, new_resources, achieved_resources);

                                if (!_.isEmpty(achieved_resources)) {
                                    state.mission_text += ' Resources: ' + app.drawCost(achieved_resources);
                                    _.each(achieved_resources, (value, resource_key) => {
                                        state[resource_key] += value;
                                    });
                                }
                                else {
                                    state.mission_text = ' ';
                                }

                                let ships_reward = (state.mission_distance + app.sailorsNeed()) * _.random(7, 13);
                                let new_ships = {
                                    canoe: Math.ceil((_.random(0, ships_reward) - 10) / 25),
                                    proa: Math.ceil((_.random(0, ships_reward) - 25) / 50),
                                    catamaran: Math.ceil((_.random(0, ships_reward) - 50) / 250)
                                };
                                let reward_ships = {};
                                _.each(new_ships, (count, ship) => {
                                    if (count > 0) reward_ships[ship] = count;
                                });
                                console.log(ships_reward, new_ships, reward_ships);

                                if (!_.isEmpty(reward_ships)) {
                                    state.mission_text += ' Stolen ships: ' + app.drawCost(reward_ships);
                                    _.each(reward_ships, (value, resource_key) => {
                                        state[resource_key] += value;
                                    });
                                }
                                else {
                                    state.mission_text = ' ';
                                }

                                let tension = Math.ceil(state.mission_long * 0.1);
                                let ships_los = {
                                    canoe: _.random(Math.min(tension, state.canoe), state.canoe),
                                    proa: _.random(Math.min(tension, state.proa), state.proa),
                                    catamaran: _.random(Math.min(tension, state.catamaran), state.catamaran)
                                };
                                let human_los = ships_los.canoe + ships_los.proa * 2 + ships_los.catamaran * 3;

                                state.sailor -= human_los;
                                state.population -= human_los;
                                let armor_loss = Math.min(state.armor, human_los);
                                state.armor -= armor_loss;
                                state = app.chargeState(state, ships_los);

                                state.mission_text += ' Your losses: ' + app.drawCost(ships_los) + ' and ' + human_los + ' member of crew with ' + armor_loss + ' armor.';
                            }
                                break;
                            default:
                                console.log('broken robbery outcome');
                        }
                        break;
                    default:
                        console.log('broken mission type');
                }

                state.mission = false;
            }
            else {
                state.mission_timer--;
                //state.mission_timer -= 10;
            }
        }

        // attract new people
        if ((app.state.bonfire > 0 || app.state.house > 0 || app.state.moai > 0) && app.state.population < (app.state.hut * 2) + (app.state.house * 4)) {
            if (_.random(1, Math.floor((10 * app.state.population) / (1 + app.state.bonfire + (2 * app.state.house) + (10 * app.state.moai)))) === 1) {
                state.population++;// ;app.setState({population: app.state.population + 1});
            }
        }

        // attract trader
        let chance = Math.floor(_.random(1, 1 + (100 / (1 + app.state.lighthouse))));
        //console.log(app.state.lighthouse, chance, app.state.trader);
        if (app.state.lighthouse > 0 && !app.state.trader && chance === 1) {
            const rates = {
                'fruits': 1.5,
                'roots': 1.5,
                'fish': 2,
                'meat': 2,
                'wood': 5,
                'turf': 5,
                'stone': 10,
                'obsidian': 25,
                'wool': 25,
                'skin': 25,
                'iron': 50,
                'meals': 1,
                'tools': 15,
                'instruments': 75
            };
            const tradable = _.keys(rates);

            let size = _.random(1, 3);
            let resource1 = _.sample(tradable);
            let resource2 = _.sample(tradable);

            let nav_factor = Math.floor(100 - (app.navigation/100));
            console.log(nav_factor);

            if (resource1 === resource2 || _.random(1, nav_factor) === 1) {
                let count1 = Math.floor(0.1 * (_.random(1, 10) + [0, 10, 50, 100][size] * _.random(7, 13) * app.state.lighthouse / rates[resource1]));
                state.trader = {
                    type: 'gift', offer: {'resource1': resource1, 'count1': count1},
                    //  text: <p>Traders arrived with gifts. Their gift is <span className="badge">{count1} {resource1}</span>.</p>
                };
            }
            else {
                let count1 = Math.floor(0.1 * (_.random(1, 10) + [0, 50, 100, 250][size] * _.random(7, 13) * app.state.lighthouse / rates[resource1]));
                let count2 = Math.floor(0.1 * (_.random(1, 10) + [0, 50, 100, 250][size] * _.random(7, 13) * app.state.lighthouse / rates[resource2]));
                state.trader = {
                    type: 'trade',
                    offer: {'resource1': resource1, 'count1': count1, 'resource2': resource2, 'count2': count2},
                    //  text: <p>Trader arrival. They offer <span className="badge">{count1} {resource1}</span> for <span className="badge">{count2} {resource2}</span>.</p>
                };
            }
        }

        // feeding
        for (let i = 0; i < app.state.population; i++) {
            let selected_food = null;
            if (app.state.meals > 1) {
                selected_food = "meals";
            }
            else {
                let food = [];
                _.each(['fruits', 'roots', 'fish', 'meat', 'human_meat'], (food_type) => {
                    if (app.state[food_type] > 0) {
                        food.push(food_type);
                    }
                });

                if (food.length === 0) {
                    state.population--;
                    state.human_meat += 50;

                    let works = [];
                    _.each(professions, (profession, profession_key) => {
                        if (app.state[profession_key] > 0) {
                            works.push(profession_key);
                        }
                    });
                    state[_.sample(works)]--;
                    continue;
                }
                else {
                    selected_food = _.sample(food);
                }
            }

            if (Math.floor(_.random(1, 3)) === 1) {
                state[selected_food]--;
            }
        }

        const chooser = (state, items, func) => {
            let raw = [];
            _.each(items, (item) => {
                if (app.state[item] > 0) {
                    raw.push(item);
                }
            });
            if (raw.length > 0) {
                return func(state, _.sample(raw));
            }
            return state;
        };

        const burner = (state, func) => {
            return chooser(state, ['wood', 'coal', 'turf'], (state, selected) => {
                if (_.random(1, 10) === 1) {
                    state[selected]--;
                }
                return func(state);
            } );
        };

        const transformer = (state, rates, production) => {
            return chooser(state, _.keys(rates), (state, selected) => {
                state[selected]--;
                state[production] += rates[selected];
                return state;
            } );
        };

        // work
        _.each(professions, (profession, profession_key) => {
            if (profession.resource) {

                if (profession_key === 'fielder') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        if (_.random(1, 5) === 1) {
                            state['vegetables']++;
                        }
                    }
                }

                if (profession_key === 'hunter') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        if (_.random(1, 50) === 1) {
                            state['skin']++;
                        }
                    }
                }

                if (profession_key === 'miner') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        if (_.random(1, 10) === 1) {
                            state['stone']++;
                        }
                        if (_.random(1, 20) === 1) {
                            state['coal']++;
                        }
                    }
                }

                if (profession_key === 'mason') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        if (_.random(1, 250 * app.state.island_type === 'mountain' ? 1 : 5) === 1) {
                            state['obsidian']++;
                        }
                        if (_.random(1, 50) === 1) {
                            state['coal']++;
                        }
                    }
                }

                if (app.state[profession_key] > 0 && app.state.volumes[profession.resource] > 0) {
                    let productivity = app.productivity(profession_key);
                    if (app.state.human_meat > 0) {
                        productivity *= 2;
                    }
                    //  console.log(productivity);
                    //  console.log(app.state[profession_key], profession.home, app.state[profession.home]);
                    for (let i = 0; i < productivity; i++) {
                        let ecofactor = app.state.volumes[profession.resource] / app.state.caps[profession.resource];
                        let difficulty = resources[profession.resource].difficulty;
                        if (app.state.tools > 0) {
                            difficulty /= 3;
                        }
                        if (app.state.instruments > 0) {
                            difficulty /= 10;
                        }
                        let top = 1 + Math.round(difficulty / ecofactor);
                        let chance = Math.ceil(_.random(1, top));
                        //  console.log(ecofactor, difficulty, top, chance);


                        if (app.state.tools > 0 && _.random(1, Math.floor((250 + (app.state.workshop * 50)) / (resources[profession.resource].vegetation ? 1 : 3))) === 1) {
                            state['tools']--;
                        }
                        if (app.state.instruments > 0 && _.random(1, Math.floor((1000 + (app.state.forge * 250)) / (resources[profession.resource].is_nature ? 1 : 3))) === 1) {
                            state['instruments']--;
                        }


                        if (chance === 1) {
                            if (profession.resource === 'moai') {
                                if (app.state.moai < app.state.ahu) {
                                    state[profession.resource]++;
                                    state.volumes[profession.resource]--;
                                }
                            }
                            else {
                                state[profession.resource]++;
                                state.volumes[profession.resource]--;  // (((

                                if (app.state.instruments > 0) {
                                    if (profession.resource !== 'moai' && _.random(1, 2) === 1) {
                                        state.volumes[profession.resource]++; // (((
                                    }
                                }

                            }
                        }
                    }
                }
            }
            else {
                if (profession_key === 'cook') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        state = burner(state, (state) => {
                            if (_.random(1, 3) === 1) {
                                state = transformer(state, {'fruits': 2, 'roots': 2, 'fish': 3, 'meat': 3, 'vegetables': 2, 'human_meat': 3}, 'meals');
                            }
                            return state;
                        });
                    }
                }

                if (profession_key === 'navigator') {
                    state.navigation = 1;
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        state = burner(state, (state) => { state.navigation++; return state; });
                    }
                }

                if (profession_key === 'aquarius') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        if (_.random(1, 100 * app.state.island_type === 'swamp' ? 1 : 5) === 1) {
                            state['turf']++;
                        }
                    }
                }

                if (profession_key === 'herdsman') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        if (_.random(1, 50) === 1) {
                            state.meat += 10;
                        }
                        if (_.random(1, 100) === 1) {
                            state.wool += 1;
                        }
                    }
                }

                if (profession_key === 'master') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        if (_.random(1, 20) === 1) {
                            state = transformer(state, {'stone': 1}, 'tools');
                        }
                    }
                }

                if (profession_key === 'smith') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        state = burner(state, (state) => {
                            if (_.random(1, 50) === 1) {
                                state = transformer(state, {'iron': 1, 'obsidian': 1}, 'instruments');
                            }
                            return state;
                        });
                    }
                }

                if (profession_key === 'armorer') {
                    for (let i = 0; i < app.productivity(profession_key); i++) {
                        state = burner(state, (state) => {
                            if (_.random(1, 50) === 1) {
                                state = transformer(state, {'iron': 1, 'wool': 1, 'skin': 1}, 'armor');
                            }
                            return state;
                        });
                    }
                }

            }
        });

        // regeneration
        _.each(resources, (resource, resource_key) => {
            if (app.state.volumes[resource_key] < app.state.caps[resource_key]) {
                let new_counter = 0;
                if (resource.vegetation && app.state.aquarius > 0) {
                    let productivity = app.state.aquarius + Math.min(app.state.aquarius, app.state.canal);
                    let regen = resource.regen + Math.floor(resource.regen * productivity / 10);
                    new_counter = app.state.volumes[resource_key] + regen;
                }
                else {
                    new_counter = app.state.volumes[resource_key] + resource.regen;
                }
                state.volumes[resource_key] = new_counter > app.state.caps[resource_key] ? app.state.caps[resource_key] : new_counter;
            }
        });

        // end game
        if (state.population === 0) {
            state.score = true;
            state.environment = 'end';
            app.pauseGame();
        }



        return state;
    }

};