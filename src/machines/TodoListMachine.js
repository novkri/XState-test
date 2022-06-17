import {createMachine} from "xstate";

const TodoListMachine = createMachine({
    id: 'list',
    initial: 'hidden',
    states: {
        hidden: {
            on: {
                OPEN_LIST: 'visible'
            }
        },
        visible: {
            on: {
                HIDE_LIST: 'hidden'
            }
        }
    }
})

export default TodoListMachine
