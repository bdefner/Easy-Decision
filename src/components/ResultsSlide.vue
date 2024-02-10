<script setup>
import { computed, defineProps, watch } from 'vue';

const props = defineProps({
  alternativesComparisons: Object,
  criteriaComparisons: Object,
  question: String,
  criteria: Array,
  alternatives: Array,
});

// Mock data for debugging
// const mockCriteriaComparisons = {
//   'criteria1:criteria2': 3, // criteria1 is three times as important as criteria2
//   'criteria2:criteria1': 1 / 3,
// };

// const mockCriteria = ['criteria1', 'criteria2'];

watch(
  () => props.alternativesComparisons,
  (alternativesComparisons) => {
    console.log('alternativesComparisons :', alternativesComparisons);
  },
);

// Utility to ensure comparison keys are consistent
// const generateComparisonKey = (item1, item2) => `${item1}:${item2}`;

// Correctly handle the computation of normalized matrices and weights
// function computeNormalizedMatrixAndWeights(comparisons, items) {
//   console.log('items :', items);
//   console.log('comparisons :', comparisons);
//   let matrix = items.map(() => new Array(items.length).fill(0));
//   let sumColumns = new Array(items.length).fill(0);

//   items.forEach((item1, i) => {
//     items.forEach((item2, j) => {
//       if (i === j) {
//         matrix[i][j] = 1; // Diagonal is always 1
//       } else {
//         const key = generateComparisonKey(item1, item2);
//         const reverseKey = generateComparisonKey(item2, item1);
//         matrix[i][j] = comparisons[key] || 1 / comparisons[reverseKey] || 1;
//       }
//       sumColumns[j] += matrix[i][j];
//     });
//   });

//   // Normalize the matrix
//   matrix = matrix.map((row) => row.map((value, j) => value / sumColumns[j]));

//   // Calculate weights
//   const weights = matrix.map(
//     (row) => row.reduce((sum, value) => sum + value, 0) / items.length,
//   );

//   return { normalizedMatrix: matrix, weights };
// }

function computeNormalizedMatrixAndWeightsTest(comparisonsObject, items) {
  console.log('comparisonsObject :', comparisonsObject);

  // Directly use comparisonsObject if it contains the comparison data
  const comparisons = comparisonsObject.__v_isRef
    ? comparisonsObject.value
    : comparisonsObject;

  // Step 1: Construct the pairwise comparison matrix
  let matrix = items.map((item1, i) =>
    items.map((item2, j) => {
      if (i === j) return 1; // Diagonal elements are 1
      const key = `${item1}:${item2}`;
      return (
        comparisons[key] ??
        (comparisons[`${item2}:${item1}`]
          ? 1 / comparisons[`${item2}:${item1}`]
          : 1)
      ); // Use 1 as a fallback for missing comparisons to maintain AHP consistency
    }),
  );

  // Step 2: Normalize the matrix
  let columnSums = matrix[0].map((_, columnIndex) =>
    matrix.reduce((sum, currentRow) => sum + currentRow[columnIndex], 0),
  );

  let normalizedMatrix = matrix.map(
    (row) =>
      row.map((cell, columnIndex) => cell / (columnSums[columnIndex] || 1)), // Prevent division by zero
  );

  // Step 3: Calculate the criteria weights
  let weights = normalizedMatrix.map(
    (row) => row.reduce((sum, cell) => sum + cell, 0) / row.length,
  );

  return { normalizedMatrix, weights };
}

function computeNormalizedMatrixAndWeights(comparisons, items) {
  // Initial matrix construction based on your specific AHP structure
  let matrix = items.map(() => new Array(items.length).fill(0));
  let sumColumns = new Array(items.length).fill(0);

  // Construct the matrix using provided comparison values
  items.forEach((item1, i) => {
    items.forEach((item2, j) => {
      if (i === j) {
        matrix[i][j] = 1; // Self-comparison
      } else {
        const key = `${item1}:${item2}`;
        matrix[i][j] =
          comparisons[key] ??
          (comparisons[`${item2}:${item1}`]
            ? 1 / comparisons[`${item2}:${item1}`]
            : 1);
      }
      sumColumns[j] += matrix[i][j];
    });
  });

  // Normalize the matrix
  matrix = matrix.map((row) => row.map((value, j) => value / sumColumns[j]));

  // Calculate weights (e.g., average of rows)
  const weights = matrix.map(
    (row) => row.reduce((a, b) => a + b, 0) / row.length,
  );

  return { normalizedMatrix: matrix, weights };
}

// Adjusted to handle the potential structure of criteriaComparisons
const criteriaWeights = computed(() => {
  console.log(
    `props.criteriaComparisons,
  props.criteria :`,
    props.criteriaComparisons,
    props.criteria,
  );
  const { weights } = computeNormalizedMatrixAndWeightsTest(
    props.criteriaComparisons,
    props.criteria,
  );
  console.log('weights :', weights);
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

const overallPreference = computed(() => {
  let totalScores = {};

  // Initialize total scores for each alternative
  props.alternatives.forEach((alternative) => {
    totalScores[alternative] = 0;
  });

  // Aggregate scores for each alternative based on criteria weights and alternatives rankings
  Object.entries(alternativesRankings.value).forEach(
    ([criterion, rankings]) => {
      const criterionWeight =
        criteriaWeights.value[props.criteria.indexOf(criterion)];
      Object.entries(rankings).forEach(([alternative, score]) => {
        totalScores[alternative] += score * criterionWeight;
      });
    },
  );

  // Normalize total scores to ensure they sum up to 1 (or 100% for pie chart representation)
  const totalScoreSum = Object.values(totalScores).reduce(
    (sum, score) => sum + score,
    0,
  );
  Object.keys(totalScores).forEach((alternative) => {
    totalScores[alternative] = totalScores[alternative] / totalScoreSum;
  });

  return totalScores;
});
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
    <h2>Overall Preference for "{{ question }}"</h2>
    <ul>
      <li
        v-for="(score, alternative) in overallPreference"
        :key="alternative"
      >
        {{ alternative }}: {{ (score * 100).toFixed(2) }}%
      </li>
    </ul>
  </div>
</template>
