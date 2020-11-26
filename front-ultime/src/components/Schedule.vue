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
              :events="events"
              :weekdays="[1, 2, 3, 4, 5, 6, 0]"
              locale="es"
              color="primary"
              type="week"
              class="my-event.with-time"
              :hide-date="true"
              :short-weekdays="false"
              :show-weekday="true"
              :category-show-all="true"
            ></v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-text style="height: 100px; position: relative">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              absolute
              top
              right
              fab
              v-bind="attrs"
              v-on="on"
              @click="dialog = true"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar nueva materia</span>
        </v-tooltip>
      </v-card-text>
    </v-card>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Agrega una materia</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Nombre de la materia"
                    required
                    prepend-icon="mdi-ballot-outline"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    prepend-icon="mdi-calendar-cursor"
                    :items="[
                      'Lunes',
                      'Martes',
                      'Miércoles',
                      'Jueves',
                      'Viernes',
                      'Sábado',
                      'Domingo',
                    ]"
                    label="Día de la semana"
                    required
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <!--Hora de inicio-->
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="menu"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="time"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="time"
                        label="Hora de inicio"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu2"
                      v-model="time"
                      full-width
                      @click:minute="$refs.menu.save(time)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
                <!--Hora final-->
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="menu"
                    v-model="menu3"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="time3"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="time3"
                        label="Hora de inicio"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu3"
                      v-model="time3"
                      full-width
                      @click:minute="$refs.menu.save(time3)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Añadir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
//import moment from "moment";

export default {
  data: () => ({
    today: "2020-11-25",
    loading: false,
    dialog: false,
    notifications: false,
    sound: true,
    time: null,
    menu2: false,
    modal2: false,
    time3: null,
    menu3: false,
    modal3: false,
    widgets: false,
    events: [
      {
        name: "Creatividad empresarial",
        start: "2020-11-25 09:00",
        end: "2020-11-25 10:00",
      },
    ],
    subject: {},
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