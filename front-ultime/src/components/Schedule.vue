<template>
  <v-container>
    <v-col>
      <h1 class="text-center">Mi Horario</h1>
      <v-divider></v-divider>
      <p class="text-center psub">
        Usa el siguiente calendario como herramienta para poder almacenar tu
        horario semestral.
      </p>
      <p class="text-center">Puedes acceder a él cuando lo necesites!</p>
    </v-col>
    <v-card elevation="15" :loading="loading">
      <v-row>
        <v-col>
          <v-sheet height="400">
            <v-calendar
              ref="calendar"
              :now="today"
              :value="today"
              :events="events"
              color="primary"
              type="week"
              class="my-event.with-time"
            ></v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-text style="height: 100px; position: relative">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="!hidden"
              color="primary"
              dark
              absolute
              top
              right
              fab
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar nueva materia</span>
        </v-tooltip>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    today: "2019-01-08",
    loading: false,
    events: [
      {
        name: "Weekly Meeting",
        start: "2019-01-07 09:00",
        end: "2019-01-07 10:00",
      },
      {
        name: `Thomas' Birthday`,
        start: "2019-01-10",
      },
      {
        name: "Mash Potatoes",
        start: "2019-01-09 12:30",
        end: "2019-01-09 15:30",
      },
    ],
  }),
  mounted() {
    this.$refs.calendar.scrollToTime("7:00");
  },
};
</script>

<style scoped>
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;
}

.my-event.with-time {
  position: absolute;
  right: 4px;
  margin-right: 0px;
}
.mx-2 {
  margin-top: 20px;
}
.psub {
  margin-top: 20px;
}
</style>