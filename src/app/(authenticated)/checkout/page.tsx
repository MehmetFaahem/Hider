'use client'

import {
  Typography,
  Form,
  Input,
  Radio,
  Card,
  Button,
  Space,
  Divider,
} from 'antd'
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [form] = Form.useForm()
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card')

  // Fetch active cart with items
  const { data: cart } = Api.cart.findFirst.useQuery({
    where: { userId: user?.id, status: 'active' },
    include: {
      cartItems: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  // Calculate total
  const total =
    cart?.cartItems?.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0,
    ) || 0

  const { mutateAsync: createOrder } = Api.order.create.useMutation()
  const { mutateAsync: updateCart } = Api.cart.update.useMutation()
  const { mutateAsync: createOrderItems } =
    Api.orderItem.createMany.useMutation()

  const handleCheckout = async (values: any) => {
    try {
      if (!cart || !user) return

      // Create order
      const order = await createOrder({
        data: {
          status: 'pending',
          total: total.toString(),
          shippingAddress: values.address,
          paymentMethod: paymentMethod,
          userId: user.id,
        },
      })

      // Create order items
      await createOrderItems({
        data: cart.cartItems.map(item => ({
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
          variantId: item.variantId,
          orderId: order.id,
        })),
      })

      // Update cart status
      await updateCart({
        where: { id: cart.id },
        data: { status: 'completed' },
      })

      enqueueSnackbar('Order placed successfully!', { variant: 'success' })
      router.push('/home')
    } catch (error) {
      enqueueSnackbar('Failed to place order', { variant: 'error' })
    }
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>
        <ShoppingCartOutlined /> Checkout
      </Title>
      <Text>
        Complete your purchase by providing shipping and payment information
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleCheckout}
        style={{ marginTop: 24 }}
      >
        <Card title="Shipping Information" style={{ marginBottom: 24 }}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Shipping Address"
            rules={[{ required: true, message: 'Please enter your address' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Card>

        <Card title="Payment Method" style={{ marginBottom: 24 }}>
          <Radio.Group
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value="credit_card">
                <CreditCardOutlined /> Credit Card
              </Radio>
              <Radio value="paypal">
                <CreditCardOutlined /> PayPal
              </Radio>
            </Space>
          </Radio.Group>
        </Card>

        <Card title="Order Summary">
          {cart?.cartItems?.map(item => (
            <div key={item.id} style={{ marginBottom: 12 }}>
              <Text>{item.product?.name}</Text>
              {item.variant && (
                <Text type="secondary"> - {item.variant.value}</Text>
              )}
              <div>
                <Text type="secondary">
                  Quantity: {item.quantity.toString()} x ${item.price}
                </Text>
              </div>
            </div>
          ))}
          <Divider />
          <Text strong>Total: ${total.toFixed(2)}</Text>
        </Card>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckCircleOutlined />}
            size="large"
          >
            Place Order
          </Button>
        </div>
      </Form>
    </PageLayout>
  )
}
