<script setup lang="ts">
interface Props {
  activeTab: 'dashboard' | 'trends' | 'education' | 'achievements' | 'settings'
  showFab?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFab: true
})

const emit = defineEmits<{
  navigate: [screen: string]
  fabClick: []
}>()

const handleNavClick = (screen: string) => {
  emit('navigate', screen)
}

const handleFabClick = () => {
  emit('fabClick')
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom">
    <div class="max-w-md mx-auto px-4">
      <div class="flex items-center justify-around h-20 relative">
        <!-- Dashboard -->
        <button
          @click="handleNavClick('dashboard')"
          :class="[
            'flex flex-col items-center justify-center gap-1 transition-colors flex-1',
            activeTab === 'dashboard' ? 'text-clinical-blue-500' : 'text-gray-400'
          ]"
        >
          <span class="material-symbols-outlined text-2xl" :class="{ 'font-bold': activeTab === 'dashboard' }">
            {{ activeTab === 'dashboard' ? 'dashboard' : 'dashboard' }}
          </span>
          <span class="text-xs font-medium">Inicio</span>
        </button>

        <!-- Trends/Graphs -->
        <button
          @click="handleNavClick('trends')"
          :class="[
            'flex flex-col items-center justify-center gap-1 transition-colors flex-1',
            activeTab === 'trends' ? 'text-clinical-blue-500' : 'text-gray-400'
          ]"
        >
          <span class="material-symbols-outlined text-2xl" :class="{ 'font-bold': activeTab === 'trends' }">
            {{ activeTab === 'trends' ? 'show_chart' : 'show_chart' }}
          </span>
          <span class="text-xs font-medium">Gráficas</span>
        </button>

        <!-- FAB Spacer -->
        <div v-if="showFab" class="flex-1"></div>

        <!-- Education -->
        <button
          @click="handleNavClick('education')"
          :class="[
            'flex flex-col items-center justify-center gap-1 transition-colors flex-1',
            activeTab === 'education' ? 'text-clinical-blue-500' : 'text-gray-400'
          ]"
        >
          <span class="material-symbols-outlined text-2xl" :class="{ 'font-bold': activeTab === 'education' }">
            {{ activeTab === 'education' ? 'school' : 'school' }}
          </span>
          <span class="text-xs font-medium">Aprender</span>
        </button>

        <!-- Achievements -->
        <button
          @click="handleNavClick('achievements')"
          :class="[
            'flex flex-col items-center justify-center gap-1 transition-colors flex-1',
            activeTab === 'achievements' ? 'text-clinical-blue-500' : 'text-gray-400'
          ]"
        >
          <span class="material-symbols-outlined text-2xl" :class="{ 'font-bold': activeTab === 'achievements' }">
            {{ activeTab === 'achievements' ? 'emoji_events' : 'emoji_events' }}
          </span>
          <span class="text-xs font-medium">Logros</span>
        </button>

        <!-- FAB Button (Floating) -->
        <button
          v-if="showFab"
          @click="handleFabClick"
          class="absolute left-1/2 -translate-x-1/2 -top-7 w-16 h-16 rounded-full bg-gradient-to-br from-clinical-blue-500 to-clinical-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
