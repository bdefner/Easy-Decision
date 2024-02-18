<script setup>
import { defineEmits, ref } from 'vue';
import QuestionnaireNavigation from './QuestionnaireNavigation.vue';

const question = ref('');
const emit = defineEmits(['questionUpdated', 'updateSlide']);

function updateSlide(newSlide) {
  emit('questionUpdated', question.value);
  emit('updateSlide', newSlide);
}
</script>

<template>
  <div class="slide_wrap">
    <h2>Define Your Question</h2>
    <input
      v-model="question"
      placeholder="Enter the main goal"
      class="text-center"
    />
    <QuestionnaireNavigation
      :currentSlide="currentSlide"
      @updateSlide="updateSlide"
    />
  </div>
</template>
