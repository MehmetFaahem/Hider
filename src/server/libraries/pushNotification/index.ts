import { Utility } from '@/core/helpers/utility'
import { PushNotification } from '@prisma/client'
import webpush from 'web-push'

class Service {
  constructor() {
    this.setup()
  }

  private setup() {
    try {
      const email = process.env.WEB_PUSH_EMAIL ?? 'marbler@marblism.com'
      const keyPublic = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
      const keyPrivate = process.env.WEB_PUSH_PRIVATE_KEY

      if (
        Utility.isNull(email) ||
        Utility.isNull(keyPublic) ||
        Utility.isNull(keyPrivate)
      ) {
        throw new Error(
          `Set WEB_PUSH_EMAIL && NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY && WEB_PUSH_PRIVATE_KEY in your .env to activate`,
        )
      }

      webpush.setVapidDetails(`mailto:${email}`, keyPublic, keyPrivate)

      console.log(`Push Notification library is active`)
    } catch (error) {
      console.error(
        `Push Notification library failed to start: ${error.message}`,
      )
    }
  }

  async sendMany(options: {
    title: string
    message: string
    pushNotifications: PushNotification[]
    url?: string
  }) {
    const { title, message, pushNotifications, url } = options

    let countSuccess = 0
    let countErrors = 0

    console.log(`${pushNotifications.length} notifications to send...`)

    for (const pushNotification of pushNotifications) {
      const endpointMasked = this.maskEndpoint(pushNotification.endpoint)

      try {
        const subscription: PushSubscription = JSON.parse(
          pushNotification.subscription,
        )

        await webpush.sendNotification(
          subscription as any,
          JSON.stringify({
            title,
            url,
            body: message,
          }),
        )

        console.log(
          `Notification sent to user "${pushNotification.userId}" on endpoint "${endpointMasked}"`,
        )

        countSuccess++
      } catch (error) {
        console.error(
          `Could not send notification to user "${pushNotification.userId}" on endpoint "${endpointMasked}": ${error.message}`,
        )

        countErrors++
      }
    }

    return { countSuccess, countErrors }
  }

  maskEndpoint(endpoint: string) {
    return endpoint.slice(0, 10) + '...' + endpoint.slice(-5)
  }
}

class Singleton {
  static service = new Service()
}

export const PushNotificationService = Singleton.service
