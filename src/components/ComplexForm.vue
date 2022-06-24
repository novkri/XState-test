<template>
  <div>
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

const { state, send } = useMachine(complexFormMachine)
</script>

<style scoped lang="scss"></style>
