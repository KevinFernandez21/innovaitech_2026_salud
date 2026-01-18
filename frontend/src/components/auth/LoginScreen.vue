<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import type { UserRole } from '../../types/user'

const { login, resetOnboarding, completeOnboarding } = useAuth()
const showPatientOptions = ref(false)

const handleLogin = (role: UserRole, isNewPatient = false) => {
  const user = login(role)

  // Si es paciente nuevo (register), resetear onboarding para forzar el flujo completo
  if (role === 'patient' && isNewPatient && user) {
    resetOnboarding()
  }
  // Si es paciente existente (login), marcar onboarding como completado
  else if (role === 'patient' && !isNewPatient && user) {
    completeOnboarding()
  }
}

const togglePatientOptions = () => {
  showPatientOptions.value = !showPatientOptions.value
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-clinical-blue-50 via-white to-health-green-50 flex flex-col items-center justify-center p-6">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-clinical-blue-500 mb-6 shadow-lg">
          <span class="material-symbols-outlined text-5xl text-white">favorite</span>
        </div>
        <h1 class="text-5xl font-display font-bold text-clinical-blue-500 mb-3">Cardio-Band</h1>
        <p class="text-text-muted text-lg">Sistema de Monitoreo Cardiovascular</p>
        <p class="text-text-muted text-sm mt-2">Selecciona tu perfil para continuar</p>
      </div>

      <!-- Role Selection Cards -->
      <div class="space-y-4">
        <!-- Patient Role -->
        <div class="w-full">
          <button
            @click="togglePatientOptions"
            class="w-full bg-white rounded-2xl p-6 shadow-soft border-2 border-clinical-blue-100 hover:border-clinical-blue-500 hover:shadow-lg transition-all text-left group"
          >
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-clinical-blue-500 to-clinical-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-4xl">person</span>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-display font-bold text-clinical-blue-600 mb-1">Paciente</h3>
                <p class="text-sm text-text-muted">Monitorea tu salud cardiovascular</p>
              </div>
              <span
                class="material-symbols-outlined text-clinical-blue-300 group-hover:text-clinical-blue-500 text-3xl transition-transform"
                :class="{ 'rotate-90': showPatientOptions }"
              >
                chevron_right
              </span>
            </div>
          </button>

          <!-- Patient Login/Register Options -->
          <div
            v-if="showPatientOptions"
            class="mt-3 ml-4 space-y-3 animate-fade-in"
          >
            <!-- Register Button -->
            <button
              @click="handleLogin('patient', true)"
              class="w-full bg-gradient-to-r from-clinical-blue-500 to-clinical-blue-600 text-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all text-left group flex items-center gap-3"
            >
              <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">person_add</span>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-base">Registrarse</h4>
                <p class="text-xs text-clinical-blue-100">Nuevo paciente - Configuración inicial</p>
              </div>
              <span class="material-symbols-outlined text-white/70 group-hover:text-white text-2xl">arrow_forward</span>
            </button>

            <!-- Login Button -->
            <button
              @click="handleLogin('patient', false)"
              class="w-full bg-white border-2 border-clinical-blue-200 text-clinical-blue-600 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-clinical-blue-400 transition-all text-left group flex items-center gap-3"
            >
              <div class="w-12 h-12 rounded-xl bg-clinical-blue-50 flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-clinical-blue-600">login</span>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-base">Iniciar Sesión</h4>
                <p class="text-xs text-text-muted">Ya tengo cuenta - Ir al dashboard</p>
              </div>
              <span class="material-symbols-outlined text-clinical-blue-300 group-hover:text-clinical-blue-500 text-2xl">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Clinical Role -->
        <button
          @click="handleLogin('clinical')"
          class="w-full bg-white rounded-2xl p-6 shadow-soft border-2 border-clinical-blue-100 hover:border-clinical-blue-500 hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-clinical-blue-600 to-clinical-blue-700 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-4xl">medical_information</span>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-display font-bold text-clinical-blue-600 mb-1">Clínico</h3>
              <p class="text-sm text-text-muted">Supervisa a tus pacientes</p>
              <p class="text-xs text-health-green-600 mt-1 font-medium">Dr. María García</p>
            </div>
            <span class="material-symbols-outlined text-clinical-blue-300 group-hover:text-clinical-blue-500 text-3xl">chevron_right</span>
          </div>
        </button>

        <!-- Family Role -->
        <button
          @click="handleLogin('family')"
          class="w-full bg-white rounded-2xl p-6 shadow-soft border-2 border-health-green-100 hover:border-health-green-500 hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-health-green-500 to-health-green-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-4xl">family_restroom</span>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-display font-bold text-health-green-600 mb-1">Familiar</h3>
              <p class="text-sm text-text-muted">Acompaña a tu ser querido</p>
              <p class="text-xs text-clinical-blue-600 mt-1 font-medium">John Johnson</p>
            </div>
            <span class="material-symbols-outlined text-health-green-300 group-hover:text-health-green-500 text-3xl">chevron_right</span>
          </div>
        </button>
      </div>

      <!-- Demo Note -->
      <div class="mt-8 p-4 bg-clinical-blue-50 rounded-xl border border-clinical-blue-100">
        <p class="text-xs text-clinical-blue-600 text-center">
          <span class="material-symbols-outlined text-sm align-middle">info</span>
          Demo para Hackathon - Datos simulados
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -4px rgba(31, 79, 216, 0.1);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
