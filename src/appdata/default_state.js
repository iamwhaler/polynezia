
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
    stone_tools: 0,
    iron_tools: 0,
    human_meat: 0,


    island_type: 'tropical',
    building_space: building_space,

    caps: {
        fruits: 0,
        roots: 0,
        fish: 0,
        wildfowl: 0,
        wood: 0,
        stone: 0,
        iron: 0,
        moai: 0,
    },
    volumes: {
        fruits: 0,
        roots: 0,
        fish: 0,
        wildfowl: 0,
        wood: 0,
        stone: 0,
        iron: 0,
        moai: 0,
    },


    bonfire: 0,
    lighthouse: 0,
    hut: 0,
    house: 0,
    canal: 0,

    garden: 0,
    field: 0,
    pier: 0,
    lodge: 0,

    quarry: 0,
    mine: 0,

    workshop: 0,
    sawmill: 0,
    forge: 0,

    ahu: 0,


    sailor: 1,
    cook: 0,
    aquarius: 0,

    gardener: 0,
    fielder: 0,
    fisherman: 0,
    hunter: 0,

    mason: 0,
    miner: 0,

    master: 0,
    woodcutter: 0,
    smith: 0,

    builder: 0,


    canoe: 1,
    proa: 0,
    catamaran: 0,


    mission: false, // fishing, discovery
    mission_timer: 0,
    mission_distance: 0,
    mission_long: 0,


    trader: false,
    score: false,
    embarked: false,

    legacy: 0,
    heritage: 0,


    game_speed: 1000,
    game_speed_multiplier: 1,
    game_paused: true,
    tick: 0
};

export default {};