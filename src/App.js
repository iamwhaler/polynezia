import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './App.css';
import './tooltip.css';

import {resources, items, ships, buildings, professions} from './appdata/knowledge';
import {default_state} from './appdata/default_state';

var timerID = null;

class App extends Component {
  constructor(props) {
    super(props);

    var app_state = JSON.parse(localStorage.getItem("app_state"));
    this.state = app_state ? app_state : default_state;

    this.resetGame = this.resetGame.bind(this);
    this.playGame = this.playGame.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.setGameSpeed = this.setGameSpeed.bind(this);
    this.tick = this.tick.bind(this);

    this.lockedTill = this.lockedTill.bind(this);

    this.shipsSum  = this.shipsSum.bind(this);
    this.sailorsNeed  = this.sailorsNeed.bind(this);
    this.fleetCapacity  = this.fleetCapacity.bind(this);
    this.fleetSpeed  = this.fleetSpeed.bind(this);

    this.isEnough  = this.isEnough.bind(this);
    this.collect  = this.collect.bind(this);
    this.build  = this.build.bind(this);
    this.ruin  = this.ruin.bind(this);
    this.assignWorker = this.assignWorker.bind(this);
    this.detachWorker = this.detachWorker.bind(this);
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

    // fleeting
    if (state.mission !== false) {
      if (state.mission_timer === 0) {
        if (state.mission === 'fishing') {
          let reward = state.mission_long * state.shipsSum * _.random(7, 13);
          alert(reward);
          this.fish += reward;
        }
        if (state.mission === 'discovery') {
          alert('You just alive.');
        }
        state.mission = false;
      }
      else {
        state.mission_timer--;
      }
    }

    // attract new people
    if ((this.state.bonfire > 0 || this.state.moai > 0) && this.state.population < (this.state.hut*2) + (this.state.house*5)){
      if ( _.random(1, Math.floor((10*this.state.population)/(1+this.state.bonfire+(10*this.state.moai)))) === 1 ) {
        state.population++;// ;this.setState({population: this.state.population + 1});
      }
    }

    // attract trader
    let chance = Math.floor(_.random(1, 1 + (250 / (1 + this.state.lighthouse))));
    //console.log(this.state.lighthouse, chance, this.state.trader);
    if (this.state.lighthouse > 0 && !this.state.trader && chance === 1) {
      const tradable = ['fruits', 'roots', 'fish', 'wildfowl', 'wood', 'stone', 'iron'];

      let size = _.random(1, 3);
      let resource1 = _.sample(tradable);
      let resource2 = _.sample(tradable);

      if (resource1 === resource2) {
        let count1 = Math.floor(0.1 * (_.random(1, 10) + [0, 5, 25, 50][size] * _.random(7, 13) * this.state.lighthouse / resources[resource1].difficulty));
        state.trader = {type: 'gift', offer: {'resource1': resource1, 'count1': count1},
          text: 'Traders arrived with gifts. Their gift is  '+count1+' '+resource1+'.'};
      }
      else {
        let count1 = Math.floor(0.1 * (_.random(1, 10) + [0, 10, 50, 250][size] * _.random(7, 13) * this.state.lighthouse / resources[resource1].difficulty));
        let count2 = Math.floor(0.1 * (_.random(1, 10) + [0, 10, 50, 250][size] * _.random(7, 13) * this.state.lighthouse / resources[resource2].difficulty));
        state.trader = {type: 'trade', offer: {'resource1': resource1, 'count1': count1, 'resource2': resource2, 'count2': count2},
          text: 'Trader arrival. They offer '+count1+' '+resource1+' for '+count2+' '+resource2+'.'};
      }
    }

    // feeding
    for(let i=0; i<this.state.population; i++) {
      let selected_food = null;
      if (this.state.meals > 1) {
        selected_food = "meals";
      }
      else {
        let food = [];
        _.each(['fruits', 'roots', 'fish', 'wildfowl', 'human_meat'], (food_type) => { if(this.state[food_type] > 0) { food.push(food_type); } });

        if(food.length === 0) {
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

      if (_.random(1, 3) === 1) {
        state[selected_food]--;
      }
    }

    // work
    _.each(professions, (profession, profession_key) => {
      if (profession.resource) {
        if (profession_key === 'miner') {
          for (let i=0; i<Math.min(this.state.mine, this.state.miner); i++) {
            if (_.random(1, 5) === 1) {
              state['stone']++;
            }
          }
        }
        if (this.state[profession_key] > 0 && this.state[profession.resource+'_volume'] > 0) {
          let productivity = this.productivity(profession_key); // this.state[profession_key] + Math.min(this.state[profession_key], this.state[profession.home]);
          if (this.state.human_meat > 0) {
            productivity *= 2;
          }
        //  console.log(productivity);
        //  console.log(this.state[profession_key], profession.home, this.state[profession.home]);
          for(let i=0; i<productivity; i++) {
            let ecofactor = this.state[profession.resource + '_volume'] / resources[profession.resource].max_cap;
            let difficulty = this.state.tools > 0 ? resources[profession.resource].difficulty/10 : resources[profession.resource].difficulty;
            let top = 1 + Math.round(difficulty / ecofactor);
            let chance = Math.ceil(_.random(1, top));
          //  console.log(ecofactor, difficulty, top, chance);

            if (_.random(1, 100 + this.state.forge / (resources[profession.resource].is_nature ? 1 : 3)) === 1) {
              state['tools']--;
            }

            if ( chance === 1 ) {
              if (profession.resource === 'moai') {
                if (this.state.moai < this.state.ahu) {
                  state[profession.resource]++;
                  state[profession.resource + '_volume']--;
                }
              } else {
                state[profession.resource]++;

                state[profession.resource + '_volume']--;  // (((
                if (this.state.tools > 0) {
                  if (profession.resource !== 'moai' && _.random(1, 2) === 1) {
                    state[profession.resource + '_volume']++; // (((
                  }
                }

              }
            }
          }
        }
      }
      else {
        if (profession_key === 'cook') {
          for (let i=0; i<this.productivity(profession_key); i++) {
            if (this.state.wood < 1) continue;
            let food = [];
            _.each(['fruits', 'roots', 'fish', 'wildfowl', 'human_meat'], (food_type) => { if(this.state[food_type] > 0) { food.push(food_type); } });
            state[_.sample(food)]--;
            state['meals'] += 2;
            if (_.random(1, 10) === 1) {
              state['wood']--;
            }
          }
        }
        if (profession_key === 'smith') {
          for (let i=0; i<this.productivity(profession_key); i++) {
            if (this.state.iron < 1) continue;
            if (_.random(1, 50) === 1) {
              state['iron']--;
              state['tools']++;
            }
          }
        }
      }
    });

    // regeneration
    _.each(resources, (resource, resource_key) => {
      if (this.state[resource_key+'_volume'] < resource.max_cap) {
        let new_counter = 0;
        if (resource.is_nature && this.state.keeper > 0) {
          let productivity = this.state.keeper + Math.min(this.state.keeper, this.state.keep);
          let regen = resource.regen + Math.floor(resource.regen * productivity / 10);
          new_counter = this.state[resource_key+'_volume'] + regen;
        }
        else {
          new_counter = this.state[resource_key+'_volume'] + resource.regen;
        }
        state[resource_key+'_volume'] = new_counter > resource.max_cap ? resource.max_cap : new_counter;
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

    let len = ((this.state.lighthouse + 1) * 100) / this.fleetSpeed();

    let o = {};
    o.mission = type;
    o.mission_timer = len;
    o.mission_long = len;

    console.log(o);
    this.setState(o);

  }

  productivity(profession_key) {
    return this.state[profession_key] + Math.min(this.state[profession_key], this.state[professions[profession_key].home]);
  }

  resetGame() {
    if (!window.confirm('Are you ready to move to a new island? Your progress will be lost.')) return false;

    let population = this.sailorsNeed();
    let canoe = this.state.canoe;
    let proa = this.state.proa;
    let catamaran = this.state.catamaran;

    let new_state = default_state;

    new_state.population = population;
    new_state.sailor = population;
    new_state.canoe = canoe;
    new_state.proa = proa;
    new_state.catamaran = catamaran;

    this.setState(new_state);
    this.playGame();
  }

  lockedTill(factor) {
    if (factor === true) return false;
    return this.state[factor] > 0 ? false : true;
  }

  build(building_key, type = 'buildings', cost = false) {
    if (this.isEnough(building_key, type, cost) && (this.state.building_space - this.built()) > 0) {
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
    if (!window.confirm('Are you sure?')) return false;
    if(this.state[key] < 1) return;
    let o = {};
    o[key] = this.state[key] - 1;

    if (!skip_firing && o[key] === 0) {
      o[buildings[key].worker] = 0;
    }

    this.setState(o);
  }

  isEnough(building_key, type = 'buildings', cost = false) {
    if (type === 'buildings') {
      if (this.state.building_space - this.built() < 1) return false;
    }

    if (!cost) {
      cost = buildings[building_key].cost;
    }

    let enough = true;
    _.each(cost, (value, resource_key) => { if(this.state[resource_key] < value) enough = false; } );
    return enough;
  }

  collect(resource_key) {
    if (this.state[resource_key+'_volume'] > 1) {
      let o = {};
      o[resource_key] = this.state[resource_key] + 1;
      o[resource_key+'_volume'] = this.state[resource_key+'_volume'] - 1;
      this.setState(o);
    }
  }

  charge(cost) {
    let enough = true;
    _.each(cost, (value, resource_key) => {
      let o = {};
      o[resource_key] = this.state[resource_key] - value;
      this.setState(o); } );
    return enough;
  }

  built() {
    return  this.state.hut + this.state.house + this.state.bonfire + this.state.lighthouse + this.state.keep +
            this.state.garden + this.state.field + this.state.pier + this.state.lodge +
            this.state.sawmill + this.state.quarry + this.state.mine + this.state.forge +
            this.state.ahu;
  }

  busy() {
    return  this.state.cook + this.state.keeper +  this.state.sailor +
            this.state.gardener + this.state.fielder + this.state.fisherman + this.state.hunter +
            this.state.woodcutter + this.state.mason + this.state.miner + this.state.smith +
            this.state.builder;
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
    if (this.state.proa) return ships.proa.speed;
    if (this.state.canoe) return ships.canoe.speed;
    return false;
  }

  assignWorker(work) {
    if (this.busy() < this.state.population ) {
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


  render() {

    const make_button = (stat, name, callback, text = '', style = 'btn-success') =>
          <span key = {stat+name} >
            <button className={'btn ' + style}
                 title={text} onClick={callback}> {name} </button>
          </span>;

    const make_buy_button = (stat, name, text = '', type = 'buildings', cost = false) =>
          <span key = {stat+name} >
            <button className={classNames('btn', 'titled', 'btn-success', 'btn-sm', (this.isEnough(stat, type, cost) ? '' : 'disabled'))}
                    data-toggle="tooltip" data-placement="top" data-html="true"
                    title={text} onClick={() => { this.build(stat, type, cost); }}> {name} </button>
          </span>;

    const make_arrows = (stat, name) =>
        <div key = {stat+name}>
          {name}
          <button onClick={() => {this.detachWorker(stat)}}> {'<'} </button>
          <span className="font-weight-bold badge" style={{width: '28px'}}> {this.state[stat]} </span>
          <button onClick={() => {this.assignWorker(stat)}}> {'>'} </button>
        </div>;

    const draw_cost = (cost) => {
      let text = '';
      _.each(cost, (value, resource) => { text += resource + ': ' + value + ' '; });
      return text;
    };

    return (
      <div className="App">
        <div className="background-image">
        </div>
        <div className="content">
          {this.state.score
              ?
              <div className="container">
                <div>
                  <h1>Your nation has become extinct. </h1>
                  <h1>You have lived {this.state.tick} days. </h1>
                  <h1>Your legacy: {this.state.moai} moai.</h1>
                  {make_button('refresh', 'New Game', this.resetGame, 'text')}
                </div>
              </div>
              :
              <div className="container theme-showcase" role="main">
                <div>
                  <div>
                    <span className="pull-left cheat">{make_button('cheat', ' ', () => { this.setState({wood: 10000, stone: 1000, iron: 500, meals: 10000, tools: 100}); }, 'text', ' cheat')}</span>

                    {make_button('fruits', 'Collect Fruits', () => { this.collect('fruits'); }, 'text')}
                    {this.lockedTill('field') ? '' : make_button('roots', 'Collect Roots', () => { this.collect('roots'); }, 'text')}
                    {make_button('wood', 'Collect Wood', () => { this.collect('wood'); }, 'text')}

                    <span className="pull-right">{make_button('refresh', 'New Game', this.resetGame, 'text', ' cheat')}</span>
                  </div>
                </div>


                { true ? "" :
                    <span className="flex-element">
              <span onClick={() => {
                if (this.state.game_paused) {
                  this.playGame();
                } else {
                  this.pauseGame();
                }
              }}>
                <span className={classNames('glyphicon', (this.state.game_paused ? 'glyphicon-play' : 'glyphicon-pause'))}
                      style={{width: 28, height: 28}}></span>
              </span>

                      {[1, 3].map((speed, index) => {
                        return <span key={index}>
                          {this.state.game_speed_multiplier === speed
                              ? <button className="" style={{width: 42, height: 28}}><u>{{
                            0: 'slow',
                            1: 'fast',
                            2: 'faster'
                          }[index]}</u></button>
                              : <button className="" style={{width: 42, height: 28}} onClick={() => {
                            this.setGameSpeed(speed);
                          }}>{{0: 'slow', 1: 'fast', 2: 'faster'}[index]}
                          </button>}
                      </span>
                      })}

                      <span onClick={() => {
                        let i = 1;
                        let n = 24;
                        while (i <= n) {
                          this.tick((i === n));
                          i++;
                        }
                      }}>
                <img src={"24-hours-icon.png"} alt={"Next Day"} title={"Next Day"}
                     className="img" style={{width: 28, height: 28}}/>
              </span>
            </span>
                }

                <div className="flex-container-row">

                  <div className="flex-element">
                    <h4 className="App-title">Your Resources</h4>
                    <div className="datablock">
                      {_.keys(resources).map((resource_key) => {
                        return this.lockedTill(resources[resource_key].locked_till) ? '' : <div key={resource_key}>
                          {resources[resource_key].name}: {this.state[resource_key]}</div>
                      })}
                      {_.keys(items).map((item_key) => {
                        return this.state[item_key] > 0 ? <div key={item_key}>
                          {items[item_key].name}: {this.state[item_key]}</div> : ''
                      })}
                    </div>

                    <div className="fat">
                      {this.state.trader !== false
                          ?
                          <div>
                            {this.state.trader.text}
                            {this.state.trader.type === 'gift'
                                ?
                                make_button('take', 'Take',
                                    () => {
                                      console.log(this.state.trader);
                                      let o = {};
                                      o[this.state.trader.offer.resource1] = this.state[this.state.trader.offer.resource1] + this.state.trader.offer.count1;
                                      o['trader'] = false;
                                      this.setState(o);
                                    })
                                :
                                <div>
                                  {make_button('trade', 'Trade',
                                      () => {
                                        if (this.state[this.state.trader.offer.resource2] < this.state.trader.offer.count2) return false;
                                        let o = {};
                                        o[this.state.trader.offer.resource2] = this.state[this.state.trader.offer.resource2] - this.state.trader.offer.count2;
                                        o[this.state.trader.offer.resource1] = this.state[this.state.trader.offer.resource1] + this.state.trader.offer.count1;
                                        o['trader'] = false;
                                        this.setState(o);
                                      })}
                                  {make_button('cancel', 'Cancel', () => { this.setState({trader: false}); }, '', 'btn-danger')}
                                </div> }
                          </div>
                          : ""}
                    </div>

                  </div>




                  <div className="flex-element" style={{'flexGrow': 3}}>
                    <h4 className="App-title">Civilisation</h4>
                    <div className="flex-container-row">
                      <div className="flex-element"><span className="badge"> {this.state.building_space - this.built()} </span> free building space </div>
                      <div className="flex-element">Population: {this.state.population} / {(this.state.hut * 2) + (this.state.house * 5)}</div>
                      <div className="flex-element"> free citizens <span className="badge"> {this.state.population - this.busy()}</span></div>
                    </div>

                    <div className="">
                      {_.keys(buildings).map((building_key) => {
                        let profession_key = buildings[building_key].worker;
                      //  console.log(building_key, profession_key);

                        return <div className="flex-container-row" key={building_key}>
                          <div className="flex-element alignleft">
                            {this.lockedTill(buildings[building_key].locked_till)
                                ? ''
                                :
                                <div key={building_key}>
                                  <span>
                                    <span className="badge"> {this.state[building_key]} </span>
                                    {make_buy_button(building_key, '+1 ' + buildings[building_key].name, buildings[building_key].text + ' Cost: ' + draw_cost(buildings[building_key].cost))}
                                  </span>
                                  {make_button(building_key + '_del', 'del',
                                      () => { this.ruin(building_key, false); },
                                      'Destroy ' + buildings[building_key].name,
                                      'btn-danger btn-xs' + (this.state[building_key] === 0 ? ' disabled' : ''))}
                                </div>
                            }
                          </div>
                          <div className="flex-element alignright">
                            {profession_key === null ? '' :
                              this.lockedTill(professions[profession_key].locked_till)
                                ? ''
                                :
                                <div key={profession_key} className="filament">
                                  <h4 className="slim">
                                    {make_arrows(profession_key, <span key={profession_key}
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


                  <div className="flex-element hidden">
                    <h4 className="App-title">Buildings</h4>
                    <div className="datablock">
                      <span className="badge"> {this.state.building_space - this.built()} </span> free building space
                      {_.keys(buildings).map((building_key) => {
                        return this.lockedTill(buildings[building_key].locked_till)
                            ? ''
                            :
                            <div key={building_key}>
                              <span>
                                <span className="badge"> {this.state[building_key]} </span>
                                {make_buy_button(building_key, '+1 ' + buildings[building_key].name, buildings[building_key].text + ' Cost: ' + draw_cost(buildings[building_key].cost))}
                              </span>
                              {make_button(building_key+'_del', 'del', this.ruin,
                                  'Destroy '+buildings[building_key].name,
                                  'btn-danger btn-xs' + (this.state[building_key] === 0 ? ' disabled' : ''))}
                            </div>
                      })}
                    </div>
                  </div>

                  <div className="flex-element hidden">
                    <h4 className="App-title">Tribe</h4>
                    <div className="datablock">

                      <div>Population: {this.state.population} / {(this.state.hut * 2) + (this.state.house * 5)}</div>
                      <div><span className="badge"> {this.state.population - this.busy()}</span> free citizens</div>

                      {_.keys(professions).map((profession_key) => {
                        return this.lockedTill(professions[profession_key].locked_till)
                            ? ''
                            :
                            <div key={profession_key} className="filament">
                              <h4 className="slim">
                                {make_arrows(profession_key, <span key={profession_key} className="label label-default titled" title={professions[profession_key].text}> {professions[profession_key].name} </span>)}
                              </h4>
                            </div>
                      })}
                    </div>
                  </div>

                  <div className="flex-element">
                    <div>
                      <h4 className="App-title">Natural Resources</h4>
                      <div className="datablock">
                        Day: {this.state.tick}
                        {_.keys(resources).map((resource_key) => {
                          return this.lockedTill(resources[resource_key].locked_till) ? '' : <div key={resource_key}>
                            {resources[resource_key].name}: {Math.floor(this.state[resource_key + '_volume'])} / {resources[resource_key].max_cap} </div>
                        })}
                      </div>

                      <h4 className="App-title">Fleet</h4>
                      <div>
                        <div className="flex-container-row">
                          {_.keys(ships).map((ship_key) => {
                            return this.lockedTill(ships[ship_key].locked_till) ? '' :
                              <div key={ship_key}>
                                <span>
                                  <span className="badge"> {this.state[ship_key]} </span>
                                  {make_buy_button(ship_key, '+1 ' + ships[ship_key].name, ships[ship_key].text + ' Cost: ' + draw_cost(ships[ship_key].cost), 'ships', ships[ship_key].cost)}
                                </span>
                                {make_button(ship_key + '_del', 'del',
                                    () => { this.ruin(ship_key, true); },
                                    'Destroy ' + ships[ship_key].name,
                                    'btn-danger btn-xs' + (this.state[ship_key] === 0 ? ' disabled' : ''))}
                              </div>;
                          })}
                        </div>
                        <div>
                          <span>
                            Ships: {this.shipsSum()} Crew: {this.state.sailor} / {this.sailorsNeed()}
                          </span>
                          <div>
                            Speed: {this.fleetSpeed()} Capacity: {this.fleetCapacity()}
                          </div>
                          <div className="hidden">
                          {make_arrows('sailor', <span key='sailor'
                                                             className="label label-default titled"
                                                             title={professions.sailor.text}> {professions.sailor.name} </span>)}
                          </div>
                        </div>
                        {this.state.mission
                            ? <div>Your fleet in {this.state.mission}. Return back in {this.state.mission_timer} days.</div>
                            :
                            <div>
                              {this.lockedTill('pier') ? '' : make_button('fishing', 'Fishing', () => {
                                this.startMission('fishing');
                              }, 'text', this.state.sailor < this.sailorsNeed() ? ' btn-success disabled' : ' btn-success')}
                              {this.lockedTill('lighthouse') ? '' : make_button('discovery', 'Discovery', () => {
                                this.startMission('discovery');
                              }, 'text', this.state.sailor < this.sailorsNeed() ? ' btn-success disabled' : ' btn-success')}
                              {false ? '' : make_button('resetlement', 'Resetlement', this.resetGame,
                                  'text', this.state.sailor < this.sailorsNeed() ? ' btn-success disabled' : ' btn-success')}
                            </div>
                        }
                      </div>
                    </div>

                  </div>

                </div>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
