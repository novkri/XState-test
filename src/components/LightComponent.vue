<template>
  <div class="lightswitcher">
    I am representing Light machine {{state.context.switches }}
    <div class="round" v-if="state.matches('red')" :style="{background: 'red'}" @click="send('SWITCH')" />
    <div class="round" v-if="state.matches('yellow')" :style="{background: 'yellow'}" @click="send('SWITCH')" />
    <div class="round" v-if="state.matches('green')" :style="{background: 'green'}" @click="send('SWITCH')" />
    <br />
    <button @click="send('BREAK')">Break</button>
  </div>
</template>

<script setup lang="ts">
import lightMachine from "../machines/light.machine.ts";
import {useMachine} from "@xstate/vue";


const { state, send } = useMachine(lightMachine)

console.log(state, send)

</script>

<style scoped  >
.lightswitcher {
  display: flex;
  flex-direction: column;
}
.round {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 10px;
}

button {
  width: 150px;
  margin: auto;
}
</style>
