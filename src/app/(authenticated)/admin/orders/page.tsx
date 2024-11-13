'use client'

import {
  Table,
  Typography,
  Button,
  Space,
  Modal,
  Tag,
  Descriptions,
  Select,
} from 'antd'
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import type { Prisma } from '@prisma/client'
const { Title, Text } = Typography
type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: true
    orderItems: {
      include: {
        product: true
        variant: true
      }
    }
  }
}>
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function AdminOrdersPage() {
  const router = useRouter()
  const params = useParams<any>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [selectedOrder, setSelectedOrder] = useState<OrderWithRelations | null>(
    null,
  )
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { data: orders, refetch } = Api.order.findMany.useQuery({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  const { mutateAsync: updateOrder } = Api.order.update.useMutation()

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder({
        where: { id: orderId },
        data: { status: newStatus },
      })
      enqueueSnackbar('Order status updated successfully', {
        variant: 'success',
      })
      refetch()
    } catch (error) {
      enqueueSnackbar('Failed to update order status', { variant: 'error' })
    }
  }

  const handleRefund = async (orderId: string) => {
    try {
      await updateOrder({
        where: { id: orderId },
        data: { status: 'REFUNDED' },
      })
      enqueueSnackbar('Order refunded successfully', { variant: 'success' })
      refetch()
      setIsModalVisible(false)
    } catch (error) {
      enqueueSnackbar('Failed to process refund', { variant: 'error' })
    }
  }

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text copyable>{text}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user?.name || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: OrderWithRelations) => (
        <Select
          value={status}
          onChange={value => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="PROCESSING">Processing</Select.Option>
          <Select.Option value="SHIPPED">Shipped</Select.Option>
          <Select.Option value="DELIVERED">Delivered</Select.Option>
          <Select.Option value="CANCELLED">Cancelled</Select.Option>
          <Select.Option value="REFUNDED">Refunded</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: string) => <Text strong>${total}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: OrderWithRelations) => (
        <Space>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => {
              setSelectedOrder(record)
              setIsModalVisible(true)
            }}
          >
            Details
          </Button>
          {record.status !== 'REFUNDED' && (
            <Button
              danger
              icon={<DollarOutlined />}
              onClick={() => handleRefund(record.id)}
            >
              Refund
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <PageLayout layout="narrow">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Title level={2}>Order Management</Title>
        <Text>View and manage all customer orders</Text>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title="Order Details"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedOrder && (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Descriptions title="Customer Information" bordered>
                <Descriptions.Item label="Name">
                  {selectedOrder.user?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedOrder.user?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Shipping Address">
                  {selectedOrder.shippingAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  {selectedOrder.paymentMethod}
                </Descriptions.Item>
              </Descriptions>

              <Table
                title={() => 'Order Items'}
                dataSource={selectedOrder.orderItems}
                rowKey="id"
                pagination={false}
                columns={[
                  {
                    title: 'Product',
                    dataIndex: 'product',
                    key: 'product',
                    render: product => product?.name,
                  },
                  {
                    title: 'Variant',
                    dataIndex: 'variant',
                    key: 'variant',
                    render: variant => variant?.value || 'N/A',
                  },
                  {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    key: 'quantity',
                  },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                    key: 'price',
                    render: price => `$${price}`,
                  },
                ]}
              />
            </Space>
          )}
        </Modal>
      </Space>
    </PageLayout>
  )
}
