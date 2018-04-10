import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './App.css';

var timerID = null;

const resources = {
  'fruits': {name: 'Fruits', locked_till: true, difficulty: 1, max_cap: 10000, regen: 1},
  'roots': {name: 'Roots', locked_till: true, difficulty: 1, max_cap: 10000, regen: 1},
  'fish': {name: 'Fish', locked_till: 'pier', difficulty: 2, max_cap: 10000, regen: 1},
  'wildfowl': {name: 'Meat', locked_till: 'lodge', difficulty: 2, max_cap: 10000, regen: 1},
  'wood': {name: 'Wood', locked_till: true, difficulty: 1, max_cap: 10000, regen: 1},
  'stone': {name: 'Stone', locked_till: 'quarry', difficulty: 10, max_cap: 1000, regen: 0.01},
  'iron': {name: 'Iron', locked_till: 'mine', difficulty: 100, max_cap: 100, regen: 0.001},
  'moai': {name: 'Moai', locked_till: 'ahu', difficulty: 1000, max_cap: 10, regen: 0.00001}
};

const buildings = {
  'hut': {name: 'Build Hut', cost: {'wood': 100}, locked_till: true, text: 'Home for Two.'},
  'house': {name: 'Build House', cost: {'wood': 100, 'stone': 10}, locked_till: 'mine', text: 'Home for Five.'},
  'garden': {name: 'Build Garden', cost: {'wood': 100}, locked_till: 'hut', text: 'Each garden accelerates the speed of one gardener.'},
  'field': {name: 'Build Field', cost: {'wood': 100}, locked_till: 'hut', text: 'Each field accelerates the speed of one fielder.'},
  'pier': {name: 'Build Pier', cost: {'wood': 100, 'stone': 10}, locked_till: 'quarry', text: 'Each pier accelerates the speed of one fisherman.'},
  'lodge': {name: 'Build Lodge', cost: {'wood': 100, 'iron': 10, locked_till: 'mine'}, text: 'Each lodge accelerates the speed of one hunter.'},
  'sawmill': {name: 'Build Sawmill', cost: {'wood': 100, 'iron': 10}, locked_till: 'mine', text: 'Each sawmill accelerates the speed of one woodcutter.'},
  'quarry': {name: 'Build Quarry', cost: {'wood': 1000}, locked_till: 'hut', text: 'Each quarry accelerates the speed of one mason.'},
  'mine': {name: 'Build Mine', cost: {'wood': 1000, 'stone': 100}, locked_till: 'quarry', text: 'Each mine accelerates the speed of one miner.'},
  'ahu': {name: 'Build Ahu', cost: {'stone': 1000}, locked_till: 'mine', text: 'Each Ahu accelerates the speed of one builder.'},
};

const professions = {
  'gardener': {resource: 'fruits', home: 'garden', locked_till: 'hut'},
  'fielder': {resource: 'roots', home: 'field', locked_till: 'hut'},
  'fisherman': {resource: 'fish', home: 'pier', locked_till: 'pier'},
  'hunter': {resource: 'wildfowl', home: 'lodge', locked_till: 'lodge'},
  'woodcutter': {resource: 'wood', home: 'sawmill', locked_till: 'hut'},
  'mason': {resource: 'stone', home: 'quarry', locked_till: 'quarry'},
  'miner': {resource: 'iron', home: 'mine', locked_till: 'mine'},
  'builder': {resource: 'moai', home: 'ahu', locked_till: 'ahu'}
};

const default_state = {
  population: 2,


  fruits: 420,
  roots: 420,
  fish: 0,
  wildfowl: 0,

  wood: 190,
  stone: 0,
  iron: 0,
  moai: 0,


  fruits_volume: resources['fruits'].max_cap,
  roots_volume: resources['roots'].max_cap,
  fish_volume: resources['fish'].max_cap,
  wildfowl_volume: resources['wildfowl'].max_cap,

  wood_volume: resources['wood'].max_cap,
  stone_volume: resources['stone'].max_cap,
  iron_volume: resources['iron'].max_cap,
  moai_volume: resources['moai'].max_cap,


  hut: 0,
  house: 0,

  garden: 0,
  field: 0,
  pier: 0,
  lodge: 0,

  sawmill: 0,
  quarry: 0,
  mine: 0,
  ahu: 0,


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

    if (this.state.population < (this.state.hut*2) + (this.state.house*5)){
      if ( Math.ceil(_.random(1, Math.floor(100/(10+this.state.population)))) === 1 ) {
        state.population++;// ;this.setState({population: this.state.population + 1});
      }
    }

    for(let i=0; i<this.state.population; i++) {
      let food = [];
      _.each(['fruits', 'roots', 'fish', 'wildfowl'], (food_type) => { if(this.state[food_type] > 0) { food.push(food_type); } });

      if(food.length === 0) {
        state.population--;
      }
      else {
        let selected = [_.sample(food)];
        state[selected]--;
      }
    }

    _.each(professions, (profession, profession_key) => {
      if (this.state[profession_key] > 0 && this.state[profession.resource+'_volume'] > 0) {
        let productivity = this.state[profession_key] + Math.min(this.state[profession_key], this.state[profession.home]);
      //  console.log(productivity);
      //  console.log(this.state[profession_key], profession.home, this.state[profession.home]);
        for(let i=0; i<productivity; i++) {
          let ecofactor = this.state[profession.resource + '_volume'] / resources[profession.resource].max_cap;
          let top = Math.round(resources[profession.resource].difficulty * ecofactor);
          let chance = Math.ceil(_.random(1, top));
          console.log(ecofactor, top, chance);
          if ( chance === 1 ) {
            state[profession.resource]++; // = this.state[profession.resource] + 1;
            state[profession.resource+'_volume']--; // = this.state[profession.resource+'_volume'] - 1;
          }
        }
      }
    });

    _.each(resources, (resource, resource_key) => {
      if (this.state[resource_key+'_volume'] < resource.max_cap) {
        let new_counter = this.state[resource_key+'_volume'] + resource.regen;
        state[resource_key+'_volume'] = new_counter > resource.max_cap ? resource.max_cap : new_counter;
      }
    });

    if (state.population === 0) state.score = true;

    this.setState(state);

    localStorage.setItem("app_state", JSON.stringify(state));
  }

  resetGame() {
    this.setState(default_state);
  }

  lockedTill(factor) {
    if (factor === true) return false;
    return this.state[factor] > 0 ? false : true;
  }

  build(building_key) {
    if (this.isEnough(building_key)) {
      this.charge(building_key);
      let o = {};
      o[building_key] = this.state[building_key] + 1;
      this.setState(o);
    }
  }

  isEnough(building_key) {
    let building = buildings[building_key];
    let enough = true;
    _.each(building.cost, (value, resource_key) => { if(this.state[resource_key] < value) enough = false; } );
    return enough;
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

  busy() {
    return  this.state.gardener + this.state.fielder + this.state.fisherman + this.state.hunter +
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

    const make_collect_button = (stat, name, callback, text = '') =>
          <span key = {stat+name} >
            <button className={classNames('btn', 'btn-success')}
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
                <h1>Your entire people are dead. </h1>
                <h1>You have lived {this.state.tick} turns. </h1>
                <h1>Your legacy: {this.state.moai} moai.</h1>
                {make_collect_button('refresh', 'New Game', this.resetGame, 'text')}
              </div>
            </div>
            :
            <div className="container theme-showcase" role="main">
              <div>
                <div>
                  {make_collect_button('fruits', 'Collect Fruits', () => {
                    this.setState({fruits: this.state.fruits + 1});
                  }, 'text')}
                  {make_collect_button('roots', 'Collect Roots', () => {
                    this.setState({roots: this.state.roots + 1});
                  }, 'text')}
                  {make_collect_button('wood', 'Collect Wood', () => {
                    this.setState({wood: this.state.wood + 1});
                  }, 'text')}
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
                  <h4 className="App-title">Resources</h4>
                  <div className="datablock">
                    {_.keys(resources).map((resource_key) => {
                      return this.lockedTill(resources[resource_key].locked_till) ? '' : <div key={resource_key}>
                        {resources[resource_key].name}: {this.state[resource_key]}</div>
                    })}
                  </div>
                </div>

                <div className="flex-element">
                  <h4 className="App-title">Buildings</h4>
                  <div className="datablock">
                    {_.keys(buildings).map((building_key) => {
                      return this.lockedTill(buildings[building_key].locked_till) ? '' : <div key={building_key}>
                        {make_buy_button(building_key, buildings[building_key].name, buildings[building_key].text + ' Cost: ' + draw_cost(buildings[building_key].cost), buildings[building_key].locked_till)}
                        <span className="badge"> {this.state[building_key]} </span>
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
                  <h4 className="App-title">Ecology</h4>
                  <div>
                    Tick: {this.state.tick}


                    <h3 className="App-title">Natural Resources</h3>
                    <div className="datablock">
                      {_.keys(resources).map((resource_key) => {
                        return this.lockedTill(resources[resource_key].locked_till) ? '' : <div key={resource_key}>
                          {resources[resource_key].name}: {this.state[resource_key + '_volume']}</div>
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
