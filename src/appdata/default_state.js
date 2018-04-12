
import {resources} from '../appdata/knowledge';

const building_space = 42;

export const default_state = {
    population: 1,


    fruits: 420,
    roots: 0,
    fish: 0,
    wildfowl: 0,

    wood: 80,
    stone: 0,
    iron: 0,
    moai: 0,

    meals: 0,
    tools: 0,
    human_meat: 0,


    building_space: building_space,

    fruits_volume: resources['fruits'].max_cap / 2,
    roots_volume: resources['roots'].max_cap / 2,
    fish_volume: resources['fish'].max_cap / 2,
    wildfowl_volume: resources['wildfowl'].max_cap / 2,

    wood_volume: resources['wood'].max_cap / 2,
    stone_volume: resources['stone'].max_cap / 2,
    iron_volume: resources['iron'].max_cap / 2,
    moai_volume: building_space,


    bonfire: 0,
    lighthouse: 0,
    hut: 0,
    house: 0,
    canal: 0,

    garden: 0,
    field: 0,
    pier: 0,
    lodge: 0,

    sawmill: 0,
    quarry: 0,
    mine: 0,
    forge: 0,

    ahu: 0,


    sailor: 1,
    cook: 0,
    aquarius: 0,

    gardener: 0,
    fielder: 0,
    fisherman: 0,
    hunter: 0,

    woodcutter: 0,
    mason: 0,
    miner: 0,
    smith: 0,

    builder: 0,


    canoe: 1,
    proa: 0,
    catamaran: 0,


    mission: false, // fishing, discovery
    mission_timer: 0,
    mission_long: 0,


    trader: false,
    score: false,
    embarked: false,


    game_speed: 1000,
    game_speed_multiplier: 1,
    game_paused: true,
    tick: 0
};

export default {};