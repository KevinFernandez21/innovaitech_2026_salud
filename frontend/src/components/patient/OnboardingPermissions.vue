<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  navigate: [screen: string]
}>()

const bluetoothEnabled = ref(false)
const notificationsEnabled = ref(false)
const locationEnabled = ref(false)

const enableBluetooth = () => {
  bluetoothEnabled.value = true
}

const enableNotifications = () => {
  notificationsEnabled.value = true
}

const enableLocation = () => {
  locationEnabled.value = true
}

const handleContinue = () => {
  emit('navigate', 'bluetooth')
}

const handleBack = () => {
  emit('navigate', 'data-consent')
}

const allPermissionsGranted = () => {
  return bluetoothEnabled.value && notificationsEnabled.value && locationEnabled.value
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
        <h1 class="text-lg font-display font-bold text-text-main">Permisos</h1>
        <div class="w-10"></div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-md mx-auto px-6 py-8">
        <!-- Step Indicator -->
        <div class="flex justify-center gap-2 mb-8">
          <div class="w-8 h-1 rounded-full bg-health-green-500"></div>
          <div class="w-8 h-1 rounded-full bg-clinical-blue-500"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
          <div class="w-8 h-1 rounded-full bg-gray-200"></div>
        </div>

        <!-- Content -->
        <h2 class="text-3xl font-display font-bold text-clinical-blue-600 mb-3 text-center">
          Necesitamos algunos permisos
        </h2>
        <p class="text-text-muted text-center mb-8">
          Para brindarte la mejor experiencia de monitoreo
        </p>

        <!-- Permission Cards -->
        <div class="space-y-4">
          <!-- Bluetooth -->
          <div
            :class="[
              'bg-white rounded-2xl p-6 border-2 transition-all',
              bluetoothEnabled ? 'border-health-green-500 bg-health-green-50' : 'border-gray-200 shadow-soft'
            ]"
          >
            <div class="flex items-start gap-4">
              <div
                :class="[
                  'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                  bluetoothEnabled ? 'bg-health-green-500' : 'bg-clinical-blue-50'
                ]"
              >
                <span
                  :class="[
                    'material-symbols-outlined text-3xl',
                    bluetoothEnabled ? 'text-white' : 'text-clinical-blue-500'
                  ]"
                >
                  bluetooth
                </span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-text-main mb-1">Bluetooth</h3>
                <p class="text-sm text-text-muted mb-3">
                  Conecta tu dispositivo Cardio-Band para recibir datos en tiempo real
                </p>
                <button
                  v-if="!bluetoothEnabled"
                  @click="enableBluetooth"
                  class="px-4 py-2 bg-clinical-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-clinical-blue-600 transition-colors"
                >
                  Habilitar
                </button>
                <div v-else class="flex items-center gap-2 text-health-green-600">
                  <span class="material-symbols-outlined text-xl">check_circle</span>
                  <span class="text-sm font-semibold">Habilitado</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div
            :class="[
              'bg-white rounded-2xl p-6 border-2 transition-all',
              notificationsEnabled ? 'border-health-green-500 bg-health-green-50' : 'border-gray-200 shadow-soft'
            ]"
          >
            <div class="flex items-start gap-4">
              <div
                :class="[
                  'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                  notificationsEnabled ? 'bg-health-green-500' : 'bg-clinical-blue-50'
                ]"
              >
                <span
                  :class="[
                    'material-symbols-outlined text-3xl',
                    notificationsEnabled ? 'text-white' : 'text-clinical-blue-500'
                  ]"
                >
                  notifications
                </span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-text-main mb-1">Notificaciones</h3>
                <p class="text-sm text-text-muted mb-3">
                  Recibe alertas importantes sobre tu salud y recordatorios
                </p>
                <button
                  v-if="!notificationsEnabled"
                  @click="enableNotifications"
                  class="px-4 py-2 bg-clinical-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-clinical-blue-600 transition-colors"
                >
                  Habilitar
                </button>
                <div v-else class="flex items-center gap-2 text-health-green-600">
                  <span class="material-symbols-outlined text-xl">check_circle</span>
                  <span class="text-sm font-semibold">Habilitado</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Location (Optional) -->
          <div
            :class="[
              'bg-white rounded-2xl p-6 border-2 transition-all',
              locationEnabled ? 'border-health-green-500 bg-health-green-50' : 'border-gray-200 shadow-soft'
            ]"
          >
            <div class="flex items-start gap-4">
              <div
                :class="[
                  'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                  locationEnabled ? 'bg-health-green-500' : 'bg-clinical-blue-50'
                ]"
              >
                <span
                  :class="[
                    'material-symbols-outlined text-3xl',
                    locationEnabled ? 'text-white' : 'text-clinical-blue-500'
                  ]"
                >
                  location_on
                </span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-text-main mb-1">
                  Ubicación
                  <span class="text-xs text-text-muted font-normal">(Opcional)</span>
                </h3>
                <p class="text-sm text-text-muted mb-3">
                  Mejora la precisión del Bluetooth y contexto de actividad
                </p>
                <button
                  v-if="!locationEnabled"
                  @click="enableLocation"
                  class="px-4 py-2 bg-clinical-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-clinical-blue-600 transition-colors"
                >
                  Habilitar
                </button>
                <div v-else class="flex items-center gap-2 text-health-green-600">
                  <span class="material-symbols-outlined text-xl">check_circle</span>
                  <span class="text-sm font-semibold">Habilitado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Note -->
        <div class="mt-8 p-4 bg-clinical-blue-50 rounded-xl border border-clinical-blue-100">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-clinical-blue-500 text-xl flex-shrink-0">lock</span>
            <p class="text-xs text-clinical-blue-700 leading-relaxed">
              Tu privacidad es importante. Todos los datos son encriptados y solo tú y tu equipo médico autorizado pueden acceder a ellos.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-100 bg-white">
      <div class="max-w-md mx-auto px-6 py-4">
        <button
          @click="handleContinue"
          :disabled="!allPermissionsGranted()"
          :class="[
            'w-full py-4 rounded-2xl font-display font-bold text-lg transition-all',
            allPermissionsGranted()
              ? 'bg-gradient-to-r from-clinical-blue-500 to-clinical-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >
          Continuar
        </button>
        <p class="text-sm text-text-muted text-center mt-3">Paso 3 de 7</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(31, 79, 216, 0.08);
}
</style>
