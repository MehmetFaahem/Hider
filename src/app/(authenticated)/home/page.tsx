'use client'

import {
  Typography,
  Input,
  Select,
  Card,
  Row,
  Col,
  Badge,
  Space,
  Button,
} from 'antd'
import {
  ShoppingCartOutlined,
  FireOutlined,
  TagOutlined,
  SearchOutlined,
} from '@ant-design/icons'
const { Title, Text } = Typography
const { Search } = Input
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function HomePage() {
  const router = useRouter()
  const params = useParams<any>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  // Fetch featured products
  const { data: featuredProducts } = Api.product.findMany.useQuery({
    where: { featured: true },
    take: 4,
  })

  // Fetch trending products (based on stock < 10 as an example)
  const { data: trendingProducts } = Api.product.findMany.useQuery({
    where: { stock: { lt: 10 } },
    take: 4,
  })

  // Handle product search
  const onSearch = (value: string) => {
    router.push(`/products?search=${value}`)
  }

  // Handle category selection
  const onCategoryChange = (value: string) => {
    router.push(`/products?category=${value}`)
  }

  // Handle product click
  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  return (
    <PageLayout layout="narrow">
      <div style={{ padding: '20px' }}>
        <Title level={1}>Welcome to Our Store</Title>
        <Text>Discover amazing products at great prices</Text>

        {/* Search and Filter Section */}
        <div style={{ marginTop: '24px', marginBottom: '32px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={16}>
              <Search
                placeholder="Search products..."
                onSearch={onSearch}
                enterButton={<SearchOutlined />}
                size="large"
              />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Select Category"
                style={{ width: '100%' }}
                onChange={onCategoryChange}
                size="large"
              >
                <Select.Option value="electronics">Electronics</Select.Option>
                <Select.Option value="clothing">Clothing</Select.Option>
                <Select.Option value="books">Books</Select.Option>
              </Select>
            </Col>
          </Row>
        </div>

        {/* Featured Products Section */}
        <Title level={2}>
          <TagOutlined /> Featured Products
        </Title>
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          {featuredProducts?.map(product => (
            <Col xs={24} sm={12} md={6} key={product.id}>
              <Badge.Ribbon text="Featured" color="gold">
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
                  onClick={() => handleProductClick(product.id)}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <Space direction="vertical">
                        <Text>${product.price}</Text>
                        <Text type="secondary">
                          Stock: {product.stock.toString()}
                        </Text>
                      </Space>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>

        {/* Trending Items Section */}
        <Title level={2}>
          <FireOutlined /> Trending Items
        </Title>
        <Row gutter={[16, 16]}>
          {trendingProducts?.map(product => (
            <Col xs={24} sm={12} md={6} key={product.id}>
              <Badge.Ribbon text="Hot" color="red">
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
                  onClick={() => handleProductClick(product.id)}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <Space direction="vertical">
                        <Text>${product.price}</Text>
                        <Text type="secondary">
                          Only {product.stock.toString()} left!
                        </Text>
                      </Space>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>

        {/* Shopping Cart Button */}
        <Button
          type="primary"
          size="large"
          icon={<ShoppingCartOutlined />}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
          }}
          onClick={() => router.push('/cart')}
        />
      </div>
    </PageLayout>
  )
}
