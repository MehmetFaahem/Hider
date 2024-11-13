import { Trpc } from '@/core/trpc/server'
import { z } from 'zod'
import { PushNotificationService } from '../libraries/pushNotification'

const PushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable(), // This can be null
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
})

export const PushNotificationRouter = Trpc.createRouter({
  subscribeUser: Trpc.procedure
    .input(
      z.object({
        subscription: PushSubscriptionSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.database.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
      })

      const subscription = input.subscription

      const subscriptionFound = await ctx.database.pushNotification.findFirst({
        where: { userId: user.id, endpoint: subscription.endpoint },
      })

      const endpointMasked = PushNotificationService.maskEndpoint(
        subscription.endpoint,
      )

      if (subscriptionFound) {
        console.log(
          `Push notification for user "${user.id}" and endpoint "${endpointMasked}" is already registered.`,
        )
        return {}
      }

      await ctx.database.pushNotification.create({
        data: {
          userId: user.id,
          endpoint: subscription.endpoint,
          subscription: JSON.stringify(subscription),
        },
      })

      console.log(
        `Push notification for user "${user.id}" and endpoint "${endpointMasked}" has been registered.`,
      )

      return {}
    }),

  unsubscribeUser: Trpc.procedure.mutation(async ({ ctx }) => {
    const user = await ctx.database.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
    })

    const result = await ctx.database.pushNotification.deleteMany({
      where: { userId: user.id },
    })

    console.log(
      `${result.count} devices have been removed from Push notification for user "${user.id}".`,
    )

    return {}
  }),

  notifyUser: Trpc.procedure
    .input(
      z.object({
        title: z.string(),
        message: z.string(),
        userId: z.string(),
        url: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const pushNotifications = await ctx.database.pushNotification.findMany({
        where: { userId: input.userId },
      })

      await PushNotificationService.sendMany({
        title: input.title,
        message: input.message,
        url: input.url,
        pushNotifications,
      })

      return {}
    }),

  notifyAll: Trpc.procedure
    .input(
      z.object({
        title: z.string(),
        message: z.string(),
        url: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const pushNotifications = await ctx.database.pushNotification.findMany({
        where: { userId: { notIn: [ctx.session.user.id] } },
      })

      await PushNotificationService.sendMany({
        title: input.title,
        message: input.message,
        url: input.url,
        pushNotifications,
      })

      return {}
    }),
})
