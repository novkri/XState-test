import {createMachine} from "xstate";

const lightMachine = createMachine({
    // identifier
    id: 'light',

    // initial state
    initial: 'green',

    // local context for entire machine
    context: {
        elapsed: 0,
        direction: 'east'
    },

    // state definitions
    states: {
        green: {
            // action on state entry
            entry: 'alertGreen'
        },
        yellow: {},
        red: {}
    }
}, {
    // actions - the mapping of action names to their implementation
    actions: {
        alertGreen: (context, event) => {
            alert('green')
        }
    },

    // delays - the mapping of delay names to their implementation
    delays: {},

    // guards - the mapping of transition guard (cond) names to their implementation
    guards: {},

    // services - the mapping of invoked service (src) names to their implementation
    services: {}
})

export default lightMachine
