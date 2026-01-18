<template>
  <div class="bg-clinical-white text-text-main font-body min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-clinical-blue-100 selection:text-clinical-blue-600">
    <div class="h-12 w-full"></div>
    <header class="w-full px-6 py-4 flex items-center">
      <button @click="$emit('navigate', 'menu')" class="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 text-clinical-blue-500 active:scale-90 transition-transform">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>
    </header>
    <main class="flex-1 w-full max-w-md px-6 flex flex-col">
      <div class="mt-2 mb-8">
        <h1 class="text-3xl font-display font-bold text-clinical-blue-500 leading-tight">Conectar tu Brazalete</h1>
        <p class="text-text-muted mt-2 font-medium">Asegúrate de que tu Cardio-Band esté encendida y cerca de tu teléfono.</p>
      </div>
      <div class="relative flex items-center justify-center py-10 mb-8">
        <div class="halo-pulse relative flex items-center justify-center gap-4">
          <div class="relative z-10 w-32 h-56 bg-slate-100 rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden">
            <div class="absolute top-0 w-full h-6 bg-slate-800 flex justify-center items-end">
              <div class="w-16 h-4 bg-slate-800 rounded-b-xl"></div>
            </div>
            <div class="w-full h-full flex items-center justify-center bg-white p-4">
              <span class="material-symbols-outlined text-clinical-blue-500 text-5xl animate-pulse">bluetooth_searching</span>
            </div>
          </div>
          <div class="relative z-10 w-28 h-28 transform translate-y-8">
            <div class="absolute inset-0 bg-clinical-blue-100 rounded-full blur-2xl opacity-40"></div>
            <img class="relative z-10 w-full h-full object-contain drop-shadow-xl" alt="Smart wearable Cardio-Band device" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeEeb1potnuOvtBGIf7lH4Fc0KumKWkTl6q_F59kO6Ovwp6DpXNDTcMWkx5_5MaeD8OtOVn6biEllLj2fDC2ZEcrHPSQJOvatGrlxY2Na3wz-yxq2X8rl_5A-gVPQ0fNTv3iY6rgBcVpNus7SegZy02t6lHVCJntYYs8zpO5h98m6fNr5lM5BPg9Xy1v4YehnxGwP3ZWEjW8Cg9mN67QSD6qyXmgHt70ATuqMd27jSJ6DYgKrPf_qNiIiQGbqKJ9aXfqJf58m-eO0"/>
          </div>
        </div>
      </div>
      <div class="bg-clinical-blue-50/50 border border-clinical-blue-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-clinical-blue-500 flex items-center justify-center text-white">
            <span class="text-xs font-bold">4/7</span>
          </div>
          <div>
            <span class="block text-xs font-bold text-clinical-blue-500 uppercase tracking-widest">Paso 4 de 7</span>
            <span class="text-sm font-semibold text-text-main">Emparejamiento Bluetooth</span>
          </div>
        </div>
        <span class="material-symbols-outlined text-clinical-blue-300">check_circle</span>
      </div>
      <div class="flex-1 space-y-4">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-sm font-bold text-text-muted uppercase tracking-wider">Dispositivos encontrados</h3>
          <div class="flex items-center gap-2 bg-health-green-50 px-2.5 py-1 rounded-full border border-health-green-100">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-health-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-health-green-500"></span>
            </span>
            <span class="text-[10px] font-bold text-health-green-600 uppercase">Buscando...</span>
          </div>
        </div>
        <div class="space-y-3">
          <div class="bg-white rounded-2xl p-4 shadow-soft border border-clinical-blue-100 flex items-center justify-between transition-all active:scale-[0.98]">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-clinical-blue-50 flex items-center justify-center text-clinical-blue-500">
                <span class="material-symbols-outlined">watch</span>
              </div>
              <div>
                <span class="block font-bold text-text-main">Cardio-Band X1</span>
                <span class="text-xs text-text-muted">Señal excelente</span>
              </div>
            </div>
            <button @click="$emit('navigate', 'calibration')" class="bg-clinical-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md hover:bg-clinical-blue-600 transition-colors">
              Conectar
            </button>
          </div>
          <div class="bg-white/60 rounded-2xl p-4 border border-gray-100 flex items-center justify-between opacity-60">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                <span class="material-symbols-outlined">bluetooth</span>
              </div>
              <div>
                <span class="block font-bold text-gray-400">Unknown Device</span>
                <span class="text-xs text-gray-400">Señal débil</span>
              </div>
            </div>
            <button class="text-gray-400 text-xs font-bold px-5 py-2.5">
              Conectar
            </button>
          </div>
        </div>
      </div>
      <footer class="mt-auto py-8 flex flex-col items-center gap-4">
        <button class="text-clinical-blue-500 font-bold text-sm hover:underline flex items-center gap-2">
          <span class="material-symbols-outlined text-lg">help</span>
          ¿Necesitas ayuda?
        </button>
        <div class="w-1/3 h-1.5 bg-gray-200 rounded-full mt-2"></div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
defineEmits(['navigate'])
</script>

<style scoped>
.halo-pulse {
  position: relative;
}
.halo-pulse::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140%;
  height: 140%;
  background: radial-gradient(circle, rgba(31, 79, 216, 0.1) 0%, rgba(31, 79, 216, 0) 70%);
  border-radius: 50%;
  z-index: 0;
}

body {
  -webkit-tap-highlight-color: transparent;
}
</style>
