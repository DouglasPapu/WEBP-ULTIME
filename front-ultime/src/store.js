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
    userlog:{
      id:"",
      username:"",
      passwd:"",
      lastname:"",
      firstname:""
    },
    messagelog:"",
    messageRegis:"",
    loading: false,
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
    logUser(state, payload){
      axios
      .post("http://localhost:3000/users/login", payload)
      .then((res)=>{
        
       if(res.status===200){
                 
         state.userlog.username =res.data[0].username;
         state.userlog.id = res.data[0].pk_user;
         state.userlog.firstname = res.data[0].firstname;
         state.userlog.passwd = res.data[0].passwd;
         state.userlog.lastname = res.data[0].lastname;
         state.messagelog = "";
         console.log(res.data[0])
       }

      })
      .catch((error)=>{
       
        let message1 = "";        
        switch (error.response.data.message) {
          case "The users no exists": {            
            message1 ="Error: el usuario no existe.";
            break;
          }
          case "The username is incorrect": {
            message1 ="Error: el nombre de usuario es incorrecto.";
            break;
          }
          case "The password is wrong": {
            message1 ="Error: La contraseña es incorrecta.";
            break;
          }
          default: {
            message1 = "No se pudo inciar sesion. Intentalo de nuevo";
          }
        }
        state.messagelog = message1; 
        console.log("AERROR",state.messagelog )
            
      })

    },
    registerUser(state,payload){
      axios
      .post("http://localhost:3000/users/create", payload)
      .then((res)=>{
       if(res.status===200){   
         
        state.messageRegis = "Registro con éxito"
       }
      })
      .catch((error)=>{       
        let message1 = "";        
        switch (error.response.data.message) {
          case "The username already exists": {            
            message1 ="Error: el nombre de usuario ya existe.";
            break;
          }
        }
        state.messageRegis = message1; 
        
            
      })
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
    logUser({commit}, payload){
    
      commit("logUser", payload);
    },
    registerUser({commit},payload){
      commit("registerUser",payload)
    },
    getSubjects({ commit }) {
      this.state.loading = true;
      axios
        .get("http://localhost:3000/api/subjects/", { params: { fk_user: 2 } })
        .then((res) => {
          if (res.status === 200) {
            commit("SET_SUBJECTS", res.data);
          }
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
    getUserLoged:(state)=>{
      return state.userlog;
    },
    getMessageLog:(state)=>{
      return state.messagelog;
    },
    getMessageReg:(state)=>{
      return state.messageRegis;
    }
  },
});
