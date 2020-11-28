import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    message: "",
    activeAlert: false,
    typeMessage: "",
    subjects: [],
    tasks: [],
  },
  mutations: {
    addSubjectToSchedule(state, payload) {
      payload.fk_user = 1;
      axios
        .post("http://localhost:3000/api/subjects/create-subject", payload)
        .then((res) => {
          if (res.status === 200) {
            state.subjects.push(payload);
            state.activeAlert = true;
            state.typeMessage = "success";
            state.message = "Se ha agregado la materia con éxito.";
          }
        })
        .catch((error) => {
          let message1 = "";
          switch (error.response.data.message) {
            case "This field is busy": {
              message1 =
                "Error: Ya existe una materia en este rango de tiempo.";
              break;
            }
            case "Exist some field which is busy": {
              message1 =
                "Error: El tiempo de rango escogido para esta materia ya está ocupado.";
              break;
            }
            case "The user doesn't exist": {
              message1 = "Error: El usuario no existe. Por favor regístrate";
              break;
            }
            default: {
              message1 = "No se pudo crear la materia. Intentalo de nuevo";
            }
          }
          state.activeAlert = true;
          state.typeMessage = "error";
          state.message = message1;
        });
    },
  },
  actions: {
    addSubjectToSchedule({ commit }, payload) {
      commit("addSubjectToSchedule", payload);
    },
  },
  getters: {
    getMessage: (state) => {
      return state.message;
    },
    getActiveAlert: (state) => {
      return state.activeAlert;
    },
    getTypeMessage: (state) => {
      return state.typeMessage;
    },
  },
});
