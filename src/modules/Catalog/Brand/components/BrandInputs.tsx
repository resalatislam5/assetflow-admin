import { Form, Row, type FormInstance } from 'antd';
import {
  FormFileUpload,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import FromSubmit from '../../../../common/Button/FromSubmit';
import type { ICreateBrand } from '../types/brandTypes';

type Props = {
  onFinish: (values: ICreateBrand) => void;
  loading: boolean;
  form: FormInstance<ICreateBrand>;
  editMode?: boolean;
};

const BrandInputs = ({ onFinish, loading, form, editMode }: Props) => {
  return (
    <Form<ICreateBrand>
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={{ status: 'ACTIVE' }}
    >
      <Row gutter={[16, 0]}>
        <FormInputText
          name='name'
          label='Brand Name'
          placeholder='Enter brand name'
          required
          md={12}
        />
        <FormInputText
          name='website'
          label='Website'
          placeholder='https://...'
          md={12}
        />
        <FormInputSelect
          name='status'
          label='Status'
          md={12}
          options={[
            { label: 'ACTIVE', value: 'ACTIVE' },
            { label: 'INACTIVE', value: 'INACTIVE' },
          ]}
        />
        <FormInputTextArea
          name='description'
          label='Description'
          placeholder='Enter brand details'
          rows={1}
          md={12}
        />
        <FormFileUpload
          name='logo'
          label='Brand Logo'
          maxCount={1}
          accept='image/*'
          md={24}
          lg={24}
        />
      </Row>
      <FromSubmit
        text={editMode ? 'Update Brand' : 'Create Brand'}
        loading={loading}
      />
    </Form>
  );
};

export default BrandInputs;
