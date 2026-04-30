<template>
  <div v-loading="loading">
    <div class="design-form">
      <form-group :data="formData.list" :config="formData.config" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import FormGroup from "./formGroup.vue";
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    formData: any;
  }>(),
  {
    formData: () => {
      return {
        list: [],
        form: {},
      };
    },
  }
);

// const storeForm = useDesignFormStore()
const loading = ref(false);
</script>
