<script setup>
import { defineEmits } from 'vue';
import MainButton from '../../components/MainButton.vue';

const emit = defineEmits(['updateSlide']);

function updateSlide(newSlide) {
  emit('updateSlide', newSlide);
}
</script>
<template>
  <div class="flex justify-center w-full my-5">
    <MainButton
      label="previous"
      on-click-emit="prev"
      icon-left="ChevronLeftIcon"
      @clicked="updateSlide($event)"
    />
    <MainButton
      label="next"
      on-click-emit="next"
      icon-right="ChevronRightIcon"
      @clicked="updateSlide($event)"
    />
  </div>
</template>
