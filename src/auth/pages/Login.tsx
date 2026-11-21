import React from 'react';
import {
  Button,
  Col,
  ConfigProvider,
  Flex,
  Form,
  Image,
  Row,
  Space,
  theme,
  Typography,
  Result,
} from 'antd';
import { Link, useNavigate } from 'react-router';
import {
  FormInputPassword,
  FormInputText,
} from '../../common/Form/FormIInput';
import { useBreakpoint } from '../../common/utils/constant';
import { useLoginMutation } from '../api/authEndpoint';
import type { LoginTypes } from '../types/authTypes';
import { logo_horizontal } from '../../common/ui/image';

const { Text } = Typography;

const authThemeToken = {
  colorPrimary: '#10B981',
  colorPrimaryHover: '#059669',
  colorPrimaryActive: '#047857',
  colorLink: '#10B981',
  colorLinkHover: '#059669',
};

const Login = () => {
  const { sm } = useBreakpoint();
  const [form] = Form.useForm();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const location = window.location;

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('assetflow_token', token);
      navigate('/');
    }
  }, [location.search, navigate]);

  const [isExpired, setIsExpired] = React.useState(false);

  const onFinish = (values: LoginTypes) => {
    login(values)
      .unwrap()
      .then((data) => {
        if (data.data) {
          localStorage.setItem('assetflow_token', data?.data?.token);
          navigate('/');
        }
      })
      .catch((err: unknown) => {
        const error = err as {
          data?: {
            code?: string;
            message?: string;
          };
        };
        if (
          error?.data?.code === 'SUBSCRIPTION_EXPIRED' ||
          error?.data?.message?.includes('subscription has expired')
        ) {
          setIsExpired(true);
        }
      });
  };

  if (isExpired) {
    return (
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm, token: authThemeToken }}>
        <Flex
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
          gap={20}
        >
          <Result
            status='error'
            title={
              <Typography.Title
                level={2}
                style={{ color: '#ff4d4f', margin: 0 }}
              >
                Subscription Expired
              </Typography.Title>
            }
            subTitle={
              <Typography.Text style={{ fontSize: 16 }}>
                Your tenant subscription has ended. Please contact the
                administration or support team to renew your access.
              </Typography.Text>
            }
            extra={[
              <Button
                type='primary'
                size='large'
                key='console'
                onClick={() => setIsExpired(false)}
              >
                Back to Login
              </Button>,
              <Button size='large' key='buy'>
                Contact Support
              </Button>,
            ]}
            style={{
              padding: '40px 20px',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              maxWidth: 500,
            }}
          />
        </Flex>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm, token: authThemeToken }}>
      <Flex style={{ flexDirection: 'column' }} gap={24}>
        <Space orientation='vertical' size={4}>
          <Image
            src={logo_horizontal}
            alt='AssetFlow'
            width={180}
            preview={false}
            style={{ marginLeft: -8, marginBottom: 8 }}
          />

          <h1 style={{ fontSize: sm ? 36 : 28, margin: 0, fontWeight: 700, color: '#1E293B' }}>
            Welcome Back!
          </h1>
          <Text style={{ color: '#64748B' }}>Please enter log in details below</Text>
        </Space>
        <Form form={form} onFinish={onFinish} layout='vertical'>
          <Row>
            <FormInputText
              lg={24}
              label='Email or Phone'
              name='email'
              required
              placeholder='Enter your email or phone number'
            />
            <FormInputPassword
              lg={24}
              label='Password'
              name='password'
              required
              style={{ marginBottom: 8 }}
            />
            <Flex justify='end' style={{ width: '100%' }}>
              <Link
                to={'/auth/forgot-password'}
                style={{
                  fontWeight: 500,
                  marginBottom: 16,
                  color: '#10B981',
                }}
              >
                Forgot Password?
              </Link>
            </Flex>
            <Col xs={24}>
              <Button
                size='large'
                type='primary'
                htmlType='submit'
                loading={isLoading}
                block
                style={{
                  height: 44,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                Login
              </Button>
            </Col>
          </Row>
        </Form>
      </Flex>
    </ConfigProvider>
  );
};

export default Login;
