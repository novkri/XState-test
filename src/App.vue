<template>
  <div id="app">
    <textarea v-model="content" />
    <div v-show="current.matches('visible.rendered')" v-html="rendered" />
    <pre v-show="current.matches('visible.raw')">{{ raw }}</pre>

    <button @click="send('SWITCH')">
      {{ current.matches('visible.raw') ? 'Show rendered Markdown' : 'Show HTML code' }}
    </button>
    <button @click="send('TOGGLE')">
      {{ current.matches('hidden') ? 'Show preview' : 'Hide preview' }}
    </button>

    <br />

    <button v-if="todoListState.matches('hidden')" @click="send('OPEN_LIST')" >Open TODO list</button>
    <TodoList v-if="todoListState.matches('visible')" />


    <br />
    <hr />
    <br />

    <LightComponent />
  </div>
</template>

<script>
import { createMachine, interpret, State } from "xstate";
import TodoList from "@/components/TodoList";
import TodoListMachine from "@/machines/TodoListMachine";
import LightComponent from "@/components/LightComponent";

const toggleMachine = createMachine({
  id: "toggle",
  initial: "visible",
  states: {
    visible: {
      on: {
        TOGGLE: 'hidden'
      },
      initial: 'rendered',
      states: {
        rendered: {
          on: { SWITCH: "raw" }
        },
        raw: {
          on: { SWITCH: "rendered" }
        },
        memo: {
          type: 'history'
        }
      }
    },
    hidden: {
      on: {
        TOGGLE: 'visible.memo'
      }
    }

  }
});

// hydrate the machine when we start it.
const savedState = JSON.parse(localStorage.getItem('state'))
const prevState = State.create(savedState || toggleMachine.initialState)
const resolvedState = toggleMachine.resolveState(prevState)

export default {
  name: 'App',
  components: {
    LightComponent,
    TodoList
  },
  data() {
    return {
      toggleService: interpret(toggleMachine),
      current: toggleMachine.initialState,
      content: "# Hello there!\n\n- Type some Markdown on the left\n- See HTML in the right\n- Magic\n\n![An orange jellyfish](https://i.picsum.photos/id/1069/400/250.jpg)",
      //   ---
      todoListService: interpret(TodoListMachine),
      todoListState: TodoListMachine.initialState
    }
  },
  created() {
    this.toggleService
        .onTransition(state => {
          this.current = state;

          try {
            const state = JSON.stringify(this.current)
            localStorage.setItem('state', state)
          } catch {
            console.error('Local storage is unavailable')
          }
        })
        .start(resolvedState);

    this.todoListService.onTransition(state => {
      this.todoListState = state
    })
  },
  computed: {
    rendered() {
      return 'Rendered txt'
    },
    raw() {
      return 'Raw txt'
    }
  },
  methods: {
    send(event) {
      this.toggleService.send(event);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
