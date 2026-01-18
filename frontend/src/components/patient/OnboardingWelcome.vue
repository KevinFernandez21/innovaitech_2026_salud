<script setup lang="ts">
const emit = defineEmits<{
  navigate: [screen: string]
}>()

const handleContinue = () => {
  emit('navigate', 'onboarding-permissions')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-clinical-blue-50 via-white to-health-green-50 flex flex-col">
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="max-w-md w-full text-center">
        <!-- Step Indicator -->
        <div class="flex justify-center gap-2 mb-8">
          <div class="w-8 h-1 rounded-full bg-clinical-blue-500"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
        </div>

        <!-- Hero Illustration -->
        <div class="relative mb-8">
          <div class="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-clinical-blue-500 to-clinical-blue-600 flex items-center justify-center shadow-2xl">
            <span class="material-symbols-outlined text-white" style="font-size: 100px;">favorite</span>
          </div>
          <div class="absolute -right-4 top-8 w-16 h-16 rounded-full bg-health-green-500 flex items-center justify-center shadow-lg animate-pulse">
            <span class="material-symbols-outlined text-white text-3xl">trending_up</span>
          </div>
          <div class="absolute -left-4 bottom-8 w-16 h-16 rounded-full bg-clinical-blue-400 flex items-center justify-center shadow-lg animate-pulse" style="animation-delay: 0.5s;">
            <span class="material-symbols-outlined text-white text-3xl">monitor_heart</span>
          </div>
        </div>

        <!-- Content -->
        <h1 class="text-4xl font-display font-bold text-clinical-blue-600 mb-4">
          ¡Bienvenido a<br>Cardio-Band!
        </h1>

        <p class="text-lg text-text-main mb-6 leading-relaxed">
          Tu compañero inteligente para el monitoreo cardiovascular
        </p>

        <!-- Feature Cards -->
        <div class="space-y-3 mb-10">
          <div class="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-soft border border-clinical-blue-100 flex items-center gap-4 text-left">
            <div class="w-12 h-12 rounded-xl bg-clinical-blue-50 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-clinical-blue-500 text-2xl">vital_signs</span>
            </div>
            <div>
              <p class="font-semibold text-text-main text-sm">Monitoreo en Tiempo Real</p>
              <p class="text-xs text-text-muted">Presión arterial, ritmo cardíaco y más</p>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-soft border border-health-green-100 flex items-center gap-4 text-left">
            <div class="w-12 h-12 rounded-xl bg-health-green-50 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-health-green-500 text-2xl">school</span>
            </div>
            <div>
              <p class="font-semibold text-text-main text-sm">Educación Personalizada</p>
              <p class="text-xs text-text-muted">Aprende sobre tu salud de forma sencilla</p>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-soft border border-clinical-blue-100 flex items-center gap-4 text-left">
            <div class="w-12 h-12 rounded-xl bg-clinical-blue-50 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-clinical-blue-500 text-2xl">groups</span>
            </div>
            <div>
              <p class="font-semibold text-text-main text-sm">Círculo de Apoyo</p>
              <p class="text-xs text-text-muted">Conecta con tu familia y doctor</p>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <button
          @click="handleContinue"
          class="w-full bg-gradient-to-r from-clinical-blue-500 to-clinical-blue-600 text-white py-4 rounded-2xl font-display font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          Comenzar
        </button>

        <!-- Step Counter -->
        <p class="text-sm text-text-muted mt-6">Paso 1 de 6</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(31, 79, 216, 0.08);
}
</style>
