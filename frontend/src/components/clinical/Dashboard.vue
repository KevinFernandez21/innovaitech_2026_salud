<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { mockPatients, mockNotifications } from '../../api/mockData'

const emit = defineEmits<{
  navigate: [screen: string]
}>()

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
  emit('navigate', `patient-detail-${patientId}`)
}

const handleLogout = () => {
  logout()
}

const searchQuery = ref('')
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
          <button class="p-2 text-text-muted hover:text-clinical-blue-500 hover:bg-clinical-blue-50/30 rounded-full transition-colors">
            <span class="material-symbols-outlined text-[20px]">tune</span>
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
            v-for="patient in highRiskPatients.slice(0, 2)"
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
                <button class="w-10 h-10 rounded-full bg-clinical-blue-500 text-white shadow-lg shadow-clinical-blue-500/30 flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
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
          <button @click="emit('navigate', 'patients')" class="text-clinical-blue-500 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all bg-clinical-blue-50/30 px-3 py-1.5 rounded-full">
            Ver todos <span class="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </div>

        <div class="grid gap-4">
          <!-- Patient Cards -->
          <div
            v-for="patient in mockPatients.slice(0, 4)"
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
      <button class="flex items-center justify-center w-16 h-16 rounded-2xl bg-clinical-blue-500 text-white shadow-lg shadow-clinical-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 group hover:rotate-3">
        <span class="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-6 left-6 right-6 z-50">
      <div class="bg-white/90 backdrop-blur-xl rounded-full shadow-floating border border-white/20 h-20 flex justify-between items-center px-2 max-w-md mx-auto">
        <button class="flex flex-col items-center justify-center w-full h-full text-clinical-blue-500 gap-1 relative">
          <div class="absolute top-3 bg-clinical-blue-500/10 w-12 h-8 rounded-full"></div>
          <span class="material-symbols-outlined filled text-2xl relative z-10">grid_view</span>
        </button>
        <button @click="emit('navigate', 'patients')" class="flex flex-col items-center justify-center w-full h-full text-text-muted hover:text-clinical-blue-500 transition-colors gap-1 group">
          <span class="material-symbols-outlined text-2xl group-hover:-translate-y-0.5 transition-transform">groups</span>
        </button>
        <button @click="emit('navigate', 'alerts')" class="flex flex-col items-center justify-center w-full h-full text-text-muted hover:text-clinical-blue-500 transition-colors gap-1 group relative">
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
