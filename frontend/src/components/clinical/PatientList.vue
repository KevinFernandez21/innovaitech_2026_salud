<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockPatients } from '../../api/mockData'

const router = useRouter()

const searchQuery = ref('')
const selectedRiskFilter = ref<'all' | 'high' | 'medium' | 'low'>('all')

const filteredPatients = computed(() => {
  let filtered = mockPatients

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.conditions.some(c => c.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // Filter by risk
  if (selectedRiskFilter.value !== 'all') {
    filtered = filtered.filter(p => p.risk_level === selectedRiskFilter.value)
  }

  return filtered
})

const getRiskColor = (level: string) => {
  switch (level) {
    case 'high': return 'text-red-600 bg-red-100'
    case 'medium': return 'text-yellow-600 bg-yellow-100'
    case 'low': return 'text-health-green-600 bg-health-green-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

const getRiskLabel = (level: string) => {
  switch (level) {
    case 'high': return 'Alto'
    case 'medium': return 'Medio'
    case 'low': return 'Bajo'
    default: return level
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-6">
    <!-- Header -->
    <header class="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10">
      <div class="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="router.push('/clinical/dashboard')"
            class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">arrow_back</span>
          </button>
          <h1 class="text-lg font-display font-bold text-text-main">Lista de Pacientes</h1>
        </div>
        <span class="text-sm text-text-muted font-semibold">{{ filteredPatients.length }} pacientes</span>
      </div>
    </header>

    <div class="max-w-md mx-auto px-4 py-4">
      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar paciente..."
            class="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-clinical-blue-500 focus:outline-none focus:ring-2 focus:ring-clinical-blue-500/20 transition-all"
          />
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-2">
        <button
          v-for="filter in [
            { value: 'all', label: 'Todos' },
            { value: 'high', label: 'Alto' },
            { value: 'medium', label: 'Medio' },
            { value: 'low', label: 'Bajo' }
          ]"
          :key="filter.value"
          @click="selectedRiskFilter = filter.value as any"
          :class="[
            'px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap',
            selectedRiskFilter === filter.value
              ? 'bg-clinical-blue-500 text-white shadow-md'
              : 'bg-white text-text-muted hover:bg-gray-100 border border-gray-200'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Patient Cards -->
      <div class="space-y-3">
        <div
          v-for="patient in filteredPatients"
          :key="patient.id"
          @click="router.push(`/clinical/patient/${patient.id}`)"
          class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 active:scale-[0.98]"
        >
          <!-- Header Row -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img :src="patient.avatar" :alt="patient.name" class="w-12 h-12 rounded-xl object-cover shadow-sm">
                <div :class="[
                  'absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full',
                  patient.risk_level === 'high' ? 'bg-red-500' :
                  patient.risk_level === 'medium' ? 'bg-yellow-500' :
                  'bg-health-green-500'
                ]"></div>
              </div>
              <div>
                <h3 class="font-bold text-text-main">{{ patient.name }}</h3>
                <p class="text-sm text-text-muted">{{ patient.age }} años</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
          </div>

          <!-- Conditions Tags -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="condition in patient.conditions.slice(0, 2)"
              :key="condition"
              class="px-2.5 py-1 bg-clinical-blue-50 text-clinical-blue-700 text-xs font-medium rounded-lg"
            >
              {{ condition }}
            </span>
            <span
              v-if="patient.conditions.length > 2"
              class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg"
            >
              +{{ patient.conditions.length - 2 }}
            </span>
          </div>

          <!-- Info Grid -->
          <div class="grid grid-cols-3 gap-3">
            <!-- Risk Level -->
            <div class="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-2">
              <span :class="[
                'text-xs font-bold mb-1',
                patient.risk_level === 'high' ? 'text-red-600' :
                patient.risk_level === 'medium' ? 'text-yellow-600' :
                'text-health-green-600'
              ]">
                {{ getRiskLabel(patient.risk_level) }}
              </span>
              <span class="text-[10px] text-text-muted uppercase font-semibold">Riesgo</span>
            </div>

            <!-- Alerts -->
            <div class="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-2">
              <div v-if="patient.alerts_count > 0" class="flex items-center gap-1 mb-1">
                <span class="material-symbols-outlined text-red-500 text-sm">error</span>
                <span class="text-xs font-bold text-red-600">{{ patient.alerts_count }}</span>
              </div>
              <span v-else class="text-xs font-bold text-text-muted mb-1">-</span>
              <span class="text-[10px] text-text-muted uppercase font-semibold">Alertas</span>
            </div>

            <!-- Streak -->
            <div class="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-2">
              <div class="flex items-center gap-1 mb-1">
                <span class="material-symbols-outlined text-health-green-500 text-sm">local_fire_department</span>
                <span class="text-xs font-bold text-text-main">{{ patient.streak_days }}</span>
              </div>
              <span class="text-[10px] text-text-muted uppercase font-semibold">Días</span>
            </div>
          </div>

          <!-- Last Measurement -->
          <div class="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-400 text-sm">schedule</span>
            <span class="text-xs text-text-muted">
              Última medición: {{ new Date(patient.last_measurement).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPatients.length === 0" class="text-center py-16">
          <span class="material-symbols-outlined text-6xl text-gray-300 mb-4 block">search_off</span>
          <p class="text-text-muted font-medium">No se encontraron pacientes</p>
          <p class="text-sm text-text-muted mt-1">Intenta con otros términos de búsqueda</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
