<template>
  <div class="container">
    <v-row ref="Calendar" class="Fill-height">
      <v-col>
        <h1 class="text-center">Planeador</h1>
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
        <v-sheet height="600" elevation="15" :loading="loading">
          <v-calendar
            ref="planner"
            v-model="value"
            color="primary"
            type="week"
            :events="tasks"
            :event-ripple="false"
            :event-color="getEventColor"
            locale="es"
            @click:event="showTask"
          >
          </v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <!-- V-Card show task -->
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar color="primary" dark>
                <v-btn icon @click="openEdit(selectedEvent)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="dialogDelete = true">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-toolbar-title v-html="editEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <span
                  >Hora de inicio:<br />
                  {{ timeStart }}</span
                >
                <v-spacer></v-spacer>
                <span
                  >Hora de finalización: <br />
                  {{ timeEnd }}</span
                >
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  CERRAR
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-card>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  absolute
                  bottom
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
      <!-- Dialog add task -->
      <v-dialog v-model="dialog" persistent max-width="600">
        <v-form v-model="isValid">
          <v-card>
            <v-card-title> Agregar una tarea </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Nombre"
                      required
                      :rules="nameRules"
                      v-model="createEvent.name"
                      prepend-icon="mdi-ballot-outline"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Descripción"
                      required
                      :rules="descriptionRules"
                      v-model="createEvent.description"
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
                      :return-value.sync="createEvent.day"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="createEvent.day"
                          label="Fecha de la tarea"
                          prepend-icon="mdi-calendar"
                          readonly
                          :rules="dateRules"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="createEvent.day"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(createEvent.day)"
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
                      :return-value.sync="createEvent.start"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="createEvent.start"
                          label="Hora de inicio"
                          prepend-icon="mdi-calendar"
                          readonly
                          :rules="startRules"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-model="createEvent.start">
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
                          @click="$refs.menuTimeStart.save(createEvent.start)"
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
                      :return-value.sync="createEvent.end"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="createEvent.end"
                          label="Hora de fin"
                          prepend-icon="mdi-calendar"
                          readonly
                          :rules="endRules"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-model="createEvent.end">
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="warning"
                          @click="menuTimeEnd = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menuTimeEnd.save(createEvent.end)"
                        >
                          OK
                        </v-btn>
                      </v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-checkbox
                      v-model="createEvent.done"
                      label="Done"
                      color="success"
                      true-value="Y"
                      false-value="N"
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
              <v-btn
                color="blue darken-1"
                text
                @click="saveTask()"
                :disabled="!isValid"
              >
                Añadir
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <!-- Dialog edit task -->
      <v-dialog v-model="dialogEdit" persistent max-width="600">
        <v-form v-model="isValid">
          <v-card>
            <v-card-title> Editar una tarea </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Nombre"
                      required
                      :rules="nameRules"
                      v-model="editEvent.name"
                      prepend-icon="mdi-ballot-outline"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Descripción"
                      required
                      :rules="descriptionRules"
                      v-model="editEvent.description"
                      prepend-icon="mdi-text"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="menuUpd"
                      v-model="menuUpd"
                      :close-on-content-click="false"
                      :return-value.sync="editEvent.day"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editEvent.day"
                          label="Fecha de la tarea"
                          prepend-icon="mdi-calendar"
                          readonly
                          :rules="dateRules"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editEvent.day"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menuUpd = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menuUpd.save(editEvent.day)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="menuUpdStart"
                      v-model="menuUpdStart"
                      :close-on-content-click="false"
                      :return-value.sync="editEvent.start_time"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editEvent.start_time"
                          label="Hora de inicio"
                          prepend-icon="mdi-calendar"
                          readonly
                          :rules="startRules"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-model="editEvent.start_time">
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="warning"
                          @click="menuUpdStart = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menuUpdStart.save(editEvent.start_time)"
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
                      ref="menuUpdEnd"
                      v-model="menuUpdEnd"
                      :close-on-content-click="false"
                      :return-value.sync="editEvent.end_time"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editEvent.end_time"
                          label="Hora de fin"
                          prepend-icon="mdi-calendar"
                          readonly
                          :rules="endRules"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-model="editEvent.end_time">
                        <v-spacer></v-spacer>
                        <v-btn text color="warning" @click="menuUpdEnd = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menuUpdEnd.save(editEvent.end_time)"
                        >
                          OK
                        </v-btn>
                      </v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-checkbox
                      v-model="editEvent.done"
                      label="Done"
                      color="success"
                      true-value="Y"
                      false-value="N"
                      prepend-icon="check_circle"
                      required
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="dialogEdit = false">
                Cancelar
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="editTask()"
                :disabled="!isValid"
              >
                Actualizar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <!-- Dialog delete task -->
      <v-dialog v-model="dialogDelete" max-width="530">
        <v-card>
          <v-card-title class="headline">
            ¿Estás seguro que deseas borrar la tarea?
          </v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="dialogDelete = false">
              Cancelar
            </v-btn>

            <v-btn color="green darken-1" text @click="deleteTask">
              Eliminar
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
        <v-data-table :items="tasks" :headers="headers">
          <template v-slot:item.start="{ item }">
            <span>{{
              new Date(item.start).toLocaleString().substr(11, 16)
            }}</span>
          </template>
          <template v-slot:item.end="{ item }">
            <span>{{
              new Date(item.end).toLocaleString().substr(11, 16)
            }}</span>
          </template>

          <template v-slot:item.done="{ item }">
            <v-icon :color="item.done === 'Y' ? 'green darken-2' : 'red'">{{
              item.done === "Y" ? "how_to_reg" : "unpublished"
            }}</v-icon>
          </template>

          <template v-slot:item.day="{ item }">
            <span>{{
              new Date(item.start).toLocaleString().substr(0, 9)
            }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <Alert></Alert>
  </div>
</template>

<script>
import Alert from "./Alert"; /* 
import axios from 'axios';
import {mapActions} from 'vuex'; */
export default {
  components: {
    Alert,
  },
  data: () => ({
    value: "",
    colors: ["blue", "indigo", "deep-purple", "cyan", "green", "orange"],
    menu: false,
    menuTimeStart: false,
    menuTimeEnd: false,
    menuUpdStart: false,
    menuUpdEnd: false,
    menuUpd: false,
    timeStart: null,
    timeEnd: null,
    selectedElement: null,
    selectedOpen: false,
    dialog: false,
    dialogDelete: false,
    dialogEdit: false,
    isValid: true,
    createEvent: {
      name: "",
      description: "",
      start: "",
      end: "",
      start_time: "",
      end_time: "",
      day: "",
      done: "N",
      color: "",
      fk_user: 0,
    },
    editEvent: {
      name: "",
      description: "",
      start: "",
      end: "",
      start_time: "",
      end_time: "",
      day: "",
      done: "N",
      color: "",
    },
    selectedEvent: {},
    nameRules: [(name) => !!name || "El nombre de la tarea es requerido"],
    descriptionRules: [
      (description) =>
        !!description || "La descripción de la tarea es requerido",
    ],
    dateRules: [(day) => !!day || "La fecha de la tarea es requerida"],
    startRules: [
      (start) => !!start || "La hora de inicio de la tarea es requerida",
    ],
    endRules: [(end) => !!end || "La hora de fin de la tarea es requerida"],
    headers: [
      { text: "Name", value: "name" },
      { text: "Desciption", value: "description" },
      { text: "Start Time", value: "start" },
      { text: "End Time", value: "end" },
      { text: "Day", value: "day" },
      { text: "State", value: "done" },
    ],
  }),
  computed: {
    tasks() {
      return this.$store.state.tasks;
    },
    loading() {
      return this.$store.state.loading;
    },
  },
  mounted() {
    this.$refs.planner.checkChange();
    this.$store.dispatch("getTasks");
  },
  methods: {
    openEdit(payload) {
      this.editEvent = Object.assign({}, payload);
      this.dialogEdit = true;
    },
    refresh() {
      this.createEvent = {
        name: "",
        description: "",
        start: "",
        end: "",
        start_time: "",
        end_time: "",
        day: "",
        done: "N",
        color: "",
        fk_user: 0,
      };
    },
    saveTask() {
      this.createEvent.start_time = this.createEvent.start;
      this.createEvent.end_time = this.createEvent.end;
      this.createEvent.color = this.colors[this.rnd(0, this.colors.length - 1)];
      this.$store.dispatch("saveTask", this.createEvent);
      this.$store.dispatch("getTasks");
      this.refresh();
      this.dialog = false;
    },
    editTask() {
      var updTask = {
        id: this.editEvent.id,
        name: this.editEvent.name,
        description: this.editEvent.description,
        start: this.editEvent.start,
        end: this.editEvent.end,
        start_time: this.editEvent.start_time,
        end_time: this.editEvent.end_time,
        day: this.editEvent.day,
        done: this.editEvent.done,
        color: this.editEvent.color,
      };
      this.$store.dispatch("editTask", updTask);
      this.$store.dispatch("getTasks");
      this.dialogEdit = false;
    },
    showTask({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
        this.timeStart = this.selectedEvent.start.substr(11, 16);
        this.timeEnd = this.selectedEvent.end.substr(11, 16);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    deleteTask() {
      this.$store.dispatch("deleteTask", this.editEvent);
      this.$store.dispatch("getTasks");
      this.selectedOpen = false;
      this.dialogDelete = false;
    },
    getEventColor(event) {
      return event.color;
    },
    prev() {
      this.$refs.planner.prev();
    },
    next() {
      this.$refs.planner.next();
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
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