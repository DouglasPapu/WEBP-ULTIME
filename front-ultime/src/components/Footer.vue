<template>
  <v-col class="text-center" cols="12">
    {{ new Date().getFullYear() }} — <strong>ULTIME</strong>
  </v-col>
</template>

<script>
export default {
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),
};
</script>

<style>
</style>