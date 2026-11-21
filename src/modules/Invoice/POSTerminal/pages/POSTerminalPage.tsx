import {
  BarcodeOutlined,
  ClearOutlined,
  DeleteOutlined,
  DollarOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
  type InputRef,
} from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../../app/hooks/hooks';
import { SelectCustomer } from '../../../../common/SelectWithApi';
import { useGetPOSProductListQuery } from '../api/posTerminalEndpoints';
import POSPaymentModal from '../components/POSPaymentModal';
import POSThermalReceiptModal from '../components/POSThermalReceiptModal';
import type { IPOSCartItem, IPOSCompletedOrder } from '../types/posTerminalTypes';
import type { IProductList } from '../../../Catalog/Product/types/productTypes';

const POSTerminalPage = () => {
  const { selectedBranchId, locationName } = useAppSelector(
    (state) => state.location,
  );

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );
  const [cartItems, setCartItems] = useState<IPOSCartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    number | undefined
  >(undefined);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] =
    useState<IPOSCompletedOrder | null>(null);

  const barcodeInputRef = useRef<InputRef>(null);

  const { data: productData, isLoading: isProductsLoading } =
    useGetPOSProductListQuery({
      search: search || undefined,
      category_id: selectedCategory,
      limit: 100,
    });

  const products: IProductList[] = productData?.data || [];

  const handleAddToCart = useCallback((product: IProductList) => {
    const unitPrice = Number(
      product.base_price || product.mrp || product.wholesale_price || 0,
    );

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product_id === Number(product.id),
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        const existing = next[existingIdx];
        const newQty = existing.quantity + 1;
        const subtotal = newQty * existing.unit_price;
        const total = Math.max(0, subtotal - existing.discount_amount);
        next[existingIdx] = {
          ...existing,
          quantity: newQty,
          subtotal_amount: subtotal,
          total_amount: total,
        };
        return next;
      }

      const newItem: IPOSCartItem = {
        product_id: Number(product.id),
        product_title: product.title,
        sku: product.sku,
        barcode: product.barcode,
        unit_price: unitPrice,
        purchase_price: Number(product.purchase_price || 0),
        quantity: 1,
        discount_amount: 0,
        tax_amount: 0,
        subtotal_amount: unitPrice,
        total_amount: unitPrice,
        image_url: product.primary_image,
      };

      return [newItem, ...prev];
    });
  }, []);

  const handleBarcodeSubmit = (barcode: string) => {
    const trimmed = barcode.trim();
    if (!trimmed) return;

    const matched = products.find(
      (p) =>
        (p.barcode && p.barcode.toLowerCase() === trimmed.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase() === trimmed.toLowerCase()) ||
        (p.short_code && p.short_code.toLowerCase() === trimmed.toLowerCase()),
    );

    if (matched) {
      handleAddToCart(matched);
      setSearch('');
      message.success(`Added: ${matched.title}`);
    } else {
      message.warning(`No product found for barcode: ${trimmed}`);
    }
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product_id === productId) {
            const newQty = Math.max(0, item.quantity + delta);
            const subtotal = newQty * item.unit_price;
            const total = Math.max(0, subtotal - item.discount_amount);
            return {
              ...item,
              quantity: newQty,
              subtotal_amount: subtotal,
              total_amount: total,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setDiscountAmount(0);
    setTaxAmount(0);
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    );
  }, [cartItems]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + taxAmount);
  }, [subtotal, discountAmount, taxAmount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (cartItems.length > 0) {
          setPaymentModalOpen(true);
        } else {
          message.warning('Cart is empty');
        }
      } else if (e.key === 'Escape') {
        setPaymentModalOpen(false);
        setReceiptModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems.length]);

  const handleCheckoutSuccess = (order: IPOSCompletedOrder) => {
    setCompletedOrder(order);
    setPaymentModalOpen(false);
    setReceiptModalOpen(true);
    handleClearCart();
  };

  return (
    <div style={{ padding: 16, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15} xl={16}>
          <Card
            size='small'
            bordered={false}
            style={{ borderRadius: 8, marginBottom: 16 }}
          >
            <Row gutter={[12, 12]} align='middle'>
              <Col xs={24} sm={12} md={10}>
                <Input
                  ref={barcodeInputRef}
                  prefix={<BarcodeOutlined style={{ color: '#1677ff' }} />}
                  placeholder='Scan Barcode or SKU (F2 to focus)...'
                  allowClear
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onPressEnter={(e) =>
                    handleBarcodeSubmit(
                      (e.target as HTMLInputElement).value,
                    )
                  }
                  size='large'
                />
              </Col>
              <Col xs={12} sm={6} md={8}>
                <Select
                  style={{ width: '100%' }}
                  size='large'
                  placeholder='Filter by Category'
                  allowClear
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(val)}
                  options={[
                    { label: 'All Categories', value: undefined },
                  ]}
                />
              </Col>
              <Col xs={12} sm={6} md={6} style={{ textAlign: 'right' }}>
                <Tag color='geekblue' style={{ padding: '6px 12px', fontSize: 13 }}>
                  Branch: {locationName || 'Central'}
                </Tag>
              </Col>
            </Row>
          </Card>

          <Card
            bordered={false}
            loading={isProductsLoading}
            style={{ borderRadius: 8, minHeight: 520 }}
            bodyStyle={{ padding: 12 }}
          >
            {products.length === 0 ? (
              <Empty description='No active products found' />
            ) : (
              <Row gutter={[12, 12]}>
                {products.map((product) => {
                  const price = Number(
                    product.base_price ||
                      product.mrp ||
                      product.wholesale_price ||
                      0,
                  );
                  return (
                    <Col xs={12} sm={8} md={6} xl={4} key={product.id}>
                      <Card
                        hoverable
                        size='small'
                        onClick={() => handleAddToCart(product)}
                        style={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderRadius: 8,
                          textAlign: 'center',
                          border: '1px solid #f0f0f0',
                        }}
                        cover={
                          product.primary_image ? (
                            <img
                              alt={product.title}
                              src={product.primary_image}
                              style={{
                                height: 100,
                                objectFit: 'contain',
                                padding: 8,
                                background: '#fafafa',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                height: 100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f5f5f5',
                                color: '#bfbfbf',
                              }}
                            >
                              <BarcodeOutlined style={{ fontSize: 32 }} />
                            </div>
                          )
                        }
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 12,
                            lineHeight: 1.3,
                            height: 32,
                            overflow: 'hidden',
                            marginBottom: 4,
                          }}
                          title={product.title}
                        >
                          {product.title}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: '#8c8c8c',
                            marginBottom: 4,
                          }}
                        >
                          {product.sku}
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: '#0958d9',
                          }}
                        >
                          ৳{price.toLocaleString()}
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={9} xl={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 8 }}
            bodyStyle={{ padding: 16 }}
            title={
              <Space>
                <ShoppingCartOutlined style={{ color: '#0958d9' }} />
                <span>Current Cart</span>
                <Badge count={cartItems.length} showZero color='#0958d9' />
              </Space>
            }
            extra={
              <Button
                size='small'
                danger
                icon={<ClearOutlined />}
                onClick={handleClearCart}
                disabled={cartItems.length === 0}
              >
                Clear
              </Button>
            }
          >
            <div style={{ marginBottom: 12 }}>
              <SelectCustomer
                name='customer_id'
                label='Customer'
                placeholder='Select Customer (Default: Walk-in)'
                allowClear
                value={selectedCustomerId}
                onChange={(val) =>
                  setSelectedCustomerId(val ? Number(val) : undefined)
                }
              />
            </div>

            <div
              style={{
                maxHeight: 340,
                overflowY: 'auto',
                marginBottom: 16,
              }}
            >
              <Table<IPOSCartItem>
                dataSource={cartItems}
                rowKey='product_id'
                size='small'
                pagination={false}
                columns={[
                  {
                    title: 'Item',
                    key: 'item',
                    render: (_, item) => (
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>
                          {item.product_title}
                        </div>
                        <div style={{ fontSize: 10, color: '#8c8c8c' }}>
                          ৳{item.unit_price} x {item.quantity}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: 'Qty',
                    key: 'qty',
                    width: 100,
                    align: 'center',
                    render: (_, item) => (
                      <Space size={4}>
                        <Button
                          size='small'
                          icon={<MinusOutlined />}
                          onClick={() =>
                            handleUpdateQuantity(item.product_id, -1)
                          }
                        />
                        <span style={{ fontWeight: 600, minWidth: 20 }}>
                          {item.quantity}
                        </span>
                        <Button
                          size='small'
                          icon={<PlusOutlined />}
                          onClick={() =>
                            handleUpdateQuantity(item.product_id, 1)
                          }
                        />
                      </Space>
                    ),
                  },
                  {
                    title: 'Total',
                    key: 'total',
                    width: 75,
                    align: 'right',
                    render: (_, item) => (
                      <strong style={{ fontSize: 12 }}>
                        ৳{item.total_amount.toLocaleString()}
                      </strong>
                    ),
                  },
                  {
                    title: '',
                    key: 'action',
                    width: 36,
                    align: 'center',
                    render: (_, item) => (
                      <Button
                        size='small'
                        type='text'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item.product_id)}
                      />
                    ),
                  },
                ]}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description='Cart is empty. Scan barcode or click products.'
                    />
                  ),
                }}
              />
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div style={{ marginBottom: 12 }}>
              <Row gutter={8} align='middle' style={{ marginBottom: 6 }}>
                <Col span={12}>
                  <span style={{ fontSize: 12, color: '#595959' }}>
                    Subtotal:
                  </span>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <strong>৳{subtotal.toLocaleString()}</strong>
                </Col>
              </Row>

              <Row gutter={8} align='middle' style={{ marginBottom: 6 }}>
                <Col span={12}>
                  <span style={{ fontSize: 12, color: '#595959' }}>
                    Discount (৳):
                  </span>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <InputNumber
                    size='small'
                    min={0}
                    value={discountAmount}
                    onChange={(val) => setDiscountAmount(Number(val || 0))}
                    style={{ width: 110 }}
                  />
                </Col>
              </Row>

              <Row gutter={8} align='middle' style={{ marginBottom: 6 }}>
                <Col span={12}>
                  <span style={{ fontSize: 12, color: '#595959' }}>
                    Tax / VAT (৳):
                  </span>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <InputNumber
                    size='small'
                    min={0}
                    value={taxAmount}
                    onChange={(val) => setTaxAmount(Number(val || 0))}
                    style={{ width: 110 }}
                  />
                </Col>
              </Row>

              <Divider style={{ margin: '8px 0' }} />

              <Row gutter={8} align='middle'>
                <Col span={12}>
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Grand Total:
                  </Typography.Title>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Typography.Title
                    level={3}
                    style={{ margin: 0, color: '#0958d9' }}
                  >
                    ৳{grandTotal.toLocaleString()}
                  </Typography.Title>
                </Col>
              </Row>
            </div>

            <Button
              type='primary'
              size='large'
              block
              disabled={cartItems.length === 0}
              icon={<DollarOutlined />}
              onClick={() => setPaymentModalOpen(true)}
              style={{
                background: '#52c41a',
                borderColor: '#52c41a',
                height: 48,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Pay Now (F4)
            </Button>

            <div
              style={{
                marginTop: 10,
                textAlign: 'center',
                fontSize: 11,
                color: '#8c8c8c',
              }}
            >
              Shortcuts: <strong>F2</strong> (Search/Scan) &nbsp;|&nbsp;{' '}
              <strong>F4</strong> (Checkout) &nbsp;|&nbsp;{' '}
              <strong>Esc</strong> (Close)
            </div>
          </Card>
        </Col>
      </Row>

      <POSPaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        grandTotal={grandTotal}
        subtotal={subtotal}
        discountAmount={discountAmount}
        taxAmount={taxAmount}
        cartItems={cartItems}
        customerId={selectedCustomerId}
        branchId={selectedBranchId ? Number(selectedBranchId) : undefined}
        onSuccess={handleCheckoutSuccess}
      />

      <POSThermalReceiptModal
        open={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        order={completedOrder}
      />
    </div>
  );
};

export default POSTerminalPage;
