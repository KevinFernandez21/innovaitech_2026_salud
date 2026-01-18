<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
import type { UserRole } from '../../types/user'

const { login } = useAuth()

const handleLogin = (role: UserRole) => {
  login(role)
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
        <button
          @click="handleLogin('patient')"
          class="w-full bg-white rounded-2xl p-6 shadow-soft border-2 border-clinical-blue-100 hover:border-clinical-blue-500 hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-clinical-blue-500 to-clinical-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-4xl">person</span>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-display font-bold text-clinical-blue-600 mb-1">Paciente</h3>
              <p class="text-sm text-text-muted">Monitorea tu salud cardiovascular</p>
              <p class="text-xs text-health-green-600 mt-1 font-medium">Sarah Johnson</p>
            </div>
            <span class="material-symbols-outlined text-clinical-blue-300 group-hover:text-clinical-blue-500 text-3xl">chevron_right</span>
          </div>
        </button>

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
</style>
