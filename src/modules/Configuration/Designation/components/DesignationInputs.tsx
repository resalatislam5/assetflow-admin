import { SelectDepartment } from '../../../../common/SelectWithApi/Select';
import { Form, Row, type FormInstance } from 'antd';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputSelect,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import type { ICreateDesignation } from '../types/designationTypes';

type Props = {
  onFinish: (arg: ICreateDesignation) => void;
  form: FormInstance;
  loading: boolean;
  editMode?: boolean;
};

const DesignationInputs = ({ onFinish, form, loading, editMode }: Props) => {
  return (
    <Form onFinish={onFinish} form={form}>
      <Row gutter={[8, 8]}>
        <SelectDepartment
          name={'department_id'}
          label={'Department'}
          required
          lg={24}
        />
        <FormInputText lg={24} name={'name'} label={'Name'} required />
        {editMode && (
          <FormInputSelect
            name={'status'}
            label={'Status'}
            lg={24}
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
            ]}
          />
        )}
      </Row>
      <FromSubmit text={editMode ? 'Update' : 'Create'} loading={loading} />
    </Form>
  );
};

export default DesignationInputs;
