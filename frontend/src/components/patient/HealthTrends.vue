<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockTrends } from '../../api/mockData'

const router = useRouter()

type TimeRange = '7d' | '30d' | '90d'
const selectedRange = ref<TimeRange>('7d')
const selectedMetric = ref<'blood_pressure' | 'heart_rate' | 'sleep'>('blood_pressure')

// Filter data by selected range
const getRangeData = (data: any[], range: TimeRange) => {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  return data.slice(-days)
}

const bloodPressureData = computed(() => getRangeData(mockTrends.blood_pressure, selectedRange.value))
const heartRateData = computed(() => getRangeData(mockTrends.heart_rate, selectedRange.value))
const sleepData = computed(() => getRangeData(mockTrends.sleep, selectedRange.value))

// Calculate averages
const avgSystolic = computed(() => {
  const values = bloodPressureData.value.map((d: any) => d.value.systolic)
  return Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length)
})

const avgDiastolic = computed(() => {
  const values = bloodPressureData.value.map((d: any) => d.value.diastolic)
  return Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length)
})

const avgHeartRate = computed(() => {
  const values = heartRateData.value.map((d: any) => d.value)
  return Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length)
})

const avgSleep = computed(() => {
  const values = sleepData.value.map((d: any) => d.value)
  return (values.reduce((a: number, b: number) => a + b, 0) / values.length).toFixed(1)
})

const handleBack = () => {
  router.push('/patient/dashboard')
}

// Download functionality
const showDownloadModal = ref(false)
const downloadFormat = ref<'pdf' | 'csv' | 'json'>('pdf')
const includeCharts = ref(true)
const includeRawData = ref(true)

const openDownloadModal = () => {
  showDownloadModal.value = true
}

const closeDownloadModal = () => {
  showDownloadModal.value = false
}

const handleDownload = () => {
  // In a real app, this would generate the actual file
  const rangeText = selectedRange.value === '7d' ? '7 días' : selectedRange.value === '30d' ? '30 días' : '90 días'

  let formatText = ''
  switch (downloadFormat.value) {
    case 'pdf':
      formatText = 'PDF'
      break
    case 'csv':
      formatText = 'CSV (Excel)'
      break
    case 'json':
      formatText = 'JSON (Datos estructurados)'
      break
  }

  const includedData = []
  if (includeCharts.value) includedData.push('gráficas')
  if (includeRawData.value) includedData.push('datos crudos')

  alert(`Descargando reporte de salud:\n\n` +
    `Formato: ${formatText}\n` +
    `Período: ${rangeText}\n` +
    `Incluye: ${includedData.join(', ')}\n\n` +
    `El archivo se descargará en unos momentos...`)

  closeDownloadModal()
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
        <h1 class="text-lg font-display font-bold text-text-main">Tendencias de Salud</h1>
        <button @click="openDownloadModal" class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center">
          <span class="material-symbols-outlined text-gray-600">download</span>
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto pb-24">
      <div class="max-w-md mx-auto px-6 py-6">
        <!-- Time Range Selector -->
        <div class="flex gap-2 mb-6">
          <button
            v-for="range in [{ value: '7d', label: '7 días' }, { value: '30d', label: '30 días' }, { value: '90d', label: '90 días' }]"
            :key="range.value"
            @click="selectedRange = range.value as TimeRange"
            :class="[
              'flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all',
              selectedRange === range.value
                ? 'bg-clinical-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            {{ range.label }}
          </button>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="bg-gradient-to-br from-clinical-blue-50 to-clinical-blue-100 rounded-2xl p-4 border border-clinical-blue-200">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-clinical-blue-500 text-xl">vital_signs</span>
              <p class="text-xs text-clinical-blue-700 font-medium">Presión Arterial</p>
            </div>
            <p class="text-2xl font-display font-bold text-clinical-blue-600">
              {{ avgSystolic }}/{{ avgDiastolic }}
            </p>
            <p class="text-xs text-clinical-blue-600 mt-1">mmHg promedio</p>
          </div>

          <div class="bg-gradient-to-br from-health-green-50 to-health-green-100 rounded-2xl p-4 border border-health-green-200">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-health-green-500 text-xl">ecg_heart</span>
              <p class="text-xs text-health-green-700 font-medium">Ritmo Cardíaco</p>
            </div>
            <p class="text-2xl font-display font-bold text-health-green-600">{{ avgHeartRate }}</p>
            <p class="text-xs text-health-green-600 mt-1">bpm promedio</p>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-purple-500 text-xl">bedtime</span>
              <p class="text-xs text-purple-700 font-medium">Sueño</p>
            </div>
            <p class="text-2xl font-display font-bold text-purple-600">{{ avgSleep }}</p>
            <p class="text-xs text-purple-600 mt-1">horas promedio</p>
          </div>

          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-orange-500 text-xl">trending_up</span>
              <p class="text-xs text-orange-700 font-medium">Racha</p>
            </div>
            <p class="text-2xl font-display font-bold text-orange-600">15</p>
            <p class="text-xs text-orange-600 mt-1">días activos</p>
          </div>
        </div>

        <!-- Metric Selector -->
        <div class="mb-4">
          <div class="flex gap-2">
            <button
              @click="selectedMetric = 'blood_pressure'"
              :class="[
                'flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all border-2',
                selectedMetric === 'blood_pressure'
                  ? 'bg-clinical-blue-500 text-white border-clinical-blue-500'
                  : 'bg-white text-text-main border-gray-200 hover:border-clinical-blue-300'
              ]"
            >
              <span class="material-symbols-outlined text-lg align-middle">vital_signs</span>
              Presión
            </button>
            <button
              @click="selectedMetric = 'heart_rate'"
              :class="[
                'flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all border-2',
                selectedMetric === 'heart_rate'
                  ? 'bg-health-green-500 text-white border-health-green-500'
                  : 'bg-white text-text-main border-gray-200 hover:border-health-green-300'
              ]"
            >
              <span class="material-symbols-outlined text-lg align-middle">ecg_heart</span>
              Ritmo
            </button>
            <button
              @click="selectedMetric = 'sleep'"
              :class="[
                'flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all border-2',
                selectedMetric === 'sleep'
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white text-text-main border-gray-200 hover:border-purple-300'
              ]"
            >
              <span class="material-symbols-outlined text-lg align-middle">bedtime</span>
              Sueño
            </button>
          </div>
        </div>

        <!-- Chart Area (Placeholder - Chart.js integration) -->
        <div class="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-text-main">
              {{ selectedMetric === 'blood_pressure' ? 'Presión Arterial' : selectedMetric === 'heart_rate' ? 'Ritmo Cardíaco' : 'Horas de Sueño' }}
            </h3>
            <span class="text-xs text-text-muted">{{ selectedRange === '7d' ? 'Últimos 7 días' : selectedRange === '30d' ? 'Últimos 30 días' : 'Últimos 90 días' }}</span>
          </div>

          <!-- Simple SVG Chart Placeholder -->
          <div class="relative h-48 bg-gradient-to-b from-clinical-blue-50 to-transparent rounded-xl border border-clinical-blue-100 flex items-center justify-center">
            <div class="text-center">
              <span class="material-symbols-outlined text-6xl text-clinical-blue-300 mb-2">show_chart</span>
              <p class="text-sm text-text-muted">Gráfica interactiva con Chart.js</p>
              <p class="text-xs text-text-muted mt-1">Requiere instalación de dependencias</p>
              <div class="mt-4 flex gap-2 justify-center">
                <div class="w-3 h-3 rounded-full bg-clinical-blue-500"></div>
                <div class="w-3 h-3 rounded-full bg-health-green-500"></div>
                <div class="w-3 h-3 rounded-full bg-purple-500"></div>
              </div>
            </div>
          </div>

          <!-- Chart Legend -->
          <div class="mt-4 flex gap-4 justify-center text-xs">
            <div v-if="selectedMetric === 'blood_pressure'" class="flex gap-3">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-clinical-blue-500"></div>
                <span class="text-text-muted">Sistólica</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-health-green-500"></div>
                <span class="text-text-muted">Diastólica</span>
              </div>
            </div>
            <div v-else-if="selectedMetric === 'heart_rate'" class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-health-green-500"></div>
              <span class="text-text-muted">BPM</span>
            </div>
            <div v-else class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-purple-500"></div>
              <span class="text-text-muted">Horas</span>
            </div>
          </div>
        </div>

        <!-- Recent Measurements -->
        <div class="bg-white rounded-2xl border-2 border-gray-200 p-5">
          <h3 class="font-semibold text-text-main mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-clinical-blue-500">history</span>
            Mediciones Recientes
          </h3>
          <div class="space-y-3">
            <template v-if="selectedMetric === 'blood_pressure'">
              <div v-for="(item, index) in bloodPressureData.slice(-5).reverse()" :key="`bp-${index}`" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p class="text-sm font-medium text-text-main">{{ item.value.systolic }}/{{ item.value.diastolic }} mmHg</p>
                  <p class="text-xs text-text-muted">{{ new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) }}</p>
                </div>
                <div :class="[
                  'px-3 py-1 rounded-lg text-xs font-semibold',
                  item.value.systolic < 120 ? 'bg-health-green-100 text-health-green-700' : item.value.systolic < 130 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ item.value.systolic < 120 ? 'Normal' : item.value.systolic < 130 ? 'Elevada' : 'Alta' }}
                </div>
              </div>
            </template>

            <template v-else-if="selectedMetric === 'heart_rate'">
              <div v-for="(item, index) in heartRateData.slice(-5).reverse()" :key="`hr-${index}`" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p class="text-sm font-medium text-text-main">{{ item.value }} bpm</p>
                  <p class="text-xs text-text-muted">{{ new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) }}</p>
                </div>
                <div :class="[
                  'px-3 py-1 rounded-lg text-xs font-semibold',
                  item.value >= 60 && item.value <= 80 ? 'bg-health-green-100 text-health-green-700' : 'bg-yellow-100 text-yellow-700'
                ]">
                  {{ item.value >= 60 && item.value <= 80 ? 'Normal' : 'Revisar' }}
                </div>
              </div>
            </template>

            <template v-else>
              <div v-for="(item, index) in sleepData.slice(-5).reverse()" :key="`sleep-${index}`" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p class="text-sm font-medium text-text-main">{{ item.value }} horas</p>
                  <p class="text-xs text-text-muted">{{ new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) }}</p>
                </div>
                <div :class="[
                  'px-3 py-1 rounded-lg text-xs font-semibold',
                  item.value >= 7 && item.value <= 9 ? 'bg-health-green-100 text-health-green-700' : 'bg-yellow-100 text-yellow-700'
                ]">
                  {{ item.value >= 7 && item.value <= 9 ? 'Óptimo' : 'Mejorar' }}
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Info Note -->
        <div class="mt-6 bg-clinical-blue-50 rounded-xl p-4 border border-clinical-blue-100">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-clinical-blue-500 text-xl flex-shrink-0">lightbulb</span>
            <div>
              <p class="text-sm text-clinical-blue-700 font-semibold mb-1">Tip de Salud</p>
              <p class="text-xs text-clinical-blue-600 leading-relaxed">
                Mantén mediciones consistentes a la misma hora cada día para obtener tendencias más precisas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Modal -->
    <div
      v-if="showDownloadModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeDownloadModal"
    >
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-text-main">Descargar Reporte</h2>
            <p class="text-sm text-text-muted mt-1">Exporta tus datos de salud</p>
          </div>
          <button
            @click="closeDownloadModal"
            class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        <!-- Format Selection -->
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-semibold text-text-main mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-clinical-blue-500">insert_drive_file</span>
              Formato de archivo
            </h3>
            <div class="space-y-2">
              <label class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer hover:bg-gray-50"
                :class="downloadFormat === 'pdf' ? 'border-clinical-blue-500 bg-clinical-blue-50' : 'border-gray-200'"
              >
                <input
                  type="radio"
                  v-model="downloadFormat"
                  value="pdf"
                  class="w-4 h-4 text-clinical-blue-500"
                />
                <div class="flex-1">
                  <p class="font-semibold text-text-main text-sm">PDF</p>
                  <p class="text-xs text-text-muted">Reporte visual con gráficas</p>
                </div>
                <span class="material-symbols-outlined text-red-500">picture_as_pdf</span>
              </label>

              <label class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer hover:bg-gray-50"
                :class="downloadFormat === 'csv' ? 'border-clinical-blue-500 bg-clinical-blue-50' : 'border-gray-200'"
              >
                <input
                  type="radio"
                  v-model="downloadFormat"
                  value="csv"
                  class="w-4 h-4 text-clinical-blue-500"
                />
                <div class="flex-1">
                  <p class="font-semibold text-text-main text-sm">CSV</p>
                  <p class="text-xs text-text-muted">Datos tabulares para Excel</p>
                </div>
                <span class="material-symbols-outlined text-health-green-500">table_chart</span>
              </label>

              <label class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer hover:bg-gray-50"
                :class="downloadFormat === 'json' ? 'border-clinical-blue-500 bg-clinical-blue-50' : 'border-gray-200'"
              >
                <input
                  type="radio"
                  v-model="downloadFormat"
                  value="json"
                  class="w-4 h-4 text-clinical-blue-500"
                />
                <div class="flex-1">
                  <p class="font-semibold text-text-main text-sm">JSON</p>
                  <p class="text-xs text-text-muted">Datos estructurados para desarrolladores</p>
                </div>
                <span class="material-symbols-outlined text-purple-500">code</span>
              </label>
            </div>
          </div>

          <!-- Content Options -->
          <div>
            <h3 class="text-sm font-semibold text-text-main mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-clinical-blue-500">checklist</span>
              Contenido a incluir
            </h3>
            <div class="space-y-2">
              <label class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  v-model="includeCharts"
                  class="w-4 h-4 text-clinical-blue-500 rounded"
                />
                <div class="flex-1">
                  <p class="font-medium text-text-main text-sm">Gráficas y visualizaciones</p>
                  <p class="text-xs text-text-muted">Solo disponible en formato PDF</p>
                </div>
              </label>

              <label class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  v-model="includeRawData"
                  class="w-4 h-4 text-clinical-blue-500 rounded"
                />
                <div class="flex-1">
                  <p class="font-medium text-text-main text-sm">Datos detallados</p>
                  <p class="text-xs text-text-muted">Todas las mediciones del período</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Period Info -->
          <div class="bg-clinical-blue-50 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-clinical-blue-500 text-lg">calendar_month</span>
              <div>
                <p class="text-xs text-clinical-blue-700 font-semibold mb-1">Período seleccionado</p>
                <p class="text-sm text-clinical-blue-600">
                  Últimos <span class="font-bold">{{ selectedRange === '7d' ? '7 días' : selectedRange === '30d' ? '30 días' : '90 días' }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mt-6">
          <button
            @click="closeDownloadModal"
            class="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-text-main hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleDownload"
            class="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-clinical-blue-500 text-white hover:bg-clinical-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-lg">download</span>
            Descargar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(31, 79, 216, 0.08);
}
</style>
