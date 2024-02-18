<script setup>
import Chart from 'chart.js/auto';
import { computed, defineProps, onMounted, ref, watch } from 'vue';
import QuestionnaireNavigation from './QuestionnaireNavigation.vue';

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

const overallPreferenceChart = ref(null);
const criteriaWeightsChart = ref(null);

onMounted(() => {
  const overallCtx = document
    .getElementById('overallPreferenceChart')
    .getContext('2d');

  overallPreferenceChart.value = new Chart(overallCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(overallPreference.value),
      datasets: [
        {
          label: 'Overall Preference',
          data: Object.values(overallPreference.value).map(
            (score) => score * 100,
          ),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            // Add more colors as needed
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            // Add more border colors as needed
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Overall Preference for "' + props.question + '"',
        },
      },
    },
  });

  const criteriaCtx = document
    .getElementById('criteriaWeightsChart')
    .getContext('2d');
  criteriaWeightsChart.value = new Chart(criteriaCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(criteriaWeights.value), // Assuming criteriaWeights is an object
      datasets: [
        {
          label: 'Criteria Weights',
          data: Object.values(criteriaWeights.value).map(
            (weight) => weight * 100,
          ),
          backgroundColor: [
            // Define colors for each slice
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            // Add more colors as needed
          ],
          borderColor: [
            // Define border colors for each slice
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            // Add more border colors as needed
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Criteria Weights for "' + props.question + '"',
        },
      },
    },
  });
});

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
  <div class="slide_wrap">
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
      <canvas
        id="overallPreferenceChart"
        class="overallPie"
      ></canvas>
      <canvas
        id="criteriaWeightsChart"
        class="weightsPie"
      ></canvas>
    </ul>
    <QuestionnaireNavigation
      :currentSlide="currentSlide"
      @updateSlide="updateSlide"
    />
  </div>
</template>
