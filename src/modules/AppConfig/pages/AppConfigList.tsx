import {
  Form,
  Row,
  Typography,
  theme,
} from 'antd';
import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import FromSubmit from '../../../common/Button/FromSubmit';
import {
  FormFileUpload,
  FormInputNumber,
  FormInputText,
  FormInputTextArea,
} from '../../../common/Form/FormIInput';
import { sanitizeFormData } from '../../../common/utils/sanitizeFormData';
import { toUploadFileList } from '../../../common/utils/toUploadFileList ';
import {
  useGetAppConfigListQuery,
  useUpdateAppConfigMutation,
} from '../api/appConfigEndpoints';
import type { ICreateAppConfig } from '../types/appConfigTypes';

const { Text, Title } = Typography;

const AppConfigList = () => {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const sectionTitle = (label: string) => (
    <Text
      type='secondary'
      style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: 14,
      }}
    >
      {label}
    </Text>
  );

  const cardStyle: CSSProperties = {
    background: colorBgContainer,
    border: `1px solid ${colorBorderSecondary}`,
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 20,
    transition: 'background 0.3s ease, border-color 0.3s ease',
  };

  const { data, isLoading } = useGetAppConfigListQuery();
  const [updateAppConfig, { isLoading: updating }] =
    useUpdateAppConfigMutation();

  const [form] = Form.useForm<ICreateAppConfig>();

  const onFinish = (values: ICreateAppConfig) => {
    const body = sanitizeFormData(values, {
      fileKeys: ['logo', 'favicon'],
    });
    updateAppConfig(body);
  };

  useEffect(() => {
    if (data?.data) {
      const c = data.data;
      form.setFieldsValue({
        company_name: c.company_name || c.name || 'AssetFlow',
        name: c.company_name || c.name || 'AssetFlow',
        phone: c.phone,
        email: c.email,
        address: c.address,
        currency: c.currency || 'BDT',
        currency_symbol: c.currency_symbol || '৳',
        default_locale: c.default_locale || 'en-US',
        safety_stock: c.safety_stock ?? 5,
        invoice_footer_text: c.invoice_footer_text,
        logo: toUploadFileList(c.logo),
        favicon: toUploadFileList(c.favicon),
      });
    }
  }, [data?.data, form]);

  return (
    <div style={{ padding: '24px 28px', maxWidth: 980 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          System & Enterprise Configuration
        </Title>
        <Text type='secondary' style={{ fontSize: 13 }}>
          Manage your organization profile, default currency, stock safety thresholds, and invoices.
        </Text>
      </div>

      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        disabled={isLoading}
      >
        <div style={{ marginBottom: 20 }}>
          {sectionTitle('Company & Organization')}
          <div style={cardStyle}>
            <Row gutter={[16, 8]}>
              <FormInputText
                name='company_name'
                label='Company Name'
                placeholder='AssetFlow Ltd.'
                required
                lg={12}
              />
              <FormInputText
                name='email'
                label='Support / Corporate Email'
                placeholder='info@assetflow.com'
                lg={12}
              />
              <FormInputText
                name='phone'
                label='Corporate Phone'
                placeholder='+880 1700 000000'
                lg={12}
              />
              <FormInputText
                name='address'
                label='Head Office Address'
                placeholder='House 12, Road 5, Dhanmondi, Dhaka'
                lg={12}
              />
            </Row>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          {sectionTitle('Currency & Localization')}
          <div style={cardStyle}>
            <Row gutter={[16, 8]}>
              <FormInputText
                name='currency'
                label='Currency Code'
                placeholder='BDT'
                lg={8}
              />
              <FormInputText
                name='currency_symbol'
                label='Currency Symbol'
                placeholder='৳'
                lg={8}
              />
              <FormInputText
                name='default_locale'
                label='Default Locale'
                placeholder='en-US'
                lg={8}
              />
            </Row>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          {sectionTitle('Inventory & Invoicing')}
          <div style={cardStyle}>
            <Row gutter={[16, 8]}>
              <FormInputNumber
                name='safety_stock'
                label='Global Safety Stock Alert'
                placeholder='5'
                min={0}
                lg={8}
              />
              <FormInputTextArea
                name='invoice_footer_text'
                label='Invoice Footer Note'
                placeholder='Thank you for your business!'
                lg={16}
              />
            </Row>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          {sectionTitle('Brand Logos & Icons')}
          <div style={cardStyle}>
            <Row gutter={[16, 16]}>
              <FormFileUpload
                label='Company Brand Logo'
                name='logo'
                maxCount={1}
                accept='image/*'
                lg={12}
              />
              <FormFileUpload
                label='System Favicon'
                name='favicon'
                maxCount={1}
                accept='image/*'
                lg={12}
              />
            </Row>
          </div>
        </div>

        <FromSubmit text='Save Changes' loading={updating} />
      </Form>
    </div>
  );
};

export default AppConfigList;
