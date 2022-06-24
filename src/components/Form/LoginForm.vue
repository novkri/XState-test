<template>
  <div>
    <input type="text" v-model="emailInput" placeholder="email"  @click="send('FOCUS')" @blur="send('BLUR')" @input="onInput">
    <input type="text" v-model="passwordInput" placeholder="password" @click="send('FOCUS')" @blur="send('BLUR')"  @input="onInput">
    <button :disabled="state.matches('disabled')" >Submit</button>

    {{state.value}}
  </div>
</template>

<script setup lang="ts">
import formInputMachine from "@/machines/formInput.machine";
import { useMachine } from "@xstate/vue";

const { state, send, service } = useMachine(formInputMachine)
import {ref} from "vue";

// console.log(state)
// console.log(send)
// const initState = state.initialState
const emailInput = ref('')
const passwordInput = ref('')
// const submitBtn = ref()


const onInput = (event) => {
  console.log(event.target.value)

  send('CHANGE')
  // this.state.
  console.log(service)
}
</script>

<style scoped>

</style>
