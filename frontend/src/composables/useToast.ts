import { ref, h, render, type Component } from 'vue'
import Toast from '../components/shared/Toast.vue'

export interface ToastOptions {
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<Array<{ id: number; component: Component }>>([])
let toastId = 0

export function useToast() {
  const show = (options: ToastOptions) => {
    const id = toastId++
    const container = document.createElement('div')
    document.body.appendChild(container)

    const close = () => {
      render(null, container)
      document.body.removeChild(container)
      const index = toasts.value.findIndex(t => t.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }

    const vnode = h(Toast, {
      ...options,
      onClose: close
    })

    render(vnode, container)
    toasts.value.push({ id, component: vnode.component! })
  }

  const success = (message: string, title?: string, duration?: number) => {
    show({ message, title, type: 'success', duration })
  }

  const error = (message: string, title?: string, duration?: number) => {
    show({ message, title, type: 'error', duration })
  }

  const warning = (message: string, title?: string, duration?: number) => {
    show({ message, title, type: 'warning', duration })
  }

  const info = (message: string, title?: string, duration?: number) => {
    show({ message, title, type: 'info', duration })
  }

  return {
    show,
    success,
    error,
    warning,
    info
  }
}
