import { Card } from 'antd';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { useGetCouponUsagesQuery } from '../api/couponEndpoints';
import type { ICouponUsage } from '../types/couponTypes';

type Props = {
  couponId: number | string;
};

const CouponUsagesModal = ({ couponId }: Props) => {
  const { data, isLoading, isFetching } = useGetCouponUsagesQuery({ id: couponId });

  return (
    <Card size='small' className='modal-container' style={{ border: 'none' }}>
      <AntTable<ICouponUsage>
        dataSource={data?.data || []}
        rowKey='id'
        loading={isLoading || isFetching}
        bordered
        total={data?.total}
        columns={[
          {
            title: 'Invoice Number',
            dataIndex: 'invoice_number',
            key: 'invoice_number',
            render: (inv?: string) => <strong>{inv || 'N/A'}</strong>,
          },
          {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
            render: (name?: string, record?: ICouponUsage) => (
              <div>
                <div>{name || 'Guest'}</div>
                {record?.customer_phone && (
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.customer_phone}</div>
                )}
              </div>
            ),
          },
          {
            title: 'Discount Given',
            dataIndex: 'discount_amount',
            key: 'discount_amount',
            render: (amt: number) => <strong>BDT {Number(amt || 0).toFixed(2)}</strong>,
          },
          {
            title: 'Used At',
            dataIndex: 'used_at',
            key: 'used_at',
            render: (dt: string) => dateAndTimeFormat(dt),
          },
        ]}
      />
    </Card>
  );
};

export default CouponUsagesModal;
