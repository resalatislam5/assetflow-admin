import { Button, Space, Tag } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import ViewButton from '../../../../common/Button/ViewButton';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import {
  useDeleteCouponMutation,
  useGetCouponListQuery,
} from '../api/couponEndpoints';
import CreateCoupon from '../components/CreateCoupon';
import UpdateCoupon from '../components/UpdateCoupon';
import ViewCoupon from '../components/ViewCoupon';
import CouponUsagesModal from '../components/CouponUsagesModal';
import type { CouponDiscountType, ICouponList } from '../types/couponTypes';

const CouponList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('COUPON');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetCouponListQuery(query);
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Coupon',
            content: <CreateCoupon />,
            open: true,
            width: 800,
          }),
        )
      }
      title='Coupon List'
      options={{ showButton: can_create }}
    >
      <AntTable<ICouponList>
        dataSource={data?.data || []}
        rowKey='id'
        loading={isLoading || isFetching}
        bordered
        total={data?.total}
        columns={[
          {
            dataIndex: 'code',
            key: 'code',
            title: 'Coupon',
            render: (_: unknown, record: ICouponList) => (
              <div>
                <strong style={{ letterSpacing: 1 }}>{record.code}</strong>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                  {record.title}
                </div>
                {record.branch_name && (
                  <Tag color='cyan' style={{ marginTop: 4 }}>
                    {record.branch_name}
                  </Tag>
                )}
                {record.warehouse_name && (
                  <Tag color='geekblue' style={{ marginTop: 4 }}>
                    {record.warehouse_name}
                  </Tag>
                )}
              </div>
            ),
          },
          {
            dataIndex: 'discount_type',
            key: 'discount_type',
            title: 'Type',
            width: 150,
            render: (type: CouponDiscountType) => (
              <Tag color={type === 'PERCENTAGE' ? 'purple' : 'blue'}>
                {type === 'PERCENTAGE' ? 'PERCENTAGE (%)' : 'FIXED AMOUNT (BDT )'}
              </Tag>
            ),
          },
          {
            dataIndex: 'discount_value',
            key: 'discount_value',
            title: 'Value',
            width: 110,
            render: (val: number, record: ICouponList) => (
              <strong>
                {record.discount_type === 'PERCENTAGE' ? `${val}%` : `BDT ${val}`}
              </strong>
            ),
          },
          {
            dataIndex: 'min_order_amount',
            key: 'min_order_amount',
            title: 'Min Order',
            width: 110,
            render: (val: number) => `BDT ${val}`,
          },
          {
            dataIndex: 'usage_count',
            key: 'usage_count',
            title: 'Usage',
            width: 120,
            render: (used: number, record: ICouponList) => (
              <span>
                {used} / {record.usage_limit_total ? record.usage_limit_total : '∞'}
              </span>
            ),
          },
          {
            title: 'Validity',
            key: 'validity',
            width: 180,
            render: (_: unknown, record: ICouponList) => (
              <div style={{ fontSize: 11 }}>
                <div>From: {dateAndTimeFormat(record.start_date)}</div>
                <div>To: {dateAndTimeFormat(record.end_date)}</div>
              </div>
            ),
          },
          {
            dataIndex: 'is_active',
            key: 'is_active',
            title: 'Status',
            width: 100,
            render: (active: boolean) => (
              <Tag color={active ? 'green' : 'red'}>
                {active ? 'ACTIVE' : 'INACTIVE'}
              </Tag>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            width: 220,
            render: (_, record) => (
              <Space>
                <Button
                  size='small'
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: `Usages of Coupon: ${record.code}`,
                        content: <CouponUsagesModal couponId={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                >
                  Usages
                </Button>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Coupon',
                        content: <ViewCoupon id={record.id} />,
                        open: true,
                        width: 700,
                      }),
                    )
                  }
                />
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Update Coupon',
                        content: <UpdateCoupon id={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  onClick={() => deleteCoupon(record.id)}
                  loading={isDeleting}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default CouponList;
