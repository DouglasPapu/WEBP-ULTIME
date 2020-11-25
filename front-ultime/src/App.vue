<template>
  <v-app id="app">
    <main>
      <div class="app-container">
        <header class="app-header">
          <!--<NavBar></NavBar>-->
        </header>
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),
};
</script>
<style>
</style>