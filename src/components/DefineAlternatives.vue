<script setup>
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps({
  alternatives: Array,
});

const alternativesMutation = ref(props.alternatives);

const emit = defineEmits(['updateAlternatives']);

// onMounted(() => {
//   console.log('criteria :', props.criteria);
// });

function addAlternative() {
  alternativesMutation.value.push('');
}

function save() {
  emit('updateAlternatives', alternativesMutation);
}
</script>
<template>
  <div>
    <h2>Define Your Alternatives</h2>
    <div
      v-for="(alternative, index) in alternativesMutation"
      :key="index"
    >
      <input
        v-model="alternativesMutation[index]"
        :placeholder="`Alternative ${index + 1}`"
      />
    </div>
    <button @click="addAlternative">Add Alternative</button>
    <button @click.prevent="save">Save</button>
  </div>
</template>
