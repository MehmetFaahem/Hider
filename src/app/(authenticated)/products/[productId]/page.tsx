'use client'

import {
  Typography,
  Card,
  Image,
  Select,
  InputNumber,
  Button,
  Descriptions,
  Space,
  Row,
  Col,
} from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { Prisma } from '@prisma/client'
const { Title, Paragraph } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams<{ productId: string }>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)

  // Fetch product with variants
  const { data: product } = Api.product.findFirst.useQuery({
    where: { id: params.productId },
    include: { variants: true },
  })

  // Fetch or create user cart
  const { data: cart, refetch: refetchCart } = Api.cart.findFirst.useQuery({
    where: { userId: user?.id, status: 'ACTIVE' },
  })

  const { mutateAsync: createCart } = Api.cart.create.useMutation()
  const { mutateAsync: addToCart } = Api.cartItem.create.useMutation()

  const handleAddToCart = async () => {
    try {
      if (!user) {
        enqueueSnackbar('Please login to add items to cart', {
          variant: 'error',
        })
        return
      }

      if (!selectedVariant && product?.variants?.length > 0) {
        enqueueSnackbar('Please select a variant', { variant: 'error' })
        return
      }

      let cartId = cart?.id

      if (!cartId) {
        const newCart = await createCart({
          data: {
            userId: user.id,
            status: 'ACTIVE',
          },
        })
        cartId = newCart.id
      }

      await addToCart({
        data: {
          cartId,
          productId: product!.id,
          variantId: selectedVariant || undefined,
          quantity,
          price: product!.price,
        },
      })

      await refetchCart()
      enqueueSnackbar('Product added to cart', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to add product to cart', { variant: 'error' })
    }
  }

  if (!product) return null

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Product Details</Title>
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                }}
              />
            )}
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={3}>{product.name}</Title>
              <Paragraph>{product.description}</Paragraph>

              <Descriptions bordered column={1}>
                <Descriptions.Item label="Price">
                  ${product.price}
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  {product.category || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Stock">
                  {product.stock.toString()}
                </Descriptions.Item>
              </Descriptions>

              {product.variants && product.variants.length > 0 && (
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select variant"
                  onChange={value => setSelectedVariant(value)}
                >
                  {product.variants.map(variant => (
                    <Select.Option key={variant.id} value={variant.id}>
                      {variant.type}: {variant.value} (Stock:{' '}
                      {variant.stock.toString()})
                    </Select.Option>
                  ))}
                </Select>
              )}

              <Space>
                <InputNumber
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={value => setQuantity(value || 1)}
                />
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>
    </PageLayout>
  )
}
