import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './App.css';
import './tooltip.css';

import {resources, items, buildings, professions} from './appdata/knowledge';
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

    this.isEnough  = this.isEnough.bind(this);
    this.collect  = this.collect.bind(this);
    this.build  = this.build.bind(this);
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

    // attract new people
    if ((this.state.bonfire > 0 || this.state.moai > 0) && this.state.population < (this.state.hut*2) + (this.state.house*5)){
      if ( _.random(1, Math.floor((10*this.state.population)/(1+this.state.bonfire+(10*this.state.moai)))) === 1 ) {
        state.population++;// ;this.setState({population: this.state.population + 1});
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

      if (_.random(1, 4) === 1) {
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
            console.log(ecofactor, difficulty, top, chance);

            if (_.random(1, 100 + this.state.forge / (resources[profession.resource].is_nature ? 1 : 3)) === 1) {
              state['tools']--;
            }

            if ( chance === 1 ) {
              if (profession.resource === 'moai') {
                if (this.state.moai < this.state.ahu || true) {
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

  productivity(profession_key) {
    return this.state[profession_key] + Math.min(this.state[profession_key], this.state[professions[profession_key].home]);
  }

  resetGame() {
    this.setState(default_state);
    this.playGame();
  }

  lockedTill(factor) {
    if (factor === true) return false;
    return this.state[factor] > 0 ? false : true;
  }

  build(building_key) {
    if (this.isEnough(building_key) && (this.state.building_space - this.built()) > 0) {
      this.charge(building_key);
      let o = {};
      o[building_key] = this.state[building_key] + 1;
      this.setState(o);
    }
  }

  isEnough(building_key) {
    if (this.state.building_space - this.built() < 1) return false;

    let building = buildings[building_key];
    let enough = true;
    _.each(building.cost, (value, resource_key) => { if(this.state[resource_key] < value) enough = false; } );
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

  charge(building_key) {
    let building = buildings[building_key];
    let enough = true;
    _.each(building.cost, (value, resource_key) => {
      let o = {};
      o[resource_key] = this.state[resource_key] - value;
      this.setState(o); } );
    return enough;
  }

  built() {
    return  this.state.hut + this.state.house + this.state.bonfire + this.state.keep +
            this.state.garden + this.state.field + this.state.pier + this.state.lodge +
            this.state.sawmill + this.state.quarry + this.state.mine + this.state.forge +
            this.state.ahu;
  }

  busy() {
    return  this.state.cook + this.state.keeper +
            this.state.gardener + this.state.fielder + this.state.fisherman + this.state.hunter +
            this.state.woodcutter + this.state.mason + this.state.miner + this.state.smith +
            this.state.builder;
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

    const make_collect_button = (stat, name, callback, text = '', style = 'btn-success') =>
          <span key = {stat+name} >
            <button className={classNames('btn', style)}
                 title={text} onClick={callback}> {name} </button>
          </span>;

    const make_buy_button = (stat, name, text = '') =>
          <span key = {stat+name} >
            <button className={classNames('btn', 'titled', 'btn-success', 'btn-sm', (this.isEnough(stat) ? '' : 'disabled'))}
                 title={text} onClick={() => { this.build(stat); }}> {name} </button>
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
                  {make_collect_button('refresh', 'New Game', this.resetGame, 'text')}
                </div>
              </div>
              :
              <div className="container theme-showcase" role="main">
                <div>
                  <div>
                    <span className="pull-left cheat">{make_collect_button('cheat', ' ', () => { this.setState({wood: 10000, stone: 1000, iron: 500, meals: 10000, tools: 100}); }, 'text', ' cheat')}</span>

                    {make_collect_button('fruits', 'Collect Fruits', () => { this.collect('fruits'); }, 'text')}
                    {this.lockedTill('field') ? '' : make_collect_button('roots', 'Collect Roots', () => { this.collect('roots'); }, 'text')}
                    {make_collect_button('wood', 'Collect Wood', () => { this.collect('wood'); }, 'text')}

                    <span className="pull-right">{make_collect_button('refresh', 'New Game', this.resetGame, 'text', ' btn-xs btn-danger')}</span>
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
                                  {make_collect_button(building_key + '_del', 'del',
                                      () => {
                                        console.log(building_key);
                                        console.log(this.state[building_key]);
                                        if (!window.confirm('Are you sure?')) return false;
                                        if (this.state[building_key] < 1) return;
                                        let o = {};
                                        o[building_key] = this.state[building_key] - 1;
                                        this.setState(o);
                                      },
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
                              {make_collect_button(building_key+'_del', 'del',
                                  () => {
                                    console.log(building_key);
                                    console.log(this.state[building_key]);
                                    if (!window.confirm('Are you sure?')) return false;
                                    if(this.state[building_key] < 1) return;
                                    let o = {};
                                    o[building_key] = this.state[building_key] - 1;
                                    this.setState(o);
                                  },
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
                            {resources[resource_key].name}: {Math.floor(this.state[resource_key + '_volume'])}</div>
                        })}
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
