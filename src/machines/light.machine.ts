import {assign, createMachine} from "xstate";

interface LightContext {
    elapsed: number
    direction: string
    switches: number
    customDuration: number
}
// Child machine, switch states when time is up
const minuteMachine = createMachine({
    id: 'timer',
    initial: 'active',
    context: {
        duration: 1000 // default duration
    },
    states: {
        active: {
            after: {
                // todo how to  customDuration from parent ?
                30000: { target: 'finished' }
            }
        },
        finished: { type: 'final' }
    }
})

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
        switches: 0,
        customDuration: 30000
    },

    // state definitions
    states: {
        green: {
            tags: ['lightswitcher'],
            // action on state entry
            // @ts-ignore
            entry: assign<LightContext>({ switches: (ctx) => ctx.switches + 1}),
            on: {
                SWITCH: {target: 'red'},
                BREAK: {target: 'broken', cond: 'isTooManySwitches'}

            },
            invoke: {
                src: minuteMachine,
                // todo data ??
                // Deriving child context from parent context
                data: {
                    duration: (context: LightContext) => context.customDuration
                },
                onDone: 'red'
            }
        },
        yellow: {
            tags: ['lightswitcher'],

            entry: assign<LightContext>({ switches: (ctx) => ctx.switches + 1}),
            on: {
                SWITCH: 'green',
                BREAK: {target: 'broken', cond: {
                        type: 'isTooManySwitches',
                        minAmount: 4
                    }}

            },
            invoke: {
                src: minuteMachine,
                onDone: 'green'
            }
        },
        red: {
            tags: ['lightswitcher'],
            entry: assign<LightContext>({ switches: (ctx) => ctx.switches + 1}),
            on: {
                SWITCH: 'yellow',
                BREAK: {target: 'broken', cond: (context) => context.switches > 7}

            },
            // exit actions
            exit: 'logPeople',

            invoke: {
                src: minuteMachine,
                onDone: 'yellow'
            }
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
            console.log(context)
            if ('minAmount' in cond) {
                return context.switches > 7 || context.switches >= cond?.minAmount
            }
            return false

        }
    }
    ,

    // services - the mapping of invoked service (src) names to their implementation
    services: {}
})

export default lightMachine
