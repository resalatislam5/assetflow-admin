import { Form, Row, type FormInstance } from 'antd';
import FromSubmit from '../../../common/Button/FromSubmit';
import {
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../common/Form/FormIInput';
import type { ICreateStoreProduct } from '../types/storeTypes';

type Props = {
  onFinish: (values: ICreateStoreProduct) => void;
  form: FormInstance;
  loading: boolean;
  editMode?: boolean;
};

const StoreProductInputs = ({ onFinish, form, loading, editMode }: Props) => {
  return (
    <Form onFinish={onFinish} form={form} layout='vertical'>
      <Row gutter={[12, 12]}>
        <FormInputText
          name='name'
          label='Product Name'
          placeholder='Enter product name (e.g. Office Chair, Laptop, Pen)'
          required
          lg={12}
        />

        <FormInputText
          name='code'
          label='Product Code'
          placeholder='Enter unique product code (e.g. PRD-001)'
          required
          lg={12}
        />

        <FormInputNumber
          name='unit_price'
          label='Unit Price (৳)'
          placeholder='Enter unit price'
          required
          lg={12}
        />

        {!editMode && (
          <FormInputNumber
            name='initial_stock'
            label='Initial Stock (Quantity)'
            placeholder='Enter initial stock quantity'
            required={false}
            lg={12}
          />
        )}

        {editMode && (
          <FormInputSelect
            name='status'
            label='Status'
            required
            lg={12}
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
            ]}
          />
        )}

        <FormInputTextArea
          name='description'
          label='Description / Specifications'
          placeholder='Enter optional product details, brand, or model specifications'
          required={false}
          lg={24}
          rows={3}
        />
      </Row>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
        <FromSubmit text={editMode ? 'Update Product' : 'Create Product'} loading={loading} />
      </div>
    </Form>
  );
};

export default StoreProductInputs;
