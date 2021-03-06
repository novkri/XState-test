import {createMachine} from "xstate";

const complexForm = createMachine({
    id: 'complex',
    type: 'parallel',
    states: {
        dishCard: {
            initial: 'read',
            states: {
                read: {
                    on: {
                        TOGGLE_MODE: 'edit'
                    }
                },
                edit: {
                    // initial: 'create',
                    on: {
                        TOGGLE_MODE: 'read',
                    },
                    // states: {
                    //     create: {
                    //         on: { EDIT: 'edit' },
                    //     },
                    //     edit: {
                    //         on: { CREATE: 'create' },
                    //     },
                    // }
                }
            }
        },
        dishType: {
            initial: 'none',
            states: {
                none: { on: { SET_DISH: 'dish', SET_GOOD: 'good' } },
                good: { on: { TOGGLE_DISH: 'dish' } },
                dish: { on: { TOGGLE_DISH: 'good' } },
            },
        },
    }

})

export default complexForm
