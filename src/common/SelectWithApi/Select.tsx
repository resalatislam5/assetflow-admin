import type { FormItemProps, SelectProps, TreeSelectProps } from 'antd';
import { Col, Empty, Form, Select, Spin, TreeSelect } from 'antd';
import React, { useMemo } from 'react';
import type { IAccountHeadTreeNode, IOrderSelect, IVariantSelect } from './selectTypes';
import {
  useGetAccountSelectQuery,
  useGetAccountHeadTreeQuery,
  useGetAccountHeadSelectQuery,
  useGetBrandSelectQuery,
  useGetCategorySelectQuery,
  useGetCustomerSelectQuery,
  useGetProductSelectQuery,
  useGetRoleSelectQuery,
  useGetStoreProductSelectQuery,
  useGetUserSelectQuery,
  useGetWarehouseSelectQuery,
  useGetBranchSelectQuery,
  useGetCouponSelectQuery,
  useGetSupplierSelectQuery,
  useGetOrderSelectQuery,
} from './SelectEndpoints';

export type SelectItemProps = {
  label?: string;
  name?: string | number | (string | number)[];
  required?: boolean;
  disabled?: boolean;
  layout?: 'horizontal' | 'vertical';
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  size?: SelectProps['size'];
  mode?: SelectProps['mode'];
  onChange?: SelectProps['onChange'];
  placeholder?: string;
  defaultValue?: SelectProps['defaultValue'];
  value?: SelectProps['value'];
  allowClear?: boolean;
  standalone?: boolean;
  colWrap?: boolean;
  style?: React.CSSProperties;
  [key: string]: unknown;
} & Omit<FormItemProps, 'name' | 'label' | 'defaultValue'>;

interface RenderSelectProps {
  props: SelectItemProps;
  defaultLabel: string;
  defaultName: string;
  options: { label: string; value: string | number }[];
  isLoading: boolean;
}

const SmartSelect: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  ...restProps
}) => {
  const resolvedValue = useMemo(() => {
    if (value === undefined || value === null || value === '') return undefined;

    if (Array.isArray(value)) {
      return value.map((val) => {
        const match = options?.find(
          (opt) => opt.value === val || String(opt.value) === String(val),
        );
        return match ? match.value : val;
      });
    }

    const exactMatch = options?.find((opt) => opt.value === value);
    if (exactMatch) return exactMatch.value;

    const looseMatch = options?.find(
      (opt) => String(opt.value) === String(value),
    );
    if (looseMatch) return looseMatch.value;

    return value;
  }, [value, options]);

  return (
    <Select
      options={options}
      value={resolvedValue}
      onChange={onChange}
      {...restProps}
    />
  );
};

const renderCustomSelect = ({
  props,
  defaultLabel,
  defaultName,
  options,
  isLoading,
}: RenderSelectProps) => {
  const {
    label = defaultLabel,
    name = defaultName,
    required,
    disabled,
    layout = 'vertical',
    xs = 24,
    sm = 24,
    md = 24,
    lg = 12,
    xl,
    xxl,
    size = 'middle',
    mode,
    onChange,
    placeholder,
    defaultValue,
    value,
    allowClear = true,
    standalone = false,
    colWrap = false,
    style,
    ...rest
  } = props;

  const selectNode = (
    <SmartSelect
      placeholder={placeholder || `Select ${label}`}
      disabled={disabled || isLoading}
      loading={isLoading}
      size={size}
      options={options}
      mode={mode}
      allowClear={allowClear}
      showSearch
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      notFoundContent={isLoading ? <Spin size='small' /> : <Empty />}
      onChange={onChange}
      value={value}
      defaultValue={defaultValue}
      style={{ width: '100%', ...style }}
    />
  );

  if (standalone) {
    if (
      colWrap ||
      props.xs !== undefined ||
      props.sm !== undefined ||
      props.md !== undefined ||
      props.lg !== undefined
    ) {
      return (
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
          {selectNode}
        </Col>
      );
    }
    return selectNode;
  }

  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required, message: `${label} is required` }]}
        layout={layout}
        {...rest}
      >
        {selectNode}
      </Form.Item>
    </Col>
  );
};

export const SelectUser = (props: SelectItemProps) => {
  const { data, isLoading } = useGetUserSelectQuery();
  const options = data?.data?.length
    ? data.data.map((user) => ({
        label: `${user.name} (${user.email})`,
        value: user.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'User',
    defaultName: 'user_id',
    options,
    isLoading,
  });
};

export const SelectRole = (props: SelectItemProps) => {
  const { data, isLoading } = useGetRoleSelectQuery();
  const options = data?.data?.length
    ? data.data.map((role) => ({
        label: role.name,
        value: role.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Role',
    defaultName: 'role_id',
    options,
    isLoading,
  });
};

export const SelectCategory = (
  props: SelectItemProps & { excludeId?: string | number },
) => {
  const { data, isLoading } = useGetCategorySelectQuery();
  const options = data?.data?.length
    ? data.data
        .filter(
          (cat) =>
            !props.excludeId || String(cat.id) !== String(props.excludeId),
        )
        .map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Category',
    defaultName: 'category_id',
    options,
    isLoading,
  });
};

export const SelectBrand = (props: SelectItemProps) => {
  const { data, isLoading } = useGetBrandSelectQuery();
  const options = data?.data?.length
    ? data.data.map((brand) => ({
        label: brand.name,
        value: brand.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Brand',
    defaultName: 'brand_id',
    options,
    isLoading,
  });
};

export const SelectProduct = (props: SelectItemProps) => {
  const { data, isLoading } = useGetProductSelectQuery();
  const options = data?.data?.length
    ? data.data.map((product) => ({
        label: `${product.title} (${product.sku})`,
        value: product.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Product',
    defaultName: 'product_id',
    options,
    isLoading,
  });
};

export type SelectVariantProps = SelectItemProps & {
  variants?: IVariantSelect[];
};

export const SelectVariant = (props: SelectVariantProps) => {
  const { variants = [], ...restProps } = props;
  const options = variants.map((v) => ({
    label: `${v.variant_name} (${v.sku}) - ৳${v.price || 0}`,
    value: v.id,
  }));

  return renderCustomSelect({
    props: restProps,
    defaultLabel: 'Variant',
    defaultName: 'variant_id',
    options,
    isLoading: false,
  });
};

export const SelectWarehouse = (props: SelectItemProps) => {
  const { data, isLoading } = useGetWarehouseSelectQuery();
  const options = data?.data?.length
    ? data.data.map((w) => ({
        label: `${w.name} (${w.code})`,
        value: w.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Warehouse',
    defaultName: 'warehouse_id',
    options,
    isLoading,
  });
};

export const SelectBranch = (props: SelectItemProps) => {
  const { data, isLoading } = useGetBranchSelectQuery();
  const options = data?.data?.length
    ? data.data.map((b) => ({
        label: `${b.name} (${b.code})`,
        value: b.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Branch',
    defaultName: 'branch_id',
    options,
    isLoading,
  });
};

export const SelectCustomer = (props: SelectItemProps) => {
  const { data, isLoading } = useGetCustomerSelectQuery();
  const options = data?.data?.length
    ? data.data.map((c) => ({
        label: `${c.first_name}${c.last_name ? ' ' + c.last_name : ''} (${c.customer_code || c.phone})`,
        value: c.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Customer',
    defaultName: 'customer_id',
    options,
    isLoading,
  });
};

export const SelectStoreProduct = (props: SelectItemProps) => {
  const { data, isLoading } = useGetStoreProductSelectQuery();
  const options = data?.data?.length
    ? data.data.map((sp) => ({
        label: `${sp.name} (${sp.code}) - Stock: ${sp.current_stock}`,
        value: sp.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Store Product',
    defaultName: 'store_product_id',
    options,
    isLoading,
  });
};

export const SelectAccount = ({
  accountType,
  accountCategory,
  ...props
}: SelectItemProps & { accountType?: string; accountCategory?: string }) => {
  const { data, isLoading } = useGetAccountSelectQuery();
  const options = data?.data?.length
    ? data.data
        .filter((acc) => !acc.is_group)
        .filter((acc) => !accountCategory || acc.account_category === accountCategory)
        .filter((acc) => !accountType || acc.account_type === accountType)
        .map((acc) => ({
          label: `${acc.name} (${acc.account_type}${acc.account_number ? ' - ' + acc.account_number : ''}) — ৳${Number(acc.current_balance ?? 0).toLocaleString()}`,
          value: acc.id,
        }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Account',
    defaultName: 'account_id',
    options,
    isLoading,
  });
};

export type TreeSelectHeadProps = {
  label?: string;
  name?: string | number | (string | number)[];
  required?: boolean;
  disabled?: boolean;
  layout?: 'horizontal' | 'vertical';
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  size?: TreeSelectProps['size'];
  placeholder?: string;
  allowClear?: boolean;
  standalone?: boolean;
  colWrap?: boolean;
  style?: React.CSSProperties;
  treeDefaultExpandAll?: boolean;
  onChange?: TreeSelectProps['onChange'];
  value?: TreeSelectProps['value'];
  excludeId?: string | number;
  [key: string]: unknown;
} & Omit<FormItemProps, 'name' | 'label' | 'defaultValue'>;

export const TreeSelectAccountHead = (props: TreeSelectHeadProps) => {
  const { data, isLoading } = useGetAccountHeadTreeQuery();
  const {
    label = 'Account Head',
    name = 'head_id',
    required = false,
    disabled = false,
    layout,
    xs = 24,
    sm = 24,
    md,
    lg,
    xl,
    xxl,
    size = 'middle',
    placeholder = 'Select Account Head',
    allowClear = true,
    standalone = false,
    colWrap = false,
    style,
    treeDefaultExpandAll = true,
    excludeId,
    onChange,
    value,
    ...rest
  } = props;

  const transformTree = (nodes?: IAccountHeadTreeNode[]): TreeSelectProps['treeData'] => {
    if (!nodes?.length) return [];
    return nodes
      .filter((node) => !excludeId || String(node.id) !== String(excludeId))
      .map((node) => {
        const titleText = node.title || (node.code ? `${node.code} - ${node.name}` : node.name);
        return {
          title: titleText,
          label: titleText,
          value: node.value !== undefined ? node.value : node.id,
          key: node.key !== undefined ? node.key : node.id,
          children: transformTree(node.children),
        };
      });
  };

  const treeData = useMemo(() => transformTree(data?.data), [data?.data, excludeId]);

  const safeValue = useMemo(() => {
    if (value === undefined || value === null || (typeof value === 'number' && Number.isNaN(value))) {
      return undefined;
    }
    return value;
  }, [value]);

  const treeSelectNode = (
    <TreeSelect
      treeData={treeData}
      loading={isLoading}
      placeholder={placeholder}
      allowClear={allowClear}
      treeDefaultExpandAll={treeDefaultExpandAll}
      showSearch
      treeNodeFilterProp="title"
      size={size}
      disabled={disabled}
      style={{ width: '100%', ...style }}
      onChange={onChange}
      value={safeValue}
    />
  );

  if (standalone) {
    if (
      colWrap ||
      props.xs !== undefined ||
      props.sm !== undefined ||
      props.md !== undefined ||
      props.lg !== undefined
    ) {
      return (
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
          {treeSelectNode}
        </Col>
      );
    }
    return treeSelectNode;
  }

  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required, message: `${label} is required` }]}
        layout={layout}
        {...rest}
      >
        {treeSelectNode}
      </Form.Item>
    </Col>
  );
};

export const SelectAccountHead = ({
  accountCategory,
  ...props
}: SelectItemProps & { accountCategory?: string }) => {
  const { data, isLoading } = useGetAccountHeadSelectQuery(
    accountCategory ? { account_category: accountCategory } : undefined,
  );
  const options = data?.data?.length
    ? data.data.map((h) => ({
        label: h.code ? `${h.code} - ${h.name} (${h.account_category})` : `${h.name} (${h.account_category})`,
        value: h.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Account Head',
    defaultName: 'head_id',
    options,
    isLoading,
  });
};

export const SelectCoupon = (props: SelectItemProps) => {
  const { data, isLoading } = useGetCouponSelectQuery();
  const options = data?.data?.length
    ? data.data.map((c) => ({
        label: `${c.code} (${c.discount_type === 'PERCENTAGE' ? `${c.discount_value}%` : `৳${c.discount_value}`})`,
        value: c.code,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Coupon',
    defaultName: 'coupon_code',
    options,
    isLoading,
  });
};

export const SelectSupplier = (props: SelectItemProps) => {
  const { data, isLoading } = useGetSupplierSelectQuery();
  const options = data?.data?.length
    ? data.data.map((s) => ({
        label: `${s.name}${s.company_name ? ` (${s.company_name})` : ''}${s.phone ? ` - ${s.phone}` : ''}`,
        value: s.id,
      }))
    : [];

  return renderCustomSelect({
    props,
    defaultLabel: 'Supplier',
    defaultName: 'supplier_id',
    options,
    isLoading,
  });
};

const FallbackSelect = (props: SelectItemProps) => {
  const {
    label = 'Select',
    name = 'select_id',
    required,
    layout = 'vertical',
    xs = 24,
    sm = 24,
    md = 24,
    lg = 12,
    placeholder,
    standalone = false,
    ...rest
  } = props;

  const selectNode = (
    <Select
      placeholder={placeholder || `Select ${label}`}
      allowClear
      showSearch
      options={[]}
      notFoundContent={<Empty />}
      style={{ width: '100%' }}
    />
  );

  if (standalone) {
    return selectNode;
  }

  return (
    <Col xs={xs} sm={sm} md={md} lg={lg}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required, message: `${label} is required` }]}
        layout={layout}
        {...rest}
      >
        {selectNode}
      </Form.Item>
    </Col>
  );
};

export const SelectCountry = FallbackSelect;
export const SelectDepartment = FallbackSelect;
export const SelectDesignation = FallbackSelect;
export const SelectEmployee = FallbackSelect;
export const SelectHead = (props: SelectItemProps) => {
  const { placeholder, ...restProps } = props;
  const { data, isLoading } = useGetAccountHeadSelectQuery({ account_category: 'EXPENSE' });

  const options = data?.data?.length
    ? data.data.map((head) => ({
        label: head.code ? `${head.code} - ${head.name}` : head.name,
        value: Number(head.id),
      }))
    : [];

  return renderCustomSelect({
    props: {
      placeholder: placeholder || 'Choose an expense head',
      ...restProps,
    },
    defaultLabel: 'Expense Head',
    defaultName: 'head_id',
    options,
    isLoading: Boolean(isLoading),
  });
};
export const SelectCourse = FallbackSelect;
export const SelectBatch = FallbackSelect;
export const SelectPackage = FallbackSelect;
export const SelectStudent = FallbackSelect;
export const SelectAgent = FallbackSelect;
export const SelectEnrollment = FallbackSelect;
export const SelectHelpCategory = FallbackSelect;

export const SelectOrder = ({
  unpaid_only = false,
  customer_id,
  refundable_returns_only = false,
  onSelectOrder,
  onChange,
  ...restProps
}: SelectItemProps & {
  unpaid_only?: boolean;
  customer_id?: number | string;
  refundable_returns_only?: boolean;
  onSelectOrder?: (order: IOrderSelect) => void;
}) => {
  const { data, isLoading } = useGetOrderSelectQuery({
    unpaid_only,
    customer_id,
    refundable_returns_only,
  });

  const orderMap = useMemo(() => {
    const map = new Map<number | string, IOrderSelect>();
    data?.data?.forEach((o) => {
      map.set(Number(o.id), o);
      map.set(String(o.id), o);
    });
    return map;
  }, [data]);

  const options = data?.data?.length
    ? data.data.map((o) => {
        const identifier = o.invoice_number || o.order_number;
        if (refundable_returns_only) {
          const refundAmt = Number(o.return_refund_amount || o.paid_amount || 0).toLocaleString();
          return {
            label: `${identifier} ${o.return_number ? `(Return: ${o.return_number})` : ''} [Refundable: ৳${refundAmt}]`,
            value: Number(o.id),
          };
        }
        return {
          label: `${identifier} — ${o.customer_name || 'Guest'}${o.customer_phone ? ` (${o.customer_phone})` : ''} [Due: ৳${Number(o.due_amount || 0).toLocaleString()}]`,
          value: Number(o.id),
        };
      })
    : [];

  const handleCustomChange = (val: unknown, opt: unknown) => {
    if (onChange) {
      onChange(val as SelectProps['value'], opt as SelectProps['options']);
    }
    if (onSelectOrder && val) {
      const match = orderMap.get(val as number | string);
      if (match) {
        onSelectOrder(match);
      }
    }
  };

  return renderCustomSelect({
    props: {
      placeholder: 'Select Order',
      onChange: handleCustomChange,
      showSearch: true,
      filterOption: (input: string, option?: { label?: unknown; value?: unknown }) =>
        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase()),
      ...restProps,
    },
    defaultLabel: 'Order',
    defaultName: 'order_id',
    options,
    isLoading: Boolean(isLoading),
  });
};

export const SelectAgentCommission = FallbackSelect;
export const SelectInvoice = SelectOrder;
