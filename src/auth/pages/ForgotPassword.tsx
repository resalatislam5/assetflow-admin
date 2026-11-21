import { Button, Form, ConfigProvider, Flex, Space, Image, theme, Typography, Row, Col } from 'antd';
import { Link, useNavigate } from 'react-router';
import { useForgotPasswordMutation } from '../api/authEndpoint';
import { useBreakpoint } from '../../common/utils/constant';
import { logo_horizontal } from '../../common/ui/image';
import { FormInputEmail } from '../../common/Form/FormIInput';

const { Text } = Typography;

const authThemeToken = {
  colorPrimary: '#10B981',
  colorPrimaryHover: '#059669',
  colorPrimaryActive: '#047857',
  colorLink: '#10B981',
  colorLinkHover: '#059669',
};

const ForgotPassword = () => {
  const { sm } = useBreakpoint();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    try {
      await forgotPassword({ email: values.email }).unwrap();
      navigate(`/auth/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch {
    }
  };

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

          <h1 style={{ fontSize: sm ? 32 : 24, margin: 0, fontWeight: 700, color: '#1E293B' }}>
            Forgot Password?
          </h1>
          <Text style={{ color: '#64748B' }}>
            Enter your email address and we'll send you a 6-digit OTP to reset your password.
          </Text>
        </Space>
        
        <Form layout="vertical" onFinish={onFinish}>
          <Row>
            <FormInputEmail lg={24} label="Email" name="email" required size="large" />
            
            <Col xs={24} style={{ marginTop: 10 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
                style={{ height: 44, fontSize: 16, fontWeight: 600, borderRadius: 8 }}
              >
                Send OTP
              </Button>
            </Col>
          </Row>
        </Form>
        <Flex justify='center' style={{ width: '100%', marginTop: -10 }}>
          <Text type="secondary">
            Remember your password?{' '}
            <Link to="/auth/login" style={{ color: '#10B981', fontWeight: 600 }}>
              Log in
            </Link>
          </Text>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default ForgotPassword;
