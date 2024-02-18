<script setup>
import { defineEmits, defineProps, ref } from 'vue';
import MainButton from './MainButton.vue';
import QuestionnaireNavigation from './QuestionnaireNavigation.vue';

const props = defineProps({
  alternatives: Array,
});

const alternativesMutation = ref(props.alternatives);

const emit = defineEmits(['updateAlternatives', 'updateSlide']);

// onMounted(() => {
//   console.log('criteria :', props.criteria);
// });

function addAlternative() {
  alternativesMutation.value.push('');
}

function updateSlide(newSlide) {
  emit('updateAlternatives', alternativesMutation);
  emit('updateSlide', newSlide);
}
</script>
<template>
  <div class="slide_wrap">
    <h2>Define Your Alternatives</h2>
    <div
      v-for="(alternative, index) in alternativesMutation"
      :key="index"
    >
      <input
        v-model="alternativesMutation[index]"
        :placeholder="`Alternative ${index + 1}`"
        class="text-center"
      />
    </div>
    <MainButton
      label="add alternative"
      icon-left="PlusCircleIcon"
      @clicked="addAlternative()"
    />
    <QuestionnaireNavigation
      :currentSlide="currentSlide"
      @updateSlide="updateSlide"
    />
  </div>
</template>
