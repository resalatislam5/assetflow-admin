import { Card, Col, Row, Space, Statistic, Tag } from 'antd';
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
  useDeletePromotionMutation,
  useGetPromotionListQuery,
  useGetPromotionSummaryQuery,
} from '../api/promotionEndpoints';
import CreatePromotion from '../components/CreatePromotion';
import UpdatePromotion from '../components/UpdatePromotion';
import ViewPromotion from '../components/ViewPromotion';
import type { CampaignPromoType, IPromotionList } from '../types/promotionTypes';

const PromotionList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('PROMOTION');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetPromotionListQuery(query);
  const { data: summaryData } = useGetPromotionSummaryQuery();
  const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionMutation();

  const summary = summaryData?.data;

  const getPromoTypeTag = (type: CampaignPromoType) => {
    switch (type) {
      case 'BUY_X_GET_Y':
        return <Tag color='volcano'>BUY X GET Y</Tag>;
      case 'CATEGORY_DISCOUNT':
        return <Tag color='cyan'>CATEGORY DISCOUNT</Tag>;
      case 'BRAND_DISCOUNT':
        return <Tag color='geekblue'>BRAND DISCOUNT</Tag>;
      case 'BILL_TOTAL_DISCOUNT':
        return <Tag color='purple'>BILL TOTAL DISCOUNT</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  };

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Promotion Campaign',
            content: <CreatePromotion />,
            open: true,
            width: 800,
          }),
        )
      }
      title='Promotional Campaigns'
      options={{ showButton: can_create }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card size='small' bordered>
            <Statistic
              title='Total Campaigns'
              value={summary?.total_promotions || 0}
              valueStyle={{ color: '#0958d9' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size='small' bordered>
            <Statistic
              title='Active Campaigns'
              value={summary?.active_promotions || 0}
              valueStyle={{ color: '#389e0d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size='small' bordered>
            <Statistic
              title='Expired Campaigns'
              value={summary?.expired_promotions || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IPromotionList>
        dataSource={data?.data || []}
        rowKey='id'
        loading={isLoading || isFetching}
        bordered
        total={data?.total}
        columns={[
          {
            dataIndex: 'name',
            key: 'name',
            title: 'Campaign Name',
            render: (name: string) => <strong>{name}</strong>,
          },
          {
            dataIndex: 'promo_type',
            key: 'promo_type',
            title: 'Type',
            width: 190,
            render: (type: CampaignPromoType) => getPromoTypeTag(type),
          },
          {
            title: 'Reward / Discount',
            key: 'discount',
            width: 170,
            render: (_: unknown, record: IPromotionList) => {
              if (record.promo_type === 'BUY_X_GET_Y') {
                return (
                  <Tag color='gold'>
                    Buy {record.buy_quantity || 1} Get {record.get_quantity || 0} Free
                  </Tag>
                );
              }
              if (record.discount_percentage) {
                return <strong>{record.discount_percentage}% OFF</strong>;
              }
              if (record.discount_amount) {
                return <strong>BDT {record.discount_amount} OFF</strong>;
              }
              return '—';
            },
          },
          {
            dataIndex: 'min_spend_amount',
            key: 'min_spend_amount',
            title: 'Min Spend',
            width: 120,
            render: (val: number) => `BDT ${val || 0}`,
          },
          {
            title: 'Validity Window',
            key: 'validity',
            width: 200,
            render: (_: unknown, record: IPromotionList) => (
              <div style={{ fontSize: 11 }}>
                <div>Start: {dateAndTimeFormat(record.start_date)}</div>
                <div>End: {dateAndTimeFormat(record.end_date)}</div>
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
            width: 150,
            render: (_, record) => (
              <Space>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Promotion Campaign',
                        content: <ViewPromotion id={record.id} />,
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
                        title: 'Update Promotion Campaign',
                        content: <UpdatePromotion id={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  onClick={() => deletePromotion(record.id)}
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

export default PromotionList;
