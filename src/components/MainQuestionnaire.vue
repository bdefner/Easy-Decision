<script setup>
import { onMounted, reactive, ref } from 'vue';
import DefineAlternatives from './DefineAlternatives.vue';
import DefineComparisons from './DefineComparisons.vue';
import DefineCriteria from './DefineCriteria.vue';
import DefineQuestion from './DefineQuestion.vue';
import QuestionnaireNavigation from './QuestionnaireNavigation.vue';
import ResultsSlide from './ResultsSlide.vue';

const question = ref('');
let criteria = reactive([]);
let alternatives = ref([]);
let allDone = ref(false);

let criteriaComparisons = ref({});
const alternativesComparisons = reactive([]);

const currentSlide = ref(0);

const handleQuestionUpdate = (updatedQuestion) => {
  question.value = updatedQuestion;
};

onMounted(() => {
  console.log('criteria :', criteria);
});

function updateSlide(newSlide) {
  currentSlide.value = newSlide;
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
  console.log(
    'criteria :',
    criteria,
    'alternatives :',
    alternatives,
    'criteriaComparisons :',
    criteriaComparisons,
    'alternativesComparisons :',
    alternativesComparisons,
  );
}
</script>

<template>
  <div>
    <DefineQuestion
      @questionUpdated="handleQuestionUpdate"
      v-if="currentSlide === 0"
    />
    <DefineCriteria
      :criteria="criteria"
      @updateCriteria="updateCriteria"
    />
    <DefineAlternatives
      :alternatives="alternatives"
      @updateAlternatives="updateAlternatives"
    />
    <DefineComparisons
      :items="criteria"
      label="Criteria Comparison"
      @update-comparisons="updateCriteriaComparisons"
    />
    <div
      v-for="(criterion, index) in criteria"
      :key="index"
    >
      <DefineComparisons
        :items="alternatives"
        :label="`Compare alternatives for ${criterion}`"
        @update-comparisons="
          (updatedComparisons) =>
            updateAlternativesComparisons(updatedComparisons, criterion)
        "
      />
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
    <QuestionnaireNavigation
      :currentSlide="currentSlide"
      @updateSlide="updateSlide"
    />
  </div>
</template>
