<template>
  <div>
    <v-carousel
      cycle
      height="400"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <v-sheet height="100%">
          <v-img class="back-car" :src="slide">
            <v-row class="pt-16" align="center" justify="center">
              <div class="display-3 pt-15">{{ message[i] }}</div>
              <v-col sm="12" align="center">
                <v-btn
                  color="primary"
                  elevation="2"
                  x-large
                  @click="dialogForm = true;"
                >
                  Registrate</v-btn
                >
              </v-col>
            </v-row>
          </v-img>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    <v-row justify="center">
      <v-dialog v-model="dialogForm" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Perfil de usuario</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Nombre"
                    required
                    v-model="user_reg.firstname"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Apellido"
                    v-model="user_reg.lastname"
                     :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4"> </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nombre de usuario"
                    required
                    v-model="user_reg.username"
                     :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Contraseña"                    
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show2 = !show2"
              :type="show2 ? 'text' : 'password'"
                    required
                    v-model="user_reg.passwd"
                     :rules="passwordRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <!-- <small>*indicates required field</small> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogForm = false; cleanUserLog()">
              Cancelar
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :disabled= validateReg
              @click="register()"
            >
              Crear
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        <v-dialog :value="registerDialog" max-width="200">
          <v-alert :value="registerDialog" dismissible :type= typereg>
          {{ messageReg }}
        </v-alert>

        </v-dialog>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <v-card class="mx-auto" height="415" max-width="480" outlined>
          <v-card-title class="title"
            >Plataforma online para planificar tus actividades
            académicas</v-card-title
          >
          <v-spacer></v-spacer>
          <v-card-subtitle
            >Bienvenido, por favor ingresa tu cuenta</v-card-subtitle
          >
          <v-card-text>
            <v-text-field
              v-model="user_log.username"
              label="Nombre de usuario"
              :rules="usernameLogRules"
              outlined
            ></v-text-field>
            <v-text-field
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show1 = !show1"
              :type="show1 ? 'text' : 'password'"
              v-model="user_log.passwd"
              label="Contraseña"
              :rules="passwdLogRules"
              outlined
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined block x-large color="primary" @click="login">
              Ingresar
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog :value="alertLog" max-width="200">
          <v-alert :value="alertLog" dismissible :type= typeLog>
          {{ messageLog }}
        </v-alert>

        </v-dialog>
         
       
        
      </v-col>
      <v-col cols="12" sm="6">
        <v-card
          class="mx-auto"
          height="415"
          max-width="480"
          outline
          img="https://images.unsplash.com/photo-1494599948593-3dafe8338d71?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1750&q=80"
        >
        </v-card>
      </v-col>
    </v-row>
    <v-spacer></v-spacer>
    <v-banner two-line>
      <v-avatar slot="icon" color="blue darken-1" size="40">
        <v-icon justify="space-around" color="white"> fas fa-book-open </v-icon>
      </v-avatar>

      Almacena tu horario con facilidad, añade tus tareas de la semana en el
      planeador de ULTime, guarda todas las notas de tu materia y calcula tu
      rendimiento academico. Todo siempre almacenado en tu cuenta personal
    </v-banner>

    <div class="container">
      <v-row>
        <v-col cols="12" sm="6">
          <v-card
            class="mx-auto"
            height="415"
            max-width="480"
            outline
            img="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTh8fG1lZXRpbmd8ZW58MHx8MHw%3D&auto=format&fit=crop&w=1500&q=60"
          >
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="mx-auto" height="300" max-width="480" outlined>
            <v-card-title class="title">Sobrer Nosotros</v-card-title>
            <v-spacer></v-spacer>
            <v-card-subtitle
              >ULTime es una plataforma web creada en 2020 para la gestión y
              planificación de actividades académicas, notas de clase, así como
              alarmas que recuerden dichas actividades. Destinada para uso
              principal de estudiantes. Registrate ya!</v-card-subtitle
            >
            <v-card-actions>
              <v-btn color="primary" elevation="4" x-large icon>
                <v-icon dark> fab fa-facebook </v-icon></v-btn
              >
              <v-btn color="primary" elevation="4" x-large icon>
                <v-icon dark> fab fa-twitter</v-icon></v-btn
              >
              <v-btn color="primary" elevation="4" x-large icon>
                <v-icon dark>fab fa-instagram</v-icon></v-btn
              >
              <v-btn
                href="https://github.com/DouglasPapu/WEBP-ULTIME"
                color="primary"
                elevation="4"
                x-large
                icon
              >
                <v-icon dark>fab fa-github</v-icon></v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-card color="cyan darken-2" height="100%" max-width="1400">
        <v-row>
          <v-col cols="12" sm="4">
            <v-card-text align="center" class="headline font-weight-medium">
              Conoce a nuestro creadores:<br />
              <hr color="#FFFFF" />
              Juan Martín García<br />
              Douglas López <br />
              Laura Rubio <br />
            </v-card-text>
          </v-col>
          <v-col cols="12" sm="8">
            <v-img style="width: 500px" src="../images/logo.png"> </v-img>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <v-spacer></v-spacer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      message: [
        "Empieza a planear tu semestre",
        "Organiza tu tiempo con ULTime",
        "Guarda tus notas del semestre",
      ],
      slides: [
        "https://images.unsplash.com/photo-1552582305-6b778426ab60?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1750&q=80",
        "https://images.unsplash.com/photo-1503551723145-6c040742065b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1750&q=80",
        "https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1755&q=80",
      ],
      dialogForm: false,
      alertLog: false,
      validateReg:false,
      messageLog: "",
      typeLog:"",
      registerDialog:false,
      typereg:"",
      messageReg:"",
      show1: false,
      show2:false,
      user_log: {
        username: "",
        passwd: "",
      },
      user_reg: {
        username: "",
        passwd: "",
        firstname: "",
        lastname: "",
      },
       nameRules: [
        (name) => !!name || "Obligatorio",
        (name) => name.length > 2 || "El nombre es muy corto",
      ],
      passwordRules: [(passwd) => !!passwd || "Obligatorio"],
      passwdLogRules: [(passwd) => !!passwd || "Obligatorio"],
      usernameLogRules: [(username) => !!username || "Obligatorio"],
    };
  },
  methods: {

    ...mapActions(["logUser", "registerUser"]),
    cleanUserLog() {
      this.user_reg.username=""
      this.user_reg.firstname=""
      this.user_reg.lastname=""
      this.user_reg.passwd=""      
    },    
     login() {
     
     this.logUser(this.user_log)
    setTimeout(()=>{       
       this.messageLog = this.$store.getters.getMessageLog      
        if(this.messageLog !== ""){  
          this.alertLog = true;
          this.typeLog = "error"
          setTimeout(()=>{
             this.alertLog = false; 

          },2000)  
        }else{
            this.alertLog = true;
           this.typeLog = "success"
           this.messageLog = "Ha ingresado sesion"
           setTimeout(()=>{
             this.alertLog = false;  

          },2000) 
        }

       
    },2000)
    
    },
    
    register() {
      if(this.user_reg.username!=="" && this.user_reg.lastname!=="" && this.user_reg.passwd!=="" && this.user_reg.firstname!==""){
         this.registerUser(this.user_reg);
  this.dialogForm = false;
      //console.log(this.user_reg)
       setTimeout(()=>{       
       this.messageReg = this.$store.getters.getMessageReg      
        if(this.messageReg === "Error: el nombre de usuario ya existe."){  
          this.registerDialog = true;
          this.typereg = "error"
          setTimeout(()=>{
             this.registerDialog = false; 

          },2000)  
        }else{
            this.registerDialog = true;
           this.typereg = "success"          
           setTimeout(()=>{
             this.registerDialog = false;  

          },2000)
          this.user_reg.username = ""
          this.user_reg.passwd= ""
          this.user_reg.firstname= ""
          this.user_reg.lastname=""   
        }

       
    },2000)
      }else{
        this.messageReg = "Debe llenar la información"
         this.registerDialog = true;
          this.typereg = "error"
          setTimeout(()=>{
             this.registerDialog = false; 

          },2000)  

      }
     
      
    
    },
  },
};
</script>

<style>
.title {
  font-family: "Mulish", sans-serif;
  color: dodgerblue;
  text-align: center;
  font-size: 30px;
}
.back-car {
  /* background-image: url("https://images.unsplash.com/photo-1494599948593-3dafe8338d71?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1750&q=80"); */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-color: #cccccc;
}
</style>