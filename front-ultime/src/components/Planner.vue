<template>
  <div class="container">
    <v-row ref="Calendar" class="Fill-height">
      <v-col>
        <h1 class="text-center">Calendario</h1>
        <v-divider />
        <p class="text-center psub">
          Utiliza este planeador para organizar tus tareas y tu tiempo durante
          la semana.
        </p>
        <v-toolbar flat>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.planner">
            {{ $refs.planner.title }}
          </v-toolbar-title>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
        </v-toolbar>
        <v-sheet height="600" elevation="15">
          <v-calendar
            ref="planner"
            v-model="value"
            color="primary"
            type="week"
            :events="events"
            :event-ripple="false"
            :event-color="getEventColor"
            locale="es"
          >
          </v-calendar>
          <v-card>
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
              <span>Agregar tarea</span>
            </v-tooltip>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
          <v-card-title> Agregar una tarea </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Nombre"
                    required
                    :value="createEvent.name"
                    prepend-icon="mdi-ballot-outline"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Descipcion"
                    required
                    :value="createEvent.description"
                    prepend-icon="mdi-text"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :value="date"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Fecha de la tarea"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="menuTimeStart"
                    v-model="menuTimeStart"
                    :close-on-content-click="false"
                    :return-value.sync="timeStart"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="timeStart"
                        label="Hora de inicio"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker v-model="timeStart">
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="warning"
                        @click="menuTimeStart = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menuTimeStart.save(timeStart)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="menuTimeEnd"
                    v-model="menuTimeEnd"
                    :close-on-content-click="false"
                    :return-value.sync="timeEnd"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="timeEnd"
                        label="Hora de fin"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker v-model="timeEnd">
                      <v-spacer></v-spacer>
                      <v-btn text color="warning" @click="menuTimeEnd = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menuTimeEnd.save(timeEnd)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6">
                  <v-checkbox
                    v-model="createEvent.state"
                    label="Done"
                    color="success"
                    :value="createEvent.state"
                    prepend-icon="check_circle"
                    required
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog = false">
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="saveEvent()">
              Añadir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row ref="Events-Description">
      <v-col>
        <h1 class="text-center">Descripción de próximas tareas</h1>
        <v-divider />
        <p class="text-center psub">
          Aquí está un resumen más detallado de las tareas pendientes en tu
          planeador.
        </p>
        <v-data-table :items="events" :headers="headers">
          <template v-slot:item.start="{ item }">
            <span>{{ new Date(item.start).toLocaleString() }}</span>
          </template>
          <template v-slot:item.end="{ item }">
            <span>{{ new Date(item.end).toLocaleString() }}</span>
          </template>
          <template v-slot:item.state="{ item }">
            <!-- <v-icon :color="item.state ? 'green darken-2' : 'red'">{{
              item.state ? "how_to_reg" : "unpublished"
            }}</v-icon> -->
            <v-checkbox
              :checked="item.state ? 'true' : 'false'"
              disabled="true"
            >
            </v-checkbox>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "../plugins/axios";
export default {
  data: () => ({
    value: "",
    events: [
      {
        name: "Prueba",
        start: "2020-11-25 07:00",
        end: "2020-11-25 08:00",
        color: "indigo",
      },
    ],
    colors: ["blue", "indigo", "deep-purple", "cyan", "green", "orange"],
    menu: false,
    menuTimeStart: false,
    menuTimeEnd: false,
    timeStart: null,
    timeEnd: null,
    date: new Date().toISOString().substr(0, 10),
    dialog: false,
    createEvent: {
      name: "",
      description: "",
      start: "",
      end: "",
      state: "",
      color: "",
    },
    headers: [
      { text: "Name", value: "name" },
      { text: "Desciption", value: "description" },
      { text: "Start Time", value: "start" },
      { text: "End Time", value: "end" },
      { text: "State", value: "state" },
    ],
  }),
  mounted() {
    this.$refs.planner.checkChange();
  },
  computed: {
    cal() {
      return this.ready ? this.$refs.planner : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
  },
  methods: {
    saveEvent() {
      let apiUrl = "api/planner/create-planner";
      axios.post(apiUrl, this.createEvent).then(() => {
        this.createEvent = {
          name: "",
          description: "",
          start: this.date + " " + this.timeStart,
          end: this.date + " " + this.timeEnd,
          color: this.rndElement(this.colors),
        };
      }).catch((error) => {
        console.log(error);
      });

      console.log(this.createEvent);
      this.events.push(this.createEvent);
      this.dialog = false;
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },
    getEventColor(event) {
      return event.color;
    },

    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    rndElement(arr) {
      return arr[this.rnd(0, arr.length - 1)];
    },
    prev() {
      this.$refs.planner.prev();
    },
    next() {
      this.$refs.planner.next();
    },
  },
};
</script>

<style scoped lang="scss">
.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>