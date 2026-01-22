<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockPatients } from '../../api/mockData'

const router = useRouter()

// Patient being monitored (Sarah Johnson)
const patient = mockPatients[0]

// Filter type
type FilterType = 'all' | 'medications' | 'consultations' | 'lab_tests' | 'hospitalizations'
const selectedFilter = ref<FilterType>('all')

// Mock clinical history data
const clinicalHistory = ref([
  {
    id: 1,
    type: 'consultation',
    date: new Date('2024-10-20'),
    title: 'Consulta de Control - Cardiología',
    doctor: 'Dra. María García',
    description: 'Revisión de rutina. Presión arterial controlada. Se mantiene tratamiento actual.',
    details: ['Presión: 118/78 mmHg', 'Peso: 68 kg', 'Sin síntomas adversos'],
    icon: 'stethoscope',
    color: 'clinical-blue'
  },
  {
    id: 2,
    type: 'medication',
    date: new Date('2024-10-15'),
    title: 'Ajuste de Medicación',
    doctor: 'Dra. María García',
    description: 'Se reduce dosis de Lisinopril de 20mg a 10mg por buena evolución.',
    details: ['Lisinopril 10mg - 1 vez al día', 'Duración: Indefinida'],
    icon: 'medication',
    color: 'health-green'
  },
  {
    id: 3,
    type: 'lab_test',
    date: new Date('2024-10-10'),
    title: 'Análisis de Laboratorio',
    doctor: 'Lab. Central',
    description: 'Perfil lipídico y función renal completos.',
    details: [
      'Colesterol Total: 185 mg/dL (Normal)',
      'LDL: 110 mg/dL (Normal)',
      'HDL: 52 mg/dL (Normal)',
      'Triglicéridos: 115 mg/dL (Normal)',
      'Creatinina: 0.9 mg/dL (Normal)'
    ],
    icon: 'labs',
    color: 'purple'
  },
  {
    id: 4,
    type: 'consultation',
    date: new Date('2024-09-28'),
    title: 'Consulta de Seguimiento',
    doctor: 'Dra. María García',
    description: 'Evaluación de efectividad del tratamiento. Paciente con buena adherencia.',
    details: ['Presión: 122/80 mmHg', 'Frecuencia cardíaca: 68 bpm', 'Sin efectos secundarios'],
    icon: 'stethoscope',
    color: 'clinical-blue'
  },
  {
    id: 5,
    type: 'hospitalization',
    date: new Date('2024-08-15'),
    title: 'Internación por Crisis Hipertensiva',
    doctor: 'Hospital General - UCI',
    description: 'Paciente ingresó con presión arterial 180/110. Estabilizado y dado de alta a los 3 días.',
    details: [
      'Duración: 3 días',
      'Diagnóstico: Crisis hipertensiva',
      'Tratamiento: Medicación IV + monitoreo',
      'Alta médica: Mejorado'
    ],
    icon: 'local_hospital',
    color: 'red'
  },
  {
    id: 6,
    type: 'medication',
    date: new Date('2024-08-18'),
    title: 'Inicio de Tratamiento',
    doctor: 'Dra. María García',
    description: 'Se inicia tratamiento con Lisinopril 20mg post hospitalización.',
    details: ['Lisinopril 20mg - 1 vez al día', 'Control en 2 semanas'],
    icon: 'medication',
    color: 'health-green'
  }
])

// Filtered history
const filteredHistory = computed(() => {
  if (selectedFilter.value === 'all') return clinicalHistory.value
  return clinicalHistory.value.filter(item => item.type === selectedFilter.value)
})

// Format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Get relative time
const getRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 30) return `Hace ${days} días`
  if (days < 365) {
    const months = Math.floor(days / 30)
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`
  }
  const years = Math.floor(days / 365)
  return `Hace ${years} ${years === 1 ? 'año' : 'años'}`
}

// Expanded item
const expandedItem = ref<number | null>(null)

const toggleExpand = (id: number) => {
  expandedItem.value = expandedItem.value === id ? null : id
}
</script>

<template>
  <div class="min-h-screen bg-white pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="px-6 py-4 max-w-md mx-auto">
        <div class="flex items-center justify-between mb-4">
          <button
            @click="router.push('/family/dashboard')"
            class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">arrow_back</span>
          </button>
          <div class="text-center flex-1">
            <h1 class="text-lg font-bold text-text-main">Historial Clínico</h1>
            <p class="text-xs text-text-muted">{{ patient.name }}</p>
          </div>
          <div class="w-10"></div>
        </div>

        <!-- Filters -->
        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            @click="selectedFilter = 'all'"
            :class="[
              'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              selectedFilter === 'all'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Todos
          </button>
          <button
            @click="selectedFilter = 'consultations'"
            :class="[
              'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
              selectedFilter === 'consultations'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Consultas
          </button>
          <button
            @click="selectedFilter = 'medications'"
            :class="[
              'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
              selectedFilter === 'medications'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Medicamentos
          </button>
          <button
            @click="selectedFilter = 'lab_tests'"
            :class="[
              'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
              selectedFilter === 'lab_tests'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Análisis
          </button>
          <button
            @click="selectedFilter = 'hospitalizations'"
            :class="[
              'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
              selectedFilter === 'hospitalizations'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Hospitalizaciones
          </button>
        </div>
      </div>
    </header>

    <!-- Timeline -->
    <main class="max-w-md mx-auto px-4 py-6">
      <p class="text-sm text-text-muted mb-6 px-2">{{ filteredHistory.length }} registros encontrados</p>

      <div class="relative">
        <!-- Timeline line -->
        <div class="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gray-200"></div>

        <div class="space-y-6">
          <div
            v-for="item in filteredHistory"
            :key="item.id"
            class="relative"
          >
            <!-- Timeline dot -->
            <div
              :class="[
                'absolute left-0 top-6 w-14 h-14 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-md',
                item.color === 'clinical-blue' ? 'bg-clinical-blue-500' :
                item.color === 'health-green' ? 'bg-health-green-500' :
                item.color === 'purple' ? 'bg-purple-500' :
                'bg-red-500'
              ]"
            >
              <span class="material-symbols-outlined text-white text-lg">{{ item.icon }}</span>
            </div>

            <!-- Content card -->
            <div class="ml-20">
              <button
                @click="toggleExpand(item.id)"
                class="w-full text-left bg-white rounded-2xl p-4 shadow-soft border border-gray-100 hover:border-clinical-blue-200 transition-all"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <h3 class="font-bold text-text-main text-base leading-tight">{{ item.title }}</h3>
                    <p class="text-xs text-text-muted mt-1">{{ item.doctor }}</p>
                  </div>
                  <span
                    class="material-symbols-outlined text-gray-400 transition-transform"
                    :class="{ 'rotate-180': expandedItem === item.id }"
                  >
                    expand_more
                  </span>
                </div>

                <p class="text-sm text-text-main mt-2">{{ item.description }}</p>

                <div class="flex items-center gap-4 mt-3 text-xs">
                  <span class="text-clinical-blue-500 font-semibold">{{ formatDate(item.date) }}</span>
                  <span class="text-text-muted">{{ getRelativeTime(item.date) }}</span>
                </div>

                <!-- Expanded details -->
                <div
                  v-if="expandedItem === item.id"
                  class="mt-4 pt-4 border-t border-gray-100"
                >
                  <h4 class="text-xs font-semibold text-text-muted uppercase mb-2">Detalles</h4>
                  <ul class="space-y-1">
                    <li
                      v-for="(detail, index) in item.details"
                      :key="index"
                      class="text-sm text-text-main flex items-start gap-2"
                    >
                      <span class="material-symbols-outlined text-clinical-blue-500 text-base flex-shrink-0 mt-0.5">check_circle</span>
                      <span>{{ detail }}</span>
                    </li>
                  </ul>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredHistory.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">folder_open</span>
        <p class="text-text-muted">No hay registros en esta categoría</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
