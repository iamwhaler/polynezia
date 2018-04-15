import React, {Component} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './App.css';
import './tooltip.css';

import {starter_pack, island_types, resources, items, ships, buildings, professions} from './appdata/knowledge';
import {default_building_space, default_state} from './appdata/default_state';

var timerID = null;

class App extends Component {
    constructor(props) {
        super(props);

        var app_state = JSON.parse(localStorage.getItem("app_state"));
        this.state = app_state ? app_state : default_state;
        //this.setState(state);

        this.resetGame = this.resetGame.bind(this);
        this.newGame = this.newGame.bind(this);

        this.playGame = this.playGame.bind(this);
        this.pauseGame = this.pauseGame.bind(this);
        this.setGameSpeed = this.setGameSpeed.bind(this);
        this.tick = this.tick.bind(this);

        this.lockedTill = this.lockedTill.bind(this);
        this.drawCost = this.drawCost.bind(this);

        this.shipsSum = this.shipsSum.bind(this);
        this.sailorsNeed = this.sailorsNeed.bind(this);
        this.fleetCapacity = this.fleetCapacity.bind(this);
        this.fleetSpeed = this.fleetSpeed.bind(this);

        this.isEnough = this.isEnough.bind(this);
        this.collect = this.collect.bind(this);

        this.build = this.build.bind(this);
        this.ruin = this.ruin.bind(this);

        this.assignWorker = this.assignWorker.bind(this);
        this.detachWorker = this.detachWorker.bind(this);


        if (!app_state) this.initGame('tropical', starter_pack, {});
    }

    componentDidMount() {
        this.playGame();
    }

    playGame() {
        clearInterval(timerID);
        timerID = setInterval(
            () => this.tick(true),
            Math.floor(this.state.game_speed / this.state.game_speed_multiplier)
        );
        this.setState({game_paused: false});
    }

    pauseGame() {
        clearInterval(timerID);
        this.setState({game_paused: true});
    }

    setGameSpeed(speed) {
        this.setState({game_speed_multiplier: speed});
        this.playGame();
    }

    tick() {
        let state = this.state;

        console.log('tick');

        state.tick++;

        if (state.in_sea) {
            if (state.tick > 30 && state.fish > 30) {
                state.in_sea = false;
                state.shore = true;
            }
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
                                    state.mission_text = '<p>You found another island and harvest it!</p> Resources: ' + this.drawCost(achieved_resources);
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
                                    state.mission_text = '<p>You found new ships!</p> Ships: ' + this.drawCost(reward_ships);
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
        if ((this.state.bonfire > 0 || this.state.house > 0 || this.state.moai > 0) && this.state.population < (this.state.hut * 2) + (this.state.house * 5)) {
            if (_.random(1, Math.floor((10 * this.state.population) / (1 + this.state.bonfire + (2 * this.state.house) + (10 * this.state.moai)))) === 1) {
                state.population++;// ;this.setState({population: this.state.population + 1});
            }
        }

        // attract trader
        let chance = Math.floor(_.random(1, 1 + (100 / (1 + this.state.lighthouse))));
        //console.log(this.state.lighthouse, chance, this.state.trader);
        if (this.state.lighthouse > 0 && !this.state.trader && chance === 1) {
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

            let nav_factor = Math.floor(100 - (this.navigation/100));
            console.log(nav_factor);

            if (resource1 === resource2 || _.random(1, nav_factor) === 1) {
                let count1 = Math.floor(0.1 * (_.random(1, 10) + [0, 10, 50, 100][size] * _.random(7, 13) * this.state.lighthouse / rates[resource1]));
                state.trader = {
                    type: 'gift', offer: {'resource1': resource1, 'count1': count1},
                    //  text: <p>Traders arrived with gifts. Their gift is <span className="badge">{count1} {resource1}</span>.</p>
                };
            }
            else {
                let count1 = Math.floor(0.1 * (_.random(1, 10) + [0, 50, 100, 250][size] * _.random(7, 13) * this.state.lighthouse / rates[resource1]));
                let count2 = Math.floor(0.1 * (_.random(1, 10) + [0, 50, 100, 250][size] * _.random(7, 13) * this.state.lighthouse / rates[resource2]));
                state.trader = {
                    type: 'trade',
                    offer: {'resource1': resource1, 'count1': count1, 'resource2': resource2, 'count2': count2},
                    //  text: <p>Trader arrival. They offer <span className="badge">{count1} {resource1}</span> for <span className="badge">{count2} {resource2}</span>.</p>
                };
            }
        }

        // feeding
        for (let i = 0; i < this.state.population; i++) {
            let selected_food = null;
            if (this.state.meals > 1) {
                selected_food = "meals";
            }
            else {
                let food = [];
                _.each(['fruits', 'roots', 'fish', 'meat', 'human_meat'], (food_type) => {
                    if (this.state[food_type] > 0) {
                        food.push(food_type);
                    }
                });

                if (food.length === 0) {
                    state.population--;
                    state.human_meat += 50;

                    let works = [];
                    _.each(professions, (profession, profession_key) => {
                        if (this.state[profession_key] > 0) {
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
                if (this.state[item] > 0) {
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
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 5) === 1) {
                            state['vegetables']++;
                        }
                    }
                }

                if (profession_key === 'hunter') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 50) === 1) {
                            state['skin']++;
                        }
                    }
                }

                if (profession_key === 'miner') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 10) === 1) {
                            state['stone']++;
                        }
                        if (_.random(1, 20) === 1) {
                            state['coal']++;
                        }
                    }
                }

                if (profession_key === 'mason') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 100 * this.state.island_type === 'mountain' ? 1 : 5) === 1) {
                            state['obsidian']++;
                        }
                        if (_.random(1, 25) === 1) {
                            state['coal']++;
                        }
                    }
                }

                if (this.state[profession_key] > 0 && this.state.volumes[profession.resource] > 0) {
                    let productivity = this.productivity(profession_key);
                    if (this.state.human_meat > 0) {
                        productivity *= 2;
                    }
                    //  console.log(productivity);
                    //  console.log(this.state[profession_key], profession.home, this.state[profession.home]);
                    for (let i = 0; i < productivity; i++) {
                        let ecofactor = this.state.volumes[profession.resource] / this.state.caps[profession.resource];
                        let difficulty = resources[profession.resource].difficulty;
                        if (this.state.tools > 0) {
                            difficulty /= 3;
                        }
                        if (this.state.instruments > 0) {
                            difficulty /= 10;
                        }
                        let top = 1 + Math.round(difficulty / ecofactor);
                        let chance = Math.ceil(_.random(1, top));
                        //  console.log(ecofactor, difficulty, top, chance);


                        if (this.state.tools > 0 && _.random(1, Math.floor((250 + (this.state.workshop * 50)) / (resources[profession.resource].vegetation ? 1 : 3))) === 1) {
                            state['tools']--;
                        }
                        if (this.state.instruments > 0 && _.random(1, Math.floor((1000 + (this.state.forge * 250)) / (resources[profession.resource].is_nature ? 1 : 3))) === 1) {
                            state['instruments']--;
                        }


                        if (chance === 1) {
                            if (profession.resource === 'moai') {
                                if (this.state.moai < this.state.ahu) {
                                    state[profession.resource]++;
                                    state.volumes[profession.resource]--;
                                }
                            }
                            else {
                                state[profession.resource]++;
                                state.volumes[profession.resource]--;  // (((

                                if (this.state.instruments > 0) {
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
                                state = transformer(state, {'fruits': 2, 'roots': 2, 'fish': 3, 'meat': 3, 'vegetables': 2, 'human_meat': 3}, 'meals');
                            }
                            return state;
                        });
                    }
                }

                if (profession_key === 'navigator') {
                    state.navigation = 1;
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        state = burner(state, (state) => { state.navigation++; return state; });
                    }
                }

                if (profession_key === 'aquarius') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 25 * this.state.island_type === 'swamp' ? 1 : 5) === 1) {
                            state['turf']++;
                        }
                    }
                }

                if (profession_key === 'herdsman') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 25) === 1) {
                            state.meat += 10;
                        }
                        if (_.random(1, 50) === 1) {
                            state.wool += 1;
                        }
                    }
                }

                if (profession_key === 'master') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        if (_.random(1, 20) === 1) {
                            state = transformer(state, {'stone': 1}, 'tools');
                        }
                    }
                }

                if (profession_key === 'smith') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
                        state = burner(state, (state) => {
                            if (_.random(1, 50) === 1) {
                                state = transformer(state, {'iron': 1, 'obsidian': 1}, 'instruments');
                            }
                            return state;
                        });
                    }
                }

                if (profession_key === 'armorer') {
                    for (let i = 0; i < this.productivity(profession_key); i++) {
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
            if (this.state.volumes[resource_key] < this.state.caps[resource_key]) {
                let new_counter = 0;
                if (resource.vegetation && this.state.aquarius > 0) {
                    let productivity = this.state.aquarius + Math.min(this.state.aquarius, this.state.canal);
                    let regen = resource.regen + Math.floor(resource.regen * productivity / 10);
                    new_counter = this.state.volumes[resource_key] + regen;
                }
                else {
                    new_counter = this.state.volumes[resource_key] + resource.regen;
                }
                state.volumes[resource_key] = new_counter > this.state.caps[resource_key] ? this.state.caps[resource_key] : new_counter;
            }
        });

        // end game
        if (state.population === 0) {
            state.score = true;
            this.pauseGame();
        }

        this.setState(state);

        localStorage.setItem("app_state", JSON.stringify(state));
    }

    startMission(type) {
        if (this.state.sailor < this.sailorsNeed()) return false;

        let len = Math.floor((this.state.navigation * 100) / this.fleetSpeed());

        let o = {};
        o.mission = type;
        o.mission_timer = len;
        o.mission_long = len;
        o.mission_distance = this.state.navigation;

        console.log(o);
        this.setState(o);

    }

    productivity(profession_key) {
        return this.state[profession_key] * Math.max(1, Math.min(this.state[profession_key], this.state[professions[profession_key].home]));
    }

    initGame(island_type, old_things = {}, old_resources = {}) {
        console.log(island_type, old_things, old_resources);

        let sum = _.sum(_.values(old_resources));

        let ratio = sum > this.fleetCapacity() ? this.fleetCapacity() / sum : 1;
        console.log('ratio: ' + ratio);
        _.each(_.keys(old_resources), (key) => {
            old_things[key] = Math.floor(old_resources[key] * ratio);
        });

        let new_state = JSON.parse(JSON.stringify(default_state));

        new_state.volumes['moai'] = new_state.building_space;
        new_state.caps['moai'] = new_state.building_space;

        let resizer = island_types[island_type].land_rates;
        _.each(_.keys(resizer), (res_key) => {
            new_state.space[res_key] = Math.floor((default_building_space + old_things.legacy) * (resizer[res_key] / 100));
        });
        new_state.space.wasteland = default_building_space - new_state.space.fertile - new_state.space.shore - new_state.space.mountain;

        _.each(_.keys(old_things), (key) => {
            new_state[key] = old_things[key];
        });

        let morf = island_types[island_type].resources_rates;

        _.each(_.keys(morf), (res_key) => {
            let cap = Math.floor(_.random(0.7, 1.3) * Math.floor(resources[res_key].max_cap * ((old_things.heritage + morf[res_key]) / 100)));
            new_state.volumes[res_key] = Math.floor(_.random(cap * 0.4, cap * 0.6));
            new_state.caps[res_key] = cap;
        });

        console.log(sum, old_resources, old_things, new_state);

        this.setState(new_state);
    }

    newGame() {
        if (!window.confirm('Are you ready to start a new game? Your progress will be lost.')) return false;

        let old_thisngs = starter_pack;
        old_thisngs.legacy = 0;
        old_thisngs.heritage = 0;

        this.initGame('tropical', old_thisngs, {});
    }

    resetGame() {
        if (this.state.sailor < this.sailorsNeed()) return false;
        if (!window.confirm('Are you ready to move to a new island? Your lost all your old island and keep only your fleet, crew and resources. New island will be bigger and rich if you built Moai.')) return false;

        let state = this.state;

        let things = {};

        let island_type = _.sample(_.keys(island_types));
        things.island_type = island_type;
        things.population = this.sailorsNeed();
        things.sailor = this.sailorsNeed();

        things.canoe = state.canoe;
        things.proa = state.proa;
        things.catamaran = state.catamaran;

        things.firs_slide = false;
        things.in_sea = true;
        things.shore = false;
        things.embarked = false;
        things.score = false;

        things.legacy = state.legacy;
        things.heritage = state.heritage;
        if (state.moai > 0) {
            things.legacy++;
            things.heritage += state.moai;
        }

        let res = {
            'fruits': state.fruits,
            'roots': state.roots,
            'fish': state.fish,
            'meat': state.meat,
            'wood': state.wood,
            'stone': state.stone,
            'iron': state.iron,
            'vegetables': state.vegetables,
            'meals': state.meals,
            'tools': state.tools,
            'instruments': state.instruments,
        };

        this.initGame('tropical', things, res);
    }

    lockedTill(factor) {
        if (factor === true) return false;
        return this.state[factor] > 0 ? false : true;
    }

    build(building_key, type = 'buildings', cost = false) {
        if (this.isEnough(building_key, type, cost) && (type !== 'buildings' || this.spaceEnough(buildings[building_key].build_on))) {
            if (!cost) {
                cost = buildings[building_key].cost;
            }
            this.charge(cost);
            let o = {};
            o[building_key] = this.state[building_key] + 1;
            this.setState(o);
        }
    }

    ruin(key, skip_firing = false) {
        console.log(key);
        console.log(this.state[key]);
        if (this.state[key] < 1) return;
        if (!window.confirm('Are you sure?')) return false;
        let o = {};
        o[key] = this.state[key] - 1;

        if (!skip_firing && o[key] === 0) {
            o[buildings[key].worker] = 0;
        }

        this.setState(o);
    }

    isEnough(building_key, type = 'buildings', cost = false) {
        if (type === 'buildings') {
            if (!this.spaceEnough(buildings[building_key].build_on)) return false;
        }

        if (!cost) {
            cost = buildings[building_key].cost;
        }

        let enough = true;
        _.each(cost, (value, resource_key) => {
            if (this.state[resource_key] < value) enough = false;
        });
        return enough;
    }

    collect(resource_key) {
        let count = resource_key === 'wood' ? 1 : 10;

        if (this.state.volumes[resource_key] > count) {
            let o = {volumes: this.state.volumes};
            o[resource_key] = this.state[resource_key] + count;
            o.volumes[resource_key] = this.state.volumes[resource_key] - count;
            this.setState(o);
        }
    }

    charge(cost) {
        console.log(cost);
        let o = {};
        _.each(cost, (value, resource_key) => {
            o[resource_key] = this.state[resource_key] - value;
        });
        this.setState(o);
    }

    chargeState(state, cost) {
        console.log(cost);
        _.each(cost, (value, resource_key) => {
            state[resource_key] -= value;
        });
        return state;
    }

    gain(cost) {
        console.log(cost);
        _.each(cost, (value, resource_key) => {
            let o = {};
            o[resource_key] = this.state[resource_key] + value;
            this.setState(o);
        });
    }

    sumSpace() {
        return this.state.space.shore + this.state.space.fertile + this.state.space.mountain + this.state.space.wasteland;
    }

    sumBuild() {
        let busy = 0;
        _.each(_.keys(buildings), (building_key) => { busy += this.state[building_key]; });
        return busy;
    }

    spaceEnough(land_type = null) {
        if (this.sumBuild() >= this.sumSpace()) {
            return false;
        }

        if (!land_type || land_type === 'any') {
            return this.sumBuild() < this.sumSpace();
        }

        switch (land_type) {
            case 'shore':
                return this.state.bonfire + this.state.lighthouse + this.state.pier < this.state.space.shore;
            case 'fertile':
                return this.state.canal + this.state.garden + this.state.field + this.state.pasture + this.state.lodge + this.state.sawmill < this.state.space.fertile;
            case 'mountain':
                return this.state.quarry + this.state.mine < this.state.space.mountain;
            case 'wasteland':
                return this.sumBuild() < this.sumSpace();
            default:
                console.log('wrong land type');
        }

    }

    built(land_type = 'any') {
        let model = {shore: 0, fertile: 0, mountain: 0, wasteland: 0};
        model.shore = this.state.bonfire + this.state.lighthouse + this.state.pier;
        model.fertile = this.state.canal + this.state.garden + this.state.field + this.state.pasture + this.state.lodge + this.state.sawmill;
        model.mountain = this.state.quarry + this.state.mine;
        model.wasteland = Math.min((this.state.hut + this.state.house + this.state.workshop + this.state.forge + this.state.armory), this.state.space.wasteland);
        model.any = this.sumBuild();

        return model[land_type];
    }

    busy() {
        let busy = 0;
        _.each(_.keys(professions), (profession_key) => { busy += this.state[profession_key]; });
        return busy;
    }

    shipsSum() {
        return this.state.canoe + this.state.proa + this.state.catamaran;
    }

    sailorsNeed() {
        return this.state.canoe * ships.canoe.crew + this.state.proa * ships.proa.crew + this.state.catamaran * ships.catamaran.crew;
    }

    fleetCapacity() {
        return this.state.canoe * ships.canoe.capacity + this.state.proa * ships.proa.capacity + this.state.catamaran * ships.catamaran.capacity;
    }

    fleetSpeed() {
        if (this.state.catamaran) return ships.catamaran.speed;
        if (this.state.canoe) return ships.canoe.speed;
        if (this.state.proa) return ships.proa.speed;
        return 0;
    }

    assignWorker(work) {
        if (this.busy() < this.state.population) {
            let o = {};
            o[work] = this.state[work] + 1;
            this.setState(o)
        }
    }

    detachWorker(work) {
        if (this.state[work] > 0) {
            let o = {};
            o[work] = this.state[work] - 1;
            this.setState(o)
        }
    }

    drawCost(cost) {
        let text = '';
        _.each(cost, (value, resource) => {
            text += resource + ': ' + value + ' ';
        });
        return text;
    };


    render() {

        const make_button = (stat, name, callback, text = '', style = 'btn-success') =>
            <span key={stat + name}>
            <button className={'btn ' + style}
                    title={text} onClick={callback}> {name} </button>
          </span>;

        const make_buy_button = (stat, name, text = '', type = 'buildings', cost = false) =>
            <span className="h4" key={stat + name}>
            <button
                className={classNames('btn', 'btn-success', 'btn-xs', 'titled', (this.isEnough(stat, type, cost) ? '' : 'disabled'))}
                data-toggle="tooltip" data-placement="top" data-html="true"
                title={text} onClick={() => {
                this.build(stat, type, cost);
            }}> +1 </button>
          </span>;

        const make_arrows = (stat, name) =>
            <div key={stat + name}>
                {name}
                <button onClick={() => {
                    this.detachWorker(stat)
                }}> {'<'} </button>
                <span className="font-weight-bold badge" style={{width: '28px'}}> {this.state[stat]} </span>
                <button onClick={() => {
                    this.assignWorker(stat)
                }}> {'>'} </button>
            </div>;

        let bg_style = '';
        if (this.state.score) {
            bg_style = 'url(/night.jpg)';
        } else if (this.state.firs_slide) {
            bg_style = 'url(/start.jpg)';
        }
        else if (this.state.in_sea) {
            bg_style = 'url(/kayak.jpg)';
        }
        else if (this.state.shore) {
            bg_style = 'url(/shore.jpg)';
        }
        else if (this.state.ahu > 0) {
            bg_style = 'url(/moai.jpg)';
        }
        else if (this.state.embarked) {
            bg_style = 'url(/'+this.state.island_type+'.jpg)';
        }
        else {
            bg_style = 'url(/error.jpg)';
        }

        return (
            <div className="App clearfix">
                <div className="background-image" style={{'backgroundImage': bg_style}}>
                </div>
                <div className="content clearfix">
                    {this.state.score
                        ?
                        <div className="container">
                            <div>
                                <h1>Your nation has become extinct. </h1>
                                <h1>You have lived {this.state.tick} days. </h1>
                                <h1>Your legacy: {this.state.moai} moai.</h1>
                                {make_button('refresh', 'New Game', this.newGame, 'text')}
                            </div>
                        </div>
                        :
                        <div className="container clearfix theme-showcase" role="main">
                            <div>
                                <div>
                                    <span className="pull-left cheat"> {make_button('cheat', ' ', () => {
                                        this.setState({
                                            wood: 10000,
                                            stone: 1000,
                                            iron: 500,
                                            meals: 10000,
                                            tools: 100,
                                            instruments: 100,
                                            population: 100
                                            });
                                        }, 'text', ' cheat')}
                                    </span>

                                    <span className={this.state.embarked === true ? '' : 'cheat'}>
                                        {make_button('fruits', 'Collect Fruits', () => {
                                            this.collect('fruits');
                                        }, 'text')}
                                        {this.lockedTill('field') ? '' : make_button('roots', 'Collect Roots', () => {
                                            this.collect('roots');
                                        }, 'text')}
                                        {make_button('wood', 'Collect Wood', () => {
                                            this.collect('wood');
                                        }, 'text')}
                                    </span>

                                    <span className="pull-right">
                                        {this.state.embarked ? make_button('resettlement', 'Resettlement', this.resetGame,
                                            'text', this.state.sailor < this.sailorsNeed() ? ' btn-success btn-sm disabled' : ' btn-success btn-sm') : ''}
                                        {make_button('refresh', 'New Game', this.newGame, 'text', ' btn-xs btn-danger')}</span>
                                </div>
                            </div>

                            <div className="flex-container-row clearfix">

                                { // Left Column
                                }
                                <div className="flex-element fat panel panel-default" style={{'flexGrow': 3}}>
                                    {this.state.firs_slide === true ? <div>
                                        <p className="h4 fat">
                                            The explosion of the volcano destroys your island and everything that was dear to you. Miraculously you managed to get to the canoe. It's time to sail
                                            <span onClick={() => {
                                                this.setState({
                                                    wood: 2000,
                                                    stone: 200,
                                                    iron: 50,
                                                    meals: 1000,
                                                    tools: 100,
                                                    population: 10
                                                });
                                            }}>.</span></p>
                                            <h2>{make_button('resettlement', 'Resettlement', () => { this.setState({firs_slide: false, in_sea: true, }); this.playGame(); },
                                                'text', this.state.sailor < this.sailorsNeed() ? ' btn-success btn-sm disabled' : ' btn-success btn-sm')}</h2>
                                    </div> :
                                     this.state.embarked === true
                                        ?
                                        <div>
                                            <h4 className="App-title">Civilisation</h4>
                                            <div className="flex-container-row">
                                                <div className="flex-element">
                                                    <span className="badge bg-shore"> {this.state.space.shore - this.built('shore')} </span>
                                                    <span className="badge bg-fertile"> {this.state.space.fertile - this.built('fertile')} </span>
                                                    <span className="badge bg-mountain"> {this.state.space.mountain - this.built('mountain')} </span>
                                                    <span className="badge bg-wasteland"> {this.state.space.wasteland - this.built('wasteland')} </span>
                                                    =
                                                    <span className="badge"> {this.sumSpace() - this.sumBuild()} </span>
                                                    free space
                                                </div>
                                                <div className="flex-element">Population: {this.state.population}
                                                    / {(this.state.hut * 2) + (this.state.house * 5)}</div>
                                                <div className="flex-element"> free citizens <span
                                                    className="badge"> {this.state.population - this.busy()}</span>
                                                </div>
                                            </div>

                                            <div className="">
                                                {_.keys(buildings).map((building_key) => {
                                                    let profession_key = buildings[building_key].worker;
                                                    //  console.log(building_key, profession_key);

                                                    return <div className="clearfix" style={{'width': '100%'}}
                                                                key={building_key}>
                                                        <div className="alignleft">
                                                            { !this.lockedTill(buildings[building_key].locked_till) || this.state[building_key] > 0
                                                                ?
                                                                <span key={building_key}>
                                                                    <span className="h4">
                                                                        <span
                                                                        className={classNames('badge', 'bg-' + buildings[building_key].build_on)}> {this.state[building_key]} </span>
                                                                        {make_button(building_key + '_del', 'del',
                                                                            () => {
                                                                                this.ruin(building_key, false);
                                                                            },
                                                                            'Destroy ' + buildings[building_key].name,
                                                                            'btn-danger btn-xs' + (this.state[building_key] === 0 ? ' disabled' : ''))}

                                                                        {make_buy_button(building_key, buildings[building_key].name, buildings[building_key].text + ' Cost: ' + this.drawCost(buildings[building_key].cost))}
                                                                        <span className="label label-default titled"
                                                                        title={buildings[building_key].text + ' Cost: ' + this.drawCost(buildings[building_key].cost)}> {buildings[building_key].name} </span>
                                                                    </span>
                                                                </span>
                                                                : ''
                                                            }
                                                        </div>
                                                        <div className="alignright">
                                                            {profession_key === null ? '' :
                                                                this.lockedTill(professions[profession_key].locked_till)
                                                                    ? ''
                                                                    :
                                                                    <div key={profession_key} className="filament">
                                                                        <h4 className="slim">
                                                                            {make_arrows(profession_key, <span
                                                                                key={profession_key}
                                                                                className="label label-default titled"
                                                                                title={professions[profession_key].text}> {professions[profession_key].name} </span>)}
                                                                        </h4>
                                                                    </div>

                                                            }
                                                        </div>
                                                    </div>;
                                                })}
                                            </div>
                                        </div>
                                        : this.state.in_sea ? <div>
                                        <p className="h4 fat">Your boat throws waves, but you hold the oar firmly. The last
                                            in your tribe, you tirelessly row, in search of a new
                                            haven. How not to die of hunger<span onClick={() => {
                                                this.setState({
                                                    wood: 2000,
                                                    stone: 200,
                                                    iron: 50,
                                                    meals: 1000,
                                                    tools: 100,
                                                    population: 10
                                                });
                                            }}>?</span></p>
                                    </div>  : <div>
                                        <p className="h4 fat">Your ship boarded on the inhabitant island. Fortunately, life
                                            is accelerating in this place, and you can survive there for a while.
                                            Praying Moai idol is the legacy of your people. Celebrate them and let your
                                            civilization
                                            grow<span onClick={() => {
                                                this.setState({
                                                    wood: 2000,
                                                    stone: 200,
                                                    iron: 50,
                                                    meals: 1000,
                                                    tools: 100,
                                                    population: 10
                                                });
                                            }}>!</span></p>
                                        {make_button('embark', 'Disembark', () => {
                                            this.setState({shore: false, embarked: true});
                                        })}
                                    </div>
                                    }
                                </div>


                                { // Right Column 1
                                }


                                {this.state.firs_slide === true ? '' :
                                <div className="flex-element fat panel panel-info" style={{'height': '100%'}}>
                                    <div className="panel panel-info">
                                        <h4 className="App-title">Fleet</h4>
                                        <div>
                                            <div className="flex-container-column">
                                                {_.keys(ships).map((ship_key) => {
                                                    return !this.lockedTill(ships[ship_key].locked_till) || this.state[ship_key] > 0
                                                        ?
                                                        <div key={ship_key} className="flex-element">
                                                            <span className="h4">
                                                                <span className="badge"> {this.state[ship_key]} </span>
                                                                {this.state.embarked && !this.state.mission ? make_button(ship_key + '_del', 'del',
                                                                    () => {
                                                                        this.ruin(ship_key, true);
                                                                    },
                                                                    'Destroy ' + ships[ship_key].name,
                                                                    'btn-danger btn-xs' + (this.state[ship_key] === 0 ? ' disabled' : '')) : ''}
                                                                {this.lockedTill(ships[ship_key].locked_till) || !this.state.embarked || this.state.mission
                                                                    ? ''
                                                                    : make_buy_button(ship_key, ships[ship_key].name, ships[ship_key].text + ' Crew: ' + ships[ship_key].crew + ' Speed: ' + ships[ship_key].speed + ' Capacity: ' + ships[ship_key].capacity + ' Cost: ' + this.drawCost(ships[ship_key].cost), 'ships', ships[ship_key].cost)}

                                                                <span className="label label-default titled"
                                                                      title={ships[ship_key].text + ' Cost: ' + this.drawCost(ships[ship_key].cost)}> {ships[ship_key].name} </span>
                                                            </span>
                                                        </div>
                                                        : '';
                                                })}
                                            </div>
                                            <div>
                                                <span>
                                                    Ships: {this.shipsSum()} Crew: {this.state.sailor} / {this.sailorsNeed()}
                                                </span>
                                                <div>
                                                    Speed: {this.fleetSpeed()} Capacity: {this.fleetCapacity()}
                                                </div>
                                                {this.state.embarked ? <div className="">
                                                    {make_arrows('sailor', <span key='sailor'
                                                                                 className="label label-default titled"
                                                                                 title={professions.sailor.text}> {professions.sailor.name} </span>)}
                                                </div> : ''}
                                            </div>
                                            <div>
                                                {this.state.mission
                                                    ? <div>Your fleet in {this.state.mission}. Return back
                                                    in {this.state.mission_timer} days.</div>
                                                    :
                                                    <div className={this.shipsSum() === 0 ? 'hidden' : ''}>
                                                        {make_button('fishing', 'Fishing', () => {
                                                            this.startMission('fishing');
                                                        }, 'text', this.state.sailor < this.sailorsNeed() ? ' btn-info btn-sm disabled' : ' btn-info btn-sm')}
                                                        {this.lockedTill('lighthouse') ? '' : make_button('discovery', 'Discovery', () => {
                                                            this.startMission('discovery');
                                                        }, 'text', this.state.sailor < this.sailorsNeed() ? ' btn-warning btn-sm disabled' : ' btn-warning btn-sm')}
                                                        {this.lockedTill('lodge') ? '' : make_button('robbery', 'Robbery', () => {
                                                            this.startMission('robbery');
                                                        }, 'text', this.state.sailor < this.sailorsNeed() ? ' btn-danger btn-sm disabled' : ' btn-danger btn-sm')}
                                                    </div>
                                                }
                                            </div>
                                            <div>
                                                {this.state.mission_text !== null
                                                    ?
                                                    <div>
                                                        {this.state.mission_text}
                                                        {make_button('ok', 'ok', () => {
                                                            this.setState({'mission_text': null});
                                                        }, '', 'btn-info btn-xs')}
                                                    </div>
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="fat ">
                                        {this.state.trader !== false
                                            ?
                                            <div>
                                                {this.state.trader.type === 'gift'
                                                    ?
                                                    <div className="panel panel-info">
                                                        <h4>Traders arrived with gifts.</h4>
                                                        <p>Their gift is <span
                                                            className="badge">{this.state.trader.offer.count1} {this.state.trader.offer.resource1}</span>
                                                        </p>
                                                        {make_button('take', 'Take',
                                                            () => {
                                                                console.log(this.state.trader);
                                                                let o = {};
                                                                o[this.state.trader.offer.resource1] = this.state[this.state.trader.offer.resource1] + this.state.trader.offer.count1;
                                                                o['trader'] = false;
                                                                this.setState(o);
                                                            }, '', 'btn-success btn-sm')}
                                                    </div>
                                                    :
                                                    <div className="panel panel-info">
                                                        <h4>Traders arrived.</h4>
                                                        <p>They offer <span
                                                            className="badge">{this.state.trader.offer.count1} {this.state.trader.offer.resource1}</span>
                                                            for <span
                                                                className="badge">{this.state.trader.offer.count2} {this.state.trader.offer.resource2}</span>
                                                        </p>
                                                        {make_button('trade', 'Trade',
                                                            () => {
                                                                if (this.state[this.state.trader.offer.resource2] < this.state.trader.offer.count2) return false;
                                                                let o = {};
                                                                o[this.state.trader.offer.resource2] = this.state[this.state.trader.offer.resource2] - this.state.trader.offer.count2;
                                                                o[this.state.trader.offer.resource1] = this.state[this.state.trader.offer.resource1] + this.state.trader.offer.count1;
                                                                o['trader'] = false;
                                                                this.setState(o);
                                                            }, '', 'btn-success btn-sm')}
                                                        {make_button('cancel', 'Cancel', () => {
                                                            this.setState({trader: false});
                                                        }, '', 'btn-danger btn-sm')}
                                                    </div>
                                                }
                                            </div>
                                            : ""
                                        }
                                    </div>
                                </div>
                                }

                                { // Right Column 2
                                }
                                {this.state.firs_slide === true ? '' :
                                <div className="flex-element fat panel panel-info" style={{'height': '100%'}}>
                                    <div className="panel panel-info">
                                        <h4 className="App-title">Your Resources</h4>
                                        <div className="datablock">
                                            {_.keys(resources).map((resource_key) => {
                                                return (!this.lockedTill(resources[resource_key].locked_till) || this.state[resource_key] > 0 )
                                                    ? <div
                                                    key={resource_key}>{resources[resource_key].name}: {this.state[resource_key]}</div>
                                                    : ''
                                            })}
                                            {_.keys(items).map((item_key) => {
                                                return this.state[item_key] > 0 ? <div key={item_key}>
                                                    {items[item_key].name}: {this.state[item_key]}</div> : ''
                                            })}
                                        </div>
                                    </div>

                                    {this.state.in_sea ? <div className="panel panel-info">
                                        <h4 className="App-title">High Seas</h4>
                                        <div className="datablock">
                                            Day: {this.state.tick} in sea
                                        </div>
                                    </div> : ''}

                                    {this.state.embarked ? <div className="panel panel-info">
                                        <h4 className="App-title">Island Resources</h4>
                                        <div className="datablock">
                                            Day: {this.state.tick} on {island_types[this.state.island_type].name} island
                                            <div>Size: {this.sumSpace()} ({this.drawCost({
                                                shore: this.state.space.shore,
                                                fertile: this.state.space.fertile,
                                                mountain: this.state.space.mountain,
                                                wasteland: this.state.space.wasteland
                                            })})
                                            </div>
                                            {_.keys(resources).map((resource_key) => {
                                                return this.lockedTill(resources[resource_key].locked_till) ? '' :
                                                    <div key={resource_key}>
                                                        {resources[resource_key].name}: {Math.floor(this.state.volumes[resource_key])}
                                                        / {this.state.caps[resource_key]} </div>
                                            })}
                                        </div>
                                    </div> : ''}
                                </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default App;
