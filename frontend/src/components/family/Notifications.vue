<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockNotifications, mockPatients } from '../../api/mockData'

const router = useRouter()

// Patient being monitored
const patient = mockPatients[0]

// Filter type
type FilterType = 'all' | 'alert' | 'achievement' | 'reminder'
const selectedFilter = ref<FilterType>('all')

// Get family notifications for patient
const notifications = ref(
  mockNotifications
    .filter(n => n.patient_id === 1)
    .map(n => ({ ...n, read: n.id > 3 })) // Mark some as read for demo
)

// Filtered notifications
const filteredNotifications = computed(() => {
  if (selectedFilter.value === 'all') return notifications.value

  const typeMap: Record<FilterType, string[]> = {
    alert: ['alert'],
    achievement: ['achievement'],
    reminder: ['reminder'],
    all: []
  }

  const types = typeMap[selectedFilter.value]
  return notifications.value.filter(n => types.includes(n.type))
})

// Unread count
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

// Group notifications by date
const groupedNotifications = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const groups: Record<string, typeof notifications.value> = {
    'Hoy': [],
    'Ayer': [],
    'Esta semana': [],
    'Anteriores': []
  }

  filteredNotifications.value.forEach(notif => {
    const notifDate = new Date(notif.timestamp)
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate())

    if (notifDay.getTime() === today.getTime()) {
      groups['Hoy'].push(notif)
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups['Ayer'].push(notif)
    } else if (notifDay >= weekAgo) {
      groups['Esta semana'].push(notif)
    } else {
      groups['Anteriores'].push(notif)
    }
  })

  return groups
})

// Mark notification as read
const markAsRead = (id: number) => {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) notif.read = true
}

// Mark all as read
const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

// Show notification detail modal
const selectedNotification = ref<typeof notifications.value[0] | null>(null)
const showDetailModal = ref(false)

const viewDetail = (notification: typeof notifications.value[0]) => {
  selectedNotification.value = notification
  showDetailModal.value = true
  // Mark as read when viewing detail
  markAsRead(notification.id)
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedNotification.value = null
}

// Get notification icon and color
const getNotificationStyle = (type: string, severity?: string) => {
  if (type === 'alert') {
    return {
      icon: 'error',
      bg: 'bg-red-50',
      iconColor: 'text-red-500',
      border: 'border-red-200'
    }
  } else if (type === 'achievement') {
    return {
      icon: 'emoji_events',
      bg: 'bg-health-green-50',
      iconColor: 'text-health-green-500',
      border: 'border-health-green-200'
    }
  } else if (type === 'reminder') {
    return {
      icon: 'notifications',
      bg: 'bg-clinical-blue-50',
      iconColor: 'text-clinical-blue-500',
      border: 'border-clinical-blue-200'
    }
  }
  return {
    icon: 'info',
    bg: 'bg-gray-50',
    iconColor: 'text-gray-500',
    border: 'border-gray-200'
  }
}

// Format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora mismo'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours}h`
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
</script>

<template>
  <div class="min-h-screen bg-white pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="px-6 py-4 max-w-md mx-auto">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <button
              @click="router.push('/family/dashboard')"
              class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-gray-600">arrow_back</span>
            </button>
            <div>
              <h1 class="text-lg font-bold text-text-main">Notificaciones</h1>
              <p v-if="unreadCount > 0" class="text-xs text-clinical-blue-500 font-semibold">{{ unreadCount }} sin leer</p>
            </div>
          </div>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="px-4 py-2 bg-clinical-blue-50 text-clinical-blue-500 rounded-xl text-xs font-semibold hover:bg-clinical-blue-100 transition-colors"
          >
            Marcar todas
          </button>
        </div>

        <!-- Filters -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            @click="selectedFilter = 'all'"
            :class="[
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              selectedFilter === 'all'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Todas
          </button>
          <button
            @click="selectedFilter = 'alert'"
            :class="[
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              selectedFilter === 'alert'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Alertas
          </button>
          <button
            @click="selectedFilter = 'achievement'"
            :class="[
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              selectedFilter === 'achievement'
                ? 'bg-health-green-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Logros
          </button>
          <button
            @click="selectedFilter = 'reminder'"
            :class="[
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              selectedFilter === 'reminder'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Recordatorios
          </button>
        </div>
      </div>
    </header>

    <!-- Notifications List -->
    <main class="max-w-md mx-auto px-4 py-6">
      <div v-for="(group, groupName) in groupedNotifications" :key="groupName">
        <div v-if="group.length > 0" class="mb-6">
          <h2 class="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-2">{{ groupName }}</h2>

          <div class="space-y-3">
            <div
              v-for="notification in group"
              :key="notification.id"
              :class="[
                'relative rounded-2xl p-4 border-2 transition-all',
                notification.read
                  ? 'bg-white border-gray-100'
                  : 'bg-white border-clinical-blue-200 shadow-soft'
              ]"
            >
              <!-- Unread indicator -->
              <div v-if="!notification.read" class="absolute top-4 right-4 w-2 h-2 bg-clinical-blue-500 rounded-full"></div>

              <div class="flex gap-4">
                <!-- Icon -->
                <div :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2',
                  getNotificationStyle(notification.type, notification.severity).bg,
                  getNotificationStyle(notification.type, notification.severity).border
                ]">
                  <span :class="[
                    'material-symbols-outlined text-xl',
                    getNotificationStyle(notification.type, notification.severity).iconColor
                  ]">
                    {{ getNotificationStyle(notification.type, notification.severity).icon }}
                  </span>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h3 class="font-bold text-text-main text-sm">{{ notification.patient_name }}</h3>
                    <span v-if="notification.severity === 'high'" class="flex-shrink-0 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-md">
                      Urgente
                    </span>
                  </div>

                  <p class="text-sm text-text-main leading-relaxed mb-2">{{ notification.message }}</p>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-text-muted">{{ formatRelativeTime(notification.timestamp) }}</span>

                    <div class="flex gap-2">
                      <button
                        v-if="!notification.read"
                        @click="markAsRead(notification.id)"
                        class="text-xs text-clinical-blue-500 font-semibold hover:text-clinical-blue-600"
                      >
                        Marcar leída
                      </button>
                      <button
                        v-if="notification.severity === 'high'"
                        @click="viewDetail(notification)"
                        class="text-xs text-red-500 font-semibold hover:text-red-600"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredNotifications.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">notifications_off</span>
        <p class="text-text-muted">No hay notificaciones</p>
      </div>
    </main>

    <!-- Notification Detail Modal -->
    <div
      v-if="showDetailModal && selectedNotification"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeDetailModal"
    >
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-12 h-12 rounded-full flex items-center justify-center border-2',
              getNotificationStyle(selectedNotification.type, selectedNotification.severity).bg,
              getNotificationStyle(selectedNotification.type, selectedNotification.severity).border
            ]">
              <span :class="[
                'material-symbols-outlined text-xl',
                getNotificationStyle(selectedNotification.type, selectedNotification.severity).iconColor
              ]">
                {{ getNotificationStyle(selectedNotification.type, selectedNotification.severity).icon }}
              </span>
            </div>
            <div>
              <h2 class="text-lg font-bold text-text-main">{{ selectedNotification.patient_name }}</h2>
              <p class="text-xs text-text-muted">{{ formatRelativeTime(selectedNotification.timestamp) }}</p>
            </div>
          </div>
          <button
            @click="closeDetailModal"
            class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        <!-- Priority Badge -->
        <div v-if="selectedNotification.severity === 'high'" class="mb-4 bg-red-50 border-2 border-red-200 rounded-xl p-3 flex items-center gap-3">
          <span class="material-symbols-outlined text-red-500 text-xl">warning</span>
          <p class="text-sm text-red-700 font-semibold">Notificación Urgente</p>
        </div>

        <!-- Message -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-text-main mb-2">Mensaje</h3>
          <p class="text-sm text-text-body leading-relaxed bg-gray-50 rounded-xl p-4">
            {{ selectedNotification.message }}
          </p>
        </div>

        <!-- Recommended Actions -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-text-main mb-3">Acciones Recomendadas</h3>
          <div class="space-y-2">
            <button
              @click="router.push('/family/vitals'); closeDetailModal()"
              class="w-full flex items-center gap-3 p-3 rounded-xl bg-clinical-blue-50 text-clinical-blue-700 hover:bg-clinical-blue-100 transition-colors text-left"
            >
              <span class="material-symbols-outlined">vital_signs</span>
              <div class="flex-1">
                <p class="font-semibold text-sm">Ver Signos Vitales</p>
                <p class="text-xs text-clinical-blue-600">Revisa las últimas mediciones</p>
              </div>
              <span class="material-symbols-outlined text-clinical-blue-500">chevron_right</span>
            </button>

            <button
              v-if="selectedNotification.severity === 'high'"
              @click="router.push('/family/messages'); closeDetailModal()"
              class="w-full flex items-center gap-3 p-3 rounded-xl bg-health-green-50 text-health-green-700 hover:bg-health-green-100 transition-colors text-left"
            >
              <span class="material-symbols-outlined">chat</span>
              <div class="flex-1">
                <p class="font-semibold text-sm">Contactar al Paciente</p>
                <p class="text-xs text-health-green-600">Envía un mensaje</p>
              </div>
              <span class="material-symbols-outlined text-health-green-500">chevron_right</span>
            </button>

            <button
              @click="router.push('/family/history'); closeDetailModal()"
              class="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors text-left"
            >
              <span class="material-symbols-outlined">history</span>
              <div class="flex-1">
                <p class="font-semibold text-sm">Historial Clínico</p>
                <p class="text-xs text-purple-600">Ver eventos anteriores</p>
              </div>
              <span class="material-symbols-outlined text-purple-500">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Close Button -->
        <button
          @click="closeDetailModal"
          class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-text-main hover:bg-gray-200 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(31, 79, 216, 0.08);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
