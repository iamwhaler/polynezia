import React, {Component} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './css/App.css';
import './css/conponents.css';
import './css/tooltip.css';
import './css/footer.css';

import {starter_pack, mother_island, island_types, resources, items, goods, ships, buildings, professions} from './gamedata/knowledge';
import {storylines} from './gamedata/storylines';
import StorylineTool from './engine/StorylineTool';
import {default_building_space, getDefaultState} from './gamedata/default_state';
import tick from './gamedata/tick';

var timerID = null;

class App extends Component {
    constructor(props) {
        super(props);

        this.timerID = null;

        this.resettlement = this.resettlement.bind(this);
        this.newGame = this.newGame.bind(this);

        this.getStep = this.getStep.bind(this);

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

        this.state = getDefaultState();
    }

    componentDidMount() {
        console.log('App componentDidMount');
        let story = {};
        var app_state = JSON.parse(localStorage.getItem("app_state"));

        if (app_state) {
            story = app_state;
        } else {
            let island = this.generateIsland(getDefaultState(), mother_island, starter_pack);
            story = this.storylineStart(island, 'prologue');
            console.log({'what': 'new game', island: island, story: story});
        }

        this.setState(story);
        this.playGame();
    }

    playGame() {
        clearInterval(timerID);
        timerID = setInterval(
            () => this.tick(),
            Math.floor(this.state.game_speed / this.state.game_speed_multiplier)
        );
    //    console.log('playGame', this.state);
        this.setState({game_paused: false});
    }

    pauseGame() {
        clearInterval(timerID);
    //    this.setState({game_paused: true});
    }

    setGameSpeed(speed) {
        this.setState({game_speed_multiplier: speed});
        this.playGame();
    }

    tick() {
        let old_state = this.state;
        let new_state = tick.call(this, old_state);
    //    console.log('tick with states: ', old_state, new_state);
        this.setState(new_state);
        localStorage.setItem("app_state", JSON.stringify(new_state));
    }

    startMission(type) {
        if (this.state.sailor < this.sailorsNeed()) return false;

        let len = Math.floor(((this.productivity('navigator') * 100) + 500) / this.fleetSpeed());

        let o = {};
        o.mission = type;
        o.mission_timer = len;
        o.mission_long = len;
        o.mission_distance = this.state.navigation;

        console.log(o);
        this.setState(o);

    }

    productivity(prof_key) {
        let bonus = 0;
        let bonused_by_megalith = ['gardener', 'fielder', 'herdsman', 'fisherman', 'hunter'];
        bonus += (_.indexOf(bonused_by_megalith, prof_key) && this.state.megalith > 0) ? this.productivity('astronomer') : 0;

        let productivity =  this.state[prof_key] * (1 + 0.01 * bonus) *
            (1 + Math.max(0,
                Math.min(
                    this.state[prof_key],
                    this.state[professions[prof_key].home]) - this.state.moai
            ));
    //    console.log(prof_key + ' productivity ' + productivity);
        return productivity;
    }

    loadToFleet(state) {
        let cargo = {};

        _.each(goods, (key) => {
            cargo[key] = state[key];
        });

        let sum = _.sum(_.values(cargo));
        let ratio = sum > this.fleetCapacity() ? this.fleetCapacity() / sum : 1;
        _.each(_.keys(cargo), (key) => {
            state[key] = Math.floor(cargo[key] * ratio);
        });

     //   console.log(goods, cargo, sum, ratio, state);

        return state;
    }

    generateIsland(state, island, things = {}) {
        let new_state = state;

        new_state.island_type = island.type;

        let building_space = island.custom_space ? island.custom_space : default_building_space;
        building_space +=  + new_state.legacy;
        new_state.volumes['moai'] = building_space;
        new_state.caps['moai'] = building_space;

        let resizer = island.land_rates;
        _.each(_.keys(resizer), (res_key) => {
            new_state.space[res_key] = Math.floor(building_space * (resizer[res_key] / 100));
        });
        new_state.space.wasteland = building_space - new_state.space.fertile - new_state.space.shore - new_state.space.mountain;

        _.each(_.keys(things), (key) => {
            new_state[key] = things[key];
        });

        let morf = island.resources_rates;

        _.each(_.keys(morf), (res_key) => {
            let cap = Math.floor(_.random(0.7, 1.3) * Math.floor(resources[res_key].max_cap * ((new_state.heritage + morf[res_key]) / 100)));
            new_state.volumes[res_key] = Math.floor(_.random(cap * 0.4, cap * 0.6));
            new_state.caps[res_key] = cap;
        });

        console.log('generateIsland', island, things, new_state);

        return new_state;
    }

    storylineStart(state, storyline) {
        console.log('storylineStart', storyline);
        return StorylineTool.run.call(this, state, storyline);
    }

    storylineClick(action) {
        let state = this.state;

        if (action.on_click) {
            state = _.bind(action.on_click, this)(state);
        }

        if (action.next) {
            state = StorylineTool.step.call(this, state, action.next);
        }

        this.setState(state);
    }

    newGame() {
        if (!window.confirm('Are you ready to start a new game? Your progress will be lost.')) return false;

        let island = this.generateIsland(getDefaultState(), mother_island, starter_pack);
        let story = this.storylineStart(island, 'prologue');

        this.setState(story);
        this.playGame();
    }

    resettlement() {
        if (this.state.sailor < this.sailorsNeed()) return false;
        if (!window.confirm('Are you ready to move to a new island? Your lost all your old island and keep only your fleet, crew and resources. New island will be bigger and rich if you built Moai.')) return false;

        let state = this.state;

        if (state.moai > 0) {
            state.legacy++;
            state.heritage += state.moai;
        }

        state = this.loadToFleet(state);

        _.each(_.keys(buildings), (building_key) => { state[building_key] = 0; });
        _.each(_.keys(professions), (profession_key) => { state[profession_key] = 0; });
        state.population = this.sailorsNeed();
        state.sailor = this.sailorsNeed();
        state.moai = 0;

        this.setState(this.storylineStart(state, 'resettlement'));

        this.playGame();
    }

    getStep(step = null) {
        return step
            ? storylines[this.state.storyline_name].story[step]
            : storylines[this.state.storyline_name].story[this.state.storyline_step];
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

    ruin(key, type = 'buildings') {
        console.log(key, type);
        if (this.state[key] < 1) return;
        if (!window.confirm('Are you sure? You will get back only half of the stone, wood and iron, spent during construction.')) return false;
        let state = this.state;

        state[key]--;

        let item = {'buildings': buildings, 'ships': ships}[type][key];

        let cost = item.cost;
        if (cost.wood) state.wood += Math.round(cost.wood/2);
        if (cost.stone) state.stone += Math.round(cost.stone/2);
        if (cost.iron) state.iron += Math.round(cost.iron/2);

        if (type === 'buildings' && state[key] === 0) {
            state[item.worker] = 0;
        }
        if (type === 'ships' && state[key] === 0) {
            state['sailor'] -= item.crew;
        }

        this.setState(state);
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
        let count = {'fruits': 10, 'wood': 1, 'tools': 1, 'meals': 1, 'roots': 10}[resource_key];
        //let count = resource_key === 'wood' ? 1 : 10;

        if (this.state.volumes[resource_key] > count) {
            let o = {volumes: this.state.volumes};
            o[resource_key] = this.state[resource_key] + count;
            o.volumes[resource_key] = this.state.volumes[resource_key] - count;
            this.setState(o);
        }
    }

    charge(cost) {
     //   console.log(cost);
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
        let o = {};
        _.each(cost, (value, resource_key) => {
            o[resource_key] = this.state[resource_key] + value;
        });
        this.setState(o);
    }

    gainState(state, cost) {
        console.log(cost);
        let o = {};
        _.each(cost, (value, resource_key) => {
            o[resource_key] = state[resource_key] + value;
        });
        return state;
    }

    sumSpace() {
        return this.state.space.shore + this.state.space.fertile + this.state.space.mountain + this.state.space.wasteland;
    }

    sumBuild() {
        let busy = 0;
        _.each(_.keys(buildings), (building_key) => {
          //  console.log(building_key, this.state[building_key]);
            busy += this.state[building_key]; });
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
                return this.state.orchard + this.state.canal + this.state.garden + this.state.field + this.state.pasture + this.state.sawmill < this.state.space.fertile;
            case 'mountain':
                return this.state.quarry + this.state.mine + this.state.megalith + this.state.monastery < this.state.space.mountain;
            case 'wasteland':
                return this.sumBuild() < this.sumSpace();
            default:
                console.log('wrong land type');
        }

    }

    built(land_type = 'any') {
        let model = {shore: 0, fertile: 0, mountain: 0, wasteland: 0};
        model.shore = this.state.bonfire + this.state.lighthouse + this.state.pier;
        model.fertile = this.state.orchard + this.state.canal + this.state.garden + this.state.field + this.state.pasture + this.state.lodge + this.state.sawmill;
        model.mountain = this.state.quarry + this.state.mine + this.state.megalith + this.state.monastery;
        model.wasteland = Math.min((this.state.hut + this.state.house + this.state.carpentry + this.state.workshop + this.state.forge + this.state.weapon_forge + this.state.armory + this.state.ground), this.state.space.wasteland);
        model.any = this.sumBuild();

        return model[land_type];
    }

    busy() {
        let busy = 0;
        _.each(_.keys(professions), (profession_key) => { busy += this.state[profession_key]; });
        return busy;
    }


    getFleetPower() {
        return Math.floor(this.sailorsNeed() * (1 + 0.1 * this.state.canoe + 0.3 * this.state.proa + 1 * this.state.catamaran));
    }

    shipsSum() {
        return this.state.canoe + this.state.proa + this.state.catamaran;
    }

    armoredSailors() { // from 0 to 1
        return this.state.armor > this.state.sailor ? 1 : this.state.armor / this.state.sailor;
    }

    weaponedSailors() { // from 0 to 1
        return this.state.weapon > this.state.sailor ? 1 : this.state.weapon / this.state.sailor;
    }

    shipsLoss(state) {
        let tension = state.mission_long * 0.1;
        return {
            canoe: _.random(Math.min(Math.ceil(tension*10), state.canoe), state.canoe),
            proa: _.random(Math.min(Math.ceil(tension*3), state.proa), state.proa),
            catamaran: _.random(Math.min(Math.ceil(tension), state.catamaran), state.catamaran)
        };
    }

    shipsReward(state) {
        let ships_reward = (state.mission_distance + this.sailorsNeed()) * _.random(7, 13);
        let new_ships = {
            canoe: Math.ceil((_.random(0, ships_reward) - 10) / 25),
            proa: Math.ceil((_.random(0, ships_reward) - 50) / 100),
            catamaran: Math.ceil((_.random(0, ships_reward) - 100) / 500)
        };
        let reward_ships = {};
        _.each(new_ships, (count, ship) => {
            if (count > 0) reward_ships[ship] = count;
        });
        return reward_ships;
    }

    resourcesReward(state) {
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
        return achieved_resources;
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

    assignWorker(work, all = false) {
        if (this.busy() < this.state.population) {
            let o = {};
            o[work] = all ? this.state[work] + (this.state.population - this.busy()) : this.state[work] + 1;
            this.setState(o)
        }
    }

    detachWorker(work, all = false) {
        if (this.state[work] > 0) {
            let o = {};
            o[work] = all ? 0 : this.state[work] - 1;
            this.setState(o)
        }
    }

    drawCost(cost) {
        let text = '';
        _.each(cost, (value, resource) => {
            if (value > 0) {
                text += resource + ': ' + value + ' ';
            }
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
            <span className="" key={stat + name}>
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
                <button className="arrow-button" onClick={() => { this.detachWorker(stat, true); }}> 0 </button>
                <button className="arrow-button" onClick={() => { this.detachWorker(stat); }}> {'<'} </button>
                <span className="font-weight-bold badge h4" style={{width: '28px'}}> {this.state[stat]} </span>
                <button className="arrow-button" onClick={() => { this.assignWorker(stat); }}> {'>'} </button>
                <button className="arrow-button" onClick={() => { this.assignWorker(stat, true); }}> ∞ </button>
            </div>;


        let bg_style = this.state.environment === 'embarked'
            ? 'url(/environments/'+this.state.island_type+'.jpg)'
            : 'url(/environments/'+this.state.environment+'.jpg)';

        return (
            <div className="App">
                <div className="background-image" style={{'backgroundImage': bg_style}}>
                </div>
                <div className="content">
                    {this.state.score
                        ?
                        <div className="container">
                            <div>
                                <h1>Your nation has become extinct. </h1>
                                <h1>You have lived {Math.floor(this.state.tick/24)+1} days. </h1>
                                <h1>Your legacy: {this.state.moai} moai.</h1>
                                {make_button('refresh', 'New Game', this.newGame, '')}
                            </div>
                        </div>
                        :
                        <div className="container theme-showcase" role="main">
                            <div className="flex-container-row">
                                <span className="pull-left flex-element cheat"> {make_button('cheat', ' ', () => {
                                    this.setState({
                                        wood: 10000,
                                        stone: 1000,
                                        iron: 500,
                                        fruits: 10000,
                                        fish: 10000,
                                        meals: 10000,
                                        tools: 100,
                                        instruments: 100,
                                        population: 100,
                                        tick: 100,
                                        });
                                    }, 'text', ' cheat')}
                                </span>
                            </div>

                            <div className="flex-container-row">

                                { // Left Column
                                }
                                <div className="flex-element fat panel panel-default no-scroller clearfix" style={{'flexGrow': 3, 'minWidth': '450px'}}>
                                    {this.state.storyline === true ?
                                        <div>
                                            <p className="h4 fat">{this.getStep().text}</p>
                                            <span>
                                                {this.getStep().actions.map((action, key) => {
                                                    return make_button('action_'+key, action.text, () => { this.storylineClick(action); }, action.text, action.style);
                                                })}
                                            </span>
                                            {this.state.splash_counter ? <p className="h4 fat">{this.state.splash_counter}</p> : ''}
                                        </div>
                                        : ''
                                    }

                                    {this.state.embarked === true
                                        ?
                                        <div>
                                            <h4 className="App-title">Civilisation</h4>
                                            <div className="flex-container-row">
                                                <div className="flex-element">
                                                    <span title="Shore" className="badge bg-shore titled"> {this.state.space.shore - this.built('shore')} </span>
                                                    <span title="Fertile land" className="badge bg-fertile titled"> {this.state.space.fertile - this.built('fertile')} </span>
                                                    <span title="Mountain" className="badge bg-mountain titled"> {this.state.space.mountain - this.built('mountain')} </span>
                                                    <span title="Wasteland" className="badge bg-wasteland titled"> {this.state.space.wasteland - this.built('wasteland')} </span>
                                                    =
                                                    <span title="Free Space" className="badge"> {this.sumSpace() - this.sumBuild()} </span>
                                                    free space
                                                </div>
                                                <div className="flex-element">Population: {this.state.population}
                                                    / {(this.state.hut * 2) + (this.state.house * 4) + (this.state.monastery * 9)}</div>
                                                <div className="flex-element"> free citizens <span
                                                    className="badge"> {this.state.population - this.busy()}</span>
                                                </div>
                                            </div>

                                            <div className="scroller">
                                                {_.keys(buildings).map((building_key) => {
                                                    let profession_key = buildings[building_key].worker;
                                                    //  console.log(building_key, profession_key);

                                                    return <div className="clearfix" style={{'width': '100%'}}
                                                                key={building_key}>
                                                        <div className="alignleft">
                                                            { !this.lockedTill(buildings[building_key].locked_till) || this.state[building_key] > 0
                                                                ?
                                                                <div className="building-container"
                                                                      title={buildings[building_key].text + ' Cost: ' + this.drawCost(buildings[building_key].cost)}
                                                                      style={{backgroundImage: 'url(/buildings/'+building_key+'.jpg)'}} key={building_key}>
                                                                    <div className="building-container-content h2 fat">
                                                                        <span
                                                                        className={classNames('badge', 'filament', 'bg-' + buildings[building_key].build_on)}> {this.state[building_key]} </span>
                                                                        {make_button(building_key + '_del', 'del',
                                                                            () => {
                                                                                this.ruin(building_key, 'buildings');
                                                                            },
                                                                            'Destroy ' + buildings[building_key].name,
                                                                            'btn-danger btn-xs filament' + (this.state[building_key] === 0 ? ' disabled' : ''))}

                                                                        {make_buy_button(building_key, buildings[building_key].name, buildings[building_key].text + ' Cost: ' + this.drawCost(buildings[building_key].cost))}

                                                                        <span className="filament" title={buildings[building_key].text + ' Cost: ' + this.drawCost(buildings[building_key].cost)}>
                                                                            <span>{buildings[building_key].name}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
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
                                        : ''
                                    }
                                </div>


                                { // Right Column 1
                                }


                                {this.getFleetPower() === 0 ? '' :
                                <div className="flex-element fat panel panel-info" style={{'height': '100%', 'minWidth': '160px'}}>
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
                                                                        this.ruin(ship_key, 'ships');
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
                                                {(this.state.embarked && !this.state.mission) ? <div className="">
                                                    {make_arrows('sailor', <span key='sailor'
                                                                                 className="label label-default titled"
                                                                                 title={professions.sailor.text}> {professions.sailor.name} </span>)}
                                                </div> : ''}
                                            </div>
                                            <div>
                                                {this.state.mission
                                                    ? <div>Your fleet in {this.state.mission}. Return back
                                                    in {this.state.mission_timer} hours.</div>
                                                    :
                                                    <div className={this.shipsSum() === 0 ? 'hidden' : ''}>
                                                        {this.lockedTill('embarked') ? '' : make_button('fishing', 'Fishing', () => {
                                                            this.startMission('fishing');
                                                        }, 'text', this.state.sailor < this.sailorsNeed() ? ' btn-info btn-sm disabled' : ' btn-info btn-sm')}
                                                        {this.lockedTill('lighthouse') ? '' : make_button('discovery', 'Discovery', () => {
                                                            this.startMission('discovery');
                                                        }, 'text', this.state.sailor < this.sailorsNeed() ? ' btn-warning btn-sm disabled' : ' btn-warning btn-sm')}
                                                        {this.lockedTill('lodge') ? '' : make_button('robbery', 'Robbery', () => {
                                                            this.startMission('robbery');
                                                        }, 'text', this.state.sailor < this.sailorsNeed() ? ' btn-danger btn-sm disabled' : ' btn-danger btn-sm')}
                                                        {this.lockedTill('embarked') ? '' : make_button('resettlement', 'Resettlement', this.resettlement,
                                                            'text', this.state.sailor < this.sailorsNeed() ? ' btn-primary btn-sm disabled' : ' btn-primary btn-sm')}
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

                                    <div>
                                        {this.state.trader !== false
                                            ?
                                            <div className="fat ">
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
                                <div className="flex-element fat panel panel-info" style={{'height': '100%', 'minWidth': '160px'}}>
                                    <div className="panel panel-info">
                                        <h4 className="App-title">Your Resources</h4>
                                        <div className="datablock">
                                            {_.keys(resources).map((resource_key) => {
                                                return (!this.lockedTill(resources[resource_key].locked_till) || this.state[resource_key] > 0 )
                                                    ? <div className={classNames('titled', resources[resource_key].style)} title={resources[resource_key].text}
                                                        key={resource_key}>{resources[resource_key].name}: {this.state[resource_key]}</div>
                                                    : ''
                                            })}
                                            {_.keys(items).map((item_key) => {
                                                return this.state[item_key] > 0
                                                    ? <div className={classNames('titled', items[item_key].style)} title={items[item_key].text}
                                                           key={item_key}> {items[item_key].name}: {this.state[item_key]}</div> : ''
                                            })}
                                        </div>
                                    </div>

                                    {this.state.storm_loss !== '' ? <p>{this.state.storm_loss}</p> : ''}

                                    {this.state.in_sea ? <div className="panel panel-info">
                                        <h4 className="App-title">High Seas</h4>
                                        <div className="datablock">
                                            {Math.floor(this.state.tick%24)}:00, day {Math.floor(this.state.tick/24)+1}  in sea
                                        </div>
                                    </div> : ''}

                                    {this.state.embarked ? <div className="panel panel-info">
                                        <h4 className="App-title">Island Resources</h4>
                                        <div className="datablock">
                                            {Math.floor(this.state.tick%24)}:00, day {Math.floor(this.state.tick/24)+1} on {island_types[this.state.island_type].name} island
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

                            </div>
                        </div>
                    }
                </div>
                <div className="footer">
                    <span className="pull-left"><a href="#" onClick={this.newGame} title='Hard Reset For Developers'>new game</a></span>

                    &nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="https://t.me/polynezia">
                        <img alt="" src="http://www.advanceduninstaller.com/7b12b396d38166a899fff585e466e50d-icon.ico" />
                        &nbsp;
                        telegram
                    </a>
                    &nbsp;&nbsp;&nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="#">
                        <img alt="" src="https://static.filehorse.com/icons-web/educational-software/wikipedia-icon-32.png" />
                        &nbsp;
                        wiki
                    </a>
                    &nbsp;&nbsp;&nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="#">
                        <img alt="" src="https://images-na.ssl-images-amazon.com/images/I/418PuxYS63L.png" />
                        &nbsp;
                        reddit
                    </a>
                </div>
            </div>
        );
    }
}

export default App;
