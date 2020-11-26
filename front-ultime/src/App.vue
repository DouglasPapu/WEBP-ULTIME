<template>
  <v-app>
    <v-navigation-drawer permanent expand-on-hover app>
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

  data: () => ({
    //
  }),
};
</script>
<style>
</style>