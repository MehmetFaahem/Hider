'use client'

import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Typography,
  Space,
  Upload,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
import { Prisma } from '@prisma/client'
const { Title, Text } = Typography
type ProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: true }
}>
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function AdminProductsPage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] =
    useState<ProductWithVariants | null>(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { mutateAsync: upload } = useUploadPublic()

  const { data: products, refetch } = Api.product.findMany.useQuery({
    include: { variants: true },
  })

  const createProduct = Api.product.create.useMutation()
  const updateProduct = Api.product.update.useMutation()
  const deleteProduct = Api.product.delete.useMutation()

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync({ where: { id } })
      enqueueSnackbar('Product deleted successfully', { variant: 'success' })
      refetch()
    } catch (error) {
      enqueueSnackbar('Error deleting product', { variant: 'error' })
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      let imageUrl = editingProduct?.imageUrl
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadResult = await upload({ file: fileList[0].originFileObj })
        imageUrl = uploadResult.url
      }

      const productData = {
        name: values.name,
        description: values.description,
        price: values.price.toString(),
        stock: values.stock,
        category: values.category,
        status: values.status,
        featured: false,
        imageUrl,
      }

      if (editingProduct) {
        await updateProduct.mutateAsync({
          where: { id: editingProduct.id },
          data: productData,
        })
        enqueueSnackbar('Product updated successfully', { variant: 'success' })
      } else {
        await createProduct.mutateAsync({ data: productData })
        enqueueSnackbar('Product created successfully', { variant: 'success' })
      }

      setIsModalVisible(false)
      form.resetFields()
      setFileList([])
      setEditingProduct(null)
      refetch()
    } catch (error) {
      enqueueSnackbar('Error saving product', { variant: 'error' })
    }
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) =>
        imageUrl ? (
          <img src={imageUrl} alt="Product" style={{ width: 50 }} />
        ) : (
          '-'
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => stock.toString(),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ProductWithVariants) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record)
              form.setFieldsValue(record)
              if (record.imageUrl) {
                setFileList([
                  {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: record.imageUrl,
                  },
                ])
              }
              setIsModalVisible(true)
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <PageLayout layout="narrow">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={2}>Products Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null)
              form.resetFields()
              setFileList([])
              setIsModalVisible(true)
            }}
          >
            Add Product
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Image">
              <Upload
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={createProduct.isLoading || updateProduct.isLoading}
              >
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </PageLayout>
  )
}
