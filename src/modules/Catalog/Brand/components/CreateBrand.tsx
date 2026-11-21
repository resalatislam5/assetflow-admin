import { Card, Form } from 'antd';
import { useCreateBrandMutation } from '../api/brandEndpoints';
import { sanitizeFormData } from '../../../../common/utils/sanitizeFormData';
import BrandInputs from './BrandInputs';
import type { ICreateBrand } from '../types/brandTypes';

const CreateBrand = () => {
  const [form] = Form.useForm<ICreateBrand>();
  const [createBrand, { isLoading }] = useCreateBrandMutation();

  const onFinish = (values: ICreateBrand) => {
    const formData = sanitizeFormData(values, { fileKeys: ['logo'] });

    createBrand(formData)
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card className='modal-container'>
      <BrandInputs form={form} onFinish={onFinish} loading={isLoading} />
    </Card>
  );
};

export default CreateBrand;
