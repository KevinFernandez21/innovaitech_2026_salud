<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')
const age = ref('')
const height = ref('')
const weight = ref('')
const emergencyContact = ref('')
const emergencyPhone = ref('')

const conditions = ref<string[]>([])
const availableConditions = [
  'Hipertensión',
  'Diabetes',
  'Colesterol alto',
  'Arritmia',
  'Obesidad',
  'Ninguna (Prevención)'
]

const toggleCondition = (condition: string) => {
  const index = conditions.value.indexOf(condition)
  if (index > -1) {
    conditions.value.splice(index, 1)
  } else {
    conditions.value.push(condition)
  }
}

const isFormValid = () => {
  return fullName.value && age.value && emergencyContact.value && conditions.value.length > 0
}

const handleContinue = () => {
  if (isFormValid()) {
    router.push('/patient/onboarding/complete')
  }
}

const handleBack = () => {
  router.push('/patient/onboarding/calibration')
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10">
      <div class="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        <button
          @click="handleBack"
          class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-gray-600">arrow_back</span>
        </button>
        <h1 class="text-lg font-display font-bold text-text-main">Tu Perfil</h1>
        <div class="w-10"></div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto pb-32">
      <div class="max-w-md mx-auto px-6 py-8">
        <!-- Step Indicator -->
        <div class="flex justify-center gap-2 mb-8">
          <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
          <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
          <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
          <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
          <div class="w-8 h-1 rounded-full bg-clinical-blue-500"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
        </div>

        <!-- Content -->
        <h2 class="text-3xl font-display font-bold text-clinical-blue-600 mb-3 text-center">
          Completa tu perfil
        </h2>
        <p class="text-text-muted text-center mb-8">
          Ayúdanos a personalizar tu experiencia
        </p>

        <!-- Form -->
        <div class="space-y-6">
          <!-- Basic Info -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-text-main mb-2">
                Nombre completo *
              </label>
              <input
                v-model="fullName"
                type="text"
                placeholder="Ej: Sarah Johnson"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-sm font-semibold text-text-main mb-2">
                  Edad *
                </label>
                <input
                  v-model="age"
                  type="number"
                  placeholder="45"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-text-main mb-2">
                  Altura (cm)
                </label>
                <input
                  v-model="height"
                  type="number"
                  placeholder="165"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-text-main mb-2">
                  Peso (kg)
                </label>
                <input
                  v-model="weight"
                  type="number"
                  placeholder="68"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <!-- Health Conditions -->
          <div>
            <label class="block text-sm font-semibold text-text-main mb-3">
              Condiciones de salud *
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="condition in availableConditions"
                :key="condition"
                @click="toggleCondition(condition)"
                :class="[
                  'px-4 py-3 rounded-xl text-sm font-medium transition-all border-2',
                  conditions.includes(condition)
                    ? 'bg-clinical-blue-500 text-white border-clinical-blue-500'
                    : 'bg-white text-text-main border-gray-200 hover:border-clinical-blue-300'
                ]"
              >
                {{ condition }}
              </button>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="bg-red-50 rounded-2xl p-5 border border-red-100">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-red-500">emergency</span>
              <h3 class="font-semibold text-text-main">Contacto de Emergencia *</h3>
            </div>
            <div class="space-y-3">
              <input
                v-model="emergencyContact"
                type="text"
                placeholder="Nombre del contacto"
                class="w-full px-4 py-3 rounded-xl border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors bg-white"
              />
              <input
                v-model="emergencyPhone"
                type="tel"
                placeholder="Teléfono"
                class="w-full px-4 py-3 rounded-xl border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors bg-white"
              />
            </div>
          </div>

          <!-- Privacy Notice -->
          <div class="bg-clinical-blue-50 rounded-xl p-4 border border-clinical-blue-100">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-clinical-blue-500 text-xl flex-shrink-0">shield</span>
              <p class="text-xs text-clinical-blue-700 leading-relaxed">
                Toda tu información médica está protegida bajo las normas de privacidad y solo será compartida con profesionales de salud autorizados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white">
      <div class="max-w-md mx-auto px-6 py-4">
        <button
          @click="handleContinue"
          :disabled="!isFormValid()"
          :class="[
            'w-full py-4 rounded-2xl font-display font-bold text-lg transition-all',
            isFormValid()
              ? 'bg-gradient-to-r from-clinical-blue-500 to-clinical-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >
          Continuar
        </button>
        <p class="text-sm text-text-muted text-center mt-3">Paso 6 de 7</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
