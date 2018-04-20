
import {storylines} from '../gamedata/storylines';

export default class StorylineTool {
    static run(state, storyline_key) {
     //   console.log(storyline_key, this);
        let storyline = storylines[storyline_key];
     //   console.log(storyline_key, storyline);

        state.storyline = true;
        state.storyline_name = storyline_key;
        if (storyline.init) {
     //       console.log(storyline.init, this);
            state = storyline.init.call(this, state);
        }
        state = StorylineTool.step.call(this, state, 'start');
        return state;
    }

    static step(state, step) {
    //    console.log(step, this, state);
        state.storyline_step = step;
    //    console.log(state.storyline_name, state.storyline_step);
        if (storylines[state.storyline_name].story[state.storyline_step].on_enter) {
     //       console.log({'storylineStepExecute': step});
            return storylines[state.storyline_name].story[state.storyline_step].on_enter.call(this, state);
        }
        else {
     //       console.log({'storylineStep': step});
        }
        return state;
    }

    static genAction() {}
};