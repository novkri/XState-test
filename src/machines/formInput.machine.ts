import {assign, createMachine, send, Sender} from "xstate";
export interface FormInputMachineContext {
    value: Value
    errorMsg?: string
}

type Value = any

export type FormINputMachineEvent =
    | {
        type: 'CHANGE';
        value: Value;
    }
    | {
        type: 'BLUR';
    }
        | {
        type: 'FOCUS';
    }
        | {
        type: 'DISABLE';
    }
        | {
        type: 'ENABLE';
    }
        | {
        type: 'REPORT_INVALID';
        reason: string;
    };

// @ts-ignore
const formInputMachine = createMachine<FormInputMachineContext, FormINputMachineEvent>({
    id: 'formInput',
    initial: 'active',
    states: {
        active: {
            on: {
                DISABLE: 'disabled'
            },
            type: 'parallel',
            states: {
                focus: {
                    initial: 'unfocused',
                    states: {
                        focused: {
                            on: {
                                BLUR: 'unfocused'
                            }
                        },
                        unfocused: {
                            on: {
                                FOCUS: 'focused'
                            }
                        }
                    }
                },

                validation: {
                    initial: 'pending',
                    on: {
                        CHANGE: {
                            target: '.pending',
                            actions: 'assignValueToContext'
                        }
                    },
                    states: {
                        pending: {
                            on: {
                                REPORT_INVALID: {
                                    target: 'invalid',
                                    actions: 'assignReasonToErrorMessage'
                                }
                            },
                            invoke: {
                                src: 'validateField',
                                onDone: 'valid',
                                onError: 'invalid'
                            }
                        },

                        valid: {

                        },

                        invalid: {}
                    }
                }
            }
        },

        disabled: {
            on: {
                ENABLE: 'active'
            }
        },
    }
}, {
    actions: {
        assignReasonToErrorMessage: assign((context, event) => {
            if (event.type !== 'REPORT_INVALID') return {}
            return {
                errorMsg: event.reason
            }
        }),

        assignValueToContext: assign((context, event) => {
            if (event.type !== 'CHANGE') return {}
            return {
                value: event.value
            }
        })
    },
    services: {
        // @ts-ignore
        validateField: (context) => {
            console.log(context)
             new Promise((resolve, reject) => {
                 if (context.value === '') {
                     reject('empty')
                 } else {
                     resolve(true)
                 }
             })
        }
    }
})


export default formInputMachine
