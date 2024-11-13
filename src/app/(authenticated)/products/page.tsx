'use client'

import {
  Typography,
  Card,
  Row,
  Col,
  Select,
  InputNumber,
  Button,
  Space,
  Empty,
} from 'antd'
import {
  ShoppingCartOutlined,
  FilterOutlined,
  SortAscendingOutlined,
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

export default function ProductsPage() {
  const router = useRouter()
  const params = useParams<any>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  // States for filtering and sorting
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showInStock, setShowInStock] = useState<boolean>(true)
  const [sortBy, setSortBy] = useState<string>('name')

  // Fetch products with relations
  const { data: products } = Api.product.findMany.useQuery({
    include: {
      variants: true,
    },
  })

  // Add to cart mutation
  const { mutateAsync: createCartItem } = Api.cartItem.create.useMutation()
  const { data: cart } = Api.cart.findFirst.useQuery({
    where: { userId: user?.id, status: 'ACTIVE' },
  })

  // Filter products
  const filteredProducts = products
    ?.filter(product => {
      const price = parseFloat(product.price)
      const inStock = product.stock > 0
      return (
        (!selectedCategory || product.category === selectedCategory) &&
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        (!showInStock || inStock)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price)
        case 'stock':
          return b.stock - a.stock
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleAddToCart = async (productId: string) => {
    try {
      if (!user) {
        enqueueSnackbar('Please login to add items to cart', {
          variant: 'info',
        })
        return
      }

      await createCartItem({
        data: {
          quantity: 1,
          price: products?.find(p => p.id === productId)?.price || '0',
          cart: { connect: { id: cart?.id } },
          product: { connect: { id: productId } },
        },
      })
      enqueueSnackbar('Product added to cart', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to add product to cart', { variant: 'error' })
    }
  }

  const categories = [
    ...new Set(products?.map(p => p.category).filter(Boolean)),
  ]

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Our Products</Title>
      <Text>Discover our amazing collection of products</Text>

      <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
        <Card>
          <Space wrap>
            <Select
              style={{ width: 200 }}
              placeholder="Select Category"
              allowClear
              onChange={setSelectedCategory}
              value={selectedCategory}
            >
              {categories?.map(category => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>

            <Space>
              <Text>Price Range:</Text>
              <InputNumber
                min={0}
                value={priceRange[0]}
                onChange={value => setPriceRange([value || 0, priceRange[1]])}
              />
              <Text>to</Text>
              <InputNumber
                min={0}
                value={priceRange[1]}
                onChange={value => setPriceRange([priceRange[0], value || 0])}
              />
            </Space>

            <Select
              style={{ width: 150 }}
              placeholder="Sort By"
              onChange={setSortBy}
              value={sortBy}
              suffixIcon={<SortAscendingOutlined />}
            >
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="price">Price</Select.Option>
              <Select.Option value="stock">Stock</Select.Option>
            </Select>

            <Button
              type={showInStock ? 'primary' : 'default'}
              onClick={() => setShowInStock(!showInStock)}
              icon={<FilterOutlined />}
            >
              In Stock Only
            </Button>
          </Space>
        </Card>

        {filteredProducts?.length === 0 ? (
          <Empty description="No products found" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredProducts?.map(product => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={
                        product.imageUrl || 'https://placeholder.com/300x200'
                      }
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Button
                      key="add"
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock <= 0}
                    >
                      Add to Cart
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <>
                        <Text strong>${product.price}</Text>
                        <br />
                        <Text type={product.stock > 0 ? 'success' : 'danger'}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </Text>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Space>
    </PageLayout>
  )
}
