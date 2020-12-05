import Vue from "vue";
import Vuex from "vuex";
import axios from "./plugins/axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    message: "",
    typeMessage: "success",
    iconMessage: "",
    subjects: [],
    grades: [],
    tasks: [],
    userlog: {
      id: null,
      username: "",
      passwd: "",
      lastname: "",
      firstname: "",
    },
    messagelog: "",
    messageRegis: "",
    loading: false,
  },
  mutations: {
    addSubjectToSchedule(state, payload) {
      payload.fk_user = state.userlog.id;
      console.log(payload);
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
        .post("/api/subjects/create-subject", payload)
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
              message1 = "Ya existe una materia en este rango de tiempo.";
              break;
            }
            case "Exist some field which is busy": {
              message1 =
                "El tiempo de rango escogido para esta materia ya está ocupado.";
              break;
            }
            case "The user doesn't exist": {
              message1 = "El usuario no existe. Por favor regístrate";
              break;
            }
            case "The time final should be greater than time initial": {
              message1 = "La hora final debe ser mayor que la hora inicial";
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
    saveTask(state, payload) {
      payload.fk_user = state.userlog.id;

      axios.post("/api/tasks/create-task", payload)
        .then((res) => {
          if (res.status == 200) {
            var newTask = {
              id: res.data.params.id,
              name: payload.name,
              description: payload.description,
              start: payload.day + " " + payload.start,
              end: payload.day + " " + payload.end,
              start_time: payload.start,
              end_time: payload.end,
              day: payload.day,
              done: payload.done,
              color: payload.color
            };
            state.tasks.push(newTask);
            state.typeMessage = "success";
            state.message = "Se ha agregado la tarea con éxito.";
          }
        })
        .catch((error) => {
          state.typeMessage = "error";
          state.message = error.response.data.message;
        });
    },
    editTask(state, payload) {
      axios
        .put("/api/tasks/update-task", payload)
        .then((res) => {
          if (res.status === 200) {
            let taskN = this.tasks.find(
              (tsk) => tsk.pk_task === payload.id
            );
            let i = this.tasks.indexOf(taskN);
            var updTask = {
              id: payload.id,
              name: payload.name,
              description: payload.description,
              start: payload.day + " " + payload.start_time,
              end: payload.day + " " + payload.end_time,
              start_time: payload.start_time,
              end_time: payload.end_time,
              day: payload.day,
              done: payload.done,
              color: payload.color
            }
            this.tasks[i] = updTask;
            state.activeAlert = true;
            state.typeMessage = "success";
            state.message = "Se ha borrado la tarea con éxito.";
          }
        })
        .catch((error) => {
          state.typeMessage = "error";
          state.message = error.response.data.message;
        });
    },
    deleteTask(state, payload) {
      axios
        .delete("/api/tasks/delete-task", {
          params: { fk_user: state.userlog.id, id: payload.id },
        })
        .then((res) => {
          if (res.status === 200) {
            state.tasks.forEach((element, index) => {
              if (element.id == payload.id) {
                state.tasks.splice(index, 1);
              }
            });
            state.activeAlert = true;
            state.typeMessage = "success";
            state.message = "Se ha borrado la tarea con éxito.";
          }
        })
        .catch((error, res) => {
          let message1 = "";
          switch (error.response.data.message) {
            case "The user doesn't exist": {
              console.log("Entro aqui juas")
              console.log(res.status)
              message1 = "El usuario no existe. Por favor regístrate";
              break;
            }
          }
          state.typeMessage = "error";
          state.message = message1;
        });

    },
    SET_TASKS(state, payload) {
      var replTasks = [];
      if (payload.lenght !== 0) {
        payload.forEach((element) => {
          var newTask = {
            id: element.pk_task,
            name: element.tk_name,
            description: element.tk_description,
            start: element.tk_day + " " + element.start_time,
            end: element.tk_day + " " + element.end_time,
            start_time: element.start_time,
            end_time: element.end_time,
            day: element.tk_day,
            done: element.tk_done,
            color: element.color
          };
          replTasks.push(newTask);
        });
        state.tasks = replTasks;
        this.state.loading = false;
      }
    },
    logUser(state, payload) {
      axios
        .post("/users/login", payload)
        .then((res) => {
          if (res.status === 200) {
            state.userlog.username = res.data[0].username;
            state.userlog.id = res.data[0].pk_user;
            state.userlog.firstname = res.data[0].firstname;
            state.userlog.passwd = res.data[0].passwd;
            state.userlog.lastname = res.data[0].lastname;
            state.messagelog = "";
            console.log(res.data[0]);
          }
        })
        .catch((error) => {
          let message1 = "";
          switch (error.response.data.message) {
            case "The users no exists": {
              message1 = "Error: el usuario no existe.";
              break;
            }
            case "The username is incorrect": {
              message1 = "Error: el nombre de usuario es incorrecto.";
              break;
            }
            case "The password is wrong": {
              message1 = "Error: La contraseña es incorrecta.";
              break;
            }
            default: {
              message1 = "No se pudo inciar sesion. Intentalo de nuevo";
            }
          }
          state.messagelog = message1;
          console.log("AERROR", state.messagelog);
        });
    },
    registerUser(state, payload) {
      axios
        .post("/users/create", payload)
        .then((res) => {
          if (res.status === 200) {
            state.messageRegis = "Registro con éxito";
          }
        })
        .catch((error) => {
          let message1 = "";
          switch (error.response.data.message) {
            case "The username already exists": {
              message1 = "Error: el nombre de usuario ya existe.";
              break;
            }
          }
          state.messageRegis = message1;
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
        this.state.loading = false;
      }
    },
    deleteSubject(state, payload) {
      axios
        .delete("/api/subjects/", {
          params: { fk_user: state.userlog.id, id: payload.id },
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
        })
        .catch((error) => {
          let message1 = "";
          switch (error.response.data.message) {
            case "The user doesn't exist": {
              message1 = "El usuario no existe. Por favor regístrate";
              break;
            }
          }
          state.message = message1;
          state.typeMessage = "error";
          state.message = message1;
        });
    },
    refreshAlert(state) {
      state.message = "";
    },
    callAlert(state, payload) {
      state.message = payload.message;
      state.typeMessage = payload.typeMessage;
    },
  },
  actions: {
    addSubjectToSchedule({ commit }, payload) {
      commit("addSubjectToSchedule", payload);
    },
    saveTask({ commit }, payload) {
      commit("saveTask", payload);
    },
    editTask({ commit }, payload) {
      commit("editTask", payload);
    },
    logUser({ commit }, payload) {
      commit("logUser", payload);
    },
    registerUser({ commit }, payload) {
      commit("registerUser", payload);
    },
    getSubjects({ commit }) {
      this.state.loading = true;
      axios
        .get("/api/subjects/", {
          params: { fk_user: this.state.userlog.id },
        })
        .then((res) => {
          if (res.status === 200) {
            commit("SET_SUBJECTS", res.data);
          }
        });
    },
    getTasks({ commit }) {
      this.state.loading = true;
      axios
        .get("/api/tasks/", {
          params: { fk_user: this.state.userlog.id }
        })
        .then((res) => {
          if (res.status === 304 || res.status === 200) {
            commit("SET_TASKS", res.data);
          }
        });
    },
    refreshAlert({ commit }) {
      commit("refreshAlert");
    },
    deleteSubject({ commit }, payload) {
      commit("deleteSubject", payload);
    },
    deleteTask({ commit }, payload) {
      commit("deleteTask", payload);
    },
    callAlert({ commit }, payload) {
      commit("callAlert", payload);
    },
  },
  getters: {
    getMessage: (state) => {
      return state.message;
    },
    getTypeMessage: (state) => {
      return state.typeMessage;
    },
    getUserLoged: (state) => {
      return state.userlog;
    },
    getMessageLog: (state) => {
      return state.messagelog;
    },
    getMessageReg: (state) => {
      return state.messageRegis;
    },
  },
});
