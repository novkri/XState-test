import { createModel } from "xstate/lib/model";

const createTodo = (title: string) => {
    return {
        id: 'new Date().toISOString()',
        title,
        completed: false
    }
}

interface Todo {
    id: string
    title: string
    completed: boolean
}

const todosModel = createModel({
    todo: '',
    todos: [] as Todo[],
    filter: 'all'
}, {
        events: {
            'NEWTODO.COMMIT': (value: string) => ({value}),
        }
    }
)

export const todosMachine = todosModel.createMachine({
    id: 'todo',
    context: todosModel.initialContext,
    initial: 'loading',
    states: {
        loading: {
            entry: todosModel.assign({
                todos: (context) => {
                    console.log('entering loading state')
                    // "Rehydrate" persisted todos
                    return context.todos.map((todo) => ({
                        ...todo,
                        // ref: spawn(createTodoMachine(todo))
                    }))
                }
            }),
            // Will transition to either 'ready' immediately upon
            // entering 'loading' state
            always: 'ready'
        },

        ready: {}
    },
    on: {
        'NEWTODO.COMMIT': {
            actions: [
                todosModel.assign({
                    todo: '',
                    todos: (context, event) => {
                        console.log(event.value)
                        const newTodo = createTodo(event.value)
                        return context.todos.concat({
                                ...newTodo,
                                // ref: spawn(createTodoMachine(newTodo))
                            }
                        )
                    }
                }),
                'persist' // todo
            ],
        }
    }
})
