<script setup>
import { computed, defineEmits, defineProps, ref } from 'vue';

const emit = defineEmits(['updateComparisons']);

const props = defineProps({
  items: Array,
  label: {
    type: String,
    default: '',
  },
});

// Compute pairwise comparisons
const pairs = computed(() => {
  let result = [];
  for (let i = 0; i < props.items.length; i++) {
    for (let j = i + 1; j < props.items.length; j++) {
      result.push([props.items[i], props.items[j]]);
    }
  }
  return result;
});

// Initialize results for each pair
const pairResults = ref(pairs.value.map(() => 5)); // Default to the middle value

function submitComparisons() {
  // Convert each value in pairResults to a number before emitting
  const numericPairResults = pairResults.value.map((result) =>
    parseFloat(result),
  );
  console.log('numericPairResults :', numericPairResults);
  emit('updateComparisons', numericPairResults);
}
</script>

<template>
  <div>
    <h2>{{ props.label }}</h2>
    <div
      v-for="(pair, index) in pairs"
      :key="index"
      class="comparison"
    >
      <div>{{ pair[0] }} vs {{ pair[1] }}</div>
      <div class="slider-container">
        <input
          type="range"
          v-model="pairResults[index]"
          min="1"
          max="9"
          step="0.1"
        />
        <div>Preference: {{ pairResults[index] }}</div>
      </div>
    </div>
    <button @click="submitComparisons">Submit Comparisons</button>
  </div>
</template>

<style scoped>
.comparison {
  margin-bottom: 20px;
}

.slider-container {
  display: flex;
  align-items: center;
}

.slider-container input[type='range'] {
  margin: 0 10px;
}
</style>
