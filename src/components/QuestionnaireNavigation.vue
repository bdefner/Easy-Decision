<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  currentSlide: Number,
});

const emit = defineEmits(['updateSlide']);
</script>
<template>
  <div>
    <button @click.prevent="emit('updateSlide', props.currentSlide - 1)">
      previous
    </button>
    <button @click.prevent="emit('updateSlide', props.currentSlide + 1)">
      next
    </button>
  </div>
</template>
