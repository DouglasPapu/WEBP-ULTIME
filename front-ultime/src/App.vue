<template>
  <v-app>
    <v-navigation-drawer permanent expand-on-hover app  v-if="getFirstname">
      <Navigation></Navigation>
    </v-navigation-drawer>
    <!--     <v-app-bar color="white" app dark> -->
    <NavBar></NavBar>
    <!--     </v-app-bar> -->
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer color="white" app>
      <Footer></Footer>
    </v-footer>
  </v-app>
</template>
<script>
import Navigation from "./components/Navigation";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
export default {
  name: "App",

  components: {
    Navigation,
    NavBar,
    Footer,
  },

  data ()  {
    return{
      login: false,
    }   
    //
  },
  computed:{
    getFirstname:function(){ 
      return this.$store.getters.getUserLoged.firstname !==""? true:false;
    },
  }
};
</script>
<style>
</style>