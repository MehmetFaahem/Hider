'use client'

import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { CheckCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
const { Title, Text } = Typography

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [form] = Form.useForm()

  // Add refetch and enabled condition to cart query
  const { data: cart, refetch: refetchCart } = Api.cart.findFirst.useQuery(
    {
      where: { userId: user?.id, status: 'ACTIVE' },
      include: {
        cartItems: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    },
    {
      enabled: !!user?.id, // Only run query when user exists
    },
  )

  // Add console.log to debug cart data
  console.log('Cart data:', cart)

  // Calculate total with null checks
  const total =
    cart?.cartItems?.reduce((sum, item) => {
      if (!item.price || !item.quantity) return sum
      return sum + Number(item.price) * item.quantity
    }, 0) || 0

  const { mutateAsync: createOrder } = Api.order.create.useMutation()
  const { mutateAsync: updateCart } = Api.cart.update.useMutation()
  const { mutateAsync: createOrderItems } =
    Api.orderItem.createMany.useMutation()

  const handleCheckout = async (values: any) => {
    try {
      if (!cart || !user) return

      // Create order with COD payment method
      const order = await createOrder({
        data: {
          status: 'pending',
          total: total.toString(),
          shippingAddress: values.address,
          paymentMethod: 'cash_on_delivery', // Set fixed payment method
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
          <Text>Cash on Delivery (COD)</Text>
        </Card>

        <Card title="Order Summary">
          {!cart?.cartItems?.length ? (
            <Text>Your cart is empty</Text>
          ) : (
            <>
              {cart.cartItems.map(item => (
                <div key={item.id} style={{ marginBottom: 12 }}>
                  <Text strong>{item.product?.name || 'Unknown Product'}</Text>
                  {item.variant && (
                    <Text type="secondary"> - {item.variant.value}</Text>
                  )}
                  <div>
                    <Text type="secondary">
                      Quantity: {item.quantity || 0} x $
                      {Number(item.price || 0).toFixed(2)}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">
                      Subtotal: $
                      {((item.quantity || 0) * Number(item.price || 0)).toFixed(
                        2,
                      )}
                    </Text>
                  </div>
                  <Divider />
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <Text strong style={{ fontSize: 16 }}>
                  Total: ${total.toFixed(2)}
                </Text>
              </div>
            </>
          )}
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
