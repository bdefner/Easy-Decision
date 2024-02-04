<script setup>
import { defineEmits, ref } from 'vue';

const question = ref('');
const emit = defineEmits(['questionUpdated']);

const emitQuestion = () => {
  emit('questionUpdated', question.value);
};
</script>

<template>
  <div>
    <h2>Define Your Question</h2>
    <input
      v-model="question"
      placeholder="Enter the main goal"
    />
    <button @click="emitQuestion">Submit</button>
  </div>
</template>
