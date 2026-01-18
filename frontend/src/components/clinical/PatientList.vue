<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockPatients } from '../../api/mockData'

const emit = defineEmits<{
  navigate: [screen: string]
}>()

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
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="emit('navigate', 'dashboard')"
            class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">arrow_back</span>
          </button>
          <h1 class="text-lg font-display font-bold text-text-main">Lista de Pacientes</h1>
        </div>
        <span class="text-sm text-text-muted">{{ filteredPatients.length }} pacientes</span>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-6">
      <!-- Search and Filters -->
      <div class="flex gap-4 mb-6">
        <div class="flex-1 relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o condición..."
            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
          />
        </div>
        <div class="flex gap-2">
          <button
            v-for="filter in [
              { value: 'all', label: 'Todos' },
              { value: 'high', label: 'Alto', color: 'red' },
              { value: 'medium', label: 'Medio', color: 'yellow' },
              { value: 'low', label: 'Bajo', color: 'green' }
            ]"
            :key="filter.value"
            @click="selectedRiskFilter = filter.value as any"
            :class="[
              'px-4 py-2 rounded-xl font-semibold text-sm transition-all',
              selectedRiskFilter === filter.value
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Patients Table -->
      <div class="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-text-muted">Paciente</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-text-muted">Edad</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-text-muted">Condiciones</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-text-muted">Riesgo</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-text-muted">Alertas</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-text-muted">Racha</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-text-muted">Última medición</th>
              <th class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="patient in filteredPatients"
              :key="patient.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="emit('navigate', `patient-detail-${patient.id}`)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="patient.avatar" :alt="patient.name" class="w-10 h-10 rounded-full object-cover">
                  <span class="font-semibold text-text-main">{{ patient.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-text-main">{{ patient.age }} años</td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="condition in patient.conditions"
                    :key="condition"
                    class="px-2 py-1 bg-clinical-blue-50 text-clinical-blue-700 text-xs rounded-lg"
                  >
                    {{ condition }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 rounded-lg text-xs font-semibold', getRiskColor(patient.risk_level)]">
                  {{ getRiskLabel(patient.risk_level) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div v-if="patient.alerts_count > 0" class="flex items-center gap-2 text-red-600">
                  <span class="material-symbols-outlined text-sm">error</span>
                  <span class="font-semibold">{{ patient.alerts_count }}</span>
                </div>
                <span v-else class="text-text-muted">-</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-health-green-500 text-sm">local_fire_department</span>
                  <span class="font-semibold text-text-main">{{ patient.streak_days }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-text-muted">
                {{ new Date(patient.last_measurement).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
              </td>
              <td class="px-6 py-4">
                <span class="material-symbols-outlined text-gray-400">chevron_right</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredPatients.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
          <p class="text-text-muted">No se encontraron pacientes</p>
        </div>
      </div>
    </div>
  </div>
</template>
