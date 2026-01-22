<template>
  <div class="bg-clinical-white font-display antialiased selection:bg-health-green selection:text-white">
    <div class="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-clinical-white">
      <div class="sticky top-0 z-50 flex items-center bg-clinical-white/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100">
        <div @click="router.push('/patient/dashboard')" class="text-clinical-blue flex size-12 shrink-0 items-center justify-center rounded-full active:bg-gray-100 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 class="text-clinical-blue text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Tu Progreso</h2>
        <div class="flex size-12 items-center justify-center">
          <button @click="openSettings" class="flex items-center justify-center overflow-hidden rounded-full size-10 text-clinical-blue hover:bg-gray-100 transition-colors">
            <span class="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center pt-6 pb-8 px-4 relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-health-green/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div class="relative w-56 h-56 flex items-center justify-center mb-6">
          <div class="absolute inset-0 rounded-full border-[12px] border-surface-light"></div>
          <div class="absolute inset-0 rounded-full ring-gradient opacity-100 shadow-glow"></div>
          <div class="flex flex-col items-center z-10">
            <div class="text-health-green mb-1 animate-pulse">
              <span class="material-symbols-outlined text-[48px] fill-1">local_fire_department</span>
            </div>
            <span class="text-text-primary text-5xl font-black tracking-tighter leading-none">{{ streakDays }}</span>
            <span class="text-text-secondary text-sm font-medium uppercase tracking-widest mt-1">Días Seguidos</span>
          </div>
        </div>
        <h1 class="text-text-primary tracking-tight text-[28px] font-bold leading-tight px-4 text-center mb-2">¡Eres Imparable!</h1>
        <p class="text-text-secondary text-center text-sm px-8">Mantén la racha {{ daysToNextLevel }} días más para alcanzar el nivel de <span class="text-health-green font-bold">Guardián</span>.</p>
      </div>

      <div class="px-4 mb-8">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-clinical-blue to-[#2A5CE5] p-5 shadow-soft group text-white">
          <div class="absolute top-0 right-0 p-3 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <span class="material-symbols-outlined text-[120px] text-white">emoji_events</span>
          </div>
          <div class="relative z-10 flex flex-col items-start gap-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Próxima Recompensa</span>
            </div>
            <h3 class="text-white text-xl font-bold leading-tight">Desbloquea Tema Clínico</h3>
            <p class="text-blue-100 text-sm mb-4 max-w-[70%]">Un nuevo tema visual exclusivo para expertos en salud cardiovascular.</p>
            <div class="w-full bg-black/20 h-2 rounded-full overflow-hidden">
              <div class="bg-health-green h-full rounded-full shadow-[0_0_10px_rgba(47,191,155,0.5)]" :style="{ width: rewardProgress + '%' }"></div>
            </div>
            <div class="flex justify-between w-full mt-2 text-xs font-medium text-blue-100">
              <span>Progreso</span>
              <span class="text-white">{{ rewardProgress }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 mb-2">
        <h3 class="text-text-primary text-lg font-bold mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-clinical-blue">map</span>
          Tu Camino
        </h3>
        <div class="grid grid-cols-[32px_1fr] gap-x-4">
          <!-- Milestone 1 - Completed -->
          <div class="flex flex-col items-center pt-1">
            <div class="flex items-center justify-center size-8 rounded-full bg-health-green/10 text-health-green ring-2 ring-health-green ring-offset-2 ring-offset-clinical-white">
              <span class="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div class="w-[2px] bg-health-green/30 h-full min-h-[40px] my-1"></div>
          </div>
          <div class="flex flex-col pb-6 pt-1">
            <p class="text-text-primary text-base font-bold">Inicio Saludable</p>
            <p class="text-text-secondary text-sm">Comenzaste tu viaje cardiovascular.</p>
          </div>

          <!-- Milestone 2 - Current -->
          <div class="flex flex-col items-center">
            <div class="flex items-center justify-center size-8 rounded-full bg-health-green text-white shadow-glow z-10">
              <span class="material-symbols-outlined text-[20px] fill-1">bolt</span>
            </div>
            <div class="w-[2px] bg-gradient-to-b from-health-green/30 to-gray-200 h-full min-h-[40px] my-1"></div>
          </div>
          <div class="flex flex-col pb-6 pt-1">
            <p class="text-base font-bold gradient-text w-fit">{{ streakDays }} Días: Constancia</p>
            <p class="text-health-green text-sm font-medium">¡Estás aquí! Sigue así.</p>
          </div>

          <!-- Milestone 3 - Locked -->
          <div class="flex flex-col items-center">
            <div class="flex items-center justify-center size-8 rounded-full bg-surface-light border border-gray-200 text-gray-400">
              <span class="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div class="w-[2px] bg-gray-200 h-full min-h-[40px] my-1"></div>
          </div>
          <div class="flex flex-col pb-6 pt-1 opacity-60">
            <p class="text-text-primary text-base font-bold">30 Días: Guardián</p>
            <p class="text-text-secondary text-sm">Desbloquea insignia de plata.</p>
          </div>

          <!-- Milestone 4 - Locked -->
          <div class="flex flex-col items-center">
            <div class="flex items-center justify-center size-8 rounded-full bg-surface-light border border-gray-200 text-gray-400">
              <span class="material-symbols-outlined text-[18px]">lock</span>
            </div>
          </div>
          <div class="flex flex-col pt-1 opacity-60">
            <p class="text-text-primary text-base font-bold">60 Días: Leyenda</p>
            <p class="text-text-secondary text-sm">Tema exclusivo para compartir.</p>
          </div>
        </div>
      </div>

      <div class="h-6"></div>

      <div class="px-4 pb-24">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-text-primary text-lg font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-yellow-500">military_tech</span>
            Medallas
          </h3>
          <button @click="viewAllMedals" class="text-xs text-clinical-blue font-bold hover:underline">Ver todas</button>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-surface-light p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center gap-3 hover:bg-white hover:shadow-md transition-all cursor-pointer">
            <div class="size-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border border-white">
              <span class="material-symbols-outlined text-clinical-blue text-[28px]">cardiology</span>
            </div>
            <div>
              <p class="text-text-primary font-bold text-sm">Corazón Sano</p>
              <p class="text-text-secondary text-xs">Primera medición</p>
            </div>
          </div>
          <div class="bg-surface-light p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center gap-3 hover:bg-white hover:shadow-md transition-all cursor-pointer">
            <div class="size-14 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border border-white">
              <span class="material-symbols-outlined text-health-green text-[28px]">eco</span>
            </div>
            <div>
              <p class="text-text-primary font-bold text-sm">Vida Activa</p>
              <p class="text-text-secondary text-xs">7 días activo</p>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center gap-3 opacity-50">
            <div class="size-14 rounded-full bg-gray-100 flex items-center justify-center border border-white">
              <span class="material-symbols-outlined text-gray-400 text-[28px]">lock</span>
            </div>
            <div>
              <p class="text-gray-400 font-bold text-sm">Guardián</p>
              <p class="text-gray-400 text-xs">30 días</p>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center gap-3 opacity-50">
            <div class="size-14 rounded-full bg-gray-100 flex items-center justify-center border border-white">
              <span class="material-symbols-outlined text-gray-400 text-[28px]">lock</span>
            </div>
            <div>
              <p class="text-gray-400 font-bold text-sm">Leyenda</p>
              <p class="text-gray-400 text-xs">60 días</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div
      v-if="showSettingsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeSettings"
    >
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-text-main">Configuración de Logros</h2>
          <button
            @click="closeSettings"
            class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <label class="flex items-center justify-between p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-clinical-blue">notifications</span>
              <div>
                <p class="font-semibold text-text-main text-sm">Notificaciones de Logros</p>
                <p class="text-xs text-text-muted">Recibe alertas al desbloquear logros</p>
              </div>
            </div>
            <input
              type="checkbox"
              v-model="notificationsEnabled"
              class="w-5 h-5 text-clinical-blue-500 rounded"
            />
          </label>

          <label class="flex items-center justify-between p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-clinical-blue">flag</span>
              <div>
                <p class="font-semibold text-text-main text-sm">Mostrar Hitos</p>
                <p class="text-xs text-text-muted">Ver progreso en el camino</p>
              </div>
            </div>
            <input
              type="checkbox"
              v-model="showMilestones"
              class="w-5 h-5 text-clinical-blue-500 rounded"
            />
          </label>

          <label class="flex items-center justify-between p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-clinical-blue">lock</span>
              <div>
                <p class="font-semibold text-text-main text-sm">Perfil Privado</p>
                <p class="text-xs text-text-muted">Ocultar logros de otros usuarios</p>
              </div>
            </div>
            <input
              type="checkbox"
              v-model="privateProfile"
              class="w-5 h-5 text-clinical-blue-500 rounded"
            />
          </label>
        </div>

        <button
          @click="closeSettings"
          class="w-full mt-6 py-3 px-4 rounded-xl text-sm font-semibold bg-clinical-blue-500 text-white hover:bg-clinical-blue-600 transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </div>

    <!-- All Medals Modal -->
    <div
      v-if="showAllMedals"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeAllMedals"
    >
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-text-main">Todas las Medallas</h2>
          <button
            @click="closeAllMedals"
            class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <!-- Unlocked medals -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200 flex flex-col items-center text-center gap-3">
            <div class="size-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-white shadow-lg">
              <span class="material-symbols-outlined text-clinical-blue text-[32px]">cardiology</span>
            </div>
            <div>
              <p class="text-text-primary font-bold text-sm">Corazón Sano</p>
              <p class="text-text-secondary text-xs mb-2">Primera medición</p>
              <span class="bg-health-green-50 text-health-green-700 text-xs font-semibold px-2 py-1 rounded-lg">Desbloqueada</span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-health-green-200 flex flex-col items-center text-center gap-3">
            <div class="size-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border-2 border-white shadow-lg">
              <span class="material-symbols-outlined text-health-green text-[32px]">eco</span>
            </div>
            <div>
              <p class="text-text-primary font-bold text-sm">Vida Activa</p>
              <p class="text-text-secondary text-xs mb-2">7 días activo</p>
              <span class="bg-health-green-50 text-health-green-700 text-xs font-semibold px-2 py-1 rounded-lg">Desbloqueada</span>
            </div>
          </div>

          <!-- Locked medals -->
          <div class="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 flex flex-col items-center text-center gap-3 opacity-60">
            <div class="size-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
              <span class="material-symbols-outlined text-gray-400 text-[32px]">lock</span>
            </div>
            <div>
              <p class="text-gray-400 font-bold text-sm">Guardián</p>
              <p class="text-gray-400 text-xs mb-2">30 días consecutivos</p>
              <span class="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-lg">Bloqueada</span>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 flex flex-col items-center text-center gap-3 opacity-60">
            <div class="size-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
              <span class="material-symbols-outlined text-gray-400 text-[32px]">lock</span>
            </div>
            <div>
              <p class="text-gray-400 font-bold text-sm">Leyenda</p>
              <p class="text-gray-400 text-xs mb-2">60 días consecutivos</p>
              <span class="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-lg">Bloqueada</span>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 flex flex-col items-center text-center gap-3 opacity-60">
            <div class="size-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
              <span class="material-symbols-outlined text-gray-400 text-[32px]">lock</span>
            </div>
            <div>
              <p class="text-gray-400 font-bold text-sm">Maestro</p>
              <p class="text-gray-400 text-xs mb-2">Completa todos los módulos</p>
              <span class="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-lg">Bloqueada</span>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 flex flex-col items-center text-center gap-3 opacity-60">
            <div class="size-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
              <span class="material-symbols-outlined text-gray-400 text-[32px]">lock</span>
            </div>
            <div>
              <p class="text-gray-400 font-bold text-sm">Perfeccionista</p>
              <p class="text-gray-400 text-xs mb-2">100% objetivos completados</p>
              <span class="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-lg">Bloqueada</span>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-clinical-blue-50 rounded-xl">
          <p class="text-sm text-clinical-blue-700 text-center">
            <span class="font-bold">2 de 6</span> medallas desbloqueadas. ¡Sigue así!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const streakDays = ref(15)
const daysToNextLevel = computed(() => 30 - streakDays.value)
const rewardProgress = computed(() => Math.round((streakDays.value / 30) * 100))

// Settings modal
const showSettingsModal = ref(false)
const notificationsEnabled = ref(true)
const showMilestones = ref(true)
const privateProfile = ref(false)

const openSettings = () => {
  showSettingsModal.value = true
}

const closeSettings = () => {
  showSettingsModal.value = false
}

// View all medals
const showAllMedals = ref(false)

const viewAllMedals = () => {
  showAllMedals.value = true
}

const closeAllMedals = () => {
  showAllMedals.value = false
}
</script>

<style scoped>
.gradient-text {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(to right, #1F4FD8, #2FBF9B);
}

.ring-gradient {
  background: conic-gradient(#2FBF9B 50%, #E5E7EB 0);
  mask-image: radial-gradient(transparent 63%, black 64%);
  -webkit-mask-image: radial-gradient(transparent 63%, black 64%);
}
</style>
