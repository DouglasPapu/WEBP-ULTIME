import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    subjects: [],
    tasks: [],
  },
  mutations: {
    addSubjectToSchedule(state, payload) {
      payload.fk_schedule = 1;
      axios
        .post("http://localhost:3000/api/subjects/create-subject", payload)
        .then((res) => {
          if (res.status == 200) {
            state.subjects.push(payload);
            console.log("Ha agregado con éxito");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  actions: {
    addSubjectToSchedule({ commit }, payload) {
      commit("addSubjectToSchedule", payload);
    },
  },
});
