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
  const ahpPreferenceValues = pairResults.value.map((sliderValue) => {
    console.log('sliderValue :', sliderValue);

    // Handle the midpoint explicitly
    if (sliderValue == 5) {
      // Directly return 1 for equal importance when slider is at midpoint
      return 1;
    } else if (sliderValue < 5) {
      // Adjust logic for values < 5 if necessary
      return 2 + ((5 - sliderValue) * (9 - 2)) / (5 - 1);
    } else {
      // Adjust logic for values > 5 if necessary
      return 1 / (2 + ((sliderValue - 5) * (9 - 2)) / (5 - 1));
    }
  });

  // Ensure the normalization and weight calculation steps correctly interpret these values,
  // especially handling the case where the comparison value is 1 (equal importance)
  console.log('AHP Preference Values:', ahpPreferenceValues);
  emit('updateComparisons', ahpPreferenceValues);
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
      <div class="slider-container">
        {{ pair[0] }}
        <input
          type="range"
          v-model="pairResults[index]"
          min="1"
          max="9"
          step="0.1"
        />
        {{ pair[1] }}
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
