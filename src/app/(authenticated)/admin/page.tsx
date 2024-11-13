'use client'

import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Space,
  Button,
} from 'antd'
import {
  ShoppingCartOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  // Fetch key metrics
  const { data: products } = Api.product.findMany.useQuery({})
  const { data: orders } = Api.order.findMany.useQuery({
    include: { orderItems: true, user: true },
    orderBy: { createdAt: 'desc' },
  })
  const { data: users } = Api.user.findMany.useQuery({})

  // Calculate metrics
  const totalRevenue =
    orders?.reduce((acc, order) => acc + parseFloat(order.total), 0) || 0
  const lowStockProducts = products?.filter(product => product.stock < 10) || []
  const recentOrders = orders?.slice(0, 5) || []

  // Recent orders columns
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text ellipsis>{text}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => <Text>{user?.name || 'Unknown'}</Text>,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: string) => <Text>${total}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => <Text>{dayjs(date).format('MMM D, YYYY')}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Admin Dashboard</Title>
      <Text type="secondary">
        Monitor your store's performance and manage operations
      </Text>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={products?.length || 0}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={orders?.length || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={users?.length || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders & Low Stock */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Recent Orders">
            <Table
              dataSource={recentOrders}
              columns={columns}
              pagination={false}
              rowKey="id"
            />
            <Button
              type="link"
              style={{ marginTop: 16 }}
              onClick={() => router.push('/admin/orders')}
            >
              View All Orders
            </Button>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Low Stock Alert">
            {lowStockProducts?.map(product => (
              <Card.Grid style={{ width: '100%' }} key={product.id}>
                <Space>
                  <Text>{product.name}</Text>
                  <Text type="danger">Stock: {product.stock.toString()}</Text>
                </Space>
              </Card.Grid>
            ))}
            <Button
              type="link"
              style={{ marginTop: 16 }}
              onClick={() => router.push('/admin/products')}
            >
              Manage Inventory
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Quick Actions">
            <Space>
              <Button
                type="primary"
                onClick={() => router.push('/admin/products')}
              >
                Manage Products
              </Button>
              <Button onClick={() => router.push('/admin/orders')}>
                View Orders
              </Button>
              <Button onClick={() => router.push('/admin/users')}>
                Manage Users
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
