<template>
  <v-container>
    <div v-if="isProgress">
      <v-progress-circular
        :indeterminate="isProgress"
        absolute
        color="primary"
      ></v-progress-circular>
    </div>
    <div v-for="(item, i) in grades" :key="i">
      <v-row>
        <v-col
          ><v-text-field
            label="Nota:"
            type="number"
            required
            disabled
            prepend-icon="mdi-calendar-text-outline"
            :value="item.gr_quantity"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            label="Porcentaje %"
            type="number"
            required
            disabled
            prepend-icon="mdi-calculator-variant-outline"
            :value="item.gr_percent"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                v-on="on"
                fab
                small
                dark
                @click="openDialogEdit(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar nota</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red"
                v-bind="attrs"
                v-on="on"
                fab
                small
                dark
                @click="deleteGrade(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Eliminar nota</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>
    <div>
      <v-form v-model="isValid">
        <v-row>
          <v-col
            ><v-text-field
              label="Nota:"
              type="number"
              required
              prepend-icon="mdi-calendar-text-outline"
              :rules="gradeRules"
              v-model="grade"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Porcentaje %"
              type="number"
              required
              prepend-icon="mdi-calculator-variant-outline"
              :rules="percentRules"
              v-model="percent"
            ></v-text-field>
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-btn
            class="ma-2"
            outlined
            color="primary"
            :disabled="!isValid"
            @click="addGradeToSubject()"
            ><v-icon left> mdi-plus-circle-outline </v-icon> Agregar nota
          </v-btn>
        </v-row>
      </v-form>
    </div>
    <!-- Dialog to update a grade -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar nota</span>
        </v-card-title>
        <v-card-text>
          <v-container justify="center">
            <v-row>
              <v-col>
                <v-text-field
                  label="Nota:"
                  v-model="updQuantity"
                  :value="updQuantity"
                  required
                  :rules="gradeRules"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Porcentaje %"
                  v-model="updPercent"
                  :value="updPercent"
                  required
                  :rules="percentRules"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cerrar
          </v-btn>
          <v-btn color="blue darken-1" text @click="updateGrade()">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Alert></Alert>
  </v-container>
</template>
<script>
import axios from "axios";
import Alert from "./Alert";
import Vuex from "vuex";
export default {
  components: {
    Alert,
  },
  props: ["fk_subject"],
  data: () => ({
    grades: [],
    grade: 0,
    percent: 0,
    updQuantity: 0,
    updPercent: 0,
    updPkgrade: 0,
    isProgress: false,
    isValid: true,
    dialog: false,
    gradeRules: [(grade) => !!grade || "Debes ingresar una nota"],
    percentRules: [
      (percent) => !!percent || "Debes ingresar un porcentaje",
      (percent) =>
        /^([1-9]|[1-9][0-9]|100)$/.test(percent) ||
        "El porcentaje debe ser un número del 1 al 100",
    ],
  }),
  methods: {
    async getGrades() {
      await axios
        .get("http://localhost:3000/api/grades/", {
          params: {
            fk_user: this.getUserLoged.id,
            fk_subject: this.fk_subject,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.grades = res.data;
          }
        })
        .catch((error) => {
          let message1 = "";
          switch (error.response.data.message) {
            case "The user doesn't exist": {
              message1 = "No te encuentras registrado. Registrate!";
              break;
            }
            default: {
              message1 = "Algo salió mal. Intenta de nuevo";
            }
          }
          var errorMessage = {
            message: message1,
            typeMessage: "error",
          };
          this.$store.dispatch("callAlert", errorMessage);
        });
    },
    async addGradeToSubject() {
      this.isProgress = true;
      let grade = {
        gr_percent: this.percent,
        gr_quantity: this.grade,
        fk_subject: this.fk_subject,
      };
      await axios
        .post("http://localhost:3000/api/grades/", grade)
        .then((res) => {
          if (res.status === 200) {
            let objGrade = {
              pk_grade: res.data.params.id,
              gr_percent: this.percent,
              gr_quantity: this.grade,
              fk_subject: this.fk_subject,
            };
            this.grades.push(objGrade);
            this.isProgress = false;
            this.percent = 0;
            this.grade = 0;
            var errorMessage = {
              message: "Se ha agregado la nota con éxito",
              typeMessage: "success",
            };
            this.$store.dispatch("callAlert", errorMessage);
          }
        })
        .catch((error) => {
          let message1 = "";
          this.isProgress = false;
          switch (error.response.data.message) {
            case "the total percentage exceeded 100": {
              message1 = "El porcentaje total excedió el 100%";
              break;
            }
            default: {
              message1 = "Algo salió mal. Intenta de nuevo";
            }
          }
          var errorMessage = {
            message: message1,
            typeMessage: "error",
          };
          this.$store.dispatch("callAlert", errorMessage);
          this.percent = 0;
          this.grade = 0;
        });
    },
    async deleteGrade(payload) {
      this.isProgress = true;
      await axios
        .delete("http://localhost:3000/api/grades/", {
          params: {
            fk_user: this.getUserLoged.id,
            fk_subject: this.fk_subject,
            pk_grade: payload.pk_grade,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            var errorMessage = {
              message: "Se ha borrado con éxito",
              typeMessage: "success",
            };
            this.$store.dispatch("callAlert", errorMessage);
            this.grades.forEach((element, index) => {
              if (element.pk_grade == payload.pk_grade) {
                this.grades.splice(index, 1);
              }
            });
            this.isProgress = false;
          }
        })
        .catch((error) => {
          this.isProgress = false;
          let message1 = "";
          switch (error.response.data.message) {
            case "The user doesn't exist": {
              message1 = "No te encuentras registrado. Registrate!";
              break;
            }
            default: {
              message1 = "Algo salió mal. Intenta de nuevo";
            }
          }
          var errorMessage = {
            message: message1,
            typeMessage: "error",
          };
          this.$store.dispatch("callAlert", errorMessage);
        });
    },
    openDialogEdit(payload) {
      this.updPercent = payload.gr_percent;
      this.updQuantity = payload.gr_quantity;
      this.updPkgrade = payload.pk_grade;
      this.dialog = true;
    },
    async updateGrade() {
      this.isProgress = true;
      this.dialog = false;

      var gradeEdit = {
        fk_user: this.getUserLoged.id,
        fk_subject: this.fk_subject,
        gr_percent: this.updPercent,
        gr_quantity: this.updQuantity,
        pk_grade: this.updPkgrade,
      };
      await axios
        .put("http://localhost:3000/api/grades/", gradeEdit)
        .then((res) => {
          if (res.status === 200) {
            this.isProgress = false;
            let gradeNew = this.grades.find(
              (grd) => grd.pk_grade === gradeEdit.pk_grade
            );
            let index = this.grades.indexOf(gradeNew);

            var gradeUpd = {
              pk_grade: this.updPkgrade,
              gr_percent: this.updPercent,
              gr_quantity: this.updQuantity,
              fk_subject: this.fk_subject,
            };
            this.grades[index] = gradeUpd;

            var errorMessage = {
              message: "Se ha actualizado la nota con éxito",
              typeMessage: "success",
            };
            this.$store.dispatch("callAlert", errorMessage);
          }
        })
        .catch((error) => {
          this.isProgress = false;
          let message1 = "";
          switch (error.response.data.message) {
            case "The user doesn't exist": {
              message1 = "No te encuentras registrado. Registrate!";
              break;
            }
            case "the total percentage exceeded 100": {
              message1 =
                "No se pudó actualizar. El porcentaje total excedió el 100%";
              break;
            }
            default: {
              message1 = "Algo salió mal. Intenta de nuevo";
            }
          }
          var errorMessage = {
            message: message1,
            typeMessage: "error",
          };
          this.$store.dispatch("callAlert", errorMessage);
        });
    },
  },
  mounted() {
    this.getGrades();
  },
  computed: {
    ...Vuex.mapGetters(["getUserLoged"]),
  },
};
</script>

<style>
.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  margin-right: 5px;
  margin-top: 14px;
}
</style>