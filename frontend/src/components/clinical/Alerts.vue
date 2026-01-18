<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockNotifications } from '../../api/mockData'

const emit = defineEmits<{
  navigate: [screen: string]
}>()

const notifications = ref(mockNotifications)

const unreadAlerts = computed(() => notifications.value.filter(n => !n.read))
const criticalAlerts = computed(() => notifications.value.filter(n => n.severity === 'high'))

const markAsRead = (id: number) => {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) notif.read = true
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const getSeverityColor = (severity?: string) => {
  switch (severity) {
    case 'high': return 'bg-red-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-blue-500'
    default: return 'bg-gray-500'
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
          <h1 class="text-lg font-display font-bold text-text-main">Alertas Críticas</h1>
        </div>
        <button
          v-if="unreadAlerts.length > 0"
          @click="markAllAsRead"
          class="text-sm text-clinical-blue-500 hover:text-clinical-blue-600 font-semibold"
        >
          Marcar todas como leídas
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-red-50 rounded-2xl p-6 border border-red-200">
          <div class="flex items-center gap-3 mb-2">
            <span class="material-symbols-outlined text-red-500 text-3xl">error</span>
            <p class="text-sm text-red-700 font-semibold">Críticas</p>
          </div>
          <p class="text-3xl font-display font-bold text-red-600">{{ criticalAlerts.length }}</p>
        </div>

        <div class="bg-clinical-blue-50 rounded-2xl p-6 border border-clinical-blue-200">
          <div class="flex items-center gap-3 mb-2">
            <span class="material-symbols-outlined text-clinical-blue-500 text-3xl">notifications_active</span>
            <p class="text-sm text-clinical-blue-700 font-semibold">Sin leer</p>
          </div>
          <p class="text-3xl font-display font-bold text-clinical-blue-600">{{ unreadAlerts.length }}</p>
        </div>

        <div class="bg-health-green-50 rounded-2xl p-6 border border-health-green-200">
          <div class="flex items-center gap-3 mb-2">
            <span class="material-symbols-outlined text-health-green-500 text-3xl">check_circle</span>
            <p class="text-sm text-health-green-700 font-semibold">Atendidas</p>
          </div>
          <p class="text-3xl font-display font-bold text-health-green-600">{{ notifications.filter(n => n.read).length }}</p>
        </div>
      </div>

      <!-- Alerts List -->
      <div class="space-y-4">
        <div
          v-for="alert in notifications"
          :key="alert.id"
          :class="[
            'bg-white rounded-2xl p-6 border-2 transition-all',
            alert.read ? 'border-gray-200 opacity-75' : 'border-red-200 shadow-lg'
          ]"
        >
          <div class="flex items-start gap-4">
            <div :class="['w-3 h-3 rounded-full mt-2 flex-shrink-0', getSeverityColor(alert.severity)]"></div>
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="font-semibold text-text-main mb-1">{{ alert.patient_name }}</h3>
                  <p class="text-sm text-text-main">{{ alert.message }}</p>
                </div>
                <span :class="[
                  'px-3 py-1 rounded-lg text-xs font-semibold ml-4',
                  alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                ]">
                  {{ alert.severity === 'high' ? 'Crítica' : alert.severity === 'medium' ? 'Media' : 'Baja' }}
                </span>
              </div>
              <div class="flex items-center gap-4 mt-3">
                <span class="text-xs text-text-muted flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  {{ new Date(alert.timestamp).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
                </span>
                <span class="text-xs text-text-muted flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">{{ alert.type === 'alert' ? 'priority_high' : 'chat' }}</span>
                  {{ alert.type === 'alert' ? 'Alerta' : 'Mensaje' }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                v-if="!alert.read"
                @click="markAsRead(alert.id)"
                class="px-4 py-2 bg-clinical-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-clinical-blue-600 transition-colors"
              >
                Marcar como leída
              </button>
              <button
                @click="emit('navigate', `patient-detail-${alert.patient_id}`)"
                class="px-4 py-2 bg-gray-100 text-text-main rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Ver paciente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
