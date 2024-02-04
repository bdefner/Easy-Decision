<script setup>
import { computed, defineProps, onMounted, watch } from 'vue';

const props = defineProps({
  alternativesComparisons: Object,
  criteriaComparisons: Object,
  question: String,
  criteria: Array,
  alternatives: Array,
});

watch(
  () => props.alternativesComparisons,
  (alternativesComparisons) => {
    console.log('alternativesComparisons :', alternativesComparisons);
  },
);

onMounted(() => {
  console.log('criteriaComparisons :', props.criteriaComparisons);
  console.log('criteria :', props.criteria);
  console.log('alternativesComparisons :', props.alternativesComparisons);
  console.log('alternatives :', props.alternatives);

  console.log(
    'debug',
    debugComputeNormalizedMatrixAndWeights(
      mockCriteriaComparisons,
      mockCriteria,
    ),
  );
});

// Utility to ensure comparison keys are consistent
const generateComparisonKey = (item1, item2) => `${item1}:${item2}`;

// Correctly handle the computation of normalized matrices and weights
function computeNormalizedMatrixAndWeights(comparisons, items) {
  let matrix = items.map(() => new Array(items.length).fill(0));
  let sumColumns = new Array(items.length).fill(0);

  items.forEach((item1, i) => {
    items.forEach((item2, j) => {
      if (i === j) {
        matrix[i][j] = 1; // Diagonal is always 1
      } else {
        const key = generateComparisonKey(item1, item2);
        const reverseKey = generateComparisonKey(item2, item1);
        matrix[i][j] = comparisons[key] || 1 / comparisons[reverseKey] || 1;
      }
      sumColumns[j] += matrix[i][j];
    });
  });

  // Normalize the matrix
  matrix = matrix.map((row) => row.map((value, j) => value / sumColumns[j]));

  // Calculate weights
  const weights = matrix.map(
    (row) => row.reduce((sum, value) => sum + value, 0) / items.length,
  );

  return { normalizedMatrix: matrix, weights };
}

// Adjusted to handle the potential structure of criteriaComparisons
const criteriaWeights = computed(() => {
  const { weights } = computeNormalizedMatrixAndWeights(
    props.criteriaComparisons,
    props.criteria,
  );
  return weights;
});

// Adjusted for alternativesComparisons
const alternativesRankings = computed(() => {
  let rankings = {};
  props.criteria.forEach((criterion) => {
    const comparisons = props.alternativesComparisons[criterion] || {};
    const { weights } = computeNormalizedMatrixAndWeights(
      comparisons,
      props.alternatives,
    );
    rankings[criterion] = props.alternatives.reduce(
      (acc, alternative, index) => {
        acc[alternative] = weights[index];
        return acc;
      },
      {},
    );
  });
  return rankings;
});

// Mock data for debugging
const mockCriteriaComparisons = {
  'criteria1:criteria2': 3, // criteria1 is three times as important as criteria2
  'criteria2:criteria1': 1 / 3,
};

const mockCriteria = ['criteria1', 'criteria2'];

// Simplified function for demonstration
function debugComputeNormalizedMatrixAndWeights(comparisons, items) {
  let matrix = items.map(() => new Array(items.length).fill(0));
  let sumColumns = new Array(items.length).fill(0);

  items.forEach((item1, i) => {
    items.forEach((item2, j) => {
      const key = `${item1}:${item2}`;
      matrix[i][j] = comparisons[key] || 1; // Use direct comparison or assume equal importance
      sumColumns[j] += matrix[i][j];
    });
  });

  matrix = matrix.map((row) => row.map((value, j) => value / sumColumns[j]));
  const weights = matrix.map(
    (row) => row.reduce((a, b) => a + b, 0) / items.length,
  );

  return weights;
}
</script>

<template>
  <div>
    <h2>Results for "{{ question }}"</h2>
    <h3>Criteria Weights</h3>
    <ul>
      <li
        v-for="(weight, index) in criteriaWeights"
        :key="`criteria-${index}`"
      >
        {{ criteria[index] }}: {{ weight.toFixed(2) }}
      </li>
    </ul>
    <h3>Alternatives Rankings by Criterion</h3>
    <div
      v-for="(criterion, index) in criteria"
      :key="`criterion-${index}`"
    >
      <h4>{{ criterion }}</h4>
      <ul>
        <li
          v-for="(score, alternative) in alternativesRankings[criterion]"
          :key="`alternative-${alternative}-${index}`"
        >
          {{ alternative }}: {{ score.toFixed(2) }}
        </li>
      </ul>
    </div>
  </div>
</template>
