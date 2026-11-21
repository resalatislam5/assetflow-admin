import { Card, Form, Spin } from 'antd';
import { useEffect } from 'react';
import {
  useGetSingleBrandQuery,
  useUpdateBrandMutation,
} from '../api/brandEndpoints';
import { sanitizeFormData } from '../../../../common/utils/sanitizeFormData';
import { toUploadFileList } from '../../../../common/utils/toUploadFileList ';
import BrandInputs from './BrandInputs';
import type { ICreateBrand } from '../types/brandTypes';

type Props = {
  id: string | number;
};

const UpdateBrand = ({ id }: Props) => {
  const [form] = Form.useForm<ICreateBrand>();
  const { data, isLoading: isFetching } = useGetSingleBrandQuery(id);
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        name: data.data.name,
        logo: toUploadFileList(data.data.logo),
        website: data.data.website,
        status: data.data.status,
        description: data.data.description,
      });
    }
  }, [data, form]);

  const onFinish = (values: ICreateBrand) => {
    const formData = sanitizeFormData(values, { fileKeys: ['logo'] });

    updateBrand({ body: formData, id });
  };

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <Card className='modal-container'>
      <BrandInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode
      />
    </Card>
  );
};

export default UpdateBrand;
