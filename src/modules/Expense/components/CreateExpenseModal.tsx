import { Button, Card, Col, Divider, Form, Row, Space, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useForm } from 'antd/es/form/Form';
import { useAppDispatch } from '../../../app/hooks/hooks';
import { closeModal } from '../../../app/features/modalSlice';
import {
  FormInputDate,
  FormInputNumber,
  FormInputText,
  FormInputTextArea,
} from '../../../common/Form/FormIInput';
import { SelectAccount, SelectHead } from '../../../common/SelectWithApi/Select';
import { useCreateExpenseMutation } from '../api/expenseEndpoints';
import { numberWithComma } from '../../../common/utils/numberFormate';

interface IExpenseFormValues {
  voucher_no?: string;
  account_id: number;
  expense_date: dayjs.Dayjs;
  notes?: string;
  items: Array<{
    head_id: number;
    amount: number;
    description?: string;
  }>;
}

const CreateExpenseModal = () => {
  const [form] = useForm<IExpenseFormValues>();
  const dispatch = useAppDispatch();
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const watchedItems = Form.useWatch('items', form) || [];
  const grandTotal = watchedItems.reduce(
    (sum, item) => sum + (Number(item?.amount) || 0),
    0,
  );

  const onFinish = (values: IExpenseFormValues) => {
    const formattedDate = values.expense_date
      ? dayjs(values.expense_date).format('YYYY-MM-DD')
      : dayjs().format('YYYY-MM-DD');

    createExpense({
      voucher_no: values.voucher_no || undefined,
      account_id: Number(values.account_id),
      expense_date: formattedDate,
      notes: values.notes || undefined,
      items: values.items.map((item) => ({
        head_id: Number(item.head_id),
        amount: Number(item.amount),
        description: item.description || undefined,
      })),
    })
      .unwrap()
      .then(() => {
        form.resetFields();
        dispatch(closeModal());
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          expense_date: dayjs(),
          items: [{ head_id: undefined, amount: undefined, description: '' }],
        }}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <FormInputText
              label='Voucher No (Leave blank for auto-generate)'
              name='voucher_no'
              placeholder='e.g. EXP-000001'
            />
          </Col>
          <Col xs={24} sm={12}>
            <FormInputDate
              label='Expense Date'
              name='expense_date'
              required
            />
          </Col>
          <Col xs={24}>
            <SelectAccount
              label='Payment Account'
              name='account_id'
              required
              placeholder='Select debit account'
            />
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }}>Expense Items</Divider>

        <Form.List name='items'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={[8, 8]} align='middle' style={{ marginBottom: 8 }}>
                  <Col xs={24} sm={10}>
                    <SelectHead
                      {...restField}
                      name={[name, 'head_id']}
                      label={fields.length === 1 ? 'Expense Head' : ''}
                      required
                      placeholder='Select head'
                    />
                  </Col>
                  <Col xs={14} sm={6}>
                    <FormInputNumber
                      {...restField}
                      name={[name, 'amount']}
                      label={fields.length === 1 ? 'Amount' : ''}
                      required
                      placeholder='0.00'
                      min={0.01}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col xs={8} sm={7}>
                    <FormInputText
                      {...restField}
                      name={[name, 'description']}
                      label={fields.length === 1 ? 'Item Note' : ''}
                      placeholder='Note'
                    />
                  </Col>
                  <Col xs={2} sm={1} style={{ textAlign: 'center' }}>
                    {fields.length > 1 && (
                      <Button
                        type='text'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    )}
                  </Col>
                </Row>
              ))}

              <Button
                type='dashed'
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: 8 }}
              >
                Add Another Item
              </Button>
            </>
          )}
        </Form.List>

        <Row style={{ marginTop: 16 }}>
          <Col xs={24}>
            <FormInputTextArea
              label='Overall Notes'
              name='notes'
              placeholder='Add any general notes for this expense'
              rows={2}
            />
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }} />

        <Row justify='space-between' align='middle'>
          <Col>
            <Typography.Text strong style={{ fontSize: 16 }}>
              Total Amount: ৳ {numberWithComma(grandTotal)}
            </Typography.Text>
          </Col>
          <Col>
            <Space>
              <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
              <Button type='primary' htmlType='submit' loading={isLoading}>
                Record Expense
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CreateExpenseModal;
