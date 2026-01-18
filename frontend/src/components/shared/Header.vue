<script setup lang="ts">
interface Props {
  title?: string
  showBack?: boolean
  showSettings?: boolean
  avatar?: string
  greeting?: string
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  showSettings: false
})

const emit = defineEmits<{
  back: []
  settings: []
}>()
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Left: Back Button or Avatar/Greeting -->
      <div class="flex items-center gap-3">
        <button
          v-if="showBack"
          @click="emit('back')"
          class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-gray-600">arrow_back</span>
        </button>

        <div v-else-if="avatar && greeting" class="flex items-center gap-3">
          <img :src="avatar" alt="Avatar" class="w-10 h-10 rounded-full object-cover">
          <div>
            <p class="text-xs text-text-muted">{{ greeting }}</p>
            <p class="text-sm font-semibold text-text-main">{{ title }}</p>
          </div>
        </div>
      </div>

      <!-- Center: Title (if no avatar/greeting) -->
      <h1 v-if="title && !greeting" class="text-lg font-display font-bold text-text-main absolute left-1/2 -translate-x-1/2">
        {{ title }}
      </h1>

      <!-- Right: Settings Button -->
      <button
        v-if="showSettings"
        @click="emit('settings')"
        class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-gray-600">settings</span>
      </button>
      <div v-else class="w-10"></div>
    </div>
  </header>
</template>
