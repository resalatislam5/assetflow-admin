import { Form, Row, type FormInstance } from 'antd';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import { SelectBranch } from '../../../../common/SelectWithApi/Select';
import type { ICreateWarehouse } from '../types/warehouseTypes';

type Props = {
  onFinish: (values: ICreateWarehouse) => void;
  form: FormInstance<ICreateWarehouse>;
  loading: boolean;
  editMode?: boolean;
};

const WarehouseInputs = ({ onFinish, form, loading, editMode }: Props) => {
  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{
        type: 'OUTLET_STORE',
        allow_negative_stock: false,
        is_active: true,
      }}
    >
      <Row gutter={[12, 12]}>
        <FormInputText
          name='name'
          label='Warehouse Name'
          placeholder='Enter warehouse name'
          required
          lg={12}
        />

        <FormInputText
          name='code'
          label='Warehouse Code'
          placeholder='e.g. WH-DHAKA-01'
          required
          lg={12}
        />

        <SelectBranch
          name='branch_id'
          label='Assigned Branch (Optional - for Branch Godown)'
          placeholder='Select branch or leave empty for Central Distribution Warehouse'
          required={false}
          lg={12}
          allowClear
        />

        <FormInputSelect
          name='type'
          label='Warehouse Type'
          required
          lg={12}
          options={[
            { label: 'OUTLET_STORE', value: 'OUTLET_STORE' },
            { label: 'CENTRAL_WAREHOUSE', value: 'CENTRAL_WAREHOUSE' },
            { label: 'VIRTUAL', value: 'VIRTUAL' },
          ]}
        />

        <FormInputText
          name='phone'
          label='Contact Phone'
          placeholder='e.g. +8801700000000'
          required={false}
          lg={12}
        />

        <FormInputText
          name='email'
          label='Contact Email'
          placeholder='e.g. warehouse@example.com'
          required={false}
          lg={12}
        />

        <FormInputSelect
          name='allow_negative_stock'
          label='Allow Negative Stock'
          required
          lg={12}
          options={[
            { label: 'NO', value: false },
            { label: 'YES', value: true },
          ]}
        />

        {editMode && (
          <FormInputSelect
            name='is_active'
            label='Status'
            required
            lg={12}
            options={[
              { label: 'ACTIVE', value: true },
              { label: 'INACTIVE', value: false },
            ]}
          />
        )}

        <FormInputTextArea
          name='address'
          label='Physical Address'
          placeholder='Enter full street address and location'
          required
          lg={24}
          rows={3}
        />
      </Row>

      <FromSubmit
        text={editMode ? 'Update Warehouse' : 'Create Warehouse'}
        loading={loading}
      />
    </Form>
  );
};

export default WarehouseInputs;
