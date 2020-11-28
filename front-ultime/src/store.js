import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    message: "",
    typeMessage: "success",
    iconMessage: "",
    subjects: [],
    tasks: [],
  },
  mutations: {
    addSubjectToSchedule(state, payload) {
      payload.fk_user = 2;
      switch (payload.sub_day) {
        case 23: {
          payload.sub_day = "2020-11-23";
          break;
        }
        case 24: {
          payload.sub_day = "2020-11-24";
          break;
        }
        case 25: {
          payload.sub_day = "2020-11-25";
          break;
        }
        case 26: {
          payload.sub_day = "2020-11-26";
          break;
        }
        case 27: {
          payload.sub_day = "2020-11-27";
          break;
        }
        case 28: {
          payload.sub_day = "2020-11-28";
          break;
        }
        case 29: {
          payload.sub_day = "2020-11-29";
          break;
        }
      }
      axios
        .post("http://localhost:3000/api/subjects/create-subject", payload)
        .then((res) => {
          if (res.status === 200) {
            var objNew = {
              id: res.data.params.id,
              name: payload.sub_name,
              start: payload.sub_day + " " + payload.start_time,
              end: payload.sub_day + " " + payload.end_time,
            };
            state.subjects.push(objNew);
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
            case "The time final should be greater than time initial": {
              message1 =
                "Error:  La hora final debe ser mayor que la hora inicial";
              break;
            }
            default: {
              message1 = "No se pudo crear la materia. Intentalo de nuevo";
            }
          }
          state.typeMessage = "error";
          state.message = message1;
        });
    },
    SET_SUBJECTS(state, payload) {
      var replaceSub = [];
      if (payload.lenght !== 0) {
        payload.forEach((element) => {
          var objNew = {
            id: element.pk_subject,
            name: element.sub_name,
            start: element.sub_day + " " + element.start_time,
            end: element.sub_day + " " + element.end_time,
          };
          replaceSub.push(objNew);
        });
        state.subjects = replaceSub;
      }
    },
    deleteSubject(state, payload) {
      console.log(state.subjects);
      console.log(payload);
      axios
        .delete("http://localhost:3000/api/subjects/", {
          params: { fk_user: 2, id: payload.id },
        })
        .then((res) => {
          if (res.status === 200) {
            state.subjects.forEach((element, index) => {
              if (element.id == payload.id) {
                state.subjects.splice(index, 1);
              }
            });
            state.activeAlert = true;
            state.typeMessage = "success";
            state.message = "Se ha borrado la materia con éxito.";
          }
        });
    },
    refreshAlert(state) {
      state.message = "";
    },
  },
  actions: {
    addSubjectToSchedule({ commit }, payload) {
      commit("addSubjectToSchedule", payload);
    },
    getSubjects({ commit }) {
      axios
        .get("http://localhost:3000/api/subjects/", { params: { fk_user: 2 } })
        .then((res) => {
          commit("SET_SUBJECTS", res.data);
        });
    },
    refreshAlert({ commit }) {
      commit("refreshAlert");
    },
    deleteSubject({ commit }, payload) {
      commit("deleteSubject", payload);
    },
  },
  getters: {
    getMessage: (state) => {
      return state.message;
    },
    getTypeMessage: (state) => {
      return state.typeMessage;
    },
  },
});
