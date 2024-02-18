<script setup>
import { reactive, ref } from 'vue';
import DefineAlternatives from './DefineAlternatives.vue';
import DefineComparisons from './DefineComparisons.vue';
import DefineCriteria from './DefineCriteria.vue';
import DefineQuestion from './DefineQuestion.vue';
import ResultsSlide from './ResultsSlide.vue';

const question = ref('');
let criteria = reactive([]);
let alternatives = ref([]);
let allDone = ref(false);

let criteriaComparisons = ref({});
const alternativesComparisons = reactive([]);

let currentSlide = ref(0);
let dynamicSlideIndex = ref(0);

const handleQuestionUpdate = (updatedQuestion) => {
  question.value = updatedQuestion;
};

function updateSlide(direction) {
  console.log('direction :', direction);
  if (direction === 'next') {
    if (currentSlide.value === 4) {
      if (dynamicSlideIndex.value < criteria.value.length - 1) {
        // Move to the next dynamic slide
        dynamicSlideIndex.value++;
      } else {
        // All dynamic slides are done, move to the next static slide or finish
        currentSlide.value++;
        // dynamicSlideIndex.value = 0; // Reset for future navigation if needed
      }
    } else {
      currentSlide.value++;
    }
  } else if (direction === 'prev') {
    if (currentSlide.value === 3 && dynamicSlideIndex.value > 0) {
      // Move to the previous dynamic slide
      dynamicSlideIndex.value--;
    } else {
      // Move to the previous static slide, if not at the beginning
      if (currentSlide.value > 0) currentSlide.value--;
    }
  }
}

function updateCriteria(updatedCriteria) {
  criteria = updatedCriteria;
  console.log('criteria :', criteria);
}
function updateAlternatives(updatedAlternatives) {
  alternatives = updatedAlternatives;
  console.log('updatedAlternatives :', alternatives);
}

function updateCriteriaComparisons(updatedComparisons) {
  // Assuming 'criteria' is a reactive ref and accessing its value directly
  let comparisonIndex = 0;
  criteriaComparisons.value = {}; // Ensure this is a ref to an object for reactivity

  for (let i = 0; i < criteria.value.length; i++) {
    for (let j = i + 1; j < criteria.value.length; j++) {
      const forwardKey = `${criteria.value[i]}:${criteria.value[j]}`;
      const backwardKey = `${criteria.value[j]}:${criteria.value[i]}`;
      const comparisonValue = updatedComparisons[comparisonIndex];

      criteriaComparisons.value[forwardKey] = comparisonValue;
      criteriaComparisons.value[backwardKey] = 1 / comparisonValue;

      comparisonIndex++;
    }
  }
}

function updateAlternativesComparisons(updatedComparisons, criterion) {
  // Assuming 'alternatives' is a ref, directly access its value
  const altArray = alternatives.value; // Direct access for Vue 3 ref

  const pairs = [];
  for (let i = 0; i < altArray.length; i++) {
    for (let j = i + 1; j < altArray.length; j++) {
      pairs.push(`${altArray[i]}:${altArray[j]}`);
    }
  }

  // Construct the comparison object using the pairs
  const comparisonObject = pairs.reduce((acc, pair, index) => {
    if (index < updatedComparisons.length) {
      acc[pair] = parseFloat(updatedComparisons[index]); // Convert to float to ensure numeric comparison
    }
    return acc;
  }, {});

  // Directly update the alternativesComparisons reactive property
  // No need for Vue.set in Vue 3 when using reactive or ref
  alternativesComparisons[criterion] = comparisonObject;

  console.log('Updated alternativesComparisons:', alternativesComparisons);
}

function toggleAllDone() {
  allDone.value = !allDone.value;
}
</script>

<template>
  <div>
    <DefineQuestion
      v-if="currentSlide === 0"
      @questionUpdated="handleQuestionUpdate"
      @update-slide="updateSlide"
    />
    <DefineCriteria
      v-if="currentSlide === 1"
      :criteria="criteria"
      @updateCriteria="updateCriteria"
      @update-slide="updateSlide"
    />
    <DefineAlternatives
      v-if="currentSlide === 2"
      :alternatives="alternatives"
      @updateAlternatives="updateAlternatives"
      @update-slide="updateSlide"
    />
    <DefineComparisons
      v-if="currentSlide === 3"
      :items="criteria"
      label="Criteria Comparison"
      @update-comparisons="updateCriteriaComparisons"
      @update-slide="updateSlide"
    />
    <div v-if="currentSlide === 4">
      <div
        v-for="(criterion, index) in criteria"
        :key="index"
      >
        <DefineComparisons
          v-if="index === dynamicSlideIndex"
          :items="alternatives"
          :label="`Compare alternatives for ${criterion}`"
          @update-slide="updateSlide"
          @update-comparisons="
            (updatedComparisons) =>
              updateAlternativesComparisons(updatedComparisons, criterion)
          "
        />
      </div>
    </div>
    <button @click="toggleAllDone">All done</button>
    <ResultsSlide
      v-if="allDone"
      :question="question"
      :criteria="criteria"
      :alternatives="alternatives"
      :criteria-comparisons="criteriaComparisons"
      :alternatives-comparisons="alternativesComparisons"
    />
  </div>
</template>
