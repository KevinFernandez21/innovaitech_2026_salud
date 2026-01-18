<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { mockPatients } from '../../api/mockData'

const emit = defineEmits<{
  navigate: [screen: string]
}>()

const { currentUser } = useAuth()

// Patient being monitored (Sarah Johnson)
const patient = mockPatients[0]

// Message input
const newMessage = ref('')

// Mock messages
const messages = ref([
  {
    id: 1,
    sender: 'family',
    text: 'Hola! ¿Cómo te sientes hoy?',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    avatar: currentUser.value?.avatar || ''
  },
  {
    id: 2,
    sender: 'patient',
    text: 'Me siento muy bien, gracias por preguntar 😊',
    timestamp: new Date(Date.now() - 7000000),
    avatar: patient.avatar
  },
  {
    id: 3,
    sender: 'family',
    text: '¿Ya tomaste tu medicación de la mañana?',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    avatar: currentUser.value?.avatar || ''
  },
  {
    id: 4,
    sender: 'patient',
    text: 'Sí, la tomé a las 9:00 AM como siempre',
    timestamp: new Date(Date.now() - 3500000),
    avatar: patient.avatar
  },
  {
    id: 5,
    sender: 'patient',
    text: 'También hice mi caminata matutina, 2,450 pasos!',
    timestamp: new Date(Date.now() - 3400000),
    avatar: patient.avatar
  },
  {
    id: 6,
    sender: 'family',
    text: '¡Excelente! Estoy muy orgulloso de ti 💪',
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    avatar: currentUser.value?.avatar || ''
  }
])

// Quick message suggestions
const quickMessages = [
  '¿Cómo te sientes?',
  '¿Tomaste tu medicación?',
  '¡Bien hecho con tu racha!',
  'Te quiero ❤️'
]

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'family',
      text: newMessage.value,
      timestamp: new Date(),
      avatar: currentUser.value?.avatar || ''
    })
    newMessage.value = ''
  }
}

const sendQuickMessage = (text: string) => {
  messages.value.push({
    id: messages.value.length + 1,
    sender: 'family',
    text: text,
    timestamp: new Date(),
    avatar: currentUser.value?.avatar || ''
  })
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes}m`
  if (hours < 24) return `Hace ${hours}h`
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// Patient health status
const healthStatus = computed(() => {
  if (patient.alerts_count > 0) return { label: 'Requiere atención', color: 'bg-red-500' }
  if (patient.streak_days >= 7) return { label: 'Excelente estado', color: 'bg-health-green-500' }
  return { label: 'Estado normal', color: 'bg-yellow-500' }
})
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="px-6 py-4 max-w-md mx-auto">
        <div class="flex items-center justify-between mb-3">
          <button
            @click="emit('navigate', 'dashboard')"
            class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">arrow_back</span>
          </button>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <h1 class="text-lg font-bold text-text-main">{{ patient.name }}</h1>
              <p class="text-xs text-text-muted">Chat Familiar</p>
            </div>
            <div class="relative">
              <img :src="patient.avatar" :alt="patient.name" class="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm">
              <div :class="['absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white', healthStatus.color]"></div>
            </div>
          </div>
        </div>

        <!-- Patient Status Badge -->
        <div class="flex items-center justify-center">
          <div :class="['px-3 py-1 rounded-full flex items-center gap-2', healthStatus.color.replace('500', '50')]">
            <span :class="['w-2 h-2 rounded-full', healthStatus.color]"></span>
            <span :class="['text-xs font-semibold', healthStatus.color.replace('bg-', 'text-').replace('500', '700')]">
              {{ healthStatus.label }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Messages Container -->
    <main class="flex-1 overflow-y-auto px-4 py-6 max-w-md mx-auto w-full">
      <div class="space-y-4">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex gap-3',
            message.sender === 'family' ? 'flex-row-reverse' : 'flex-row'
          ]"
        >
          <img :src="message.avatar" :alt="message.sender" class="w-8 h-8 rounded-full object-cover flex-shrink-0">
          <div :class="[
            'max-w-[75%] flex flex-col',
            message.sender === 'family' ? 'items-end' : 'items-start'
          ]">
            <div :class="[
              'px-4 py-3 rounded-2xl',
              message.sender === 'family'
                ? 'bg-clinical-blue-500 text-white rounded-tr-sm'
                : 'bg-gray-100 text-text-main rounded-tl-sm'
            ]">
              <p class="text-sm leading-relaxed">{{ message.text }}</p>
            </div>
            <span class="text-xs text-text-muted mt-1 px-1">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Quick Messages -->
    <div class="px-4 py-3 bg-gray-50 border-t border-gray-100 max-w-md mx-auto w-full">
      <div class="flex gap-2 overflow-x-auto no-scrollbar">
        <button
          v-for="(msg, index) in quickMessages"
          :key="index"
          @click="sendQuickMessage(msg)"
          class="flex-shrink-0 px-4 py-2 bg-white text-clinical-blue-500 border border-clinical-blue-200 rounded-full text-sm font-medium hover:bg-clinical-blue-50 transition-colors"
        >
          {{ msg }}
        </button>
      </div>
    </div>

    <!-- Message Input -->
    <div class="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] max-w-md mx-auto w-full">
      <div class="flex items-center gap-3">
        <div class="flex-1 relative">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Escribe un mensaje..."
            class="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors text-sm"
          />
          <button class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-clinical-blue-500 transition-colors">
            <span class="material-symbols-outlined text-xl">attach_file</span>
          </button>
        </div>
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg',
            newMessage.trim()
              ? 'bg-clinical-blue-500 text-white hover:bg-clinical-blue-600 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >
          <span class="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
