'use client'

import {
  Table,
  Input,
  Select,
  Space,
  Button,
  Typography,
  Modal,
  Tag,
} from 'antd'
import {
  SearchOutlined,
  UserOutlined,
  HistoryOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { Prisma } from '@prisma/client'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function AdminUsersPage() {
  const router = useRouter()
  const params = useParams<any>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isOrderHistoryVisible, setIsOrderHistoryVisible] = useState(false)

  // Fetch users with their orders included
  const { data: users, refetch } = Api.user.findMany.useQuery({
    include: {
      orders: true,
    },
  })

  // Fetch orders for selected user
  const { data: selectedUserOrders } = Api.order.findMany.useQuery(
    {
      where: {
        userId: selectedUser || '',
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    },
    {
      enabled: !!selectedUser,
    },
  )

  // Update user role mutation
  const { mutateAsync: updateUser } = Api.user.update.useMutation()

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUser({
        where: { id: userId },
        data: { globalRole: newRole },
      })
      enqueueSnackbar('User role updated successfully', { variant: 'success' })
      refetch()
    } catch (error) {
      enqueueSnackbar('Failed to update user role', { variant: 'error' })
    }
  }

  const filteredUsers = users?.filter(user => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = !statusFilter || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'VERIFIED' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'globalRole',
      key: 'globalRole',
      render: (role: string, record: any) => (
        <Select
          defaultValue={role}
          style={{ width: 120 }}
          onChange={value => handleRoleChange(record.id, value)}
          options={[
            { value: 'USER', label: 'User' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          icon={<HistoryOutlined />}
          onClick={() => {
            setSelectedUser(record.id)
            setIsOrderHistoryVisible(true)
          }}
        >
          Order History
        </Button>
      ),
    },
  ]

  return (
    <PageLayout layout="narrow">
      <Title level={2}>
        <UserOutlined /> User Management
      </Title>
      <Text>Manage users, their roles, and view their order history.</Text>

      <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
        <Space>
          <Input
            placeholder="Search by name or email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 200 }}
            allowClear
            onChange={setStatusFilter}
            options={[
              { value: 'VERIFIED', label: 'Verified' },
              { value: 'INVITED', label: 'Invited' },
            ]}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title="Order History"
          open={isOrderHistoryVisible}
          onCancel={() => setIsOrderHistoryVisible(false)}
          footer={null}
          width={800}
        >
          <Table
            dataSource={selectedUserOrders}
            columns={[
              {
                title: 'Order ID',
                dataIndex: 'id',
                key: 'id',
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => (
                  <Tag color={status === 'COMPLETED' ? 'green' : 'blue'}>
                    {status}
                  </Tag>
                ),
              },
              {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
              },
              {
                title: 'Date',
                dataIndex: 'createdAt',
                key: 'createdAt',
                render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
              },
            ]}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Modal>
      </Space>
    </PageLayout>
  )
}
