import {
  Checkbox,
  Col,
  Form,
  Row,
  Table,
  Typography,
  type FormInstance,
  type TableColumnsType,
} from 'antd';

import { FormInputText } from '../../../../common/Form/FormIInput';
import { useGetModuleListQuery } from '../api/roleEndpoints';
import type { ICreateRole, IPermission } from '../types/roleTypes';
import FromSubmit from '../../../../common/Button/FromSubmit';

interface IModule {
  id: string | number;
  name: string;
}

type PermissionField = 'can_read' | 'can_create' | 'can_update' | 'can_delete';

type Props = {
  onFinish: (values: ICreateRole) => void;
  loading: boolean;
  form: FormInstance<ICreateRole>;
  editMode?: boolean;
};

const RoleInputs = ({ onFinish, loading, editMode, form }: Props) => {
  const { data, isLoading, isFetching } = useGetModuleListQuery({});
  const modules: IModule[] = (data?.data as unknown as IModule[]) || [];

  const getModId = (record: IModule): string => String(record.id ?? '');

  const getPermissionIndex = (moduleId: string): number => {
    const permissions: Partial<IPermission>[] = form.getFieldValue('permissions') || [];
    const found = permissions.findIndex((p) => String(p?.module_id) === moduleId);
    if (found !== -1) return found;
    permissions.push({ module_id: moduleId });
    form.setFieldsValue({ permissions } as Partial<ICreateRole>);
    return permissions.length - 1;
  };

  const getPermission = (moduleId: string): Partial<IPermission> => {
    const permissions: Partial<IPermission>[] = form.getFieldValue('permissions') || [];
    return permissions.find((p) => String(p?.module_id) === moduleId) || {};
  };

  const handlePermissionChange = (
    moduleId: string,
    field: PermissionField,
    checked: boolean,
  ) => {
    const permissions: Partial<IPermission>[] = form.getFieldValue('permissions') || [];
    const idx = getPermissionIndex(moduleId);
    const current = permissions[idx] || {};

    const updated: Partial<IPermission> = {
      ...current,
      module_id: moduleId,
      [field]: checked,
    };

    updated.selected =
      Boolean(updated.can_read) ||
      Boolean(updated.can_create) ||
      Boolean(updated.can_update) ||
      Boolean(updated.can_delete);

    permissions[idx] = updated;
    form.setFieldsValue({ permissions } as Partial<ICreateRole>);
  };

  const handleSelectChange = (moduleId: string, checked: boolean) => {
    const permissions: Partial<IPermission>[] = form.getFieldValue('permissions') || [];
    const idx = getPermissionIndex(moduleId);

    permissions[idx] = {
      ...permissions[idx],
      module_id: moduleId,
      can_read: checked,
      can_create: checked,
      can_update: checked,
      can_delete: checked,
      selected: checked,
    };

    form.setFieldsValue({ permissions } as Partial<ICreateRole>);
  };

  const columns: TableColumnsType<IModule> = [
    {
      title: 'Module',
      key: 'module',
      render: (_, record) => {
        const modId = getModId(record);
        const perm = getPermission(modId);
        const isSelected =
          perm.can_read ||
          perm.can_create ||
          perm.can_update ||
          perm.can_delete ||
          false;

        const idx = getPermissionIndex(modId);

        return (
          <>
            <Form.Item
              name={[idx, 'module_id']}
              initialValue={modId}
              hidden
            >
              <input />
            </Form.Item>

            <Form.Item
              name={[idx, 'selected']}
              valuePropName='checked'
              style={{ margin: 0 }}
            >
              <Checkbox
                checked={isSelected}
                onChange={(e) =>
                  handleSelectChange(modId, e.target.checked)
                }
              >
                <Typography.Text style={{ marginLeft: 8 }}>
                  {record.name}
                </Typography.Text>
              </Checkbox>
            </Form.Item>
          </>
        );
      },
    },

    {
      title: 'Read',
      align: 'center',
      render: (_, record) => {
        const modId = getModId(record);
        const idx = getPermissionIndex(modId);
        return (
          <Form.Item
            name={[idx, 'can_read']}
            valuePropName='checked'
            initialValue={false}
            style={{ margin: 0 }}
          >
            <Checkbox
              onChange={(e) =>
                handlePermissionChange(modId, 'can_read', e.target.checked)
              }
            />
          </Form.Item>
        );
      },
    },

    {
      title: 'Create',
      align: 'center',
      render: (_, record) => {
        const modId = getModId(record);
        const idx = getPermissionIndex(modId);
        return (
          <Form.Item
            name={[idx, 'can_create']}
            valuePropName='checked'
            initialValue={false}
            style={{ margin: 0 }}
          >
            <Checkbox
              onChange={(e) =>
                handlePermissionChange(
                  modId,
                  'can_create',
                  e.target.checked,
                )
              }
            />
          </Form.Item>
        );
      },
    },

    {
      title: 'Update',
      align: 'center',
      render: (_, record) => {
        const modId = getModId(record);
        const idx = getPermissionIndex(modId);
        return (
          <Form.Item
            name={[idx, 'can_update']}
            valuePropName='checked'
            initialValue={false}
            style={{ margin: 0 }}
          >
            <Checkbox
              onChange={(e) =>
                handlePermissionChange(
                  modId,
                  'can_update',
                  e.target.checked,
                )
              }
            />
          </Form.Item>
        );
      },
    },

    {
      title: 'Delete',
      align: 'center',
      render: (_, record) => {
        const modId = getModId(record);
        const idx = getPermissionIndex(modId);
        return (
          <Form.Item
            name={[idx, 'can_delete']}
            valuePropName='checked'
            initialValue={false}
            style={{ margin: 0 }}
          >
            <Checkbox
              onChange={(e) =>
                handlePermissionChange(
                  modId,
                  'can_delete',
                  e.target.checked,
                )
              }
            />
          </Form.Item>
        );
      },
    },
  ];

  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Row gutter={[12, 12]}>
        <FormInputText name='name' label='Role Name' required lg={24} />

        <Col span={24}>
          <Form.List name='permissions'>
            {() => (
              <Table<IModule>
                rowKey={(record) => getModId(record) || record.name}
                size='small'
                bordered
                columns={columns}
                dataSource={modules}
                pagination={false}
                loading={isLoading || isFetching}
                scroll={{ x: 'max-content' }}
              />
            )}
          </Form.List>
        </Col>
      </Row>

      <FromSubmit
        style={{ marginTop: '16px' }}
        text={editMode ? 'Update' : 'Create'}
        loading={loading}
      />
    </Form>
  );
};

export default RoleInputs;
