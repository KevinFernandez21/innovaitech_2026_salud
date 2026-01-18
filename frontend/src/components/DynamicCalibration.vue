<template>
  <div class="font-display bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark antialiased selection:bg-primary/20">
    <div class="relative flex min-h-screen w-full flex-col max-w-md mx-auto overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl">
      <!-- Top App Bar -->
      <header class="flex items-center px-6 py-4 justify-between bg-transparent z-10">
        <button @click="$emit('navigate', 'menu')" class="flex size-10 items-center justify-center rounded-full bg-white dark:bg-card-dark shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-text-primary-light dark:text-text-primary-dark">
          <span class="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </button>
        <div class="flex flex-col items-center">
          <h2 class="text-sm font-semibold tracking-wide text-text-primary-light dark:text-text-primary-dark uppercase opacity-70">Calibración</h2>
        </div>
        <div class="size-10"></div>
      </header>

      <!-- Main Content Scroll Area -->
      <main class="flex-1 flex flex-col px-6 pb-24 overflow-y-auto">
        <!-- Step Indicator -->
        <div class="w-full flex justify-center mt-2 mb-4">
          <span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-primary-light ring-1 ring-inset ring-primary/20">
            Paso 5 de 7 • Calibración Dinámica
          </span>
        </div>

        <!-- Headline -->
        <h1 class="text-center text-3xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark mb-8">
          Calibración por Esfuerzo
        </h1>

        <!-- Central Action Card (Timer Stage) -->
        <div class="bg-card-light dark:bg-card-dark rounded-3xl p-8 shadow-soft flex flex-col items-center justify-center relative overflow-hidden mb-6 group">
          <!-- Decorative blurred background blob -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-green/5 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Circular Timer -->
          <div class="relative size-64 flex items-center justify-center mb-6">
            <!-- SVG Ring Background -->
            <svg class="absolute w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
              <circle class="dark:stroke-gray-700" cx="50" cy="50" fill="none" r="42" stroke="#E2E8F0" stroke-width="6"></circle>
              <!-- Progress Arc -->
              <circle class="text-primary transition-all duration-1000 ease-linear" cx="50" cy="50" fill="none" r="42" stroke="currentColor" :stroke-dasharray="264" :stroke-dashoffset="progressOffset" stroke-linecap="round" stroke-width="6"></circle>
            </svg>
            <!-- Inner Content -->
            <div class="flex flex-col items-center z-10">
              <span class="material-symbols-outlined text-primary text-4xl mb-2">directions_run</span>
              <span class="text-5xl font-bold tabular-nums tracking-tight text-text-primary-light dark:text-text-primary-dark">{{ formattedTime }}</span>
              <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mt-1">Marcha en el sitio</p>
            </div>
          </div>

          <!-- Live Biofeedback Section -->
          <div class="w-full flex flex-col items-center justify-center pt-2 border-t border-gray-100 dark:border-gray-700/50">
            <div class="flex items-center gap-2 mb-2">
              <div class="size-2 rounded-full bg-accent-green animate-pulse shadow-glow"></div>
              <span class="text-xs font-semibold text-accent-green uppercase tracking-wider">Monitor activo</span>
            </div>
            <!-- Waveform Animation -->
            <div class="pulse-wave w-full max-w-[180px]">
              <div class="pulse-bar"></div>
              <div class="pulse-bar"></div>
              <div class="pulse-bar"></div>
              <div class="pulse-bar"></div>
              <div class="pulse-bar"></div>
              <div class="pulse-bar"></div>
              <div class="pulse-bar"></div>
              <div class="pulse-bar"></div>
            </div>
          </div>
        </div>

        <!-- Guidance / Context Card -->
        <div class="bg-card-light dark:bg-card-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4">
          <div class="shrink-0 mt-1 p-2 rounded-full bg-primary/10 text-primary dark:text-primary-light">
            <span class="material-symbols-outlined text-[20px]">info</span>
          </div>
          <div>
            <h3 class="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-1">¿Por qué este ejercicio?</h3>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              Este ejercicio nos ayuda a entender cómo reacciona tu corazón al movimiento y ajusta la sensibilidad del sensor dinámicamente.
            </p>
          </div>
        </div>
      </main>

      <!-- Fixed Bottom Action Area -->
      <div class="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center z-50 max-w-md mx-auto left-0 right-0">
        <button @click="startExercise" class="w-full group relative flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark active:scale-[0.98] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_8px_20px_-4px_rgba(31,75,219,0.3)]">
          <span class="material-symbols-outlined group-hover:animate-bounce">{{ isRunning ? 'pause' : 'play_arrow' }}</span>
          <span>{{ isRunning ? 'Pausar Ejercicio' : 'Comenzar Ejercicio' }}</span>
        </button>
        <button @click="$emit('navigate', 'onboarding-profile')" class="mt-3 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors underline">
          Omitir calibración
        </button>
        <p class="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
          Siguiente paso: Configuración de perfil
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

defineEmits(['navigate'])

const timeLeft = ref(60)
const isRunning = ref(false)
let intervalId: number | null = null

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progressOffset = computed(() => {
  const progress = (60 - timeLeft.value) / 60
  return 264 - (264 * progress)
})

const startExercise = () => {
  if (isRunning.value) {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  } else {
    isRunning.value = true
    intervalId = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        if (intervalId !== null) {
          clearInterval(intervalId)
          intervalId = null
        }
        isRunning.value = false
      }
    }, 1000) as unknown as number
  }
}

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.pulse-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  gap: 4px;
}

.pulse-bar {
  width: 4px;
  background-color: #2FBF9B;
  border-radius: 9999px;
  animation: pulse-eq 1s ease-in-out infinite;
}

.pulse-bar:nth-child(1) { height: 10px; animation-delay: 0.1s; }
.pulse-bar:nth-child(2) { height: 20px; animation-delay: 0.2s; }
.pulse-bar:nth-child(3) { height: 35px; animation-delay: 0.3s; }
.pulse-bar:nth-child(4) { height: 25px; animation-delay: 0.4s; }
.pulse-bar:nth-child(5) { height: 15px; animation-delay: 0.5s; }
.pulse-bar:nth-child(6) { height: 30px; animation-delay: 0.2s; }
.pulse-bar:nth-child(7) { height: 12px; animation-delay: 0.1s; }
.pulse-bar:nth-child(8) { height: 8px; animation-delay: 0.0s; }

@keyframes pulse-eq {
  0%, 100% { transform: scaleY(1); opacity: 0.6; }
  50% { transform: scaleY(1.5); opacity: 1; }
}
</style>
