<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockPatients, mockMeasurements } from '../../api/mockData'

const router = useRouter()

// Patient being monitored (Sarah Johnson)
const patient = mockPatients[0]

// Get patient measurements
const patientMeasurements = computed(() =>
  mockMeasurements.filter(m => m.patient_id === patient.id).slice(0, 10)
)

// Get latest measurement
const latestMeasurement = computed(() => patientMeasurements.value[0])

// Selected metric for chart
const selectedMetric = ref<'blood_pressure' | 'heart_rate' | 'sleep'>('blood_pressure')

// Format time relative
const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora mismo'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours}h`
  if (days === 1) return 'Ayer'
  return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// Check if value is in normal range
const isValueNormal = (measurement: typeof patientMeasurements.value[0]) => {
  if (measurement.blood_pressure) {
    const systolic = measurement.blood_pressure.systolic
    const diastolic = measurement.blood_pressure.diastolic
    if (systolic > 140 || systolic < 90 || diastolic > 90 || diastolic < 60) {
      return false
    }
  }
  if (measurement.heart_rate) {
    if (measurement.heart_rate > 100 || measurement.heart_rate < 60) {
      return false
    }
  }
  return true
}

// Get status badge
const vitalStatus = computed(() => {
  if (!latestMeasurement.value) return { label: 'Sin datos', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' }

  const isNormal = isValueNormal(latestMeasurement.value)

  if (isNormal) {
    return { label: 'Todo normal', color: 'bg-health-green-500', textColor: 'text-health-green-700', bgColor: 'bg-health-green-50' }
  } else {
    return { label: 'Requiere atención', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
  }
})
</script>

<template>
  <div class="min-h-screen bg-white text-text-main pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="flex items-center justify-between px-6 py-4 max-w-md mx-auto">
        <button
          @click="router.push('/family/dashboard')"
          class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-gray-600">arrow_back</span>
        </button>
        <div class="flex items-center gap-3">
          <div>
            <h1 class="text-lg font-bold text-text-main text-right">Señales Vitales</h1>
            <p class="text-sm text-text-muted text-right">{{ patient.name }}</p>
          </div>
          <img :src="patient.avatar" :alt="patient.name" class="w-12 h-12 rounded-2xl shadow-sm object-cover ring-2 ring-white">
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      <!-- Status Badge -->
      <section class="bg-white rounded-3xl p-5 shadow-soft border border-gray-100">
        <div class="flex items-center justify-between">
          <div :class="['px-4 py-2 rounded-xl border flex items-center gap-2', vitalStatus.bgColor, vitalStatus.textColor]">
            <span :class="['w-2 h-2 rounded-full', vitalStatus.color]"></span>
            <span class="font-bold text-sm">{{ vitalStatus.label }}</span>
          </div>
          <div class="text-sm text-text-muted">
            <span class="material-symbols-outlined text-sm align-middle">schedule</span>
            Última medición: {{ formatRelativeTime(patient.last_measurement) }}
          </div>
        </div>
      </section>

      <!-- Main Metrics Grid -->
      <section class="grid grid-cols-2 gap-3">
        <!-- Blood Pressure -->
        <div class="bg-white rounded-3xl p-5 shadow-soft border border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-clinical-blue-500 text-lg">favorite</span>
            <p class="text-xs font-bold text-text-muted uppercase">Presión</p>
          </div>
          <p class="text-2xl font-bold text-text-main" v-if="latestMeasurement?.blood_pressure">
            {{ latestMeasurement.blood_pressure.systolic }}/{{ latestMeasurement.blood_pressure.diastolic }}
          </p>
          <p class="text-xs text-text-muted mt-1">mmHg</p>
          <div v-if="latestMeasurement?.blood_pressure" class="mt-2">
            <span
              v-if="latestMeasurement.blood_pressure.systolic > 140 || latestMeasurement.blood_pressure.diastolic > 90"
              class="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full"
            >
              Elevada
            </span>
            <span
              v-else
              class="text-xs bg-health-green-50 text-health-green-600 px-2 py-0.5 rounded-full"
            >
              Normal
            </span>
          </div>
        </div>

        <!-- Heart Rate -->
        <div class="bg-white rounded-3xl p-5 shadow-soft border border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-health-green-500 text-lg">ecg_heart</span>
            <p class="text-xs font-bold text-text-muted uppercase">Ritmo</p>
          </div>
          <p class="text-2xl font-bold text-text-main" v-if="latestMeasurement?.heart_rate">
            {{ latestMeasurement.heart_rate }}
          </p>
          <p class="text-xs text-text-muted mt-1">bpm</p>
          <div v-if="latestMeasurement?.heart_rate" class="mt-2">
            <span
              v-if="latestMeasurement.heart_rate > 100 || latestMeasurement.heart_rate < 60"
              class="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full"
            >
              Anormal
            </span>
            <span
              v-else
              class="text-xs bg-health-green-50 text-health-green-600 px-2 py-0.5 rounded-full"
            >
              Normal
            </span>
          </div>
        </div>

        <!-- Sleep -->
        <div class="bg-white rounded-3xl p-5 shadow-soft border border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-purple-500 text-lg">bedtime</span>
            <p class="text-xs font-bold text-text-muted uppercase">Sueño</p>
          </div>
          <p class="text-2xl font-bold text-text-main" v-if="latestMeasurement?.sleep">
            {{ latestMeasurement.sleep }}h
          </p>
          <p class="text-xs text-text-muted mt-1">horas</p>
          <div v-if="latestMeasurement?.sleep" class="mt-2">
            <span
              v-if="latestMeasurement.sleep < 7"
              class="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full"
            >
              Bajo
            </span>
            <span
              v-else
              class="text-xs bg-health-green-50 text-health-green-600 px-2 py-0.5 rounded-full"
            >
              Bueno
            </span>
          </div>
        </div>

        <!-- Streak -->
        <div class="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-5 shadow-soft border border-orange-100">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
            <p class="text-xs font-bold text-text-muted uppercase">Racha</p>
          </div>
          <p class="text-2xl font-bold text-text-main">{{ patient.streak_days }}</p>
          <p class="text-xs text-text-muted mt-1">días</p>
          <div class="mt-2">
            <span class="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
              ¡Activo!
            </span>
          </div>
        </div>
      </section>

      <!-- Trend Chart -->
      <section class="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <h3 class="font-bold text-text-main mb-4">Tendencias (Últimas 24 horas)</h3>

        <!-- Metric Selector -->
        <div class="flex gap-2 mb-4">
          <button
            @click="selectedMetric = 'blood_pressure'"
            :class="[
              'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all',
              selectedMetric === 'blood_pressure'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Presión
          </button>
          <button
            @click="selectedMetric = 'heart_rate'"
            :class="[
              'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all',
              selectedMetric === 'heart_rate'
                ? 'bg-health-green-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Ritmo
          </button>
          <button
            @click="selectedMetric = 'sleep'"
            :class="[
              'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all',
              selectedMetric === 'sleep'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Sueño
          </button>
        </div>

        <!-- Simple chart placeholder -->
        <div class="h-32 w-full relative bg-gradient-to-b from-clinical-blue-50 to-transparent rounded-xl border border-clinical-blue-100 flex items-center justify-center">
          <div class="text-center">
            <span class="material-symbols-outlined text-4xl text-clinical-blue-300">show_chart</span>
            <p class="text-xs text-text-muted mt-2">Gráfica de tendencias</p>
          </div>
        </div>
      </section>

      <!-- Recent Measurements -->
      <section class="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-text-main flex items-center gap-2">
            <span class="material-symbols-outlined text-clinical-blue-500">history</span>
            Historial Reciente
          </h3>
          <span class="text-xs text-text-muted">Últimas 10 mediciones</span>
        </div>

        <div class="space-y-3">
          <div
            v-for="measurement in patientMeasurements"
            :key="measurement.id"
            :class="[
              'flex items-center justify-between py-3 px-4 rounded-xl border-2 transition-all',
              isValueNormal(measurement) ? 'border-gray-100 bg-white' : 'border-red-100 bg-red-50'
            ]"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <p class="text-sm font-semibold text-text-main">
                  <span v-if="measurement.blood_pressure">{{ measurement.blood_pressure.systolic }}/{{ measurement.blood_pressure.diastolic }} mmHg</span>
                  <span v-if="measurement.heart_rate"> • {{ measurement.heart_rate }} bpm</span>
                </p>
                <span v-if="!isValueNormal(measurement)" class="material-symbols-outlined text-red-500 text-sm">error</span>
              </div>
              <p class="text-xs text-text-muted">
                {{ formatRelativeTime(measurement.timestamp) }} • {{ measurement.device }}
              </p>
            </div>
            <button class="text-clinical-blue-500 hover:text-clinical-blue-600">
              <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="grid grid-cols-2 gap-3">
        <button
          @click="router.push('/family/messages')"
          class="bg-clinical-blue-500 text-white rounded-2xl p-4 shadow-lg hover:bg-clinical-blue-600 transition-all active:scale-95 flex flex-col items-center gap-2"
        >
          <span class="material-symbols-outlined text-2xl">chat</span>
          <span class="text-sm font-semibold">Enviar mensaje</span>
        </button>
        <button class="bg-white border-2 border-clinical-blue-200 text-clinical-blue-500 rounded-2xl p-4 shadow-soft hover:border-clinical-blue-500 transition-all active:scale-95 flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-2xl">share</span>
          <span class="text-sm font-semibold">Compartir datos</span>
        </button>
      </section>
    </main>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}
</style>
