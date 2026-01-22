<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'

const { logout, initialize } = useAuth()

// Initialize auth on mount
onMounted(() => {
  // Para el hackathon: siempre limpiar sesión al recargar para poder cambiar de perfil fácilmente
  logout()

  // No inicializar desde localStorage para que siempre vaya al login al recargar
  // initialize()
})
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  min-height: 100vh;
}

.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(31, 79, 216, 0.08);
}
</style>
