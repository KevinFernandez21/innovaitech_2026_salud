<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { mockPatients, mockNotifications } from '../../api/mockData'

const router = useRouter()
const { currentUser, logout } = useAuth()

// Filter patients by risk
const highRiskPatients = computed(() => mockPatients.filter(p => p.risk_level === 'high'))
const mediumRiskPatients = computed(() => mockPatients.filter(p => p.risk_level === 'medium'))
const lowRiskPatients = computed(() => mockPatients.filter(p => p.risk_level === 'low'))

// Critical alerts
const criticalAlerts = computed(() =>
  mockNotifications.filter(n => n.severity === 'high' && !n.read).length
)

// Get today's appointments count (mock)
const todayAppointments = 12
const pendingReviews = 5

const handlePatientClick = (patientId: number) => {
  router.push(`/clinical/patient/${patientId}`)
}

const handleLogout = () => {
  logout()
  router.push('/')
}

const searchQuery = ref('')

// Add New Patient Modal
const showAddPatientModal = ref(false)
const newPatient = ref({
  name: '',
  age: '',
  phone: '',
  condition: ''
})

const openAddPatientModal = () => {
  showAddPatientModal.value = true
  newPatient.value = {
    name: '',
    age: '',
    phone: '',
    condition: ''
  }
}

const closeAddPatientModal = () => {
  showAddPatientModal.value = false
}

const addNewPatient = () => {
  if (!newPatient.value.name || !newPatient.value.age || !newPatient.value.phone) {
    alert('Por favor completa todos los campos obligatorios')
    return
  }

  // In a real app, this would make an API call
  alert(`Nuevo paciente agregado:\n${newPatient.value.name}, ${newPatient.value.age} años`)
  closeAddPatientModal()
}

// Filter Modal
const showFilterModal = ref(false)
const activeFilters = ref({
  riskLevel: [] as string[],
  conditions: [] as string[],
  status: [] as string[]
})

const openFilterModal = () => {
  showFilterModal.value = true
}

const closeFilterModal = () => {
  showFilterModal.value = false
}

const toggleFilter = (category: 'riskLevel' | 'conditions' | 'status', value: string) => {
  const index = activeFilters.value[category].indexOf(value)
  if (index > -1) {
    activeFilters.value[category].splice(index, 1)
  } else {
    activeFilters.value[category].push(value)
  }
}

const clearAllFilters = () => {
  activeFilters.value = {
    riskLevel: [],
    conditions: [],
    status: []
  }
}

const activeFiltersCount = computed(() => {
  return activeFilters.value.riskLevel.length +
         activeFilters.value.conditions.length +
         activeFilters.value.status.length
})

const filteredPatients = computed(() => {
  let filtered = mockPatients

  // Filter by risk level
  if (activeFilters.value.riskLevel.length > 0) {
    filtered = filtered.filter(p => activeFilters.value.riskLevel.includes(p.risk_level))
  }

  // Filter by conditions
  if (activeFilters.value.conditions.length > 0) {
    filtered = filtered.filter(p => {
      return activeFilters.value.conditions.some(condition =>
        p.condition.toLowerCase().includes(condition.toLowerCase())
      )
    })
  }

  // Filter by status (based on alerts)
  if (activeFilters.value.status.length > 0) {
    filtered = filtered.filter(p => {
      if (activeFilters.value.status.includes('active') && p.alerts_count === 0) return true
      if (activeFilters.value.status.includes('attention') && p.alerts_count > 0) return true
      return false
    })
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.condition.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Update risk level computeds to use filtered patients
const highRiskPatientsFiltered = computed(() => filteredPatients.value.filter(p => p.risk_level === 'high'))
const mediumRiskPatientsFiltered = computed(() => filteredPatients.value.filter(p => p.risk_level === 'medium'))
const lowRiskPatientsFiltered = computed(() => filteredPatients.value.filter(p => p.risk_level === 'low'))

// Call patient via WhatsApp
const callPatient = (patient: typeof mockPatients[0]) => {
  if (!patient.emergency_phones || patient.emergency_phones.length === 0) {
    alert('Este paciente no tiene número de contacto registrado.')
    return
  }

  const phoneNumber = patient.emergency_phones[0].replace(/\+/g, '')
  const message = `Hola ${patient.name}, soy del equipo médico. Te contacto porque hemos detectado una alerta en tus signos vitales. ¿Cómo te encuentras?`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-white text-text-main pb-24 selection:bg-clinical-blue-100 selection:text-clinical-blue-600">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div class="flex items-center justify-between px-6 py-4 max-w-md mx-auto">
        <div class="flex items-center gap-4">
          <div class="relative group cursor-pointer">
            <img :src="currentUser?.avatar" :alt="currentUser?.username" class="w-12 h-12 rounded-2xl shadow-sm ring-2 ring-white transition-transform group-hover:scale-105 object-cover">
            <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-health-green-500 border-[3px] border-white rounded-full"></div>
          </div>
          <div>
            <h1 class="text-sm text-text-muted font-semibold">Bienvenido de nuevo,</h1>
            <h2 class="text-lg font-bold text-text-main tracking-tight">{{ currentUser?.username }}</h2>
          </div>
        </div>
        <button @click="handleLogout" class="relative p-2.5 rounded-xl bg-gray-50 text-text-body hover:bg-gray-100 transition-colors">
          <span class="material-symbols-outlined filled text-[24px]">logout</span>
        </button>
      </div>
    </header>

    <main class="flex flex-col gap-8 px-6 py-6 max-w-md mx-auto">
      <!-- Search Bar -->
      <div class="relative group z-10">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span class="material-symbols-outlined text-clinical-blue-500/60">search</span>
        </div>
        <input
          v-model="searchQuery"
          class="block w-full pl-12 pr-12 py-4 border-none rounded-3xl bg-white text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-clinical-blue-500/20 shadow-card transition-shadow"
          placeholder="Buscar paciente..."
          type="text"
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button @click="openFilterModal" class="relative p-2 text-text-muted hover:text-clinical-blue-500 hover:bg-clinical-blue-50/30 rounded-full transition-colors">
            <span class="material-symbols-outlined text-[20px]">tune</span>
            <span v-if="activeFiltersCount > 0" class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-clinical-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {{ activeFiltersCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Priority Attention Section -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-text-main text-xl font-bold tracking-tight">Atención Prioritaria</h3>
          <span class="bg-red-50 text-red-500 text-xs font-bold px-3 py-1.5 rounded-full ring-1 ring-red-500/10">
            {{ criticalAlerts }} Alertas
          </span>
        </div>

        <div class="flex flex-col gap-4">
          <!-- High Priority Alert Card -->
          <div
            v-for="patient in highRiskPatientsFiltered.slice(0, 2)"
            :key="patient.id"
            class="relative bg-white rounded-3xl p-5 shadow-soft border border-red-100 overflow-hidden group cursor-pointer"
            @click="handlePatientClick(patient.id)"
          >
            <div class="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 z-0 opacity-50"></div>

            <div class="relative z-10">
              <div class="flex justify-between items-start mb-4">
                <div class="flex gap-4">
                  <img :src="patient.avatar" :alt="patient.name" class="w-14 h-14 rounded-2xl shadow-sm object-cover">
                  <div>
                    <h4 class="font-bold text-text-main text-lg">{{ patient.name }}</h4>
                    <div class="flex items-center gap-1.5 mt-1">
                      <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <p class="text-red-500 font-bold text-sm">{{ patient.alerts_count }} alertas activas</p>
                    </div>
                  </div>
                </div>
                <button @click="callPatient(patient)" class="w-10 h-10 rounded-full bg-clinical-blue-500 text-white shadow-lg shadow-clinical-blue-500/30 flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
                  <span class="material-symbols-outlined text-[20px]">call</span>
                </button>
              </div>

              <!-- Mock ECG or metric display -->
              <div class="h-16 w-full bg-gradient-to-r from-red-50/50 via-white to-red-50/50 rounded-2xl relative overflow-hidden flex items-center justify-center border border-red-100/50">
                <div class="flex items-center gap-2 relative z-10 px-4 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-red-100 shadow-sm">
                  <span class="material-symbols-outlined text-red-500 text-sm">ecg_heart</span>
                  <span class="text-xs font-semibold text-red-500">Anomalía hace {{ Math.floor((new Date().getTime() - new Date(patient.last_measurement).getTime()) / 60000) }}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Patients Section -->
      <section class="flex flex-col gap-5">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-text-main text-xl font-bold tracking-tight">Pacientes</h3>
          <button @click="router.push('/clinical/patients')" class="text-clinical-blue-500 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all bg-clinical-blue-50/30 px-3 py-1.5 rounded-full">
            Ver todos <span class="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </div>

        <div class="grid gap-4">
          <!-- Patient Cards -->
          <div
            v-for="patient in filteredPatients.slice(0, 4)"
            :key="patient.id"
            @click="handlePatientClick(patient.id)"
            class="bg-white rounded-3xl p-4 shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <img :src="patient.avatar" :alt="patient.name" class="w-14 h-14 rounded-2xl shadow-sm object-cover">
                  <div :class="[
                    'absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-white rounded-full',
                    patient.risk_level === 'high' ? 'bg-red-500' :
                    patient.risk_level === 'medium' ? 'bg-yellow-500' :
                    'bg-health-green-500'
                  ]"></div>
                </div>
                <div>
                  <h4 class="text-text-main font-bold text-lg">{{ patient.name }}</h4>
                  <div class="flex items-center gap-3 mt-1 text-sm text-text-muted font-medium">
                    <span class="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                      <span class="material-symbols-outlined text-[14px] text-clinical-blue-500">favorite</span>
                      {{ patient.streak_days }}d
                    </span>
                    <span :class="[
                      'px-2 py-0.5 rounded-md font-semibold',
                      patient.risk_level === 'high' ? 'bg-red-50 text-red-600' :
                      patient.risk_level === 'medium' ? 'bg-orange-50 text-yellow-600' :
                      'bg-gray-50 text-text-body'
                    ]">
                      {{ patient.conditions[0] }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 p-2 rounded-full text-text-muted">
                <span class="material-symbols-outlined">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-3xl p-5 shadow-card flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-soft transition-shadow">
          <div class="absolute right-0 top-0 p-4 opacity-[0.03] transform group-hover:scale-125 transition-transform duration-500">
            <span class="material-symbols-outlined text-8xl text-clinical-blue-500">calendar_month</span>
          </div>
          <div class="bg-clinical-blue-50/40 w-10 h-10 flex items-center justify-center rounded-xl text-clinical-blue-500">
            <span class="material-symbols-outlined">calendar_month</span>
          </div>
          <div>
            <span class="block text-3xl font-bold text-text-main">{{ todayAppointments }}</span>
            <p class="text-sm text-text-muted font-medium">Citas Hoy</p>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-5 shadow-card flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-soft transition-shadow">
          <div class="absolute right-0 top-0 p-4 opacity-[0.03] transform group-hover:scale-125 transition-transform duration-500">
            <span class="material-symbols-outlined text-8xl text-yellow-500">pending_actions</span>
          </div>
          <div class="bg-orange-50 w-10 h-10 flex items-center justify-center rounded-xl text-yellow-600">
            <span class="material-symbols-outlined">pending_actions</span>
          </div>
          <div>
            <span class="block text-3xl font-bold text-text-main">{{ pendingReviews }}</span>
            <p class="text-sm text-text-muted font-medium">Por Revisar</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Floating Action Button -->
    <div class="fixed bottom-28 right-6 z-50">
      <button @click="openAddPatientModal" class="flex items-center justify-center w-16 h-16 rounded-2xl bg-clinical-blue-500 text-white shadow-lg shadow-clinical-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 group hover:rotate-3">
        <span class="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>

    <!-- Add New Patient Modal -->
    <div
      v-if="showAddPatientModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeAddPatientModal"
    >
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-text-main">Agregar Nuevo Paciente</h2>
          <button
            @click="closeAddPatientModal"
            class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold text-text-main mb-2">
              Nombre Completo <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newPatient.name"
              type="text"
              placeholder="Ej: Juan Pérez"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <!-- Age -->
          <div>
            <label class="block text-sm font-semibold text-text-main mb-2">
              Edad <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newPatient.age"
              type="number"
              min="0"
              max="150"
              placeholder="Ej: 45"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-semibold text-text-main mb-2">
              Teléfono <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newPatient.phone"
              type="tel"
              placeholder="Ej: +593 99 123 4567"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <!-- Condition -->
          <div>
            <label class="block text-sm font-semibold text-text-main mb-2">
              Condición Principal (Opcional)
            </label>
            <input
              v-model="newPatient.condition"
              type="text"
              placeholder="Ej: Hipertensión"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <!-- Info Note -->
          <div class="bg-clinical-blue-50 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-clinical-blue-500 text-lg">info</span>
              <p class="text-xs text-clinical-blue-700">
                El paciente recibirá un enlace de invitación para completar su perfil y conectar su dispositivo de monitoreo.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mt-6">
          <button
            @click="closeAddPatientModal"
            class="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-text-main hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="addNewPatient"
            class="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-clinical-blue-500 text-white hover:bg-clinical-blue-600 transition-all active:scale-95"
          >
            Agregar Paciente
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Modal -->
    <div
      v-if="showFilterModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeFilterModal"
    >
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-text-main">Filtrar Pacientes</h2>
            <p class="text-sm text-text-muted mt-1">{{ activeFiltersCount }} filtro(s) activo(s)</p>
          </div>
          <button
            @click="closeFilterModal"
            class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        <!-- Filter Sections -->
        <div class="space-y-6">
          <!-- Risk Level Filter -->
          <div>
            <h3 class="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-red-500 text-lg">emergency</span>
              Nivel de Riesgo
            </h3>
            <div class="flex flex-wrap gap-2">
              <button
                @click="toggleFilter('riskLevel', 'high')"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeFilters.riskLevel.includes('high')
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                ]"
              >
                Alto Riesgo
              </button>
              <button
                @click="toggleFilter('riskLevel', 'medium')"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeFilters.riskLevel.includes('medium')
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                ]"
              >
                Riesgo Medio
              </button>
              <button
                @click="toggleFilter('riskLevel', 'low')"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeFilters.riskLevel.includes('low')
                    ? 'bg-health-green-500 text-white shadow-md'
                    : 'bg-health-green-50 text-health-green-600 hover:bg-health-green-100'
                ]"
              >
                Bajo Riesgo
              </button>
            </div>
          </div>

          <!-- Conditions Filter -->
          <div>
            <h3 class="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-clinical-blue-500 text-lg">medical_information</span>
              Condiciones
            </h3>
            <div class="flex flex-wrap gap-2">
              <button
                @click="toggleFilter('conditions', 'hipertension')"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeFilters.conditions.includes('hipertension')
                    ? 'bg-clinical-blue-500 text-white shadow-md'
                    : 'bg-clinical-blue-50 text-clinical-blue-600 hover:bg-clinical-blue-100'
                ]"
              >
                Hipertensión
              </button>
              <button
                @click="toggleFilter('conditions', 'diabetes')"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeFilters.conditions.includes('diabetes')
                    ? 'bg-clinical-blue-500 text-white shadow-md'
                    : 'bg-clinical-blue-50 text-clinical-blue-600 hover:bg-clinical-blue-100'
                ]"
              >
                Diabetes
              </button>
              <button
                @click="toggleFilter('conditions', 'arritmia')"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeFilters.conditions.includes('arritmia')
                    ? 'bg-clinical-blue-500 text-white shadow-md'
                    : 'bg-clinical-blue-50 text-clinical-blue-600 hover:bg-clinical-blue-100'
                ]"
              >
                Arritmia
              </button>
              <button
                @click="toggleFilter('conditions', 'cardiaca')"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeFilters.conditions.includes('cardiaca')
                    ? 'bg-clinical-blue-500 text-white shadow-md'
                    : 'bg-clinical-blue-50 text-clinical-blue-600 hover:bg-clinical-blue-100'
                ]"
              >
                Insuficiencia Cardíaca
              </button>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <h3 class="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-500 text-lg">notifications</span>
              Estado
            </h3>
            <div class="flex flex-wrap gap-2">
              <button
                @click="toggleFilter('status', 'active')"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeFilters.status.includes('active')
                    ? 'bg-health-green-500 text-white shadow-md'
                    : 'bg-health-green-50 text-health-green-600 hover:bg-health-green-100'
                ]"
              >
                Sin Alertas
              </button>
              <button
                @click="toggleFilter('status', 'attention')"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeFilters.status.includes('attention')
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                ]"
              >
                Requiere Atención
              </button>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="mt-6 p-4 bg-clinical-blue-50 rounded-xl">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-clinical-blue-500">info</span>
            <p class="text-sm text-clinical-blue-700">
              <span class="font-bold">{{ filteredPatients.length }}</span> paciente(s) coinciden con los filtros seleccionados
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mt-6">
          <button
            @click="clearAllFilters"
            class="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-text-main hover:bg-gray-200 transition-colors"
          >
            Limpiar Filtros
          </button>
          <button
            @click="closeFilterModal"
            class="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-clinical-blue-500 text-white hover:bg-clinical-blue-600 transition-all active:scale-95"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-6 left-6 right-6 z-50">
      <div class="bg-white/90 backdrop-blur-xl rounded-full shadow-floating border border-white/20 h-20 flex justify-between items-center px-2 max-w-md mx-auto">
        <button class="flex flex-col items-center justify-center w-full h-full text-clinical-blue-500 gap-1 relative">
          <div class="absolute top-3 bg-clinical-blue-500/10 w-12 h-8 rounded-full"></div>
          <span class="material-symbols-outlined filled text-2xl relative z-10">grid_view</span>
        </button>
        <button @click="router.push('/clinical/patients')" class="flex flex-col items-center justify-center w-full h-full text-text-muted hover:text-clinical-blue-500 transition-colors gap-1 group">
          <span class="material-symbols-outlined text-2xl group-hover:-translate-y-0.5 transition-transform">groups</span>
        </button>
        <button @click="router.push('/clinical/alerts')" class="flex flex-col items-center justify-center w-full h-full text-text-muted hover:text-clinical-blue-500 transition-colors gap-1 group relative">
          <span class="material-symbols-outlined text-2xl group-hover:-translate-y-0.5 transition-transform">notifications</span>
          <span v-if="criticalAlerts > 0" class="absolute top-2 right-6 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        <button @click="handleLogout" class="flex flex-col items-center justify-center w-full h-full text-text-muted hover:text-clinical-blue-500 transition-colors gap-1 group">
          <span class="material-symbols-outlined text-2xl group-hover:-translate-y-0.5 transition-transform">logout</span>
        </button>
      </div>
    </nav>

    <!-- Bottom Gradient -->
    <div class="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-40"></div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.shadow-card {
  box-shadow: 0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04);
}

.shadow-floating {
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
