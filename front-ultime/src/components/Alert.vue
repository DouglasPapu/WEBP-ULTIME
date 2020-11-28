<template>
  <v-snackbar v-model="getActiveAlert" :timeout="3000">
    <v-alert :type="getTypeMessage">{{ getMessage }}</v-alert>
  </v-snackbar>
</template>

<script>
import Vuex from "vuex";
export default {
  data: () => ({}),
  computed: {
    ...Vuex.mapGetters(["getMessage", "getActiveAlert", "getTypeMessage"]),
  },
};
</script>
<style>
</style>