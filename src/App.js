import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './App.css';

var timerID = null;

const resources = {
  'fruits': {name: 'Fruits', is_nature: true, locked_till: true, difficulty: 1, max_cap: 10000, regen: 1},
  'roots': {name: 'Roots', is_nature: true, locked_till: 'field', difficulty: 1, max_cap: 10000, regen: 2},
  'fish': {name: 'Fish', is_nature: true, locked_till: 'pier', difficulty: 1.5, max_cap: 10000, regen: 3},
  'wildfowl': {name: 'Meat', is_nature: true, locked_till: 'lodge', difficulty: 2, max_cap: 10000, regen: 4},
  'wood': {name: 'Wood', is_nature: true, locked_till: true, difficulty: 1, max_cap: 10000, regen: 2},
  'stone': {name: 'Stone', is_nature: false, locked_till: 'quarry', difficulty: 10, max_cap: 2500, regen: 0.1},
  'iron': {name: 'Iron', is_nature: false, locked_till: 'mine', difficulty: 100, max_cap: 500, regen: 0.01},
  'moai': {name: 'Moai', is_nature: false, locked_till: 'ahu', difficulty: 1000, max_cap: 42, regen: 0.0}
};

const buildings = {
  'bonfire': {name: 'Bonfire', cost: {'wood': 10}, locked_till: 'hut', text: 'Attracts new residents.'},
  'hut': {name: 'Hut', cost: {'wood': 50}, locked_till: true, text: 'Home for Two.'},
  'house': {name: 'House', cost: {'wood': 100, 'stone': 10}, locked_till: 'mine', text: 'Home for Five.'},
  'garden': {name: 'Garden', cost: {'fruits': 10}, locked_till: 'hut', text: 'Provide fruits. Each garden accelerates the speed of one gardener.'},
  'keep': {name: 'Keep', cost: {'wood': 100}, locked_till: 'garden', text: 'Increases living nature regeneration. Each field accelerates the speed of one keeper.'},
  'field': {name: 'Field', cost: {'wood': 100}, locked_till: 'keep', text: 'Provide roots. Each field accelerates the speed of one fielder.'},
  'pier': {name: 'Pier', cost: {'wood': 100, 'stone': 10}, locked_till: 'quarry', text: 'Provide fist. Each pier accelerates the speed of one fisherman.'},
  'lodge': {name: 'Lodge', cost: {'wood': 100, 'iron': 10}, locked_till: 'mine', text: 'Provide hunt. Each lodge accelerates the speed of one hunter.'},
  'sawmill': {name: 'Sawmill', cost: {'wood': 250, 'iron': 10}, locked_till: 'mine', text: 'Each sawmill accelerates the speed of one woodcutter.'},
  'quarry': {name: 'Quarry', cost: {'wood': 1000}, locked_till: 'bonfire', text: 'Provide stone. Each quarry accelerates the speed of one mason.'},
  'mine': {name: 'Mine', cost: {'wood': 1000, 'stone': 100}, locked_till: 'quarry', text: 'Provide iron and stone. Each mine accelerates the speed of one miner.'},
  'ahu': {name: 'Ahu', cost: {'stone': 1000}, locked_till: 'mine', text: 'Each Ahu accelerates the speed of one moai builder. Moai will attracts new residents.'},
};

const professions = {
  'gardener': {resource: 'fruits', home: 'garden', locked_till: 'garden'},
  'keeper': {resource: null, home: 'keep', locked_till: 'keep'},
  'fielder': {resource: 'roots', home: 'field', locked_till: 'field'},
  'fisherman': {resource: 'fish', home: 'pier', locked_till: 'pier'},
  'hunter': {resource: 'wildfowl', home: 'lodge', locked_till: 'lodge'},
  'woodcutter': {resource: 'wood', home: 'sawmill', locked_till: 'hut'},
  'mason': {resource: 'stone', home: 'quarry', locked_till: 'quarry'},
  'miner': {resource: 'iron', home: 'mine', locked_till: 'mine'},
  'builder': {resource: 'moai', home: 'ahu', locked_till: 'ahu'}
};

const default_state = {
  population: 1,


  fruits: 420,
  roots: 0,
  fish: 0,
  wildfowl: 0,
  human_meat: 0,

  wood: 90,
  stone: 0,
  iron: 0,
  moai: 0,


  fruits_volume: resources['fruits'].max_cap / 2,
  roots_volume: resources['roots'].max_cap / 2,
  fish_volume: resources['fish'].max_cap / 2,
  wildfowl_volume: resources['wildfowl'].max_cap / 2,

  wood_volume: resources['wood'].max_cap / 2,
  stone_volume: resources['stone'].max_cap / 2,
  iron_volume: resources['iron'].max_cap / 2,
  moai_volume: resources['moai'].max_cap / 2,

  building_space: 42,

  bonfire: 0,
  hut: 0,
  house: 0,
  keep: 0,

  garden: 0,
  field: 0,
  pier: 0,
  lodge: 0,

  sawmill: 0,
  quarry: 0,
  mine: 0,
  ahu: 0,


  keeper: 0,

  gardener: 0,
  fielder: 0,
  fisherman: 0,
  hunter: 0,

  woodcutter: 0,
  mason: 0,
  miner: 0,
  builder: 0,


  game_speed: 1000,
  game_speed_multiplier: 1,
  game_paused: true,
  tick: 0,

  score: false
};

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
      let food = [];
      _.each(['fruits', 'roots', 'fish', 'wildfowl', 'human_meat'], (food_type) => { if(this.state[food_type] > 0) { food.push(food_type); } });

      if(food.length === 0) {
        state.population--;
        state.human_meat += 10;

        let works = [];
        _.each(professions, (profession, profession_key) => {
          if (this.state[profession_key] > 0) {
            works.push(profession_key);
          }
        });
        state[_.sample(works)]--;

      }
      else {
        if (_.random(1, 10) === 1) {
          state[_.sample(food)]--;
        }
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
        if (this.state[profession_key] > 1 && this.state[profession.resource+'_volume'] > 0) {
          let productivity = this.state[profession_key] + Math.min(this.state[profession_key], this.state[profession.home]);
        //  console.log(productivity);
        //  console.log(this.state[profession_key], profession.home, this.state[profession.home]);
          for(let i=0; i<productivity; i++) {
            let ecofactor = this.state[profession.resource + '_volume'] / resources[profession.resource].max_cap;
            let top = Math.round(resources[profession.resource].difficulty * ecofactor);
            let chance = Math.ceil(_.random(1, top));
       //     console.log(ecofactor, top, chance);
            if ( chance === 1 ) {
              state[profession.resource]++; // = this.state[profession.resource] + 1;
              state[profession.resource+'_volume']--; // = this.state[profession.resource+'_volume'] - 1;
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
            this.state.sawmill + this.state.quarry + this.state.mine + this.state.ahu;
  }

  busy() {
    return  this.state.keeper +
            this.state.gardener + this.state.fielder + this.state.fisherman + this.state.hunter +
            this.state.woodcutter + this.state.mason + this.state.miner + this.state.builder;
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
            <button className={classNames('btn', 'btn-success', (this.isEnough(stat) ? '' : 'disabled'))}
                 title={text} onClick={() => { this.build(stat); }}> {name} </button>
          </span>;

    const make_arrows = (stat, name) =>
        <div key = {stat+name}>
          <button onClick={() => {this.detachWorker(stat)}}> {'<'} </button>
          <span className="font-weight-bold"> {this.state[stat]} </span>
          <button onClick={() => {this.assignWorker(stat)}}> {'>'} </button>
          {name}
        </div>;

    const draw_cost = (cost) => {
      let text = '';
      _.each(cost, (value, resource) => { text += resource + ': ' + value + ' '; });
      return text;
    };

    return (
      <div className="App">
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
                  {make_collect_button('fruits', 'Collect Fruits', () => { this.collect('fruits'); }, 'text')}
                  {this.lockedTill('keep') ? '' : make_collect_button('roots', 'Collect Roots', () => { this.collect('roots'); }, 'text')}
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
                    {this.state.human_meat > 0 ? <div key='human_meat'>
                      Human Meat: {this.state.human_meat}</div> : ''}
                  </div>
                </div>

                <div className="flex-element">
                  <h4 className="App-title">Buildings</h4>
                  <div className="datablock">
                    <span className="badge"> {this.state.building_space - this.built()} </span> free building space
                    {_.keys(buildings).map((building_key) => {
                      return this.lockedTill(buildings[building_key].locked_till) ? '' : <div key={building_key}>
                        <span>
                          <span className="badge"> {this.state[building_key]} </span>
                          {make_buy_button(building_key, 'Build ' + buildings[building_key].name, buildings[building_key].text + ' Cost: ' + draw_cost(buildings[building_key].cost))}
                        </span>
                        {make_collect_button(building_key+'_del', 'del',
                            () => {
                              console.log(building_key);
                              console.log(this.state[building_key]);
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

                <div className="flex-element">
                  <h4 className="App-title">Tribe</h4>
                  <div className="datablock">

                    <div>Population: {this.state.population} / {(this.state.hut * 2) + (this.state.house * 5)}</div>
                    <div>Free citizens: {this.state.population - this.busy()}</div>

                    {_.keys(professions).map((profession_key) => {
                      return this.lockedTill(professions[profession_key].locked_till) ? '' : make_arrows(profession_key, profession_key)
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
    );
  }
}

export default App;
