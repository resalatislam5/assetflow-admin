import { Card, Form } from 'antd';
import { useCreateCategoryMutation } from '../api/categoryEndpoints';
import { sanitizeFormData } from '../../../../common/utils/sanitizeFormData';
import CategoryInputs from './CategoryInputs';
import type { ICreateCategory } from '../types/categoryTypes';

const CreateCategory = () => {
  const [form] = Form.useForm<ICreateCategory>();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const onFinish = (values: ICreateCategory) => {
    const formData = sanitizeFormData(values, { fileKeys: ['image'] });

    createCategory(formData)
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card className='modal-container'>
      <CategoryInputs form={form} onFinish={onFinish} loading={isLoading} />
    </Card>
  );
};

export default CreateCategory;
