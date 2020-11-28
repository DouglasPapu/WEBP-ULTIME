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
    userlog:{
      id:"",
      username:"",
      passwd:"",
      lastname:"",
      firstname:""
    },
    messagelog:"",
    messageRegis:"",
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
    }
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
