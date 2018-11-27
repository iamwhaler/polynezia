export const default_building_space = 24;

const default_state = {
    population: 1,


    storyline: false,
    storyline_name: '',
    storyline_step: '',


    environment: 'start',
    embarked: false,

    firs_slide: true,
    in_sea: false,
    score: false,

    trip_duration: 0,
    storm_loss: '',
    fishing_tools: 0,
    storm_set: 0,

    luck: 0,  // not used at all
    sea_search: 0, // wtf?)

    island_type: null,
    space: {shore: 0, fertile: 0, mountain: 0, wasteland: 100},

    caps: {
        fruits: 0,
        roots: 0,
        fish: 0,
        meat: 0,
        wood: 0,
        stone: 0,
        iron: 0,
        moai: 0,
    },
    volumes: {
        fruits: 0,
        roots: 0,
        fish: 0,
        meat: 0,
        wood: 0,
        stone: 0,
        iron: 0,
        moai: 0,
    },


    fruits: 0,
    roots: 0,
    fish: 0,
    meat: 0,
    wood: 0,
    stone: 0,
    iron: 0,
    moai: 0,

    //vegetables: 0,
    human_meat: 0,
    meals: 0,
    coal: 0,
    //turf: 0,
    obsidian: 0,
    wool: 0,
    skin: 0,
    shovels: 0,
    tools: 0,
    instruments: 0,
    //weapon: 0,
    armor: 0,
    //gold: 0,


    hut: 0,
    house: 0,
    //monastery: 0,
    bonfire: 0,
    pier: 0,
    lighthouse: 0,
    orchard: 0,
    //garden: 0,
    canal: 0,
    field: 0,
    pasture: 0,
    lodge: 0,
    quarry: 0,
    mine: 0,
    //megalith: 0,
    carpentry: 0,
    workshop: 0,
    sawmill: 0,
    forge: 0,
    //weapon_forge: 0,
    armory: 0,
    //ground: 0,
    ahu: 0,


    sailor: 0,
    cook: 0,
    fisherman: 0,
    navigator: 0,
    keeper: 0,
    //gardener: 0,
    aquarius: 0,
    fielder: 0,
    herdsman: 0,
    woodcutter: 0,
    hunter: 0,
    mason: 0,
    miner: 0,
    //astronomer: 0,
    carpenter: 0,
    master: 0,
    smith: 0,
    //weaponsmith: 0,
    armorer: 0,
    //instructor: 0,
    builder: 0,


    navigation: 0,

    canoe: 0,
    proa: 0,
    catamaran: 0,


    mission: false, // fishing, discovery
    mission_timer: 0,
    mission_distance: 0,
    mission_long: 0,
    mission_text: null,

    trader: false,


    //legacy: 0,
    //heritage: 0,


    game_speed: 1000,
    game_speed_multiplier: 2,
    game_paused: true,
    tick: 0
};

export const getDefaultState = () => {
    return JSON.parse(JSON.stringify(default_state));
};

export default {};