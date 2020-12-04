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
              :events="subjects"
              :weekdays="[1, 2, 3, 4, 5, 6, 0]"
              locale="es"
              color="primary"
              type="week"
              class="my-event.with-time"
              hide-date="true"
              start="2020-11-23"
              end="2020-11-29"
              :short-weekdays="false"
              @click:event="showEvent"
            ><template v-slot:day-label-header="{}">{{undefined}} </template></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar color="primary" dark>
                  <v-btn icon @click="dialogDelete = true">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-toolbar-title
                    v-html="selectedEvent.name"
                  ></v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <span
                    >Hora de inicio:<br />
                    {{ timeInitDetails }}</span
                  >
                  <v-spacer></v-spacer>
                  <span
                    >Hora de finalización: <br />
                    {{ timeFinalDetails }}</span
                  >
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="secondary" @click="selectedOpen = false">
                    CERRAR
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
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
        <v-form v-model="isValid">
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
                      v-model="subject.sub_name"
                      :rules="subjectRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      prepend-icon="mdi-calendar-cursor"
                      :items="daysweek"
                      item-text="day"
                      item-value="number"
                      label="Día de la semana"
                      v-model="subject.sub_day"
                      required
                      :rules="dayRules"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <!--Hora de inicio-->
                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="subject.start_time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="subject.start_time"
                          label="Hora de inicio"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="startRules"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu2"
                        v-model="subject.start_time"
                        full-width
                        @click:minute="$refs.menu2.save(subject.start_time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                  <!--Hora final-->
                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="menu3"
                      v-model="menu3"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="subject.end_time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="subject.end_time"
                          label="Hora de finalización"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="endRules"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu3"
                        v-model="subject.end_time"
                        full-width
                        @click:minute="$refs.menu3.save(subject.end_time)"
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
              <v-btn
                :disabled="!isValid"
                color="blue darken-1"
                text
                @click="addSubjectToSchedule"
              >
                Añadir
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <!-- Dialog warning to delete an subject -->
      <v-dialog v-model="dialogDelete" max-width="530">
        <v-card>
          <v-card-title class="headline">
            ¿Estás seguro que deseas borrar la materia?
          </v-card-title>

          <v-card-text>
            Recuerda que una vez eliminada perderás todas las notas almacenadas
            que tenias para esta materia.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="dialogDelete = false">
              Cancelar
            </v-btn>

            <v-btn color="green darken-1" text @click="deleteSubject">
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <Alert></Alert>
  </v-container>
</template>
<script>
import Alert from "./Alert";
export default {
  components: {
    Alert,
  },
  data: () => ({
    daysweek: [
      {
        number: 23,
        day: "Lunes",
      },
      {
        number: 24,
        day: "Martes",
      },
      {
        number: 25,
        day: "Miércoles",
      },
      {
        number: 26,
        day: "Jueves",
      },
      {
        number: 27,
        day: "Viernes",
      },
      {
        number: 28,
        day: "Sábado",
      },
      {
        number: 29,
        day: "Domingo",
      },
    ],
    subject: {
      sub_name: "",
      start_time: null,
      end_time: null,
      sub_day: "",
      fk_user: 0,
    },
    selectedElement: null,
    selectedOpen: false,
    selectedEvent: {},
    dialog: false,
    menu2: false,
    menu3: false,
    isValid: true,
    timeInitDetails: null,
    timeFinalDetails: null,
    dialogDelete: false,
    subjectRules: [(name) => !!name || "El nombre de la materia es requerido"],
    dayRules: [(day) => !!day || "El día es requerido"],
    startRules: [(start) => !!start || "La hora de inicio es requerida"],
    endRules: [(end) => !!end || "La hora final es requerida"],
  }),
  mounted() {
    this.$refs.calendar.scrollToTime("6:00");
    this.$store.dispatch("getSubjects");
  },
  methods: {
    addSubjectToSchedule() {
      this.$store.dispatch("addSubjectToSchedule", this.subject);
      this.dialog = false;
    },
    deleteSubject() {
      this.$store.dispatch("deleteSubject", this.selectedEvent);
      this.selectedOpen = false;
      this.dialogDelete = false;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
        this.timeInitDetails = this.selectedEvent.start.substr(11, 16);
        this.timeFinalDetails = this.selectedEvent.end.substr(11, 16);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
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
.theme--light.v-calendar-daily
  .v-calendar-daily_head-day.v-past
  .v-calendar-daily_head-weekday,
.theme--light.v-calendar-daily
  .v-calendar-daily_head-day.v-past
  .v-calendar-daily_head-day-label {
  color: black;
}
</style>