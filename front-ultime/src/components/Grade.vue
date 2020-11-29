<template>
  <v-container>
    <v-col>
      <h1 class="text-center">Mis notas</h1>
      <v-divider></v-divider>
      <p class="text-center psub">
        Aquí encontrarás todas las materias que has asignado en tu horario.
      </p>
      <p class="text-center">Empieza a registrar tus notas!</p>
    </v-col>
    <v-card elevation="15" :loading="loading">
      <v-row justify="center">
        <v-expansion-panels>
          <v-expansion-panel v-for="(item, i) in subjects" :key="i">
            <v-expansion-panel-header>
              {{ item.name }}</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <TextGrade :fk_subject="item.id"></TextGrade>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-card>
    <Alert></Alert>
  </v-container>
</template>

<script>
import Alert from "./Alert";
import TextGrade from "./TextGrade";
export default {
  components: {
    Alert,
    TextGrade,
  },
  data: () => ({}),
  mounted() {
    this.$store.dispatch("getSubjects");
  },
  computed: {
    subjects() {
      return this.$store.state.subjects;
    },
    loading() {
      return this.$store.state.loading;
    },
  },
};
</script>

<style>
</style>