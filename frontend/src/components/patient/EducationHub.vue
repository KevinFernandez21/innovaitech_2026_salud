<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Search functionality
const showSearch = ref(false)
const searchQuery = ref('')

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
  }
}

const educationTopics = [
  {
    id: 1,
    title: 'Sal y Volumen Sanguíneo',
    subtitle: 'La metáfora de la esponja',
    icon: 'water_drop',
    color: 'clinical-blue',
    duration: '5 min',
    completed: false,
    screen: 'metaphors'
  },
  {
    id: 2,
    title: 'Presión Arterial',
    subtitle: 'Qué significa y por qué importa',
    icon: 'vital_signs',
    color: 'health-green',
    duration: '4 min',
    completed: false,
    screen: null
  },
  {
    id: 3,
    title: 'Ejercicio Cardiovascular',
    subtitle: 'Actividades recomendadas',
    icon: 'directions_run',
    color: 'clinical-blue',
    duration: '6 min',
    completed: false,
    screen: null
  },
  {
    id: 4,
    title: 'Nutrición para el Corazón',
    subtitle: 'Alimentos beneficiosos',
    icon: 'restaurant',
    color: 'health-green',
    duration: '5 min',
    completed: false,
    screen: null
  },
  {
    id: 5,
    title: 'Manejo del Estrés',
    subtitle: 'Técnicas de relajación',
    icon: 'self_improvement',
    color: 'clinical-blue',
    duration: '7 min',
    completed: false,
    screen: null
  },
  {
    id: 6,
    title: 'Sueño y Salud Cardíaca',
    subtitle: 'La importancia del descanso',
    icon: 'bedtime',
    color: 'health-green',
    duration: '4 min',
    completed: false,
    screen: null
  }
]

// Filter topics based on search
const filteredTopics = computed(() => {
  if (!searchQuery.value) return educationTopics

  const query = searchQuery.value.toLowerCase()
  return educationTopics.filter(topic =>
    topic.title.toLowerCase().includes(query) ||
    topic.subtitle.toLowerCase().includes(query)
  )
})

const handleTopicClick = (topic: typeof educationTopics[0]) => {
  if (topic.screen) {
    router.push(`/patient/${topic.screen}`)
  } else {
    alert('Este módulo educativo estará disponible próximamente.')
  }
}

const handleBack = () => {
  router.push('/patient/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-clinical-blue-50 to-white flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10">
      <div class="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        <button
          @click="handleBack"
          class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-gray-600">arrow_back</span>
        </button>
        <h1 class="text-lg font-display font-bold text-text-main">Centro Educativo</h1>
        <button @click="toggleSearch" class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center">
          <span class="material-symbols-outlined text-gray-600">{{ showSearch ? 'close' : 'search' }}</span>
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto pb-24">
      <div class="max-w-md mx-auto px-6 py-6">
        <!-- Search Bar -->
        <div v-if="showSearch" class="mb-6 animate-fadeIn">
          <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar temas educativos..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
              autofocus
            />
          </div>
          <p v-if="searchQuery && filteredTopics.length === 0" class="mt-3 text-sm text-text-muted text-center">
            No se encontraron temas que coincidan con "{{ searchQuery }}"
          </p>
          <p v-if="searchQuery && filteredTopics.length > 0" class="mt-3 text-sm text-text-muted">
            {{ filteredTopics.length }} tema(s) encontrado(s)
          </p>
        </div>

        <!-- Hero Section -->
        <div class="bg-gradient-to-br from-clinical-blue-500 to-clinical-blue-600 rounded-3xl p-6 mb-6 text-white shadow-lg">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h2 class="text-2xl font-display font-bold mb-2">Aprende sobre tu salud</h2>
              <p class="text-clinical-blue-100 text-sm">Conocimiento que cuida tu corazón</p>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span class="material-symbols-outlined text-5xl">school</span>
            </div>
          </div>
          <div class="flex gap-4 mt-6">
            <div class="flex-1 bg-white/20 backdrop-blur rounded-xl p-3">
              <p class="text-2xl font-bold">6</p>
              <p class="text-xs text-clinical-blue-100">Temas disponibles</p>
            </div>
            <div class="flex-1 bg-white/20 backdrop-blur rounded-xl p-3">
              <p class="text-2xl font-bold">0</p>
              <p class="text-xs text-clinical-blue-100">Completados</p>
            </div>
            <div class="flex-1 bg-white/20 backdrop-blur rounded-xl p-3">
              <p class="text-2xl font-bold">31</p>
              <p class="text-xs text-clinical-blue-100">min totales</p>
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-text-main mb-3">Categorías</h3>
          <div class="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <button class="px-4 py-2 bg-clinical-blue-500 text-white rounded-xl text-sm font-medium whitespace-nowrap shadow-md">
              Todos
            </button>
            <button class="px-4 py-2 bg-white text-text-muted rounded-xl text-sm font-medium whitespace-nowrap border border-gray-200 hover:border-clinical-blue-300">
              Fundamentos
            </button>
            <button class="px-4 py-2 bg-white text-text-muted rounded-xl text-sm font-medium whitespace-nowrap border border-gray-200 hover:border-clinical-blue-300">
              Nutrición
            </button>
            <button class="px-4 py-2 bg-white text-text-muted rounded-xl text-sm font-medium whitespace-nowrap border border-gray-200 hover:border-clinical-blue-300">
              Ejercicio
            </button>
          </div>
        </div>

        <!-- Topics List -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-text-main mb-3">Temas Recomendados</h3>

          <button
            v-for="topic in filteredTopics"
            :key="topic.id"
            @click="handleTopicClick(topic)"
            :class="[
              'w-full bg-white rounded-2xl p-5 shadow-soft border-2 transition-all text-left group',
              topic.screen ? 'border-clinical-blue-100 hover:border-clinical-blue-500 hover:shadow-lg' : 'border-gray-200'
            ]"
            :disabled="!topic.screen"
          >
            <div class="flex items-start gap-4">
              <div :class="[
                'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110',
                topic.color === 'clinical-blue' ? 'bg-clinical-blue-50' : 'bg-health-green-50'
              ]">
                <span :class="[
                  'material-symbols-outlined text-3xl',
                  topic.color === 'clinical-blue' ? 'text-clinical-blue-500' : 'text-health-green-500'
                ]">
                  {{ topic.icon }}
                </span>
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between mb-1">
                  <h4 class="text-base font-bold text-text-main pr-2">{{ topic.title }}</h4>
                  <span v-if="topic.screen" class="material-symbols-outlined text-clinical-blue-300 group-hover:text-clinical-blue-500">
                    chevron_right
                  </span>
                  <span v-else class="text-xs bg-gray-100 text-text-muted px-2 py-1 rounded-lg">Próximamente</span>
                </div>
                <p class="text-sm text-text-muted mb-2">{{ topic.subtitle }}</p>
                <div class="flex items-center gap-3 text-xs text-text-muted">
                  <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-base">schedule</span>
                    <span>{{ topic.duration }}</span>
                  </div>
                  <div v-if="topic.completed" class="flex items-center gap-1 text-health-green-600">
                    <span class="material-symbols-outlined text-base">check_circle</span>
                    <span>Completado</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Progress Section -->
        <div class="mt-6 bg-health-green-50 rounded-2xl p-5 border border-health-green-100">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-xl bg-health-green-500 flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-2xl">emoji_events</span>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-text-main">Desafío Semanal</h4>
              <p class="text-xs text-text-muted">Completa 3 temas esta semana</p>
            </div>
          </div>
          <div class="w-full bg-health-green-200 rounded-full h-2 overflow-hidden">
            <div class="bg-health-green-500 h-full rounded-full" style="width: 0%"></div>
          </div>
          <p class="text-xs text-text-muted mt-2">0 de 3 completados</p>
        </div>

        <!-- Did You Know Section -->
        <div class="mt-6 bg-clinical-blue-50 rounded-2xl p-5 border border-clinical-blue-100">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-clinical-blue-500 text-2xl flex-shrink-0">lightbulb</span>
            <div>
              <h4 class="font-semibold text-clinical-blue-700 mb-2">¿Sabías que...?</h4>
              <p class="text-sm text-clinical-blue-600 leading-relaxed">
                El estrés crónico puede elevar tu presión arterial. Dedicar solo 10 minutos al día a la meditación puede hacer una gran diferencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(31, 79, 216, 0.08);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
