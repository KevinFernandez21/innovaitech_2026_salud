<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Consent checkboxes
const healthMonitoring = ref(false) // Necesario
const algorithmImprovement = ref(false) // Opcional
const healthEcosystem = ref(false) // Opcional
const termsAccepted = ref(false) // Necesario

// Validation: required consents must be checked
const canContinue = computed(() => {
  return healthMonitoring.value && termsAccepted.value
})

const handleContinue = () => {
  if (canContinue.value) {
    // Guardar preferencias de consentimiento en localStorage
    const consents = {
      healthMonitoring: healthMonitoring.value,
      algorithmImprovement: algorithmImprovement.value,
      healthEcosystem: healthEcosystem.value,
      termsAccepted: termsAccepted.value,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cardioband_consents', JSON.stringify(consents))

    // Continuar al siguiente paso
    router.push('/patient/onboarding/permissions')
  }
}

const handleBack = () => {
  router.push('/patient/onboarding/welcome')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-clinical-blue-50 via-white to-health-green-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-clinical-blue-100">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
        <button
          @click="handleBack"
          class="w-10 h-10 rounded-xl bg-clinical-blue-50 hover:bg-clinical-blue-100 flex items-center justify-center transition-colors"
        >
          <span class="material-symbols-outlined text-clinical-blue-600">arrow_back</span>
        </button>
        <div class="flex-1">
          <h1 class="text-xl font-display font-bold text-clinical-blue-600">Configuración de Privacidad</h1>
          <p class="text-sm text-text-muted">Paso 2 de 7</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-6 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Intro -->
        <div class="bg-white rounded-2xl shadow-soft p-8 mb-6 border border-clinical-blue-100">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-14 h-14 rounded-2xl bg-clinical-blue-500 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-3xl text-white">security</span>
            </div>
            <div>
              <h2 class="text-2xl font-display font-bold text-clinical-blue-600 mb-2">
                Configuración de Privacidad y Permisos
              </h2>
              <p class="text-text-muted leading-relaxed">
                Bienvenido. Para usar el software gratuito y sincronizar tu dispositivo, necesitamos tu autorización conforme a la <strong>Ley de Protección de Datos Personales</strong>.
              </p>
            </div>
          </div>
        </div>

        <!-- Consent Options -->
        <div class="space-y-4">
          <!-- 1. Health Monitoring (Required) -->
          <div class="bg-white rounded-2xl shadow-soft p-6 border-2 transition-all" :class="healthMonitoring ? 'border-clinical-blue-500' : 'border-clinical-blue-100'">
            <label class="flex items-start gap-4 cursor-pointer group">
              <div class="flex-shrink-0 pt-1">
                <input
                  v-model="healthMonitoring"
                  type="checkbox"
                  class="w-6 h-6 rounded-lg border-2 border-clinical-blue-300 text-clinical-blue-500 focus:ring-2 focus:ring-clinical-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-clinical-blue-600">
                    1. Monitoreo de Salud y Sincronización
                  </h3>
                  <span class="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg">
                    Necesario
                  </span>
                </div>
                <p class="text-text-muted text-sm leading-relaxed">
                  Autorizo el tratamiento de mis datos de salud (presión arterial, historial) ingresados manualmente o sincronizados desde el dispositivo de hardware, con la finalidad de realizar el seguimiento de mi estado cardiovascular y generar alertas de autocuidado.
                </p>
              </div>
            </label>
          </div>

          <!-- 2. Algorithm Improvement (Optional) -->
          <div class="bg-white rounded-2xl shadow-soft p-6 border-2 transition-all" :class="algorithmImprovement ? 'border-health-green-500' : 'border-clinical-blue-100'">
            <label class="flex items-start gap-4 cursor-pointer group">
              <div class="flex-shrink-0 pt-1">
                <input
                  v-model="algorithmImprovement"
                  type="checkbox"
                  class="w-6 h-6 rounded-lg border-2 border-clinical-blue-300 text-health-green-500 focus:ring-2 focus:ring-health-green-500 focus:ring-offset-2 cursor-pointer transition-all"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-clinical-blue-600">
                    2. Análisis para Mejora del Algoritmo
                  </h3>
                  <span class="px-2 py-1 bg-health-green-100 text-health-green-700 text-xs font-semibold rounded-lg">
                    Opcional
                  </span>
                </div>
                <p class="text-text-muted text-sm leading-relaxed">
                  Autorizo el uso de mis datos de forma seudonimizada (sin mi identidad) para entrenar los algoritmos de la app y mejorar la precisión de las mediciones y reportes.
                </p>
              </div>
            </label>
          </div>

          <!-- 3. Health Ecosystem (Optional) -->
          <div class="bg-white rounded-2xl shadow-soft p-6 border-2 transition-all" :class="healthEcosystem ? 'border-health-green-500' : 'border-clinical-blue-100'">
            <label class="flex items-start gap-4 cursor-pointer group">
              <div class="flex-shrink-0 pt-1">
                <input
                  v-model="healthEcosystem"
                  type="checkbox"
                  class="w-6 h-6 rounded-lg border-2 border-clinical-blue-300 text-health-green-500 focus:ring-2 focus:ring-health-green-500 focus:ring-offset-2 cursor-pointer transition-all"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-clinical-blue-600">
                    3. Ecosistema de Salud: Clínicas y Farmacias
                  </h3>
                  <span class="px-2 py-1 bg-health-green-100 text-health-green-700 text-xs font-semibold rounded-lg">
                    Opcional
                  </span>
                </div>
                <p class="text-text-muted text-sm leading-relaxed">
                  Autorizo que la App utilice mi ubicación y perfil general de salud para recomendarme clínicas, especialistas y farmacias asociadas cercanas que puedan apoyarme en mi tratamiento.
                </p>
              </div>
            </label>
          </div>

          <!-- 4. Terms and Conditions (Required) -->
          <div class="bg-white rounded-2xl shadow-soft p-6 border-2 transition-all" :class="termsAccepted ? 'border-clinical-blue-500' : 'border-clinical-blue-100'">
            <label class="flex items-start gap-4 cursor-pointer group">
              <div class="flex-shrink-0 pt-1">
                <input
                  v-model="termsAccepted"
                  type="checkbox"
                  class="w-6 h-6 rounded-lg border-2 border-clinical-blue-300 text-clinical-blue-500 focus:ring-2 focus:ring-clinical-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-clinical-blue-600">
                    4. Términos del Servicio y Hardware
                  </h3>
                  <span class="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg">
                    Necesario
                  </span>
                </div>
                <p class="text-text-muted text-sm leading-relaxed">
                  Acepto los <a href="#" class="text-clinical-blue-500 hover:underline font-medium">Términos de Uso del Software Gratuito</a> y la <a href="#" class="text-clinical-blue-500 hover:underline font-medium">Política de Privacidad</a>. Entiendo que el hardware es una herramienta de apoyo y no sustituye al médico.
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Info Box -->
        <div class="mt-6 bg-clinical-blue-50 rounded-xl p-4 border border-clinical-blue-100">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-clinical-blue-500 text-xl flex-shrink-0">info</span>
            <p class="text-sm text-clinical-blue-700 leading-relaxed">
              <strong>Importante:</strong> Los permisos marcados como "Necesarios" son obligatorios para el funcionamiento de la aplicación. Los permisos opcionales pueden ayudarnos a mejorar tu experiencia, pero puedes continuar sin activarlos.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="bg-white border-t border-clinical-blue-100 px-6 py-6">
      <div class="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <button
          @click="handleBack"
          class="px-6 py-3 rounded-xl border-2 border-clinical-blue-200 text-clinical-blue-600 font-semibold hover:bg-clinical-blue-50 transition-colors"
        >
          Atrás
        </button>

        <button
          @click="handleContinue"
          :disabled="!canContinue"
          class="px-8 py-3 rounded-xl font-semibold text-white transition-all flex items-center gap-2"
          :class="canContinue
            ? 'bg-gradient-to-r from-clinical-blue-500 to-clinical-blue-600 hover:shadow-lg'
            : 'bg-gray-300 cursor-not-allowed opacity-60'"
        >
          <span>Continuar</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -4px rgba(31, 79, 216, 0.1);
}

/* Custom checkbox styling */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  background-color: white;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: currentColor;
  border-color: currentColor;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>
