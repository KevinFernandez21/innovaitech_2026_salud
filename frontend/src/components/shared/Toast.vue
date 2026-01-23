<template>
  <Transition name="toast">
    <div
      v-if="visible"
      :class="[
        'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[calc(100%-2rem)] mx-auto',
        'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border',
        'flex items-start gap-3 p-4',
        typeClasses
      ]"
    >
      <!-- Icon -->
      <div :class="['shrink-0 w-10 h-10 rounded-full flex items-center justify-center', iconBgClasses]">
        <span class="material-symbols-outlined" :class="iconClasses">{{ icon }}</span>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 v-if="title" class="font-bold text-sm text-text-main dark:text-white mb-1">{{ title }}</h4>
        <p class="text-sm text-text-muted dark:text-gray-300">{{ message }}</p>
      </div>

      <!-- Close Button -->
      <button
        @click="close"
        class="shrink-0 w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-gray-400 text-[20px]">close</span>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

export interface ToastProps {
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<ToastProps>(), {
  type: 'info',
  duration: 4000
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const typeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'border-accent-green'
    case 'error':
      return 'border-red-500'
    case 'warning':
      return 'border-yellow-500'
    case 'info':
      return 'border-clinical-blue-500'
    default:
      return 'border-gray-200'
  }
})

const iconBgClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-accent-green/10'
    case 'error':
      return 'bg-red-50 dark:bg-red-900/20'
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-900/20'
    case 'info':
      return 'bg-clinical-blue-50 dark:bg-clinical-blue-900/20'
    default:
      return 'bg-gray-100'
  }
})

const iconClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-accent-green'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-clinical-blue-500'
    default:
      return 'text-gray-500'
  }
})

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check_circle'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'notifications'
  }
})

const close = () => {
  visible.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  setTimeout(() => {
    emit('close')
  }, 300) // Wait for transition to complete
}

onMounted(() => {
  visible.value = true

  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})

// Cleanup on unmount
watch(() => visible.value, (newVal) => {
  if (!newVal && timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
