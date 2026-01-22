import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuth } from '../composables/useAuth'

/**
 * Authentication Guard
 * Redirects to login if user is not authenticated
 */
export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const { isAuthenticated } = useAuth()

  // Route doesn't require auth
  if (!to.meta.requiresAuth) {
    return next()
  }

  // User is authenticated
  if (isAuthenticated.value) {
    return next()
  }

  // User is not authenticated, redirect to login
  console.log('[AuthGuard] User not authenticated, redirecting to login')
  return next({ path: '/', replace: true })
}

/**
 * Role Guard
 * Ensures user has the correct role for the route
 */
export function roleGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const { currentUser, isPatient, isClinical, isFamily } = useAuth()

  // Route doesn't require a specific role
  if (!to.meta.role) {
    return next()
  }

  const requiredRole = to.meta.role as string
  const userRole = currentUser.value?.role

  // Check if user has the required role
  const hasRole =
    (requiredRole === 'patient' && isPatient.value) ||
    (requiredRole === 'clinical' && isClinical.value) ||
    (requiredRole === 'family' && isFamily.value)

  if (hasRole) {
    return next()
  }

  // User doesn't have the required role, redirect to their dashboard
  console.log(`[RoleGuard] User role '${userRole}' doesn't match required role '${requiredRole}'`)

  if (isPatient.value) {
    return next({ path: '/patient/dashboard', replace: true })
  } else if (isClinical.value) {
    return next({ path: '/clinical/dashboard', replace: true })
  } else if (isFamily.value) {
    return next({ path: '/family/dashboard', replace: true })
  }

  // Fallback to login
  return next({ path: '/', replace: true })
}

/**
 * Onboarding Guard
 * Redirects patients who haven't completed onboarding to the onboarding flow
 * Prevents patients who have completed onboarding from accessing onboarding routes
 */
export function onboardingGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const { hasCompletedOnboarding, isPatient } = useAuth()

  // Guard only applies to patient routes
  if (!isPatient.value) {
    return next()
  }

  const isOnboardingRoute = to.path.startsWith('/patient/onboarding')
  const requiresOnboarding = to.meta.requiresOnboarding === true

  // Patient hasn't completed onboarding
  if (!hasCompletedOnboarding.value) {
    // Allow access to onboarding routes
    if (isOnboardingRoute) {
      return next()
    }

    // Trying to access main app without completing onboarding, redirect
    console.log('[OnboardingGuard] Patient has not completed onboarding, redirecting')
    return next({ path: '/patient/onboarding/welcome', replace: true })
  }

  // Patient has completed onboarding
  if (hasCompletedOnboarding.value) {
    // Prevent access to onboarding routes
    if (isOnboardingRoute) {
      console.log('[OnboardingGuard] Patient already completed onboarding, redirecting to dashboard')
      return next({ path: '/patient/dashboard', replace: true })
    }

    // Allow access to main app
    return next()
  }

  return next()
}
