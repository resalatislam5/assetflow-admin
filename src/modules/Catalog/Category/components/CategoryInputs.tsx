import { Form, Row, type FormInstance } from 'antd';
import {
  FormFileUpload,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import { SelectCategory } from '../../../../common/SelectWithApi';
import FromSubmit from '../../../../common/Button/FromSubmit';
import type { ICreateCategory } from '../types/categoryTypes';

type Props = {
  onFinish: (values: ICreateCategory) => void;
  loading: boolean;
  form: FormInstance<ICreateCategory>;
  editMode?: boolean;
};

const CategoryInputs = ({ onFinish, loading, form, editMode }: Props) => {
  return (
    <Form<ICreateCategory>
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={{ status: 'ACTIVE', display_order: 0 }}
    >
      <Row gutter={[16, 0]}>
        <FormInputText
          name='name'
          label='Category Name'
          placeholder='Enter category name'
          required
          md={12}
        />
        <SelectCategory
          name='parent_id'
          label='Parent Category'
          placeholder='Select parent category if subcategory'
          required={false}
          md={12}
        />
        <FormInputNumber
          name='display_order'
          label='Display Order'
          placeholder='0'
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
          placeholder='Enter category description'
          md={24}
          lg={24}
        />
        <FormFileUpload
          name='image'
          label='Category Image'
          maxCount={1}
          accept='image/*'
          md={24}
          lg={24}
        />
      </Row>
      <FromSubmit
        text={editMode ? 'Update Category' : 'Create Category'}
        loading={loading}
      />
    </Form>
  );
};

export default CategoryInputs;
