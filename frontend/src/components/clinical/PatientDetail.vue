<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockPatients, mockMeasurements, mockTrends, mockNotifications } from '../../api/mockData'

const router = useRouter()
const route = useRoute()

// Get patient ID from route params
const patientId = computed(() => Number(route.params.id))

// Get patient data
const patient = computed(() => mockPatients.find(p => p.id === patientId.value))

// Get patient measurements
const patientMeasurements = computed(() =>
  mockMeasurements.filter(m => m.patient_id === patientId.value).slice(0, 5)
)

// Get patient alerts
const patientAlerts = computed(() =>
  mockNotifications.filter(n => n.patient_id === patientId.value && !n.read)
)

// Selected metric for chart
const selectedMetric = ref<'blood_pressure' | 'heart_rate' | 'sleep'>('blood_pressure')

// Get latest measurement
const latestMeasurement = computed(() => patientMeasurements.value[0])

// Risk color helper
const getRiskColor = (level: string) => {
  switch (level) {
    case 'high': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' }
    case 'medium': return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' }
    case 'low': return { bg: 'bg-health-green-50', text: 'text-health-green-600', border: 'border-health-green-200' }
    default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
  }
}

const getRiskLabel = (level: string) => {
  switch (level) {
    case 'high': return 'Alto Riesgo'
    case 'medium': return 'Riesgo Medio'
    case 'low': return 'Riesgo Bajo'
    default: return level
  }
}

const riskColors = computed(() => patient.value ? getRiskColor(patient.value.risk_level) : getRiskColor('low'))
</script>

<template>
  <div v-if="patient" class="min-h-screen bg-white text-text-main pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="flex items-center justify-between px-6 py-4 max-w-md mx-auto">
        <button
          @click="router.push('/clinical/dashboard')"
          class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-gray-600">arrow_back</span>
        </button>
        <div class="flex items-center gap-3">
          <div>
            <h1 class="text-lg font-bold text-text-main text-right">{{ patient.name }}</h1>
            <p class="text-sm text-text-muted text-right">{{ patient.age }} años</p>
          </div>
          <img :src="patient.avatar" :alt="patient.name" class="w-12 h-12 rounded-2xl shadow-sm object-cover ring-2 ring-white">
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      <!-- Status Section -->
      <section class="bg-white rounded-3xl p-5 shadow-soft border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div :class="['px-4 py-2 rounded-xl border', riskColors.bg, riskColors.text, riskColors.border]">
            <span class="font-bold text-sm">{{ getRiskLabel(patient.risk_level) }}</span>
          </div>
          <div v-if="patientAlerts.length > 0" class="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-xl">
            <span class="material-symbols-outlined text-red-500 text-sm">error</span>
            <span class="text-sm font-bold text-red-600">{{ patientAlerts.length }} alertas</span>
          </div>
        </div>

        <div class="text-sm text-text-muted flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">schedule</span>
          Última medición: {{ new Date(patient.last_measurement).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
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
        </div>

        <!-- Streak -->
        <div class="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-5 shadow-soft border border-orange-100">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
            <p class="text-xs font-bold text-text-muted uppercase">Racha</p>
          </div>
          <p class="text-2xl font-bold text-text-main">{{ patient.streak_days }}</p>
          <p class="text-xs text-text-muted mt-1">días</p>
        </div>
      </section>

      <!-- Trend Chart -->
      <section class="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <h3 class="font-bold text-text-main mb-4">Tendencias</h3>

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
        <h3 class="font-bold text-text-main mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-clinical-blue-500">history</span>
          Historial Reciente
        </h3>
        <div class="space-y-3">
          <div
            v-for="measurement in patientMeasurements"
            :key="measurement.id"
            class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <div>
              <p class="text-sm font-semibold text-text-main">
                <span v-if="measurement.blood_pressure">{{ measurement.blood_pressure.systolic }}/{{ measurement.blood_pressure.diastolic }} mmHg</span>
                <span v-if="measurement.heart_rate"> • {{ measurement.heart_rate }} bpm</span>
              </p>
              <p class="text-xs text-text-muted mt-1">
                {{ new Date(measurement.timestamp).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
              </p>
            </div>
            <div class="bg-gray-50 px-3 py-1 rounded-lg">
              <span class="text-xs font-medium text-text-muted">{{ measurement.device }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Medical Conditions -->
      <section class="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <h3 class="font-bold text-text-main mb-4">Condiciones Médicas</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="condition in patient.conditions"
            :key="condition"
            class="px-3 py-2 bg-clinical-blue-50 text-clinical-blue-700 text-sm font-medium rounded-xl"
          >
            {{ condition }}
          </span>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="grid grid-cols-2 gap-3">
        <button class="bg-clinical-blue-500 text-white rounded-2xl p-4 shadow-lg hover:bg-clinical-blue-600 transition-all active:scale-95 flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-2xl">call</span>
          <span class="text-sm font-semibold">Llamar</span>
        </button>
        <button class="bg-white border-2 border-clinical-blue-200 text-clinical-blue-500 rounded-2xl p-4 shadow-soft hover:border-clinical-blue-500 transition-all active:scale-95 flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-2xl">chat</span>
          <span class="text-sm font-semibold">Mensaje</span>
        </button>
      </section>
    </main>
  </div>

  <!-- Patient not found -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">person_off</span>
      <p class="text-text-muted">Paciente no encontrado</p>
      <button @click="router.push('/clinical/dashboard')" class="mt-4 px-6 py-2 bg-clinical-blue-500 text-white rounded-xl">
        Volver al Dashboard
      </button>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}
</style>
