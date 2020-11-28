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
        <v-expansion-panels inset>
          <v-expansion-panel v-for="(item, i) in 5" :key="i">
            <v-expansion-panel-header>Item</v-expansion-panel-header>
            <v-expansion-panel-content>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {};
</script>

<style>
</style>