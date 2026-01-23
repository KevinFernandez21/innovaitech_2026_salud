<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockPatients, mockMeasurements, mockTrends, mockNotifications } from '../../api/mockData'
import { useToast } from '../../composables/useToast'

const toast = useToast()

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

// Get latest measurement with blood_pressure data
const latestMeasurement = computed(() => {
  const bpMeasurement = mockMeasurements.find(m =>
    m.patient_id === patientId.value && m.blood_pressure
  )
  return bpMeasurement || patientMeasurements.value[0]
})

// Chat modal
const showChatModal = ref(false)
const chatMessage = ref('')
const chatHistory = ref<{ sender: 'doctor' | 'patient', message: string, time: string }[]>([
  { sender: 'patient', message: 'Buenos días doctor', time: '10:30' },
  { sender: 'doctor', message: 'Buenos días, ¿cómo te has sentido hoy?', time: '10:32' }
])

const openChat = () => {
  showChatModal.value = true
}

const closeChat = () => {
  showChatModal.value = false
}

const sendMessage = () => {
  if (chatMessage.value.trim()) {
    chatHistory.value.push({
      sender: 'doctor',
      message: chatMessage.value,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    })
    chatMessage.value = ''
  }
}

const callPatient = () => {
  if (!patient.value?.emergency_phones || patient.value.emergency_phones.length === 0) {
    toast.warning('Este paciente no tiene número de contacto registrado.', 'Información de contacto no disponible')
    return
  }

  const phoneNumber = patient.value.emergency_phones[0].replace(/\+/g, '')
  const message = `Hola ${patient.value.name}, soy el Dr./Dra. Te contacto para hacer seguimiento de tu salud. ¿Cómo te encuentras?`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank')
}

// Generate trend data from real patient measurements
const trendData = computed(() => {
  // Get last 7 measurements for this patient, ordered by timestamp
  const allMeasurements = mockMeasurements
    .filter(m => m.patient_id === patientId.value)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  // Filter measurements based on selected metric
  let relevantMeasurements = allMeasurements
  if (selectedMetric.value === 'blood_pressure') {
    relevantMeasurements = allMeasurements.filter(m => m.blood_pressure || m.value?.systolic)
  } else if (selectedMetric.value === 'heart_rate') {
    relevantMeasurements = allMeasurements.filter(m => m.heart_rate || (m.type === 'heart_rate' && typeof m.value === 'number'))
  } else if (selectedMetric.value === 'sleep') {
    relevantMeasurements = allMeasurements.filter(m => m.sleep || (m.type === 'sleep' && m.value))
  }

  // Get last 7 measurements
  const last7 = relevantMeasurements.slice(-7)

  // Extract values
  const data: number[] = last7.map(m => {
    if (selectedMetric.value === 'blood_pressure') {
      return m.blood_pressure?.systolic || m.value?.systolic || 0
    } else if (selectedMetric.value === 'heart_rate') {
      return m.heart_rate || (typeof m.value === 'number' ? m.value : 0)
    } else {
      return m.sleep || m.value || 0
    }
  })

  // Always return exactly 7 values, fill with 0 if needed
  while (data.length < 7) {
    data.unshift(0)
  }

  return data.slice(0, 7)
})

const maxValue = computed(() => Math.max(...trendData.value))
const minValue = computed(() => Math.min(...trendData.value))

// Calculate normalized height percentage for chart bars
const getBarHeight = (value: number) => {
  // Don't show bars for 0 values (missing data)
  if (value === 0) return 0

  const range = maxValue.value - minValue.value
  // If all values are the same, show at 60% height
  if (range === 0) return 60

  // Normalize to 20-100 range for better visibility
  const normalized = ((value - minValue.value) / range) * 80 + 20
  return normalized
}

// Risk color helper
const getRiskColor = (level: string) => {
  switch (level) {
    case 'high': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' }
    case 'medium': return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' }
    case 'low': return { bg: 'bg-health-green-50', text: 'text-health-green-600', border: 'border-health-green-200' }
    default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
  }
}

// Debug logging for trend data - remove after confirming it works
watch(trendData, (newData) => {
  console.log('📊 Trend data updated:', {
    metric: selectedMetric.value,
    data: newData,
    min: minValue.value,
    max: maxValue.value,
    patientId: patientId.value
  })
}, { immediate: true })

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
          <p class="text-2xl font-bold text-text-main" v-if="latestMeasurement?.blood_pressure || latestMeasurement?.value?.systolic">
            {{ latestMeasurement.blood_pressure?.systolic || latestMeasurement.value?.systolic }}/{{ latestMeasurement.blood_pressure?.diastolic || latestMeasurement.value?.diastolic }}
          </p>
          <p v-else class="text-2xl font-bold text-gray-300">--/--</p>
          <p class="text-xs text-text-muted mt-1">mmHg</p>
        </div>

        <!-- Heart Rate -->
        <div class="bg-white rounded-3xl p-5 shadow-soft border border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-health-green-500 text-lg">ecg_heart</span>
            <p class="text-xs font-bold text-text-muted uppercase">Ritmo</p>
          </div>
          <p class="text-2xl font-bold text-text-main" v-if="latestMeasurement?.heart_rate || latestMeasurement?.value">
            {{ latestMeasurement.heart_rate || (typeof latestMeasurement.value === 'number' ? latestMeasurement.value : '--') }}
          </p>
          <p v-else class="text-2xl font-bold text-gray-300">--</p>
          <p class="text-xs text-text-muted mt-1">bpm</p>
        </div>

        <!-- Sleep -->
        <div class="bg-white rounded-3xl p-5 shadow-soft border border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-purple-500 text-lg">bedtime</span>
            <p class="text-xs font-bold text-text-muted uppercase">Sueño</p>
          </div>
          <p class="text-2xl font-bold text-text-main" v-if="latestMeasurement?.sleep || (latestMeasurement?.type === 'sleep' && latestMeasurement?.value)">
            {{ latestMeasurement.sleep || latestMeasurement.value }}h
          </p>
          <p v-else class="text-2xl font-bold text-gray-300">--</p>
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

        <!-- Simple Bar Chart -->
        <div class="h-40 w-full relative rounded-xl bg-gray-50 p-4">
          <div class="flex items-end justify-between h-full gap-2">
            <div
              v-for="(value, index) in trendData"
              :key="index"
              class="flex-1 flex flex-col items-center justify-end"
            >
              <div
                class="w-full rounded-t-lg transition-all duration-300"
                :style="{
                  height: getBarHeight(value) + '%',
                  minWidth: '4px',
                  backgroundColor: selectedMetric === 'blood_pressure' ? '#3B82F6' :
                                   selectedMetric === 'heart_rate' ? '#10B981' :
                                   '#A855F7'
                }"
              ></div>
              <span class="text-[10px] text-text-muted mt-1">{{ index + 1 }}</span>
            </div>
          </div>
        </div>
        <p class="text-xs text-center text-text-muted mt-2">Últimos 7 registros</p>
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
            <div class="flex-1">
              <p class="text-sm font-semibold text-text-main">
                <span v-if="measurement.blood_pressure || measurement.value?.systolic">
                  {{ measurement.blood_pressure?.systolic || measurement.value?.systolic }}/{{ measurement.blood_pressure?.diastolic || measurement.value?.diastolic }} mmHg
                </span>
                <span v-if="measurement.heart_rate"> • {{ measurement.heart_rate }} bpm</span>
                <span v-if="measurement.type === 'sleep'">{{ measurement.sleep || measurement.value }}h sueño</span>
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
        <div v-if="patientMeasurements.length === 0" class="text-center py-8">
          <span class="material-symbols-outlined text-4xl text-gray-300 block mb-2">show_chart</span>
          <p class="text-sm text-text-muted">No hay mediciones disponibles</p>
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
      <section class="grid grid-cols-3 gap-3">
        <button @click="callPatient" class="bg-clinical-blue-500 text-white rounded-2xl p-4 shadow-lg hover:bg-clinical-blue-600 transition-all active:scale-95 flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-2xl">call</span>
          <span class="text-sm font-semibold">Llamar</span>
        </button>
        <button @click="openChat" class="bg-white border-2 border-clinical-blue-200 text-clinical-blue-500 rounded-2xl p-4 shadow-soft hover:border-clinical-blue-500 transition-all active:scale-95 flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-2xl">chat</span>
          <span class="text-sm font-semibold">Mensaje</span>
        </button>
        <button @click="router.push(`/clinical/patient/${patientId}/sensor`)" class="bg-purple-500 text-white rounded-2xl p-4 shadow-lg hover:bg-purple-600 transition-all active:scale-95 flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-2xl">sensors</span>
          <span class="text-sm font-semibold">Sensor</span>
        </button>
      </section>
    </main>

    <!-- Chat Modal -->
    <div v-if="showChatModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center" @click="closeChat">
      <div class="bg-white dark:bg-gray-900 w-full max-w-md h-[80vh] md:h-[600px] md:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <img :src="patient.avatar" :alt="patient.name" class="w-10 h-10 rounded-xl object-cover">
            <div>
              <h3 class="font-bold text-text-main">{{ patient.name }}</h3>
              <p class="text-xs text-text-muted">En línea</p>
            </div>
          </div>
          <button @click="closeChat" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div
            v-for="(msg, index) in chatHistory"
            :key="index"
            :class="[
              'flex',
              msg.sender === 'doctor' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div :class="[
              'max-w-[75%] rounded-2xl px-4 py-2',
              msg.sender === 'doctor'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-main'
            ]">
              <p class="text-sm">{{ msg.message }}</p>
              <p :class="[
                'text-[10px] mt-1',
                msg.sender === 'doctor' ? 'text-clinical-blue-100' : 'text-text-muted'
              ]">
                {{ msg.time }}
              </p>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex gap-2">
            <input
              v-model="chatMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Escribe un mensaje..."
              class="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
            />
            <button @click="sendMessage" class="bg-clinical-blue-500 text-white px-4 py-3 rounded-xl hover:bg-clinical-blue-600 transition-all active:scale-95">
              <span class="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
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
