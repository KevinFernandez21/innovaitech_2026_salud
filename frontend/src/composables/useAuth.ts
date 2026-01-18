import { ref, computed } from 'vue'
import type { User, UserRole } from '../types/user'
import { mockUsers } from '../api/mockData'

// Global auth state
const currentUser = ref<User | null>(null)
const isAuthenticated = ref(false)
const hasCompletedOnboarding = ref(false)

export function useAuth() {
  // Computed properties for role checks
  const isPatient = computed(() => currentUser.value?.role === 'patient')
  const isClinical = computed(() => currentUser.value?.role === 'clinical')
  const isFamily = computed(() => currentUser.value?.role === 'family')

  // Initialize from localStorage
  function initialize() {
    const savedUser = localStorage.getItem('cardioband_user')

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        currentUser.value = user
        isAuthenticated.value = true

        // Check onboarding status for this specific user
        if (user.role === 'patient') {
          const onboardingKey = `cardioband_onboarding_${user.id}`
          hasCompletedOnboarding.value = localStorage.getItem(onboardingKey) === 'true'
        } else {
          // Clinical and Family don't need onboarding
          hasCompletedOnboarding.value = true
        }
      } catch (e) {
        console.error('Error parsing saved user:', e)
        logout()
      }
    }
  }

  // Login with mock user by role
  function login(role: UserRole) {
    const user = mockUsers.find(u => u.role === role)
    if (user) {
      currentUser.value = user
      isAuthenticated.value = true
      localStorage.setItem('cardioband_user', JSON.stringify(user))

      // Check if patient needs onboarding (specific to this user)
      if (role === 'patient') {
        const onboardingKey = `cardioband_onboarding_${user.id}`
        hasCompletedOnboarding.value = localStorage.getItem(onboardingKey) === 'true'
      } else {
        // Clinical and Family don't need onboarding
        hasCompletedOnboarding.value = true
      }

      return user
    }
    return null
  }

  // Login by user ID (for testing)
  function loginById(id: number) {
    const user = mockUsers.find(u => u.id === id)
    if (user) {
      currentUser.value = user
      isAuthenticated.value = true
      localStorage.setItem('cardioband_user', JSON.stringify(user))

      if (user.role === 'patient') {
        const onboardingKey = `cardioband_onboarding_${user.id}`
        hasCompletedOnboarding.value = localStorage.getItem(onboardingKey) === 'true'
      } else {
        hasCompletedOnboarding.value = true
      }

      return user
    }
    return null
  }

  // Complete onboarding (for patient only)
  function completeOnboarding() {
    if (currentUser.value) {
      hasCompletedOnboarding.value = true
      const onboardingKey = `cardioband_onboarding_${currentUser.value.id}`
      localStorage.setItem(onboardingKey, 'true')
    }
  }

  // Logout
  function logout() {
    currentUser.value = null
    isAuthenticated.value = false
    hasCompletedOnboarding.value = false
    localStorage.removeItem('cardioband_user')
    // Note: We keep individual onboarding states in localStorage for when user logs back in
  }

  // Reset onboarding (for demo purposes)
  function resetOnboarding() {
    if (currentUser.value) {
      hasCompletedOnboarding.value = false
      const onboardingKey = `cardioband_onboarding_${currentUser.value.id}`
      localStorage.removeItem(onboardingKey)
    }
  }

  return {
    currentUser,
    isAuthenticated,
    hasCompletedOnboarding,
    isPatient,
    isClinical,
    isFamily,
    initialize,
    login,
    loginById,
    logout,
    completeOnboarding,
    resetOnboarding
  }
}
