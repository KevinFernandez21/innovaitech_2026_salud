<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { mockPatients, mockNotifications } from '../../api/mockData'
import { sendEmergencyAlert, type WhatsAppPayload } from '../../api/whatsappService'

const emit = defineEmits<{
  navigate: [screen: string]
}>()

const { currentUser, logout } = useAuth()

// Patient being monitored (Sarah Johnson)
const patient = mockPatients[0]

// Family notifications
const familyNotifications = mockNotifications.filter(n => n.patient_id === 1 && !n.read)

// Emergency alert state
const isEmergencyLoading = ref(false)
const emergencySuccess = ref(false)
const emergencyError = ref(false)

const getHealthStatus = () => {
  if (patient.alerts_count > 0) return {
    color: 'red',
    label: 'Requiere Atención',
    icon: 'sentiment_very_dissatisfied',
    message: 'El paciente requiere atención inmediata. Por favor revisa las alertas.'
  }
  if (patient.streak_days >= 7) return {
    color: 'green',
    label: 'Todo Bien',
    icon: 'sentiment_satisfied',
    message: 'El paciente está descansando cómodamente. Los signos vitales están estables hoy.'
  }
  return {
    color: 'yellow',
    label: 'Normal',
    icon: 'sentiment_neutral',
    message: 'El paciente está bien. Monitorea los signos vitales regularmente.'
  }
}

const status = getHealthStatus()

// Handle emergency SOS
const handleEmergencySOS = async () => {
  if (isEmergencyLoading.value) return

  isEmergencyLoading.value = true
  emergencySuccess.value = false
  emergencyError.value = false

  try {
    const payload: WhatsAppPayload = {
      patient_id: patient.id,
      message: `🚨 ALERTA DE EMERGENCIA - ${patient.name}\n\nSe ha activado el botón SOS. El paciente puede necesitar asistencia inmediata.\n\nDatos del paciente:\n- Edad: ${patient.age} años\n- Condiciones: ${patient.conditions.join(', ')}\n- Última medición: ${new Date(patient.last_measurement).toLocaleString('es-ES')}\n\nPor favor, contacte al paciente lo antes posible.`,
      urgency_level: 'CRITICAL',
      phone_numbers: patient.emergency_phones || []
    }

    const response = await sendEmergencyAlert(payload)
    console.log('✅ Alerta enviada exitosamente:', response)

    emergencySuccess.value = true

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      emergencySuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('❌ Error enviando alerta:', error)
    emergencyError.value = true

    // Auto-hide error message after 5 seconds
    setTimeout(() => {
      emergencyError.value = false
    }, 5000)
  } finally {
    isEmergencyLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white text-text-main font-display antialiased selection:bg-clinical-blue-500 selection:text-white flex flex-col pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="px-6 py-4 flex items-center justify-between max-w-md mx-auto">
        <div class="flex flex-col">
          <span class="text-xs font-semibold text-clinical-blue-500 uppercase tracking-wider">Vista Familiar</span>
          <h1 class="text-xl font-bold leading-tight text-clinical-blue-500">Bienestar del Paciente</h1>
        </div>
        <div class="relative group cursor-pointer">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-clinical-blue-500 to-health-green-500 rounded-full opacity-30 group-hover:opacity-60 transition duration-200 blur-[2px]"></div>
          <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img :src="patient.avatar" :alt="patient.name" class="w-full h-full object-cover">
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-health-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      <!-- Main Status Card -->
      <section class="relative overflow-hidden rounded-3xl bg-white p-6 shadow-soft hover:shadow-soft-hover transition-shadow duration-300 border border-gray-100">
        <div class="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-clinical-blue-50 rounded-full blur-3xl pointer-events-none opacity-60"></div>
        <div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-health-green-500/10 rounded-full blur-2xl pointer-events-none opacity-40"></div>

        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col gap-2">
              <div :class="[
                'inline-flex items-center gap-2 px-3 py-1 rounded-full w-fit',
                status.color === 'green' ? 'bg-health-green-500/10' :
                status.color === 'yellow' ? 'bg-yellow-500/10' :
                'bg-red-500/10'
              ]">
                <span class="relative flex h-2.5 w-2.5">
                  <span :class="[
                    'animate-[ping_2s_ease-in-out_infinite] absolute inline-flex h-full w-full rounded-full opacity-75',
                    status.color === 'green' ? 'bg-health-green-500' :
                    status.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  ]"></span>
                  <span :class="[
                    'relative inline-flex rounded-full h-2.5 w-2.5',
                    status.color === 'green' ? 'bg-health-green-500' :
                    status.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  ]"></span>
                </span>
                <span :class="[
                  'font-bold text-xs tracking-wide uppercase',
                  status.color === 'green' ? 'text-health-green-500' :
                  status.color === 'yellow' ? 'text-yellow-600' :
                  'text-red-500'
                ]">{{ status.label }}</span>
              </div>
              <h2 class="text-3xl font-bold text-text-main mt-1">{{ patient.name.split(' ')[0] }} está bien</h2>
            </div>
            <div :class="[
              'p-3 rounded-full shadow-inner',
              status.color === 'green' ? 'bg-health-green-500/10 text-health-green-500' :
              status.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-600' :
              'bg-red-500/10 text-red-500'
            ]">
              <span class="material-symbols-outlined text-[32px] filled">{{ status.icon }}</span>
            </div>
          </div>

          <p class="text-text-main/80 text-lg leading-relaxed font-medium pr-4">
            {{ status.message }}
          </p>

          <div class="mt-6 flex items-center gap-2 text-sm text-text-muted">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            <span>Actualizado hace 5 mins</span>
          </div>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-3xl p-5 shadow-soft border border-gray-100 flex flex-col justify-between h-36 relative overflow-hidden">
          <div class="absolute right-0 top-0 p-4 opacity-10">
            <span class="material-symbols-outlined text-6xl text-clinical-blue-500">verified</span>
          </div>
          <div>
            <h3 class="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Adherencia</h3>
            <span class="text-4xl font-extrabold text-clinical-blue-500">{{ patient.streak_days }}</span>
            <span class="text-sm font-semibold text-text-main block">Días seguidos</span>
          </div>
          <div class="mt-2 text-xs text-text-muted">Protocolo cumplido</div>
        </div>

        <button @click="emit('navigate', 'messages')" class="bg-gradient-to-br from-clinical-blue-50 to-white rounded-3xl p-5 shadow-soft border border-clinical-blue-100 flex flex-col items-center justify-center gap-3 h-36 text-center group active:scale-95 transition-all">
          <div class="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
            <span class="material-symbols-outlined text-3xl text-clinical-blue-500 filled">diversity_1</span>
          </div>
          <div>
            <span class="block font-bold text-clinical-blue-500 text-sm">Enviar Saludos</span>
            <span class="text-xs text-clinical-blue-500/70">Notificar paciente</span>
          </div>
        </button>
      </section>

      <!-- Blood Pressure Chart -->
      <section class="grid grid-cols-1 gap-4">
        <div class="rounded-3xl bg-white p-6 shadow-soft border border-gray-100 flex flex-col gap-4">
          <div class="flex justify-between items-end">
            <div>
              <p class="text-clinical-blue-500 text-sm font-semibold mb-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-base">favorite</span>
                Presión Arterial
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-bold text-text-main tracking-tight">120/80</span>
                <span class="text-lg text-text-muted font-medium">mmHg</span>
              </div>
            </div>
            <div class="bg-clinical-blue-50 px-3 py-1 rounded-full">
              <span class="text-xs font-bold text-clinical-blue-500 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">trending_flat</span>
                Estable
              </span>
            </div>
          </div>

          <div class="h-24 w-full relative mt-2">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#2FBF9B" stop-opacity="0.2"></stop>
                  <stop offset="100%" stop-color="#2FBF9B" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,60 C20,60 40,40 60,45 C80,50 100,30 120,35 C140,40 160,55 180,50 C200,45 220,20 240,25 C260,30 280,45 300,40" fill="none" stroke="#2FBF9B" stroke-linecap="round" stroke-width="3" vector-effect="non-scaling-stroke"></path>
              <path d="M0,60 C20,60 40,40 60,45 C80,50 100,30 120,35 C140,40 160,55 180,50 C200,45 220,20 240,25 C260,30 280,45 300,40 V100 H0 Z" fill="url(#chartGradient)" stroke="none"></path>
            </svg>
            <div class="flex justify-between text-[10px] text-text-muted font-bold uppercase mt-2 tracking-wider">
              <span>L</span>
              <span>M</span>
              <span>M</span>
              <span>J</span>
              <span>V</span>
              <span>S</span>
              <span>D</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Connect Section -->
      <section>
        <h3 class="text-sm font-bold text-clinical-blue-500 uppercase tracking-widest mb-3 ml-1">Conectar</h3>
        <div class="grid grid-cols-2 gap-3">
          <button class="flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-soft transition-all active:scale-95 group">
            <div class="bg-clinical-blue-50 text-clinical-blue-500 p-2.5 rounded-xl group-hover:bg-clinical-blue-500 group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-2xl">call</span>
            </div>
            <div class="flex flex-col items-start">
              <span class="font-bold text-clinical-blue-500 text-sm">Llamar</span>
              <span class="text-[10px] text-text-muted">Llamada de voz</span>
            </div>
          </button>

          <button @click="emit('navigate', 'messages')" class="flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-soft transition-all active:scale-95 group">
            <div class="bg-clinical-blue-50 text-clinical-blue-500 p-2.5 rounded-xl group-hover:bg-clinical-blue-500 group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-2xl">forum</span>
            </div>
            <div class="flex flex-col items-start">
              <span class="font-bold text-clinical-blue-500 text-sm">Chat Familiar</span>
              <span class="text-[10px] text-clinical-blue-500/70 font-medium">{{ familyNotifications.length }} nuevos</span>
            </div>
          </button>

          <button
            @click="handleEmergencySOS"
            :disabled="isEmergencyLoading"
            class="col-span-2 flex items-center justify-between p-4 rounded-2xl bg-white border-2 transition-all active:scale-95 group overflow-hidden relative"
            :class="[
              emergencySuccess ? 'border-health-green-500/50 bg-health-green-50' :
              emergencyError ? 'border-yellow-500/50 bg-yellow-50' :
              'border-red-500/20 hover:shadow-md'
            ]"
          >
            <div
              class="absolute inset-0 transition-colors"
              :class="[
                emergencySuccess ? 'bg-health-green-500/10' :
                emergencyError ? 'bg-yellow-500/10' :
                'bg-red-500/5 group-hover:bg-red-500/10'
              ]"
            ></div>
            <div class="flex items-center gap-4 relative z-10">
              <div
                class="p-2.5 rounded-xl transition-all"
                :class="[
                  isEmergencyLoading ? 'bg-clinical-blue-500/10 text-clinical-blue-500 animate-pulse' :
                  emergencySuccess ? 'bg-health-green-500/10 text-health-green-500' :
                  emergencyError ? 'bg-yellow-500/10 text-yellow-600' :
                  'bg-red-500/10 text-red-500'
                ]"
              >
                <span v-if="!isEmergencyLoading && !emergencySuccess && !emergencyError" class="material-symbols-outlined text-2xl filled">local_police</span>
                <span v-else-if="isEmergencyLoading" class="material-symbols-outlined text-2xl">sync</span>
                <span v-else-if="emergencySuccess" class="material-symbols-outlined text-2xl filled">check_circle</span>
                <span v-else class="material-symbols-outlined text-2xl">error</span>
              </div>
              <div class="text-left">
                <span class="block font-bold text-text-main text-lg">
                  {{ isEmergencyLoading ? 'Enviando...' :
                     emergencySuccess ? '¡Alerta Enviada!' :
                     emergencyError ? 'Error al enviar' :
                     'Emergencia SOS' }}
                </span>
                <span class="block text-text-muted text-xs font-medium">
                  {{ isEmergencyLoading ? 'Por favor espera...' :
                     emergencySuccess ? `Enviado a ${patient.emergency_phones?.length || 0} contactos` :
                     emergencyError ? 'Intenta nuevamente' :
                     'Alertar servicios inmediatamente' }}
                </span>
              </div>
            </div>
            <span
              class="material-symbols-outlined relative z-10 transition-transform"
              :class="[
                emergencySuccess ? 'text-health-green-500/50' :
                emergencyError ? 'text-yellow-500/50' :
                'text-red-500/50 group-hover:translate-x-1'
              ]"
            >
              {{ emergencySuccess ? 'done' : 'arrow_forward_ios' }}
            </span>
          </button>
        </div>
      </section>

      <!-- Clinical Activity -->
      <section class="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <h3 class="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-clinical-blue-500">history</span>
          Actividad Clínica
        </h3>

        <div class="relative">
          <div class="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-100"></div>

          <div class="flex flex-col gap-8">
            <div class="relative pl-12 group">
              <div class="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-clinical-blue-500 z-10 flex items-center justify-center shadow-sm">
                <span class="material-symbols-outlined text-clinical-blue-500 text-sm">medication</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <h4 class="text-text-main font-bold text-base leading-tight">Toma de Medicación</h4>
                <p class="text-text-muted text-sm">Lisinopril (10mg) confirmado</p>
                <span class="text-xs text-clinical-blue-500 font-medium mt-1 bg-clinical-blue-50 px-2 py-0.5 rounded-md w-fit">09:00 AM</span>
              </div>
            </div>

            <div class="relative pl-12 group">
              <div class="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-health-green-500 z-10 flex items-center justify-center shadow-sm">
                <span class="material-symbols-outlined text-health-green-500 text-sm">directions_walk</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <h4 class="text-text-main font-bold text-base leading-tight">Actividad Física</h4>
                <p class="text-text-muted text-sm">2,450 pasos registrados</p>
                <span class="text-xs text-text-muted font-medium mt-1">08:30 AM</span>
              </div>
            </div>

            <div class="relative pl-12 group">
              <div class="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-purple-600 z-10 flex items-center justify-center shadow-sm">
                <span class="material-symbols-outlined text-purple-600 text-sm">bedtime</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <h4 class="text-text-main font-bold text-base leading-tight">Monitoreo de Sueño</h4>
                <p class="text-text-muted text-sm">7h 20m de duración</p>
                <span class="text-xs text-text-muted font-medium mt-1">07:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        <button class="w-full mt-6 py-3 text-sm font-semibold text-clinical-blue-500 hover:text-clinical-blue-600 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
          Ver Historial Clínico Completo
        </button>
      </section>
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 w-full z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-6 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div class="flex justify-between items-center max-w-md mx-auto">
        <button class="flex flex-col items-center gap-1 text-clinical-blue-500 group">
          <div class="p-1.5 rounded-full bg-clinical-blue-50 group-hover:bg-clinical-blue-500/20 transition-colors">
            <span class="material-symbols-outlined text-[24px] filled">grid_view</span>
          </div>
          <span class="text-[10px] font-bold">Dashboard</span>
        </button>

        <button class="flex flex-col items-center gap-1 text-text-muted hover:text-clinical-blue-500 transition-colors group">
          <div class="p-1.5 rounded-full group-hover:bg-gray-100 transition-colors">
            <span class="material-symbols-outlined text-[24px]">ecg_heart</span>
          </div>
          <span class="text-[10px] font-medium">Vitales</span>
        </button>

        <button @click="emit('navigate', 'notifications')" class="flex flex-col items-center gap-1 text-text-muted hover:text-clinical-blue-500 transition-colors group relative">
          <div class="p-1.5 rounded-full group-hover:bg-gray-100 transition-colors">
            <span class="material-symbols-outlined text-[24px]">notifications</span>
            <span v-if="familyNotifications.length > 0" class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </div>
          <span class="text-[10px] font-medium">Alertas</span>
        </button>

        <button @click="logout" class="flex flex-col items-center gap-1 text-text-muted hover:text-clinical-blue-500 transition-colors group">
          <div class="p-1.5 rounded-full group-hover:bg-gray-100 transition-colors">
            <span class="material-symbols-outlined text-[24px]">logout</span>
          </div>
          <span class="text-[10px] font-medium">Salir</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(31, 79, 216, 0.08);
}

.shadow-soft-hover {
  box-shadow: 0 10px 25px -5px rgba(31, 79, 216, 0.12);
}

.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-pulse .material-symbols-outlined {
  animation: spin 1s linear infinite;
}
</style>
