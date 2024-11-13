'use client'

import { useUserContext } from '@/core/context'
import { Utility } from '@/core/helpers/utility'
import { Api } from '@/core/trpc'
import { useSnackbar } from 'notistack'
import { createContext, useContext, useEffect, useState } from 'react'
import { useServiceWorker } from './useServiceWorker'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

type NotificationContextType = {
  status: NotificationPermission
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  subscribe(): Promise<void>
  unsubscribe(): Promise<void>
  notifyUser(options: {
    title: string
    message: string
    userId: string
    url?: string
  }): Promise<void>
  notifyAll(options: {
    title: string
    message: string
    url?: string
  }): Promise<void>
}

const NotificationContext = createContext<NotificationContextType>(undefined)

export const NotificationProvider = ({ children }) => {
  const isActive = !!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY

  const serviceWorker = useServiceWorker(isActive)

  const { enqueueSnackbar } = useSnackbar()

  const [isLoading, setLoading] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  )

  const { user } = useUserContext()

  const { mutateAsync: subscribeUser } =
    Api.pushNotificationRouter.subscribeUser.useMutation()

  const { mutateAsync: unsubscribeUser } =
    Api.pushNotificationRouter.unsubscribeUser.useMutation()

  const { mutateAsync: notifyAll } =
    Api.pushNotificationRouter.notifyAll.useMutation()

  const { mutateAsync: notifyUser } =
    Api.pushNotificationRouter.notifyUser.useMutation()

  useEffect(() => {
    if (serviceWorker.registration) {
      setIsSupported(true)

      serviceWorker
        .findSubscription()
        .then(subscription => setSubscription(subscription))
    }
  }, [serviceWorker.registration])

  async function subscribe() {
    const keyPublic = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY

    if (Utility.isNull(keyPublic)) {
      enqueueSnackbar(
        `Set NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY in your .env to activate Push Notifications`,
        {
          variant: 'error',
        },
      )
      return
    }

    if (!user) {
      enqueueSnackbar(`You must be logged to activate notifications`, {
        variant: 'error',
      })
      return
    }

    setLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready

      const applicationServerKey = urlBase64ToUint8Array(keyPublic)

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      })

      await subscribeUser({ subscription: subscription.toJSON() })

      setSubscription(subscription)
    } catch (error) {
      enqueueSnackbar(`Could not activate notifications: ${error.message}`, {
        variant: 'error',
      })
    }

    setLoading(false)
  }

  async function unsubscribe() {
    try {
      if (user) {
        await unsubscribeUser()
      }

      await subscription?.unsubscribe()

      setSubscription(null)
    } catch (error) {
      enqueueSnackbar(`Something went wrong: ${error.message}`, {
        variant: 'error',
      })
    }
  }

  async function handleNotifyUser(options: {
    title: string
    message: string
    userId: string
    url?: string
  }) {
    if (!subscription) {
      enqueueSnackbar(`Notifications must be activated`, {
        variant: 'error',
      })
    }

    await notifyUser({ ...options })
  }

  async function handleNotifyAll(options: {
    title: string
    message: string
    url?: string
  }) {
    if (!subscription) {
      enqueueSnackbar(`Notifications must be activated`, {
        variant: 'error',
      })
    }

    await notifyAll({ ...options })
  }

  return (
    <NotificationContext.Provider
      value={{
        status:
          typeof Notification !== 'undefined'
            ? Notification.permission
            : 'default',
        isSupported,
        isSubscribed: !!subscription,
        isLoading,
        subscribe,
        unsubscribe,
        notifyUser: handleNotifyUser,
        notifyAll: handleNotifyAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const usePushNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)

  if (context === undefined) {
    throw new Error('usePushNotification must be used within a UserProvider')
  }

  return context
}
