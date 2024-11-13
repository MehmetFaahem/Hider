import { useEffect, useState } from 'react'

export const useServiceWorker = (isActive = true) => {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>()

  const isAllowed =
    'serviceWorker' in navigator && 'PushManager' in window && isActive

  useEffect(() => {
    if (isAllowed) {
      register().then(instance => setRegistration(instance))
    } else {
      deregister()
    }
  }, [isAllowed])

  const register = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()

      if (registrations.length > 0) {
        return registrations[0]
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })

      return registration
    } catch (error) {
      console.error(`Could not register service worker: ${error.message}`)
    }
  }

  async function deregister() {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()

      for (const registration of registrations) {
        try {
          await registration.unregister()
        } catch (error) {
          console.error(
            `Could not de-register service worker registration: ${error.message}`,
          )
        }
      }
    } catch (error) {
      console.error(`Could not de-register service worker: ${error.message}`)
    }
  }

  async function findSubscription() {
    const subscription = await registration.pushManager.getSubscription()

    return subscription
  }

  return {
    isAllowed,
    registration,
    register,
    deregister,
    findSubscription,
  }
}
