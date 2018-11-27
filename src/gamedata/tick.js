
import _ from 'lodash';

import {resources} from './knowledge';
import {professions} from '../gamedata/professions';

export default function tick(state) {

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
                            let ships_loss = this.shipsLoss(state);
                            let human_los = ships_loss.canoe + ships_loss.proa * 2 + ships_loss.catamaran * 3;
                            state.mission_text = '<p>You loose your fleet:</p> ' + this.drawCost(ships_loss) + ' and ' + human_los + ' member of crew.';
                            state.sailor -= human_los;
                            state.population -= human_los;
                            this.charge(ships_loss);
                            break;
                        case 2:
                            let achieved_resources = this.resourcesReward(state);
                            achieved_resources = this.loadToFleet(achieved_resources);
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
                            let reward_ships = this.shipsReward(state);
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
                            let ships_loss = {canoe: state.canoe, proa: state.proa, catamaran: state.catamaran};
                            let human_los = state.canoe + state.proa * 2 + state.catamaran * 3;
                            state.sailor -= human_los;
                            state.population -= human_los;
                            let armor_loss = Math.min(state.armor, human_los);
                            let weapon_loss = 0;// Math.min(state.weapon, human_los);
                            state.armor -= armor_loss;
                            state.weapon -= weapon_loss;
                            state.mission_text = 'You lost the war, your entire fleet was lost. Loss: ' + this.drawCost(ships_loss) + ' and ' + human_los + ' member of crew with ' + armor_loss + ' armor and ' + weapon_loss + ' weapon.';
                            state = this.chargeState(state, ships_loss);
                        }
                            break;
                        case 2: {
                            let ships_loss = this.shipsLoss(state);
                            let human_los = ships_loss.canoe + ships_loss.proa * 2 + ships_loss.catamaran * 3;
                            state.sailor -= human_los;
                            state.population -= human_los;
                            let armor_loss = Math.round(Math.min(state.armor, human_los) * this.armoredSailors(state));
                            let weapon_loss = 0;// Math.round(Math.min(state.weapon, human_los) * this.weaponedSailors(state));
                            state.armor -= armor_loss;
                            state.weapon -= weapon_loss;
                            state.mission_text = 'your fleet retreated with losses: ' + this.drawCost(ships_loss) + ' and ' + human_los + ' member of crew with ' + armor_loss + ' armor and ' + weapon_loss + ' weapon.';
                            state = this.chargeState(state, ships_loss);
                        }
                            break;
                        case 3: {
                            state.mission_text = 'You found another island and conquer it! ';

                            let reward_ships = this.shipsReward(state);
                            if (!_.isEmpty(reward_ships)) {
                                state.mission_text += ' Stolen ships: ' + this.drawCost(reward_ships);
                                _.each(reward_ships, (value, resource_key) => {
                                    state[resource_key] += Math.round(value * 2 * (1 + this.weaponedSailors(state)));
                                });
                            }
                            else {
                                state.mission_text = ' ';
                            }

                            let ships_loss = this.shipsLoss(state);
                            _.each(ships_loss, (value, ship_key) => {
                                ships_loss[ship_key] = value * this.armoredSailors(state);
                            });
                            let human_los = ships_loss.canoe + ships_loss.proa * 2 + ships_loss.catamaran * 3;

                            let achieved_resources = this.resourcesReward(state);
                            _.each(achieved_resources, (value, resource_key) => {
                                achieved_resources[resource_key] += Math.round(value * 2 * (1 + this.weaponedSailors(state)));
                            });
                            achieved_resources = this.loadToFleet(achieved_resources);
                            if (!_.isEmpty(achieved_resources)) {
                                state.mission_text += ' Resources: ' + this.drawCost(achieved_resources);
                                _.each(achieved_resources, (value, resource_key) => {
                                    state[resource_key] += value;
                                });
                            }
                            else {
                                state.mission_text = ' ';
                            }

                            state.sailor -= human_los;
                            state.population -= human_los;
                            let armor_loss = Math.round(Math.min(state.armor, human_los) * this.armoredSailors(state));
                            let weapon_loss = 0;// Math.round(Math.min(state.weapon, human_los) * this.weaponedSailors(state));
                            state.armor -= armor_loss;
                            state.weapon -= weapon_loss;
                            state = this.chargeState(state, ships_loss);

                            state.mission_text += '. Your losses: ' + this.drawCost(ships_loss) + ' and ' + human_los + ' member of crew with ' + armor_loss + ' armor and ' + weapon_loss + ' weapon.';
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
    if ((state.bonfire > 0 || state.house > 0 || state.moai > 0) && state.population < ((state.hut * 2) + (state.house * 4))) {
        let pro = 1 + state.bonfire + (2 * state.house) + (10 * state.moai);
        let contra = (50 * state.population);
        let ratio = Math.floor(contra / pro);
        let top = 30 + ratio;
        let chance = _.random(1, top);
     //   console.log(pro, contra, ratio, top, chance);
        if (chance === 1) {
            state.population++;
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
        if (state.meals > 0) {
            selected_food = "meals";
        }
        else {
            let eatable = ['fruits', 'roots', 'fish', 'meat', 'human_meat'];
            let food = [];
            for (let e = 0; e < eatable.length; e++) {
                if (state[eatable[e]] > 0) {
                    food.push(eatable[e]);
                }
            }

            if (food.length === 0) {
                state.population--;
                state.skull++;
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

        if (Math.floor(_.random(1, 24)) <= 5) {
            state[selected_food]--;
        }
    }

    // work
    _.each(professions, (profession, profession_key) => {
        if (state[profession_key] > 0 && profession.onTick) {
            state = profession.onTick.call(this, state, profession_key);
        }
    });

    // regeneration
    _.each(resources, (resource, resource_key) => {
        if (state.volumes[resource_key] < state.caps[resource_key]) {
            let new_counter = 0;
            if (resource.vegetation && state.aquarius > 0) {
                let regen = resource.regen + Math.floor(resource.regen * this.productivity('aquarius') / 100);
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

