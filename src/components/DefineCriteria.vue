<script setup>
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps({
  criteria: Array,
});

const criteriaMutation = ref(props.criteria);

const emit = defineEmits(['updateCriteria']);

// onMounted(() => {
//   console.log('criteria :', props.criteria);
// });

function addCriterion() {
  criteriaMutation.value.push('');
}

function save() {
  emit('updateCriteria', criteriaMutation);
}
</script>
<template>
  <div>
    <h2>Define Your Criteria</h2>
    <div
      v-for="(criterion, index) in criteriaMutation"
      :key="index"
    >
      <input
        v-model="criteriaMutation[index]"
        :placeholder="`Criterion ${index + 1}`"
      />
    </div>
    <button @click="addCriterion">Add Criterion</button>
    <button @click.prevent="save">Save</button>
  </div>
</template>
