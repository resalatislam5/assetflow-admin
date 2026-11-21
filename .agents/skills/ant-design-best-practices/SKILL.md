---
name: ant-design-best-practices
description: Comprehensive Ant Design (antd v5/v6) best practices, component patterns, layout/grid rules, form validation, table optimization, design token theming, and accessibility guidelines for React applications. Use when writing, refactoring, or reviewing antd components, forms, tables, modals, or layouts.
license: MIT
metadata:
  author: sahozmart
  version: "1.0.0"
---

# Ant Design Best Practices & Component Architecture

This guide establishes the standard development patterns and best practices for building responsive, maintainable, and type-safe user interfaces with **Ant Design (antd v5/v6)** in React applications.

---

## 1. Grid & Layout System (Preventing Nesting Bugs)

Ant Design uses a 24-column grid system (`Row` and `Col`). Incorrect nesting leads to halved column widths, awkward margins, and broken responsive layouts.

### 1.1 Column Nesting Rule
- **NEVER nest a `<Col>` directly inside another `<Col>` without an intermediate `<Row>`.**
- If a custom component (e.g. `SelectOrder`, `SelectAccount`) internally renders a `<Col>`, do NOT wrap it in an outer `<Col>`. Either:
  1. Pass the grid spans directly to the component: `<SelectOrder xs={24} sm={12} md={12} lg={12} ... />`
  2. Pass `standalone={true}` when explicitly placing it inside `<Col xs={24} sm={12}> <Form.Item ...> <SelectOrder standalone ... /> </Form.Item> </Col>`.

### 1.2 Gutter & Responsive Spans
- Always define explicit gutters on `Row`:
  - Standard form layout: `<Row gutter={[16, 0]}>` (horizontal gap 16px, vertical managed by Form.Item margin).
  - Card/statistic grid: `<Row gutter={[16, 16]}>`.
- Define responsive breakpoints systematically:
  ```tsx
  <Row gutter={[16, 0]}>
    <Col xs={24} sm={12} lg={8}>
      <Form.Item name="field_one" label="Field One">
        <Input placeholder="Enter value" />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12} lg={8}>
      <Form.Item name="field_two" label="Field Two">
        <Input placeholder="Enter value" />
      </Form.Item>
    </Col>
  </Row>
  ```

---

## 2. Form Management & Validation Patterns

### 2.1 Standard Form Instantiation
- Always instantiate the form instance with strict typing:
  ```tsx
  const [form] = Form.useForm<IFormData>();
  ```
- Use `layout="vertical"` across all admin forms for consistent visual hierarchy.
- Pass `initialValues` on the `<Form>` component rather than on individual `<Form.Item>` to prevent state sync issues:
  ```tsx
  <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
    initialValues={{
      status: 'ACTIVE',
      charge_type: 'FIXED',
      charge_rate: 0,
      payment_date: dayjs(),
    }}
  >
  ```

### 2.2 Dynamic Cross-Field Dependencies & Validation
When field validation depends on another field (e.g. received amount vs due balance, or charge rate vs amount):
1. Declare `dependencies={['field_a', 'field_b']}` on the dependent `Form.Item`.
2. When the master field changes, immediately trigger validation of dependent fields using `form.validateFields(['field_b'])`.
3. Use async validator functions returning `Promise.resolve()` or `Promise.reject(new Error('...'))`:
  ```tsx
  <Form.Item
    name="charge_rate"
    label="Charge Rate"
    dependencies={['amount', 'charge_type']}
    rules={[
      {
        validator: (_, val) => {
          const rate = Number(val || 0);
          if (rate < 0) {
            return Promise.reject(new Error('Charge rate cannot be negative'));
          }
          if (chargeType === 'PERCENTAGE' && rate > 100) {
            return Promise.reject(new Error('Percentage fee cannot exceed 100%'));
          }
          if (chargeType === 'FIXED' && amount > 0 && rate > amount) {
            return Promise.reject(
              new Error(`Fixed fee (৳${rate.toLocaleString()}) cannot exceed received amount (৳${amount.toLocaleString()})`)
            );
          }
          return Promise.resolve();
        },
      },
    ]}
  >
    <InputNumber
      style={{ width: '100%' }}
      min={0}
      placeholder="0"
      prefix={chargeType === 'FIXED' ? '৳' : '%'}
      onChange={(val) => {
        const num = Number(val || 0);
        setChargeRate(num);
        form.setFieldValue('charge_rate', num);
      }}
    />
  </Form.Item>
  ```

### 2.3 Form.useWatch Mandate over Multiple useState
- **NEVER create multiple redundant `useState` hooks to mirror form fields** (e.g. `useState` for amount, `useState` for charge_type, `useState` for payment_type).
- Always use Ant Design's built-in `Form.useWatch`:
  ```tsx
  const selectedPaymentType = Form.useWatch('payment_type', form);
  const amount = Number(Form.useWatch('amount', form) || 0);
  const chargeType = (Form.useWatch('charge_type', form) || 'FIXED') as OrderChargeType;
  const chargeRate = Number(Form.useWatch('charge_rate', form) || 0);
  ```
- **Benefits**:
  1. Prevents duplicate state synchronization bugs and manual `onChange` boilerplate.
  2. Component inputs stay uncontrolled under `Form.Item` while still triggering reactive UI updates (like statistics, calculations, or dependent selects).
  3. Massively reduces component re-renders and keeps form logic clean and idiomatic.

### 2.4 Input Number Standards
- Always set `style={{ width: '100%' }}` on `<InputNumber />` to fill its container column width.
- Always provide `min`, `precision` (where decimals apply), and currency/symbol `prefix` or `addonAfter`.

### 2.5 Controlled Component Separation
- Never pass both `value` and `defaultValue` to a component inside a named `<Form.Item name="...">`. Let Ant Design manage value injection through `Form.Item`.

---

## 3. Table & Data Grid Best Practices

### 3.1 Mandatory `rowKey`
- Always specify `rowKey="id"` or `rowKey={(record) => record.id}`. Never omit `rowKey`, as it causes rendering bugs during pagination and selection.

### 3.2 Strict Column Typing
- Define columns using `TableColumnsType<T>` or `ColumnsType<T>` with exact entity interfaces:
  ```tsx
  const columns: TableColumnsType<IOrder> = [
    {
      title: 'Order Number',
      dataIndex: 'order_number',
      key: 'order_number',
      render: (num: string) => <Typography.Text strong>{num}</Typography.Text>,
    },
    {
      title: 'Grand Total',
      dataIndex: 'grand_total_amount',
      key: 'grand_total_amount',
      align: 'right',
      render: (amt: number) => `৳${Number(amt || 0).toLocaleString()}`,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => handleEdit(record.id)}>Edit</Button>
        </Space>
      ),
    },
  ];
  ```

### 3.3 Responsive Table Scrolling
- Every data table MUST declare responsive horizontal scrolling to prevent breaking layout containers on small screens:
  ```tsx
  <Table
    rowKey="id"
    columns={columns}
    dataSource={data?.data}
    loading={isLoading}
    scroll={{ x: 'max-content' }}
    pagination={{
      current: page,
      pageSize,
      total: data?.total,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      onChange: (p, s) => {
        setPage(p);
        setPageSize(s);
      },
    }}
  />
  ```

---

## 4. Design Tokens & Semantic Theming

Ant Design v5/v6 uses CSS-in-JS powered by design tokens.

### 4.1 Token Access via `theme.useToken()`
- Always use tokens for colors, spacing, and border radii instead of hardcoding arbitrary hex colors:
  ```tsx
  import { theme } from 'antd';

  const { token } = theme.useToken();

  return (
    <div
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: token.paddingMD,
      }}
    >
      <span style={{ color: token.colorPrimary }}>Active Status</span>
    </div>
  );
  ```

### 4.2 Prohibited Practices
- **DO NOT override `.ant-*` CSS classes** with `!important` or global selector hacks.
- Use component-level `styles` and `classNames` props or theme token overrides in `ConfigProvider`.

---

## 5. Modals, Drawers & User Feedback

### 5.1 Modal State Management & Cleanup
- Always clear or reset forms upon modal close:
  ```tsx
  const handleClose = () => {
    form.resetFields();
    dispatch(closeModal());
  };
  ```
- Use `destroyOnClose={true}` on modals when state should not persist between opens.

### 5.2 Destructive Actions with `Popconfirm`
- Any delete, cancel, or refund action MUST be guarded with a `<Popconfirm>`:
  ```tsx
  <Popconfirm
    title="Delete Item"
    description="Are you sure you want to delete this record?"
    okText="Yes, Delete"
    cancelText="No"
    okButtonProps={{ danger: true, loading: isDeleting }}
    onConfirm={() => handleDelete(record.id)}
  >
    <Button danger icon={<DeleteOutlined />} size="small" />
  </Popconfirm>
  ```

### 5.3 Context-Aware Feedback (`App.useApp()`)
- In Ant Design v5/v6, consume `App.useApp()` for modals, notifications, and toast messages so they inherit theme tokens:
  ```tsx
  import { App } from 'antd';

  const MyComponent = () => {
    const { message, notification, modal } = App.useApp();
    
    const showSuccess = () => {
      message.success('Operation completed successfully');
    };
  };
  ```

---

## 6. Select Components & Data Fetching

### 6.1 Centralized Select Components
- Always use centralized select components from `src/common/SelectWithApi/` (`SelectAccount`, `SelectOrder`, `SelectCustomer`, `SelectProduct`, etc.).
- Never duplicate RTK Query hooks and map dropdown options manually in feature forms.

### 6.2 Searchable Selects
- Large datasets in `Select` MUST enable search:
  ```tsx
  <Select
    showSearch
    allowClear
    placeholder="Select an option"
    filterOption={(input, option) =>
      String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
  />
  ```

---

## 7. Performance & Clean Code Mandates

1. **Named Icon Imports**: Import icons individually from `@ant-design/icons` (e.g. `import { PlusOutlined, EditOutlined } from '@ant-design/icons'`). Never use wildcard `* as Icons`.
2. **Strict Typing Only**: Never use `: any`, `as any`, or `<any>`. Type every column, form value, and event handler explicitly.
3. **Zero Dead Code**: Delete unused imports, components, and variables immediately upon refactoring.
4. **No Code Comments**: Keep code clean, self-explanatory, and comment-free per repository standards.

