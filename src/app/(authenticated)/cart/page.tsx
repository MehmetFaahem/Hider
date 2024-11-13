'use client'

import { Typography, Table, InputNumber, Button, Space, Empty } from 'antd'
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function CartPage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [updating, setUpdating] = useState(false)

  // Fetch cart with items
  const { data: cart, refetch } = Api.cart.findFirst.useQuery({
    where: { userId: user?.id, status: 'ACTIVE' },
    include: {
      cartItems: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  // Mutations
  const { mutateAsync: updateCartItem } = Api.cartItem.update.useMutation()
  const { mutateAsync: deleteCartItem } = Api.cartItem.delete.useMutation()

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    try {
      setUpdating(true)
      await updateCartItem({
        where: { id: itemId },
        data: { quantity },
      })
      await refetch()
      enqueueSnackbar('Cart updated successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to update cart', { variant: 'error' })
    } finally {
      setUpdating(false)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      setUpdating(true)
      await deleteCartItem({ where: { id: itemId } })
      await refetch()
      enqueueSnackbar('Item removed from cart', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to remove item', { variant: 'error' })
    } finally {
      setUpdating(false)
    }
  }

  const calculateTotal = () => {
    if (!cart?.cartItems) return 0
    return cart.cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity
    }, 0)
  }

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product: any) => (
        <Space>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: 50, height: 50, objectFit: 'cover' }}
            />
          )}
          <Text>{product.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Variant',
      dataIndex: 'variant',
      key: 'variant',
      render: (variant: any) => variant?.value || 'N/A',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `$${price}`,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (record: any) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={value => handleQuantityChange(record.id, value || 1)}
          disabled={updating}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id)}
          disabled={updating}
        >
          Remove
        </Button>
      ),
    },
  ]

  return (
    <PageLayout layout="narrow">
      <Title level={2}>
        <ShoppingCartOutlined /> Shopping Cart
      </Title>
      <Text type="secondary">
        Review and modify your cart items before checkout
      </Text>

      {cart?.cartItems && cart.cartItems.length > 0 ? (
        <>
          <Table
            dataSource={cart.cartItems}
            columns={columns}
            rowKey="id"
            pagination={false}
            style={{ marginTop: 24 }}
          />

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Text strong style={{ fontSize: 18 }}>
              Total (including tax): ${calculateTotal().toFixed(2)}
            </Text>
            <br />
            <Button
              type="primary"
              size="large"
              onClick={() => router.push('/checkout')}
              style={{ marginTop: 16 }}
              disabled={updating}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      ) : (
        <Empty description="Your cart is empty" style={{ marginTop: 48 }}>
          <Button type="primary" onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </Empty>
      )}
    </PageLayout>
  )
}
