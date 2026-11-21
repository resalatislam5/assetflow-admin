import { Card, Col, Row, Space, Statistic, Tag } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { openModal } from '../../../../app/features/modalSlice';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import AntTable from '../../../../common/Table/AntTable';
import { getStatusTag } from '../../../../common/utils/status';
import ViewButton from '../../../../common/Button/ViewButton';
import EditButton from '../../../../common/Button/EditButton';
import DeleteButton from '../../../../common/Button/DeleteButton';
import {
  dateAndTimeFormat,
  formatLabel,
} from '../../../../common/utils/helper.function';
import {
  useDeleteAccountMutation,
  useGetAccountListQuery,
} from '../api/accountEndpoints';
import type { IAccountList } from '../types/accountTypes';
import CreateAccount from '../components/CreateAccount';
import UpdateAccount from '../components/UpdateAccount';
import ViewAccount from '../components/ViewAccount';

const AccountList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('ACCOUNT');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetAccountListQuery(query);
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const getTypeTag = (type: string) => {
    switch (type) {
      case 'CASH':
        return <Tag color='green'>CASH</Tag>;
      case 'BANK':
        return <Tag color='blue'>BANK</Tag>;
      case 'MOBILE_BANKING':
        return <Tag color='purple'>MOBILE BANKING</Tag>;
      default:
        return <Tag>{formatLabel(type)}</Tag>;
    }
  };

  const accounts = data?.data || [];
  const cashBalance = accounts
    .filter((a) => a.account_type === 'CASH')
    .reduce((sum, a) => sum + Number(a.current_balance || 0), 0);
  const bankBalance = accounts
    .filter((a) => a.account_type === 'BANK')
    .reduce((sum, a) => sum + Number(a.current_balance || 0), 0);
  const mobileBankingBalance = accounts
    .filter((a) => a.account_type === 'MOBILE_BANKING')
    .reduce((sum, a) => sum + Number(a.current_balance || 0), 0);
  const totalBalance = cashBalance + bankBalance + mobileBankingBalance;

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Account',
            content: <CreateAccount />,
            open: true,
            width: 600,
          }),
        )
      }
      title='Account List'
      options={{ showButton: can_create }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            size='small'
            bordered
            style={{
              borderRadius: 8,
              background: '#f6ffed',
              borderColor: '#b7eb8f',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#389e0d', fontWeight: 600 }}>
                  Cash in Hand
                </span>
              }
              value={cashBalance}
              precision={2}
              prefix='৳ '
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            size='small'
            bordered
            style={{
              borderRadius: 8,
              background: '#e6f4ff',
              borderColor: '#91caff',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#0958d9', fontWeight: 600 }}>
                  Bank Accounts
                </span>
              }
              value={bankBalance}
              precision={2}
              prefix='৳ '
              valueStyle={{ color: '#003eb3', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            size='small'
            bordered
            style={{
              borderRadius: 8,
              background: '#f9f0ff',
              borderColor: '#d3adf7',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#722ed1', fontWeight: 600 }}>
                  Mobile Banking
                </span>
              }
              value={mobileBankingBalance}
              precision={2}
              prefix='৳ '
              valueStyle={{ color: '#531dab', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            size='small'
            bordered
            style={{
              borderRadius: 8,
              background: '#fffbe6',
              borderColor: '#ffe58f',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#d48806', fontWeight: 600 }}>
                  Total Treasury Liquidity
                </span>
              }
              value={totalBalance}
              precision={2}
              prefix='৳ '
              valueStyle={{ color: '#ad6800', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>
      <AntTable<IAccountList>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Date',
            width: 150,
            render: (text) => dateAndTimeFormat(text),
          },
          {
            dataIndex: 'name',
            key: 'name',
            title: 'Account Name',
          },
          {
            dataIndex: 'head_name',
            key: 'head_name',
            title: 'Account Head',
            render: (text, record) => (
              <Space direction='vertical' size={0}>
                <span style={{ fontWeight: 500 }}>{text || '—'}</span>
                {record.account_category && (
                  <Tag color='geekblue' style={{ fontSize: 11, padding: '0 4px' }}>
                    {record.account_category}
                  </Tag>
                )}
              </Space>
            ),
          },
          {
            dataIndex: 'account_type',
            key: 'account_type',
            title: 'Account Type',
            width: 140,
            render: (text) => getTypeTag(text),
          },
          {
            dataIndex: 'account_number',
            key: 'account_number',
            title: 'Account / Bank Info',
            render: (_text, record) => (
              <Space direction='vertical' size={0}>
                {record.account_number && <span><strong>No:</strong> {record.account_number}</span>}
                {record.bank_name && <span style={{ color: '#888' }}>{record.bank_name} {record.branch_name ? `(${record.branch_name})` : ''}</span>}
                {!record.account_number && !record.bank_name && <span>-</span>}
              </Space>
            ),
          },
          {
            dataIndex: 'current_balance',
            key: 'current_balance',
            title: 'Current Balance',
            align: 'right',
            width: 140,
            render: (val) => (
              <strong style={{ color: Number(val) >= 0 ? '#52c41a' : '#ff4d4f' }}>
                ৳ {Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            ),
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            width: 90,
            render: (text) => getStatusTag(text),
          },
          {
            title: 'Action',
            key: 'action',
            width: 160,
            align: 'center',
            render: (_text, record) => (
              <Space size='small'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Account',
                        content: <ViewAccount record={record} />,
                        open: true,
                        width: 600,
                      }),
                    )
                  }
                />
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Update Account',
                        content: <UpdateAccount record={record} />,
                        open: true,
                        width: 600,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  loading={isDeleting}
                  onClick={() => deleteAccount(record.id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default AccountList;
