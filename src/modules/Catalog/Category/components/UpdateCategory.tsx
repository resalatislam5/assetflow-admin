import { Card, Form, Spin } from 'antd';
import { useEffect } from 'react';
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from '../api/categoryEndpoints';
import { sanitizeFormData } from '../../../../common/utils/sanitizeFormData';
import { toUploadFileList } from '../../../../common/utils/toUploadFileList ';
import CategoryInputs from './CategoryInputs';
import type { ICreateCategory } from '../types/categoryTypes';

type Props = {
  id: string | number;
};

const UpdateCategory = ({ id }: Props) => {
  const [form] = Form.useForm<ICreateCategory>();
  const { data, isLoading: isFetching } = useGetSingleCategoryQuery(id);
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        name: data.data.name,
        parent_id: data.data.parent_id
          ? String(data.data.parent_id)
          : undefined,
        display_order: data.data.display_order,
        status: data.data.status,
        image: toUploadFileList(data.data.image),
        description: data.data.description,
      });
    }
  }, [data, form]);

  const onFinish = (values: ICreateCategory) => {
    const formData = sanitizeFormData(values, { fileKeys: ['image'] });

    updateCategory({ body: formData, id });
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
      <CategoryInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode
      />
    </Card>
  );
};

export default UpdateCategory;
