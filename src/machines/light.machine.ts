import {assign, createMachine} from "xstate";

interface LightContext {
    elapsed: number
    direction: string
    switches: number
}
const lightMachine = createMachine({
    // for better  context typing
    schema: {
        context: {} as LightContext
    },
    // identifier
    id: 'light',

    // initial state
    initial: 'green',

    // local context for entire machine
    context: {
        elapsed: 0,
        direction: 'east',
        switches: 0
    },

    // state definitions
    states: {
        green: {
            tags: ['lightswitcher'],
            // action on state entry
            // @ts-ignore
            entry: assign({ switches: (ctx) => ctx.switches + 1}),

            on: {
                SWITCH: {target: 'red'},
                BREAK: {target: 'broken', cond: 'isTooManySwitches'}

            }
        },
        yellow: {
            tags: ['lightswitcher'],
            // @ts-ignore
            entry: assign({ switches: (ctx) => ctx.switches + 1}),
            on: {
                SWITCH: 'green',
                BREAK: {target: 'broken', cond: {
                        type: 'isTooManySwitches',
                        minAmount: 4
                    }}

            }
        },
        red: {
            tags: ['lightswitcher'],
            // @ts-ignore
            entry: assign({ switches: (ctx: LightContext) => ctx.switches + 1}),
            on: {
                SWITCH: 'yellow',
                BREAK: {target: 'broken', cond: (context) => context.switches > 7}

            },
            // exit actions
            exit: 'logPeople',
        },
        broken: {
            type: 'parallel',
            tags: ['accident'],
            states: {
                peopleStop: {
                    entry: 'logPeople'
                },
                carsStop: {
                    entry: 'logCars'
                }
            },
            on: {
                // is activated by any event.
                "*": 'red'
            }
        }
    }
}, {
    // actions - the mapping of action names to their implementation
    actions: {
        alertGreen: (context, event) => {
            console.log('green')
        },
        logPeople: () => {
            console.log('people are stopped')
        },
        logCars: () => {
            console.log('cars are stopped')
        }
    },

    // delays - the mapping of delay names to their implementation
    delays: {},

    // guards - the mapping of transition guard (cond) names to their implementation
    guards: {
        isTooManySwitches: (context, event, { cond }) => {

            // @ts-ignore
            return context.switches > 7 || context.switches >= cond?.minAmount
        }
    }
    ,

    // services - the mapping of invoked service (src) names to their implementation
    services: {}
})

export default lightMachine
