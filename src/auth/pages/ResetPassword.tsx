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
} from 'antd';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import {
  FormInputEmail,
  FormInputPassword,
  FormInputText,
} from '../../common/Form/FormIInput';
import { logo_horizontal } from '../../common/ui/image';
import { useBreakpoint } from '../../common/utils/constant';
import {
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from '../api/authEndpoint';

const { Text } = Typography;

const authThemeToken = {
  colorPrimary: '#10B981',
  colorPrimaryHover: '#059669',
  colorPrimaryActive: '#047857',
  colorLink: '#10B981',
  colorLinkHover: '#059669',
};

const ResetPassword = () => {
  const { sm } = useBreakpoint();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [otpToken, setOtpToken] = useState('');

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();
  const [form] = Form.useForm();

  const email = searchParams.get('email');

  const onFinish = async (values: { otp?: string; password?: string }) => {
    if (!email) return;

    if (step === 1) {
      try {
        await verifyOtp({ email, token: values.otp || '' }).unwrap();
        setOtpToken(values.otp || '');
        setStep(2);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        form.setFields([
          { name: 'otp', errors: [err?.data?.message || 'Invalid OTP'] },
        ]);
      }
    } else {
      try {
        await resetPassword({
          token: otpToken,
          email,
          new_password: values.password || '',
        }).unwrap();

        navigate('/auth/login');
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        form.setFields([
          {
            name: 'password',
            errors: [err?.data?.message || 'Failed to reset password'],
          },
        ]);
      }
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm, token: authThemeToken }}>
      <Flex style={{ flexDirection: 'column' }} gap={16}>
        <Space orientation='vertical' size={4}>
          <Image
            src={logo_horizontal}
            alt='AssetFlow'
            width={160}
            preview={false}
            style={{ marginLeft: -8, marginBottom: 8 }}
          />

          <h1 style={{ fontSize: sm ? 30 : 24, margin: 0 }}>
            {step === 1 ? 'Verify OTP' : 'Set New Password'}
          </h1>
          <Text>
            {step === 1
              ? 'Enter the 6-digit OTP sent to your email.'
              : 'Create a new strong password for your account.'}
          </Text>
        </Space>

        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{ email: email || '' }}
        >
          <Row>
            <FormInputEmail
              lg={24}
              label='Email'
              name='email'
              required
              disabled
              style={{ marginBottom: 12 }}
            />

            {step === 1 && (
              <FormInputText
                lg={24}
                label='OTP Code'
                name='otp'
                required
                placeholder='6-digit OTP'
                rules={[{ len: 6, message: 'OTP must be exactly 6 digits!' }]}
                style={{ marginBottom: 20 }}
              />
            )}

            {step === 2 && (
              <>
                <FormInputPassword
                  lg={24}
                  label='New Password'
                  name='password'
                  required
                  placeholder='New Password'
                  rules={[
                    {
                      min: 6,
                      message: 'Password must be at least 6 characters!',
                    },
                  ]}
                  style={{ marginBottom: 12 }}
                />

                <FormInputPassword
                  lg={24}
                  label='Confirm Password'
                  name='confirmPassword'
                  required
                  placeholder='Confirm New Password'
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Passwords do not match!'),
                        );
                      },
                    }),
                  ]}
                  style={{ marginBottom: 20 }}
                />
              </>
            )}

            <Col xs={24}>
              <Button
                type='primary'
                htmlType='submit'
                block
                size='large'
                loading={step === 1 ? isVerifying : isResetting}
                style={{ height: 44, fontSize: 16, fontWeight: 600, borderRadius: 8 }}
              >
                {step === 1 ? 'Verify OTP' : 'Reset Password'}
              </Button>
            </Col>
          </Row>
        </Form>
        <Flex justify='center' style={{ width: '100%', marginTop: -10 }}>
          <Text type='secondary'>
            Remember your password?{' '}
            <Link to='/auth/login' style={{ color: '#10B981', fontWeight: 600 }}>
              Log in
            </Link>
          </Text>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default ResetPassword;
