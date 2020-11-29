<template>
  <v-container>
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
              <v-btn color="primary" v-bind="attrs" v-on="on" fab small dark>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar nota</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="red" v-bind="attrs" v-on="on" fab small dark>
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
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Porcentaje %"
              type="number"
              required
              prepend-icon="mdi-calculator-variant-outline"
              :rules="percentRules"
            ></v-text-field>
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-btn class="ma-2" outlined color="primary" :disabled="!isValid"
            ><v-icon left> mdi-plus-circle-outline </v-icon> Agregar nota
          </v-btn>
        </v-row>
      </v-form>
    </div>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  props: ["fk_subject"],
  data: () => ({
    grades: [],
    grade: 0,
    percent: 0,
    isValid: true,
    gradeRules: [(grade) => !!grade || "Debes ingresar una nota"],
    percentRules: [(percent) => !!percent || "Debes ingresar un porcentaje"],
  }),
  methods: {
    async getGrades() {
      await axios
        .get("http://localhost:3000/api/grades/", {
          params: { fk_user: 2, fk_subject: this.fk_subject },
        })
        .then((res) => {
          if (res.status === 200) {
            this.grades = res.data;
          }
        });
    },
  },
  mounted() {
    this.getGrades();
  },
};
</script>

<style>
.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  margin-right: 5px;
  margin-top: 14px;
}
</style>