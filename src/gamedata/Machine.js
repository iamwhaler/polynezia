
import _ from 'lodash';

import {resources, professions} from './knowledge';

class Machine {
    static tick(state) {

        //console.log(this);
        //console.log(state);


        state.tick++;
        state.storm_loss = '';

        // storyline
        if (state.storyline) {
            if (state.splash_counter > 0) state.splash_counter--;
         //   console.log(state.storyline, this);
         //   console.log(state.storyline, this.getStep(), this.getStep().on_tick);
            if (this.getStep().on_tick) state = this.getStep().on_tick.call(this, state);
        }

        // fleeting
        if (state.mission !== false) {
            if (state.mission_timer <= 0) {

                switch (state.mission) {
                    case 'fishing':
                        let reward = 10 + this.sailorsNeed() * _.random(1, state.mission_long) + Math.floor(state.mission_distance * _.random(0.7, 1 + 0.1 * state.canoe + 0.3 * state.proa + 0.7 * state.catamaran));
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
                                state.mission_text = '<p>You loose your fleet:</p> ' + this.drawCost(ships_los) + ' and ' + human_los + ' member of crew.';
                                state.sailor -= human_los;
                                state.population -= human_los;
                                this.charge(ships_los);
                                break;
                            case 2:
                                let res_reward = (state.mission_distance + this.sailorsNeed()) * _.random(7, 13);
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
                                let ratio = sum > this.fleetCapacity() ? this.fleetCapacity() / sum : 1;
                                _.each(new_resources, (count, resource) => {
                                    if (count > 0) achieved_resources[resource] = Math.ceil(count * ratio);
                                });

                                _.each(achieved_resources, (count, resource) => {
                                    if (count < 1) delete achieved_resources[resource];
                                });

                                console.log(res_reward, sum, ratio, new_resources, achieved_resources);

                                if (!_.isEmpty(achieved_resources)) {
                                    state.mission_text = 'You found another island and harvest it! Resources: ' + this.drawCost(achieved_resources);
                                    _.each(achieved_resources, (value, resource_key) => {
                                        state[resource_key] += value;
                                    });
                                }
                                else {
                                    state.mission_text = 'Nothing found.';
                                }
                                break;
                            case 3:
                                let ships_reward = (state.mission_distance + this.sailorsNeed()) * _.random(7, 13);
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
                                    state.mission_text = 'You found new ships! Ships: ' + this.drawCost(reward_ships);
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
                                let ships_los = {canoe: state.canoe, proa: state.proa, catamaran: state.catamaran};
                                let human_los = state.canoe + state.proa * 2 + state.catamaran * 3;
                                state.sailor -= human_los;
                                state.population -= human_los;
                                let armor_loss = Math.min(state.armor, human_los);
                                state.armor -= armor_loss;
                                state.mission_text = 'You lost the war, your entire fleet was lost. Loss: ' + this.drawCost(ships_los) + ' and ' + human_los + ' member of crew with ' + armor_loss + ' armor.';
                                state = this.chargeState(state, ships_los);
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
                                state.mission_text = 'your fleet retreated with losses: ' + this.drawCost(ships_los) + ' and ' + human_los + ' member of crew with ' + armor_loss + ' armor.';
                                state = this.chargeState(state, ships_los);
                            }
                                break;
                            case 3: {
                                state.mission_text = 'You found another island and conquer it! ';

                                let res_reward = (state.mission_distance + this.sailorsNeed() ) * _.random(7, 13);
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
                                let ratio = sum > this.fleetCapacity() ? this.fleetCapacity() / sum : 1;
                                _.each(new_resources, (count, resource) => {
                                    if (count > 0) achieved_resources[resource] = Math.ceil(count * ratio);
                                });
                                _.each(achieved_resources, (count, resource) => {
                                    if (count < 1) delete achieved_resources[resource];
                                });
                                console.log(res_reward, sum, ratio, new_resources, achieved_resources);

                                if (!_.isEmpty(achieved_resources)) {
                                    state.mission_text += ' Resources: ' + this.drawCost(achieved_resources);
                                    _.each(achieved_resources, (value, resource_key) => {
                                        state[resource_key] += value;
                                    });
                                }
                                else {
                                    state.mission_text = ' ';
                                }

                                let ships_reward = (state.mission_distance + this.sailorsNeed()) * _.random(7, 13);
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
                                    state.mission_text += ' Stolen ships: ' + this.drawCost(reward_ships);
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
                                state = this.chargeState(state, ships_los);

                                state.mission_text += ' Your losses: ' + this.drawCost(ships_los) + ' and ' + human_los + ' member of crew with ' + armor_loss + ' armor.';
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
        if ((state.bonfire > 0 || state.house > 0 || state.monastery > 0 || state.moai > 0) && state.population < ((state.hut * 2) + (state.house * 4) + (state.monastery * 9))) {
            if (_.random(1, Math.floor((10 * state.population) / (1 + state.bonfire + (2 * state.house) + (5 * state.monastery) + (10 * state.moai)))) === 1) {
                state.population++;// ; this.setState({population: state.population + 1});
            }
        }

        // attract trader
        let chance = _.random(1, Math.floor(1 + (420 / this.productivity('navigator'))));
        //console.log(state.lighthouse, chance, state.trader);
        if (state.lighthouse > 0 && !state.trader && chance === 1) {
            const rates = {
                'fruits': 1.5,
                'roots': 1.5,
                'fish': 2,
                'meat': 2,
                'wood': 5,
                'turf': 5,
                'coal': 5,
                'stone': 10,
                'obsidian': 20,
                'wool': 20,
                'skin': 20,
                'iron': 50,
                'meals': 1,
                'shovels': 10,
                'tools': 20,
                'instruments': 100,
                'gold': 1000,
            };
            const tradable = _.keys(rates);

            let size = _.random(1, 3);
            let resource1 = _.random(1, 3) === 1 ? 'gold' : _.sample(tradable);
            let resource2 = resource1 === 'gold' ? _.sample(tradable) : _.random(1, 3) === 1 ? 'gold' : _.sample(tradable);

            let nav_factor = Math.max(100, Math.floor(420 / (1 + 0.1 * this.productivity('navigator'))));
            //    console.log(nav_factor);

            if (resource1 === resource2 || _.random(1, nav_factor) <= 10) {
                let count1 = Math.floor(0.1 * (_.random(1, 10) + [0, 1, 3, 10][size] * _.random(7, 13) * this.productivity('navigator') / rates[resource1]));
                state.trader = {
                    type: 'gift', offer: {'resource1': resource1, 'count1': count1},
                    //  text: <p>Traders arrived with gifts. Their gift is <span className="badge">{count1} {resource1}</span>.</p>
                };
            }
            else {
                let count1 = Math.ceil(0.1 * (_.random(1, 10) + [0, 5, 10, 25][size] * _.random(7, 13) * this.productivity('navigator') / rates[resource1]));
                let count2 = Math.ceil(0.1 * (_.random(1, 10) + [0, 5, 10, 25][size] * _.random(7, 13) * this.productivity('navigator') / rates[resource2]));
                state.trader = {
                    type: 'trade',
                    offer: {'resource1': resource1, 'count1': count1, 'resource2': resource2, 'count2': count2},
                    //  text: <p>Trader arrival. They offer <span className="badge">{count1} {resource1}</span> for <span className="badge">{count2} {resource2}</span>.</p>
                };
            }
        }

        // feeding
        for (let i = 0; i < state.population; i++) {
            let selected_food = null;
            if (state.meals > 1) {
                selected_food = "meals";
            }
            else {
                let eatable = ['fruits', 'vegetables', 'roots', 'fish', 'meat', 'human_meat'];
                let food = [];
                for (let e = 0; e < eatable.length; e++) {
                    if (state[eatable[e]] > 0) {
                        food.push(eatable[e]);
                    }
                }

                if (food.length === 0) {
                    state.population--;
                    state.human_meat += 50;

                    let works = [];
                    let profs = _.keys(professions);
                    for (let w = 0; w < profs.length; w++) {
                        if (state[profs[w]] > 0) {
                            works.push(profs[w]);
                        }
                    }
                    state[_.sample(works)]--;
                    continue;
                }
                else {
                    selected_food = _.sample(food);
                }
            }

            if (Math.floor(_.random(1, 5)) < 3) {
                state[selected_food]--;
            }
        }

        const chooser = (state, items, func) => {
            let raw = [];
            _.each(items, (item) => {
                if (state[item] > 0) {
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
            });
        };

        const transformer = (state, rates, production) => {
            return chooser(state, _.keys(rates), (state, selected) => {
                state[selected]--;
                state[production] += rates[selected];
                return state;
            });
        };

        // work
        _.each(professions, (profession, profession_key) => {
            if (profession.resource) {
                if (profession_key === 'hunter') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 50) === 1) {
                            state['skin']++;
                        }
                    }
                }

                if (profession_key === 'miner') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 50) === 1) {
                            state['stone']++;
                        }
                        if (_.random(1, 25) === 1) {
                            state['coal']++;
                        }
                        if (_.random(1, 420) === 1) {
                            state['gold']++;
                        }
                    }
                }

                if (profession_key === 'mason') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 50 * (state.island_type === 'mountain' ? 1 : 5)) === 1) {
                            state['obsidian']++;
                        }
                        if (_.random(1, 30) === 1) {
                            state['coal']++;
                        }
                    }
                }

                if (state[profession_key] > 0 && state.volumes[profession.resource] > 0) {
                    let productivity = this.productivity(profession_key);
                    if (state.human_meat > 0) {
                        productivity *= 2;
                    }
                    //  console.log(productivity);
                    //  console.log(state[profession_key], profession.home, state[profession.home]);
                    for (let i = 0; i < productivity; i++) {
                        let ecofactor = state.volumes[profession.resource] / state.caps[profession.resource];
                        let difficulty = resources[profession.resource].difficulty;
                        if (state.tools > 0) {
                            difficulty /= 2;
                        }
                        if (state.instruments > 0) {
                            difficulty /= 3;
                        }
                        let top = 1 + Math.round(difficulty / ecofactor);
                        let chance = Math.ceil(_.random(1, top));
                        //  console.log(ecofactor, difficulty, top, chance);


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
                    }
                }
            }
            else {
                if (profession_key === 'cook') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        state = burner(state, (state) => {
                            if (_.random(1, 2) === 1) {
                                state = transformer(state, {
                                    'fruits': 2,
                                    'roots': 2,
                                    'fish': 3,
                                    'meat': 3,
                                    'vegetables': 2,
                                    'human_meat': 3
                                }, 'meals');
                            }
                            return state;
                        });
                    }
                }

                if (profession_key === 'gardener') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 10) === 1) {
                            state['vegetables']++;
                        }
                    }
                }

                if (profession_key === 'navigator') {
                    state.navigation = 1;
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        state = burner(state, (state) => {
                            state.navigation++;
                            return state;
                        });
                    }
                }

                if (profession_key === 'aquarius') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 50 * (state.island_type === 'swamp' ? 1 : 5)) === 1) {
                            state['turf']++;
                        }
                    }
                }

                if (profession_key === 'herdsman') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 100) === 1) {
                            state.meat += 10;
                            state.wool += 1;
                        }
                    }
                }

                if (profession_key === 'carpenter') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 10) === 1) {
                            state = transformer(state, {'wood': 1}, 'shovels');
                        }
                    }
                }

                if (profession_key === 'master') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 20) === 1) {
                            state = transformer(state, {'stone': 1, 'obsidian': 2}, 'tools');
                        }
                    }
                }

                if (profession_key === 'smith') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        state = burner(state, (state) => {
                            if (_.random(1, 50) === 1) {
                                state = transformer(state, {'iron': 2, 'obsidian': 1}, 'instruments');
                            }
                            return state;
                        });
                    }
                }

                if (profession_key === 'armorer') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        state = burner(state, (state) => {
                            if (_.random(1, 50) === 1) {
                                state = transformer(state, {'iron': 2, 'wool': 1, 'skin': 1}, 'armor');
                            }
                            return state;
                        });
                    }
                }

                if (profession_key === 'weaponsmith') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        state = burner(state, (state) => {
                            if (_.random(1, 50) === 1) {
                                state = transformer(state, {'iron': 2, 'obsidian': 1}, 'weapon');
                            }
                            return state;
                        });
                    }
                }

            }
        });

        // regeneration
        _.each(resources, (resource, resource_key) => {
            if (state.volumes[resource_key] < state.caps[resource_key]) {
                let new_counter = 0;
                if (resource.vegetation && state.aquarius > 0) {
                    let regen = resource.regen + Math.floor(resource.regen * this.productivity('aquarius') / 10);
                    new_counter = state.volumes[resource_key] + regen;
                }
                else {
                    new_counter = state.volumes[resource_key] + resource.regen;
                }
                state.volumes[resource_key] = new_counter > state.caps[resource_key] ? state.caps[resource_key] : new_counter;
            }
        });

        // end game
        if (state.population === 0) {
            state.score = true;
            state.environment = 'end';
            this.pauseGame();
        }


        return state;
    }
}

export default Machine;

