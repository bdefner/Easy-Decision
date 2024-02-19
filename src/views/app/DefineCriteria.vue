<script setup>
import { defineEmits, defineProps, ref } from 'vue';
import MainButton from '../../components/MainButton.vue';
import QuestionnaireNavigation from './QuestionnaireNavigation.vue';

const props = defineProps({
  criteria: Array,
});

const criteriaMutation = ref(props.criteria);

const emit = defineEmits(['updateCriteria', 'updateSlide']);

function updateSlide(newSlide) {
  emit('updateCriteria', criteriaMutation);
  emit('updateSlide', newSlide);
}

function addCriterion() {
  criteriaMutation.value.push('');
}
</script>
<template>
  <div class="slide_wrap">
    <h2>Define Your Criteria</h2>
    <div
      v-for="(criterion, index) in criteriaMutation"
      :key="index"
    >
      <input
        v-model="criteriaMutation[index]"
        :placeholder="`Criterion ${index + 1}`"
        class="text-center"
      />
    </div>
    <MainButton
      label="add criterion"
      icon-left="PlusCircleIcon"
      @clicked="addCriterion()"
    />
    <QuestionnaireNavigation
      :currentSlide="currentSlide"
      @updateSlide="updateSlide"
    />
  </div>
</template>
