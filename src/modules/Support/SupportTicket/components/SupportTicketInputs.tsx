import { Form, Row, type FormInstance } from 'antd';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputSelect,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import type { IUpdateSupportTicket } from '../types/supportTicketTypes';

type Props = {
  onFinish: (values: IUpdateSupportTicket) => void;
  form: FormInstance<IUpdateSupportTicket>;
  loading: boolean;
};

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
  { value: 'RESOLVED', label: 'RESOLVED' },
  { value: 'CLOSED', label: 'CLOSED' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'LOW' },
  { value: 'MEDIUM', label: 'MEDIUM' },
  { value: 'HIGH', label: 'HIGH' },
  { value: 'URGENT', label: 'URGENT' },
];

const SupportTicketInputs = ({ onFinish, form, loading }: Props) => {
  return (
    <Form<IUpdateSupportTicket>
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{
        status: 'PENDING',
        priority: 'MEDIUM',
      }}
    >
      <Row gutter={[12, 12]}>
        <FormInputSelect
          name='status'
          label='Status'
          options={STATUS_OPTIONS}
          required
          md={12}
          lg={12}
          xs={24}
        />

        <FormInputSelect
          name='priority'
          label='Priority'
          options={PRIORITY_OPTIONS}
          required
          md={12}
          lg={12}
          xs={24}
        />

        <FormInputTextArea
          name='admin_notes'
          label='Admin Notes / Resolution Summary'
          placeholder='Internal administrative notes or resolution summary...'
          rows={4}
          lg={24}
          md={24}
          xs={24}
        />

        <FromSubmit text='Update Support Ticket' loading={loading} />
      </Row>
    </Form>
  );
};

export default SupportTicketInputs;

