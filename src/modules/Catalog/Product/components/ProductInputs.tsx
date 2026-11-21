import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  theme,
  Tooltip,
  Typography,
  type FormInstance,
} from 'antd';
import {
  AppstoreOutlined,
  BarcodeOutlined,
  DeleteOutlined,
  DollarOutlined,
  FileTextOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import {
  FormFileUpload,
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import FormRichText from '../../../../common/Form/FormRichText';
import FromSubmit from '../../../../common/Button/FromSubmit';
import { SelectBrand, SelectCategory } from '../../../../common/SelectWithApi/Select';
import type { ICreateProduct } from '../types/productTypes';

type Props = {
  onFinish: (values: ICreateProduct) => void;
  loading: boolean;
  form: FormInstance<ICreateProduct>;
  editMode?: boolean;
};

const ProductInputs = ({ onFinish, loading, form, editMode }: Props) => {
  const { token } = theme.useToken();
  const hasVariants = Form.useWatch('has_variants', form);

  const cardStyle = {
    marginBottom: 20,
    borderRadius: 10,
    background: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}`,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
  };

  const headStyle = {
    background: token.colorFillAlter,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: '10px 10px 0 0',
    padding: '10px 16px',
    minHeight: 'auto',
  };

  return (
    <Form<ICreateProduct>
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={{
        status: 'ACTIVE',
        product_type: 'STANDARD',
        tracking_type: 'NONE',
        tax_type: 'INCLUSIVE',
        unit: 'PCS',
        allow_fractional_qty: false,
        base_price: 0,
        mrp: 0,
        wholesale_price: 0,
        min_selling_price: 0,
        vat_rate: 0,
        alert_quantity: 5,
        has_warranty: false,
        warranty_days: 0,
        is_featured: false,
        is_pos_favorite: false,
        pos_display_order: 0,
        has_variants: false,
      }}
    >
      <Card
        size='small'
        styles={{ header: headStyle }}
        style={cardStyle}
        title={
          <Flex align='center' gap={8}>
            <AppstoreOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
            <Typography.Text strong style={{ fontSize: 14 }}>
              General Information
            </Typography.Text>
          </Flex>
        }
      >
        <Row gutter={[16, 0]}>
          <FormInputText
            name='title'
            label='Product Title'
            placeholder='Enter product title'
            required
            xs={24}
            sm={12}
            md={12}
            lg={8}
          />
          <FormInputText
            name='short_code'
            label='Short Code'
            placeholder='e.g. PRD-001'
            xs={24}
            sm={12}
            md={12}
            lg={4}
          />
          <FormInputSelect
            name='product_type'
            label='Product Type'
            xs={24}
            sm={12}
            md={12}
            lg={4}
            options={[
              { label: 'Standard', value: 'STANDARD' },
              { label: 'Service', value: 'SERVICE' },
              { label: 'Combo', value: 'COMBO' },
            ]}
          />
          <SelectCategory
            name='category_id'
            label='Category'
            placeholder='Select category'
            required={false}
            xs={24}
            sm={12}
            md={12}
            lg={4}
          />
          <SelectBrand
            name='brand_id'
            label='Brand'
            placeholder='Select brand'
            required={false}
            xs={24}
            sm={12}
            md={12}
            lg={4}
          />
          <FormInputSelect
            name='status'
            label='Status'
            xs={24}
            sm={12}
            md={12}
            lg={4}
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Archived', value: 'ARCHIVED' },
            ]}
          />
        </Row>
      </Card>

      <Card
        size='small'
        styles={{ header: headStyle }}
        style={cardStyle}
        title={
          <Flex align='center' gap={8}>
            <DollarOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
            <Typography.Text strong style={{ fontSize: 14 }}>
              Pricing & Taxation
            </Typography.Text>
          </Flex>
        }
      >
        <Row gutter={[16, 0]}>
          <FormInputNumber
            name='purchase_price'
            label='Purchase Price (৳)'
            placeholder='0.00'
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputNumber
            name='base_price'
            label='Base / Selling Price (৳)'
            placeholder='0.00'
            required
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputNumber
            name='mrp'
            label='MRP (৳)'
            placeholder='0.00'
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputNumber
            name='wholesale_price'
            label='Wholesale Price (৳)'
            placeholder='0.00'
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputNumber
            name='min_selling_price'
            label='Min Selling Price (৳)'
            placeholder='0.00'
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputNumber
            name='special_price'
            label='Special / Sale Price (৳)'
            placeholder='0.00'
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputDate
            name='special_price_start'
            label='Special Price Start'
            placeholder='Select start date & time'
            showTime
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputDate
            name='special_price_end'
            label='Special Price End'
            placeholder='Select end date & time'
            showTime
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputNumber
            name='vat_rate'
            label='VAT Rate (%)'
            placeholder='0.00'
            min={0}
            max={100}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputSelect
            name='tax_type'
            label='Tax Type'
            xs={24}
            sm={12}
            md={12}
            lg={6}
            options={[
              { label: 'Inclusive', value: 'INCLUSIVE' },
              { label: 'Exclusive', value: 'EXCLUSIVE' },
            ]}
          />
        </Row>
      </Card>

      <Card
        size='small'
        styles={{ header: headStyle }}
        style={cardStyle}
        title={
          <Flex align='center' gap={8}>
            <InboxOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
            <Typography.Text strong style={{ fontSize: 14 }}>
              Inventory, Units & Tracking
            </Typography.Text>
          </Flex>
        }
      >
        <Row gutter={[16, 0]}>
          <FormInputSelect
            name='unit'
            label='Base Unit'
            xs={24}
            sm={12}
            md={12}
            lg={6}
            options={[
              { label: 'Pieces (PCS)', value: 'PCS' },
              { label: 'Kilogram (KG)', value: 'KG' },
              { label: 'Gram (GRAM)', value: 'GRAM' },
              { label: 'Liter (LITER)', value: 'LITER' },
              { label: 'Box (BOX)', value: 'BOX' },
              { label: 'Carton (CARTON)', value: 'CARTON' },
              { label: 'Dozen (DOZEN)', value: 'DOZEN' },
              { label: 'Meter (METER)', value: 'METER' },
              { label: 'Pair (PAIR)', value: 'PAIR' },
              { label: 'Pack (PACK)', value: 'PACK' },
              { label: 'Set (SET)', value: 'SET' },
              { label: 'Roll (ROLL)', value: 'ROLL' },
              { label: 'Bundle (BUNDLE)', value: 'BUNDLE' },
            ]}
          />
          <FormInputSelect
            name='allow_fractional_qty'
            label='Allow Fractional Qty'
            xs={24}
            sm={12}
            md={12}
            lg={6}
            options={[
              { label: 'No', value: false },
              { label: 'Yes', value: true },
            ]}
          />
          <FormInputSelect
            name='tracking_type'
            label='Tracking Type'
            xs={24}
            sm={12}
            md={12}
            lg={6}
            options={[
              { label: 'None (Standard)', value: 'NONE' },
              { label: 'Serial / IMEI Tracking', value: 'SERIAL' },
              { label: 'Batch / Lot Tracking', value: 'BATCH' },
            ]}
          />
          <FormInputNumber
            name='alert_quantity'
            label='Low Stock Alert Qty'
            placeholder='5'
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputText
            name='sku'
            label='SKU'
            placeholder='e.g. SKU-PROD-001 (auto if empty)'
            required={false}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputText
            name='barcode'
            label='Barcode / UPC'
            placeholder='Enter barcode'
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputNumber
            name='weight_grams'
            label='Weight (grams)'
            placeholder='0'
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
        </Row>
      </Card>

      <Card
        size='small'
        styles={{ header: headStyle }}
        style={cardStyle}
        title={
          <Flex align='center' gap={8}>
            <SafetyCertificateOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
            <Typography.Text strong style={{ fontSize: 14 }}>
              Warranty, POS & Options
            </Typography.Text>
          </Flex>
        }
      >
        <Row gutter={[16, 0]}>
          <FormInputSelect
            name='has_warranty'
            label='Has Warranty'
            xs={24}
            sm={12}
            md={12}
            lg={6}
            options={[
              { label: 'No', value: false },
              { label: 'Yes', value: true },
            ]}
          />
          <FormInputNumber
            name='warranty_days'
            label='Warranty Days'
            placeholder='0'
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputSelect
            name='is_pos_favorite'
            label='POS Favorite'
            xs={24}
            sm={12}
            md={12}
            lg={6}
            options={[
              { label: 'No', value: false },
              { label: 'Yes', value: true },
            ]}
          />
          <FormInputNumber
            name='pos_display_order'
            label='POS Display Order'
            placeholder='0'
            min={0}
            xs={24}
            sm={12}
            md={12}
            lg={6}
          />
          <FormInputSelect
            name='is_featured'
            label='Featured Product'
            xs={24}
            sm={12}
            md={12}
            lg={6}
            options={[
              { label: 'No', value: false },
              { label: 'Yes', value: true },
            ]}
          />
          <FormInputSelect
            name='has_variants'
            label='Has Variants'
            xs={24}
            sm={12}
            md={12}
            lg={6}
            options={[
              { label: 'No (Single Product)', value: false },
              { label: 'Yes (Multiple Variants)', value: true },
            ]}
          />
          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item name='tags' label='Tags' layout='vertical'>
              <Select
                mode='tags'
                placeholder='Add search tags'
                style={{ width: '100%' }}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card
        size='small'
        styles={{ header: headStyle }}
        style={cardStyle}
        title={
          <Flex align='center' gap={8}>
            <FileTextOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
            <Typography.Text strong style={{ fontSize: 14 }}>
              Descriptions
            </Typography.Text>
          </Flex>
        }
      >
        <Row gutter={[16, 0]}>
          <FormInputTextArea
            name='short_description'
            label='Short Description'
            placeholder='Brief summary for product listing'
            rows={2}
            md={24}
            lg={24}
          />
          <FormRichText
            name='description'
            label='Full Description'
            placeholder='Write detailed product specifications, highlights, and information...'
            md={24}
            lg={24}
          />
        </Row>
      </Card>

      {hasVariants && (
        <Form.List name='variants'>
          {(fields, { add, remove }) => (
            <Card
              size='small'
              styles={{ header: headStyle }}
              style={cardStyle}
              title={
                <Flex align='center' gap={8}>
                  <TagsOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
                  <Typography.Text strong style={{ fontSize: 14 }}>
                    Product Variants
                  </Typography.Text>
                  <Badge
                    count={fields.length}
                    showZero
                    style={{
                      backgroundColor:
                        fields.length > 0 ? token.colorPrimary : token.colorTextQuaternary,
                    }}
                  />
                </Flex>
              }
              extra={
                fields.length > 0 ? (
                  <Button
                    type='primary'
                    ghost
                    size='small'
                    icon={<PlusOutlined />}
                    onClick={() => {
                      const basePrice = form.getFieldValue('base_price') || 0;
                      const mrpVal = form.getFieldValue('mrp') || 0;
                      const productSku = form.getFieldValue('sku') || 'SKU';
                      add({
                        variant_name: '',
                        sku: `${productSku}-V${fields.length + 1}`,
                        price: Number(basePrice),
                        mrp: Number(mrpVal),
                        wholesale_price: 0,
                        min_selling_price: 0,
                        is_active: true,
                        attributes_json: {},
                      });
                    }}
                  >
                    Add Variant
                  </Button>
                ) : (
                  <Typography.Text type='secondary' style={{ fontSize: 12 }}>
                    Set up pricing and SKU for each variant
                  </Typography.Text>
                )
              }
            >
              {fields.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Typography.Text type='secondary'>
                      No variants added yet. Click below to add your first variant.
                    </Typography.Text>
                  }
                  style={{ padding: '24px 0' }}
                >
                  <Button
                    type='primary'
                    ghost
                    icon={<PlusOutlined />}
                    onClick={() => {
                      const basePrice = form.getFieldValue('base_price') || 0;
                      const mrpVal = form.getFieldValue('mrp') || 0;
                      const productSku = form.getFieldValue('sku') || 'SKU';
                      add({
                        variant_name: '',
                        sku: `${productSku}-V1`,
                        price: Number(basePrice),
                        mrp: Number(mrpVal),
                        wholesale_price: 0,
                        min_selling_price: 0,
                        is_active: true,
                        attributes_json: {},
                      });
                    }}
                  >
                    Add First Variant
                  </Button>
                </Empty>
              ) : (
                <div>
                  <div
                    style={{
                      overflowX: 'auto',
                      borderRadius: 6,
                      border: `1px solid ${token.colorBorderSecondary}`,
                    }}
                  >
                    <div style={{ minWidth: 1200 }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            '40px minmax(130px, 1.4fr) minmax(110px, 1.1fr) minmax(90px, 0.9fr) minmax(90px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(90px, 0.8fr) 40px',
                          gap: 8,
                          alignItems: 'center',
                          padding: '10px 12px',
                          backgroundColor: token.colorFillAlter,
                          borderBottom: `1px solid ${token.colorBorderSecondary}`,
                          fontSize: 12,
                          fontWeight: 600,
                          color: token.colorTextSecondary,
                          letterSpacing: '0.3px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>#</div>
                        <div>Variant Name *</div>
                        <div>SKU *</div>
                        <div>Short Code</div>
                        <div>Barcode</div>
                        <div>Purchase Price</div>
                        <div>Price *</div>
                        <div>MRP</div>
                        <div>Wholesale</div>
                        <div>Min Price</div>
                        <div>Special Price</div>
                        <div>Status</div>
                        <div style={{ textAlign: 'center' }}>Action</div>
                      </div>

                      {fields.map(({ key, name, ...restField }, index) => (
                        <div
                          key={key}
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              '40px minmax(130px, 1.4fr) minmax(110px, 1.1fr) minmax(90px, 0.9fr) minmax(90px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(95px, 0.9fr) minmax(90px, 0.8fr) 40px',
                            gap: 8,
                            alignItems: 'center',
                            padding: '8px 12px',
                            borderBottom:
                              index < fields.length - 1
                                ? `1px solid ${token.colorBorderSecondary}`
                                : 'none',
                            background:
                              index % 2 === 0
                                ? token.colorBgContainer
                                : token.colorFillQuaternary,
                          }}
                        >
                          <div style={{ textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: 22,
                                height: 22,
                                lineHeight: '22px',
                                borderRadius: '50%',
                                backgroundColor: token.colorFillSecondary,
                                fontSize: 11,
                                fontWeight: 600,
                                color: token.colorTextSecondary,
                              }}
                            >
                              {index + 1}
                            </span>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'variant_name']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Variant name is required',
                                },
                              ]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input
                                placeholder='e.g. Red, XL, 500g'
                                prefix={
                                  <TagsOutlined
                                    style={{ color: token.colorTextQuaternary }}
                                  />
                                }
                              />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'sku']}
                              rules={[
                                {
                                  required: true,
                                  message: 'SKU is required',
                                },
                              ]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input
                                placeholder='SKU-VAR-001'
                                prefix={
                                  <BarcodeOutlined
                                    style={{ color: token.colorTextQuaternary }}
                                  />
                                }
                              />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'short_code']}
                              style={{ marginBottom: 0 }}
                            >
                              <Input placeholder='Code' />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'barcode']}
                              style={{ marginBottom: 0 }}
                            >
                              <Input placeholder='Barcode' />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'purchase_price']}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='0.00'
                                style={{ width: '100%' }}
                                prefix='৳'
                              />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'price']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Price is required',
                                },
                              ]}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='0.00'
                                style={{ width: '100%' }}
                                prefix='৳'
                              />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'mrp']}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='0.00'
                                style={{ width: '100%' }}
                                prefix='৳'
                              />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'wholesale_price']}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='0.00'
                                style={{ width: '100%' }}
                                prefix='৳'
                              />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'min_selling_price']}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='0.00'
                                style={{ width: '100%' }}
                                prefix='৳'
                              />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'special_price']}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                min={0}
                                placeholder='0.00'
                                style={{ width: '100%' }}
                                prefix='৳'
                              />
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              {...restField}
                              name={[name, 'is_active']}
                              initialValue={true}
                              style={{ marginBottom: 0 }}
                            >
                              <Select
                                style={{ width: '100%' }}
                                options={[
                                  {
                                    label: (
                                      <span
                                        style={{
                                          color: '#16a34a',
                                          fontWeight: 500,
                                        }}
                                      >
                                        ● Active
                                      </span>
                                    ),
                                    value: true,
                                  },
                                  {
                                    label: (
                                      <span
                                        style={{
                                          color: '#dc2626',
                                          fontWeight: 500,
                                        }}
                                      >
                                        ● Inactive
                                      </span>
                                    ),
                                    value: false,
                                  },
                                ]}
                              />
                            </Form.Item>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <Tooltip title='Remove Variant'>
                              <Button
                                type='text'
                                danger
                                shape='circle'
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type='dashed'
                    onClick={() => {
                      const basePrice = form.getFieldValue('base_price') || 0;
                      const mrpVal = form.getFieldValue('mrp') || 0;
                      const productSku = form.getFieldValue('sku') || 'SKU';
                      add({
                        variant_name: '',
                        sku: `${productSku}-V${fields.length + 1}`,
                        price: Number(basePrice),
                        mrp: Number(mrpVal),
                        wholesale_price: 0,
                        min_selling_price: 0,
                        is_active: true,
                        attributes_json: {},
                      });
                    }}
                    block
                    icon={<PlusOutlined />}
                    style={{
                      marginTop: 12,
                      height: 38,
                      borderRadius: 6,
                      fontWeight: 500,
                    }}
                  >
                    Add Another Variant
                  </Button>
                </div>
              )}
            </Card>
          )}
        </Form.List>
      )}

      <Card
        size='small'
        styles={{ header: headStyle }}
        style={cardStyle}
        title={
          <Flex align='center' gap={8}>
            <PictureOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
            <Typography.Text strong style={{ fontSize: 14 }}>
              Product Media & Images
            </Typography.Text>
          </Flex>
        }
      >
        <Row gutter={[16, 0]}>
          <FormFileUpload
            name='upload_thumbnail'
            label='Product Thumbnail (Primary Image)'
            maxCount={1}
            accept='image/*'
            span={24}
            md={8}
            lg={8}
          />
          <FormFileUpload
            name='upload_images'
            label='Gallery Images (Additional Angles)'
            maxCount={8}
            accept='image/*'
            span={24}
            md={16}
            lg={16}
          />
        </Row>
      </Card>

      <FromSubmit
        text={editMode ? 'Update Product' : 'Create Product'}
        loading={loading}
      />
    </Form>
  );
};

export default ProductInputs;
