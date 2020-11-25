<template>
  <div>
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/80.jpg"></v-img>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="title">
            Juan Lopez Rubio
          </v-list-item-title>
          <v-list-item-subtitle>juanlobio@gmail.com</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item link to="/">
        <v-list-item-icon>
          <v-icon>home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Inicio</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/planner">
        <v-list-item-icon>
          <v-icon>event</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Planificador</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/schedule">
        <v-list-item-icon>
          <v-icon>school</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Mi horario</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-bulletin-board</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Mis notas</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>