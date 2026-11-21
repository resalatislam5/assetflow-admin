import { Card, Descriptions, Divider, Flex, Tag, Typography } from 'antd';
import { useParams } from 'react-router';
import PrintHeader from '../../../../common/print/PrintHeader';
import { dateAndTimeFormat, formatLabel } from '../../../../common/utils/helper.function';
import A4PageContainer from '../../../../layout/components/A4PageContainer';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import { useGetSingleBalanceTransferQuery } from '../api/balanceTransferEndpoints';
import type { IBalanceTransferList } from '../types/balanceTransferTypes';

type Props = {
  record?: IBalanceTransferList;
};

const TwoItem = ({
  title,
  text,
}: {
  title: string;
  text: string | number | undefined;
}) => {
  return (
    <Flex gap={5}>
      <Typography.Text style={{ fontWeight: 600 }}>{title}:</Typography.Text>
      <Typography.Text>{text || '-'}</Typography.Text>
    </Flex>
  );
};

const ViewBalanceTransfer = ({ record: initialRecord }: Props) => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleBalanceTransferQuery(
    id as string,
    { skip: !id || !!initialRecord },
  );

  const transfer = initialRecord || data?.data;

  if (!transfer) {
    return (
      <Card loading={isLoading} className='modal-container'>
        <Typography.Text>Loading balance transfer details...</Typography.Text>
      </Card>
    );
  }

  const content = (
    <Card className='modal-container' style={{ border: 'none', padding: 0 }}>
      <Descriptions
        column={1}
        bordered
        size='small'
        items={[
          {
            key: 'transfer_number',
            label: 'Transfer No',
            children: <Tag color='blue'>{transfer.transfer_number}</Tag>,
          },
          {
            key: 'transfer_date',
            label: 'Transfer Date',
            children: dateAndTimeFormat(transfer.transfer_date),
          },
          {
            key: 'from_account',
            label: 'From Account',
            children: `${transfer.from_account_name || 'N/A'} (${formatLabel(transfer.from_account_type || '')})`,
          },
          {
            key: 'to_account',
            label: 'To Account',
            children: `${transfer.to_account_name || 'N/A'} (${formatLabel(transfer.to_account_type || '')})`,
          },
          {
            key: 'amount',
            label: 'Transferred Amount',
            children: (
              <strong style={{ color: '#52c41a' }}>
                ৳ {Number(transfer.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            ),
          },
          {
            key: 'charge_amount',
            label: 'Transfer Charge',
            children: `৳ ${Number(transfer.charge_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          },
          ...(transfer.reference
            ? [
                {
                  key: 'reference',
                  label: 'Reference',
                  children: transfer.reference,
                },
              ]
            : []),
          ...(transfer.notes
            ? [
                {
                  key: 'notes',
                  label: 'Notes',
                  children: transfer.notes,
                },
              ]
            : []),
          ...(transfer.created_by_name
            ? [
                {
                  key: 'created_by',
                  label: 'Transferred By',
                  children: transfer.created_by_name,
                },
              ]
            : []),
          {
            key: 'created_at',
            label: 'Created At',
            children: dateAndTimeFormat(transfer.created_at),
          },
        ]}
      />
    </Card>
  );

  if (id && !initialRecord) {
    return (
      <ContainerLayout
        title='Balance Transfer View'
        options={{ showButton: false, showSearch: false }}
      >
        <A4PageContainer
          document_title={`${transfer.transfer_number}_balance_transfer`}
          content={
            <>
              <PrintHeader />
              <Divider />
              <Flex justify='center' style={{ marginBottom: 16 }}>
                <Typography.Text
                  style={{
                    border: '1px solid #d0d0d0',
                    padding: '4px 20px',
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  BALANCE TRANSFER VOUCHER
                </Typography.Text>
              </Flex>
              <div style={{ marginBottom: 16 }}>
                <TwoItem title='Voucher No' text={transfer.transfer_number} />
                <TwoItem title='Date' text={dateAndTimeFormat(transfer.transfer_date)} />
                <TwoItem title='From Account' text={transfer.from_account_name} />
                <TwoItem title='To Account' text={transfer.to_account_name} />
                <TwoItem
                  title='Amount'
                  text={`৳ ${Number(transfer.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                />
                <TwoItem
                  title='Charge'
                  text={`৳ ${Number(transfer.charge_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                />
              </div>
              {content}
            </>
          }
        />
      </ContainerLayout>
    );
  }

  return content;
};

export default ViewBalanceTransfer;
