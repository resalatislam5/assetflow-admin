import { Button, Space, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import {
  useGetLoyaltyPointConfigQuery,
  useGetCustomerPointsListQuery,
  useGetPointTransactionsListQuery,
} from '../api/loyaltyPointEndpoints';
import UpdateLoyaltyPointConfig from '../components/UpdateLoyaltyPointConfig';
import AdjustPointsModal from '../components/AdjustPointsModal';
import type { ICustomerPoint, IPointTransaction } from '../types/loyaltyPointTypes';

const LoyaltyPointList = () => {
  const { can_update } = useCheckPermission('LOYALTY_POINT');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const [activeTab, setActiveTab] = useState('config');

  const { data: configData } = useGetLoyaltyPointConfigQuery();
  const { data: customerData, isLoading: isCustomerLoading, isFetching: isCustomerFetching } =
    useGetCustomerPointsListQuery(query, { skip: activeTab !== 'customers' });
  const { data: txData, isLoading: isTxLoading, isFetching: isTxFetching } =
    useGetPointTransactionsListQuery(query, { skip: activeTab !== 'transactions' });

  const config = configData?.data;

  const handleOpenAdjustModal = (customer: ICustomerPoint) => {
    dispatch(
      openModal({
        title: 'Adjust Customer Points',
        content: <AdjustPointsModal customer={customer} />,
        open: true,
        width: 500,
      }),
    );
  };

  const getTransactionTypeTag = (type: string) => {
    switch (type) {
      case 'EARNED':
        return <Tag color='success'>EARNED</Tag>;
      case 'REDEEMED':
        return <Tag color='gold'>REDEEMED</Tag>;
      case 'ADJUSTED':
        return <Tag color='processing'>ADJUSTED</Tag>;
      case 'REFUNDED':
        return <Tag color='purple'>REFUNDED</Tag>;
      case 'EXPIRED':
        return <Tag color='error'>EXPIRED</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  };

  return (
    <ContainerLayout
      title='Loyalty & Reward Points'
      options={{ showButton: false }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space size='middle' wrap>
          <Tag color={config?.is_enabled ? 'green' : 'error'} style={{ padding: '4px 10px', fontSize: 13 }}>
            Status: {config?.is_enabled ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
          <Tag color='blue' style={{ padding: '4px 10px', fontSize: 13 }}>
            Earning Rate: BDT {config?.earning_spending_amount || 100} = {config?.earning_points || 1} pt
          </Tag>
          <Tag color='purple' style={{ padding: '4px 10px', fontSize: 13 }}>
            Redemption Rate: {config?.redemption_points || 10} pts = BDT {config?.redemption_amount || 1}
          </Tag>
          <Tag color='orange' style={{ padding: '4px 10px', fontSize: 13 }}>
            Min to Redeem: {config?.min_points_to_redeem || 10} pts
          </Tag>
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'config',
            label: 'Configuration & Conversion Rates',
            children: <UpdateLoyaltyPointConfig />,
          },
          {
            key: 'customers',
            label: 'Customer Points Balances',
            children: (
              <AntTable<ICustomerPoint>
                dataSource={customerData?.data || []}
                rowKey='id'
                loading={isCustomerLoading || isCustomerFetching}
                bordered
                total={customerData?.total}
                columns={[
                  {
                    dataIndex: 'name',
                    key: 'name',
                    title: 'Customer Name',
                    render: (name: string, record: ICustomerPoint) => (
                      <div>
                        <strong>{name}</strong>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                          {record.phone || record.email}
                        </div>
                      </div>
                    ),
                  },
                  {
                    dataIndex: 'reward_points',
                    key: 'reward_points',
                    title: 'Available Points',
                    render: (pts: number) => (
                      <Tag color='gold' style={{ fontWeight: 700, fontSize: 13 }}>
                        {pts} pts
                      </Tag>
                    ),
                  },
                  {
                    dataIndex: 'total_points_earned',
                    key: 'total_points_earned',
                    title: 'Total Earned',
                    render: (pts: number) => `${pts || 0} pts`,
                  },
                  {
                    dataIndex: 'total_points_redeemed',
                    key: 'total_points_redeemed',
                    title: 'Total Redeemed',
                    render: (pts: number) => `${pts || 0} pts`,
                  },
                  {
                    dataIndex: 'status',
                    key: 'status',
                    title: 'Account Status',
                    render: (status: string) => (
                      <Tag color={status === 'ACTIVE' ? 'success' : 'error'}>
                        {status}
                      </Tag>
                    ),
                  },
                  {
                    key: 'action',
                    title: 'Action',
                    align: 'center',
                    render: (_: unknown, record: ICustomerPoint) => (
                      <Button
                        type='primary'
                        size='small'
                        disabled={!can_update}
                        onClick={() => handleOpenAdjustModal(record)}
                      >
                        Adjust Points
                      </Button>
                    ),
                  },
                ]}
              />
            ),
          },
          {
            key: 'transactions',
            label: 'Points Transaction Ledger',
            children: (
              <AntTable<IPointTransaction>
                dataSource={txData?.data || []}
                rowKey='id'
                loading={isTxLoading || isTxFetching}
                bordered
                total={txData?.total}
                columns={[
                  {
                    dataIndex: 'created_at',
                    key: 'created_at',
                    title: 'Date & Time',
                    render: (date: string) => dateAndTimeFormat(date),
                  },
                  {
                    dataIndex: 'customer_name',
                    key: 'customer_name',
                    title: 'Customer',
                    render: (name: string, record: IPointTransaction) => (
                      <div>
                        <strong>{name}</strong>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                          {record.customer_phone || record.customer_email}
                        </div>
                      </div>
                    ),
                  },
                  {
                    dataIndex: 'type',
                    key: 'type',
                    title: 'Transaction Type',
                    render: (type: string) => getTransactionTypeTag(type),
                  },
                  {
                    dataIndex: 'points',
                    key: 'points',
                    title: 'Points Change',
                    render: (pts: number) => (
                      <span
                        style={{
                          fontWeight: 700,
                          color: pts > 0 ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {pts > 0 ? `+${pts}` : pts} pts
                      </span>
                    ),
                  },
                  {
                    dataIndex: 'balance_after',
                    key: 'balance_after',
                    title: 'Balance After',
                    render: (bal: number) => `${bal} pts`,
                  },
                  {
                    dataIndex: 'invoice_number',
                    key: 'invoice_number',
                    title: 'Invoice / Order Ref',
                    render: (inv?: string, record?: IPointTransaction) => inv || record?.order_number || '—',
                  },
                  {
                    dataIndex: 'remarks',
                    key: 'remarks',
                    title: 'Remarks',
                    render: (rem?: string, record?: IPointTransaction) => rem || record?.description || '—',
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default LoyaltyPointList;
