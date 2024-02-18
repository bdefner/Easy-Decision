<script setup>
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from '@heroicons/vue/24/outline';
import { computed, defineEmits, defineProps } from 'vue';

const props = defineProps({
  icon: {
    type: Boolean,
    default: false,
  },
  label: String,
  onClickEmit: String,
  iconRight: String,
  iconLeft: String,
});

const emit = defineEmits(['clicked']);

const showLeftIcon = computed(() => props.iconLeft);
const showRightIcon = computed(() => props.iconRight);

const icons = {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
};

const RightIconComponent = icons[props.iconRight];
const LeftIconComponent = icons[props.iconLeft];
</script>
<template>
  <div class="mt-4">
    <button
      @click.prevent="emit('clicked', onClickEmit)"
      class="flex items-center justify-center bg-orange-500 text-white rounded-md p-2 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 mx-3"
    >
      <component
        :is="LeftIconComponent"
        v-if="showLeftIcon"
        class="h-5 mr-1"
      />
      <span class="mr-2 ml-2">{{ label }}</span>
      <component
        :is="RightIconComponent"
        v-if="showRightIcon"
        class="h-5 ml-1"
      />
    </button>
  </div>
</template>
