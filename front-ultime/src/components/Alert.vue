<template>
  <v-snackbar :value="getMessage !== ''" :color="getTypeMessage" :timeout="-1">
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="refreshAlert">
        Cerrar
      </v-btn>
    </template>
    {{ getMessage }}
  </v-snackbar>
</template>

<script>
import Vuex from "vuex";
export default {
  data: () => ({}),
  computed: {
    ...Vuex.mapGetters(["getMessage", "getTypeMessage"]),
  },
  methods: {
    refreshAlert() {
      this.$store.dispatch("refreshAlert");
    },
  },
};
</script>
<style>
</style>