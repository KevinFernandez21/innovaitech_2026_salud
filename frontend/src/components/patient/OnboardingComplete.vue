<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'

const emit = defineEmits<{
  navigate: [screen: string]
}>()

const { completeOnboarding } = useAuth()

const handleStart = () => {
  completeOnboarding()
  emit('navigate', 'dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-health-green-50 via-white to-clinical-blue-50 flex flex-col items-center justify-center p-6">
    <div class="max-w-md w-full text-center">
      <!-- Step Indicator -->
      <div class="flex justify-center gap-2 mb-8">
        <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
        <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
        <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
        <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
        <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
        <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
      </div>

      <!-- Success Animation -->
      <div class="relative mb-8">
        <div class="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-health-green-500 to-health-green-600 flex items-center justify-center shadow-2xl animate-scale-in">
          <span class="material-symbols-outlined text-white" style="font-size: 100px; font-variation-settings: 'FILL' 1;">check_circle</span>
        </div>
        <!-- Confetti particles -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="confetti" style="left: 20%; animation-delay: 0s;"></div>
          <div class="confetti" style="left: 40%; animation-delay: 0.2s;"></div>
          <div class="confetti" style="left: 60%; animation-delay: 0.4s;"></div>
          <div class="confetti" style="left: 80%; animation-delay: 0.6s;"></div>
        </div>
      </div>

      <!-- Content -->
      <h1 class="text-4xl font-display font-bold text-health-green-600 mb-4">
        ¡Todo listo!
      </h1>

      <p class="text-lg text-text-main mb-8 leading-relaxed">
        Tu perfil ha sido configurado exitosamente. Estás listo para comenzar tu viaje hacia una mejor salud cardiovascular.
      </p>

      <!-- Feature Highlights -->
      <div class="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-health-green-100 mb-8">
        <h3 class="font-semibold text-text-main mb-4">¿Qué sigue?</h3>
        <div class="space-y-3 text-left">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-clinical-blue-50 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-clinical-blue-500 text-lg">dashboard</span>
            </div>
            <p class="text-sm text-text-muted">Explora tu dashboard personalizado</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-health-green-50 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-health-green-500 text-lg">vital_signs</span>
            </div>
            <p class="text-sm text-text-muted">Registra tu primera medición</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-clinical-blue-50 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-clinical-blue-500 text-lg">groups</span>
            </div>
            <p class="text-sm text-text-muted">Invita a tu círculo de apoyo</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-health-green-50 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-health-green-500 text-lg">emoji_events</span>
            </div>
            <p class="text-sm text-text-muted">Comienza tu racha de días activos</p>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <button
        @click="handleStart"
        class="w-full bg-gradient-to-r from-health-green-500 to-health-green-600 text-white py-5 rounded-2xl font-display font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all mb-4"
      >
        Ir a mi Dashboard
      </button>

      <!-- Motivational Message -->
      <div class="bg-clinical-blue-50 rounded-xl p-4 border border-clinical-blue-100">
        <p class="text-sm text-clinical-blue-700 font-medium">
          💙 Recuerda: Cada pequeño paso cuenta. ¡Estamos aquí para apoyarte!
        </p>
      </div>

      <!-- Step Counter -->
      <p class="text-sm text-text-muted mt-6">Paso 6 de 6 - Completado</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(400px) rotate(360deg);
    opacity: 0;
  }
}

.animate-scale-in {
  animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(45deg, #1F4FD8, #2FBF9B);
  border-radius: 50%;
  animation: confetti-fall 3s ease-out infinite;
  top: 50%;
}

.confetti:nth-child(2n) {
  background: linear-gradient(45deg, #2FBF9B, #1F4FD8);
}
</style>
