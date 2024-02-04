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
let alternatives = reactive([]);
let allDone = ref(false);

let criteriaComparisons = reactive({});
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
  criteriaComparisons = updatedComparisons;
  console.log('criteriaComparisons :', criteriaComparisons);
}

function updateAlternativesComparisons(updatedComparisons, criterion) {
  alternativesComparisons[criterion] = updatedComparisons;
  console.log('alternativesComparisons :', alternativesComparisons);
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
    <button @click="allDone = true">All done</button>
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
