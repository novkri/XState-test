<template>
  <div>
    <button @click="send('TOGGLE_MODE')">switch</button>
    <div class="card" v-if="state.matches('dishCard.read')">
       read
    </div>
    <div v-else>editable
      <div>
        <div v-if="state.matches({ dishCard: 'edit', dishType: 'dish'})">dish</div>
        <div v-if="state.matches({ dishCard: 'edit', dishType: 'good'})">good</div>
        <button @click="switchType">switch</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useMachine} from "@xstate/vue";
import complexFormMachine from "@/machines/complexForm.machine";
import {reactive} from "vue";

const { state, send } = useMachine(complexFormMachine)
const obj = reactive({
  type: ''
})
const switchType = () => {
  console.log(state.value.value)
  console.log(obj)
  if (!obj.type) {
    send('SET_DISH')
    obj.type = state.value.value.dishType
  } else {
    send('TOGGLE_DISH')
    obj.type = state.value.value.dishType
  }
}
</script>

<style scoped lang="scss"></style>
