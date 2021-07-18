import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  SafetyCertificateOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {Alert, message, Space, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import ProForm, {
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText
} from '@ant-design/pro-form';
import {connect, FormattedMessage, history, useIntl} from 'umi';
import {checkCaptcha, queryCaptcha} from '@/services/login';
import * as CryptoJS from 'crypto-js/crypto-js';
import styles from './index.less';
import {getPageQuery} from "@/utils/utils";
import {queryCurrent} from "@/services/user";

const LoginMessage = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const {userLogin = {}, submitting} = props;
  const {status, type: loginType} = userLogin;
  const [type, setType] = useState('account');
  const [captcha, setCaptcha] = useState('/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAoAHgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2WQuInMSq0gB2qzbQT2BODge+DWf/AGxFb/LqMUlkw+88gJh+vmj5QCeBu2seOBkVemghuECTxRyqDkB1DDP41D/Z1uPumdR2VLiRQPYANgD2FflNKVFK1SN/TR/qvwPTi4W94tUVjw6All5h0+9ubbKFY4gwaGP0xGRjr1PBPPOSTTXuNYsmAufKmgAA+0QWzSNnHJaMNkZPTbu9TtFX9XjN2oyv66P5LW/ond9h+zTfus2qKwj4jjB2RvbXEo+9FA0jyr7tEqMye4PQnBOakmvtbk8tbfSVhDIC8k0qOY27jYGAYds7x1zjjBHg60Xaa5fXT89X8tQ9jNb6GzRWNb/u51nvLrUpp1z+78h0jQkfMAqLhh6bi+MDB6k3/wC07AfevIFPdXkCkexB5B9jWVSlyu0dfk7fL/hl+pLptbalqikVldFdGDKwyCDkEVBL++uEh/hTEj/n8o/MZ/4D71mo3Zm3YsUVVvL+Kz2KyySzSZ8uGJCzvj+QyQCxwoyMkZqW3eWWBXmh8l2yfL3BiozxkjjOMZxkA5wT1NOlJQU2tH/X9MZLVPz5JtU8iJsQwJumIH3nb7qZ9hliODynYmnahcvbWpMIVriQiOFW5Bc9Mgc4HU46KCe1SWtslpbiJCzDLMzN1ZmJZie3JJPHHPGKEko8z6/1/X/AKWiuTUUUVBJniVLrU5I4tUjKpEVa1jKl0cN98nrx0wRj1qGbWoLG5NrLMLqVSA0dshkmQHu8agnGMfNx1HHIqld2cF741EVwrNGNOyUDsob950YA/MpzypyD3Fb1vbQWkCwW0McMK52xxoFUZOTgD3r06jo0oxUk5XSdtFb/ALeWv4a9XoZ0HGSk5Xum1/V7mfHeanfoGtLSG1ibjzbqQSMCPRIyQw7ffBznjjls2hteRMt9qV5MzdkYRxr/AHl2AYZT0xJv44zySdJraMy+aoKSZBLIcbvr68cc9O2KlrnlieV3oLl+Wq+bu/xV+3fdVJLZWPN7i3l03XrfT9Qligt/ux3NnDFC6IxOCrAAoNxO4Z7t1zz0B/tp9TmSx1eS8tLc7ZlMUaSZxyqvs2sw7ghQMgE9SJPE1lLrW2ztrcO1uDI024DaxU7Yx7k7SemBt9RTPBerR3emCwKqk1sO2BvUk8gD06H8DnJr1amJnUwyrNKTWjTSdr9e6v5NPrsdkqjlT57Xa3+fU2rfVIJZ1t5lktbps7YLgBWbjPykEq+BydpOM84qa6vbWxiEt3cw28ZbaHmkCAn0ye/Bp9xbwXcDQXMMc0TY3RyKGU4OeQfeuV1VLWNC+lz+a2nubjypQZLO3ZAQxYgEqVU8Rocg7TtAya8/D4eliZ2jePfqvv6dldP1Zxvka0dvy/r+rmk+o+FnZne90ZmY5LNLEST+dQw2lzqG57XzLK3c4ExlkD7R0WOPICgA8McjIOFKkGvPdPnm8R+JRr2tLILKDl2hhkeNNgztABJUfxE9ATz1r2C3uILuBZ7aaOaJs7ZI2DKcHHBHvXfmGF/s5RUbyb3b1in2XRv1+4zjKo9W9CjBo8drLNLb3M8bzNmR8IzN1wCzKWIGcDJOBxWR4kiu4ZNNf7dMPOvIrb91JJHlTn7wV8H3wFPoRXU1y/jm1+26dptpv2efqEUe7Gdu4MM479a5crqyqY2HO99312+86cPL94kZ2oR3VvbtqdlczpKkbeQftLykohbzJNkmQUZdh644TBJIB6LRZrq9hhvbrzyZoQ6jCrEoOD8qhi2Txy2e+MZxWLq2lLpd3HqF7PJeaUzj7asoG/cW+R22BfMUNgbWB2joPTr45EljWSN1dHAZWU5DA9CDXRmFRfVYOL5+a/vW2/u3et1u0+juviCq+aCb1/Ty83/S7jqKKK8I5zFs1F/4h/ta2dXszZCFX5G5i+7j6Dr78dQcbVFFdmP92u6fSOi9Ec+G1pqXfUKZNG0sTIkrxMejoASPzBH6UUVxp2dzoKljpxsLV7dLy5kVslWkKsyEkkkHbycnPOayJvC9pZ3L6mlzqT3QfePJKFmdj0xtxyTznCgE5wM0UV1UK9T2m/xPXzLVWau09zQS0vb+Nft001tCAAIYZsSSe8jqAVbp8sZABB+ZgcA1jQLXWdKTTZJJra1QqQlsQgwo4XGCNvQ4x2HpRRUvFVOZSh7ttUlsvP183qZtJ7mTB4JtP7Hl0z7Zex2bSH5AIgzAEHJOzP3lznuNueAAN640uCWdriFpLW6bG6e3IVm4x8wIKvgcDcDjPGKKKueNruV3Lv8AO9r373sr33Cn7msR1qt/FKY7iSGeED5ZhlJPYMuME45LAjn+EVBqmjLqslu0l5cxC3kWWNItmA65w3Kk9+mce1FFRHEzhU9rCyfkl+W33Gim0+ZF7yVa38ib98pTY/mAHeMYOQBjn6YqjpWixaOrxWtzcm2JYrbyMrJHk5+U43fhnue/NFFTHEVIwlTT92W66CU2k10ZpUUUViSf/9k=');
  const [uuid, setUuid] = useState('');
  const [verify, setVerify] = useState('');
  const intl = useIntl();

  useEffect(async () => {
    const query = await queryCurrent();
    if (query?.data?.userInfo?.id) {
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      message.success('已经登录成功！').then(
        () => {
          let {redirect} = params;

          if (redirect) {
            const redirectUrlParams = new URL(redirect);

            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);

              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }

          history.replace(redirect || '/');
        });
      return;
    }

    const res = await queryCaptcha();

    if (res.data.status === 'error') {
      return;
    }

    if (res && res.data && res.data.authcode && res.data.uuid) {
      setCaptcha(res.data.authcode);
      setUuid(res.data.uuid);
    }
  }, []);

  // AES加密用户密码
  const encryptByAES = (un, ps) => {
    const now = new Date();
    const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
    const firstName = JSON.parse(JSON.stringify(un)).charAt(0);
    const secondName = JSON.parse(JSON.stringify(un)).charAt(1);
    const key = `${firstName}ZHILETUWLDOS${secondName}${day}`;
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(ps, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  };

  const handleSubmit = (values) => {
    if (verify !== 'ok') {
      return;
    }
    const {dispatch} = props;
    const {username, password} = values;
    const aesPassword = encryptByAES(username, password);

    dispatch({
      type: 'login/login',
      payload: {...values, password: aesPassword, type},
    });
  };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values) => {
          await handleSubmit(values);
          return Promise.resolve();
        }}
      >
        <Tabs activeKey={type} onChange={setType}>
          <Tabs.TabPane
            key="account"
            tab={intl.formatMessage({
              id: 'pages.login.accountLogin.tab',
              defaultMessage: '账户密码登录',
            })}
          />
          <Tabs.TabPane
            key="mobile"
            tab={intl.formatMessage({
              id: 'pages.login.phoneLogin.tab',
              defaultMessage: '手机号登录',
            })}
          />
        </Tabs>

        {status === 'error' && loginType === 'account' && !submitting && (
          <LoginMessage
            content={intl.formatMessage({
              id: 'pages.login.accountLogin.errorMessage',
              defaultMessage: '账户或密码错误,请确定账号存在',
            })}
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon}/>,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockTwoTone className={styles.prefixIcon}/>,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '请输入密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
            <div className={styles.captcha}>
              <div className={styles.input}>
                <ProFormText
                  name="verifycode"
                  fieldProps={{
                    size: 'large',
                    prefix: <SafetyCertificateOutlined className={styles.prefixIcon}/>,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.verifycode.placeholder',
                    defaultMessage: '请输入验证码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.verifycode.required"
                          defaultMessage="请输入验证码!"
                        />
                      ),
                    },
                    {
                      validator: async (rule, value) => {
                        if (value === undefined || value.length < 4) {
                          return Promise.reject();
                        }
                        const res = await checkCaptcha({captcha: value, uuid});
                        if (res === undefined || res.data === undefined || res.data.status === undefined) {
                          const code = await queryCaptcha();
                          if (code && code.data && code.data.authcode && code.data.uuid) {
                            setCaptcha(code.data.authcode);
                            setUuid(code.data.uuid);
                          }
                          return Promise.reject(new Error('校验超时请重试!'));
                        }
                        if (res.data.status === 'error') {
                          setVerify('error');
                          const code = await queryCaptcha();
                          if (code && code.data && code.data.authcode && code.data.uuid) {
                            setCaptcha(code.data.authcode);
                            setUuid(code.data.uuid);
                          }
                          return Promise.reject(new Error('验证码错误!'));
                        }

                        if (res.data.status === 'ok') {
                          setVerify('ok');
                          return Promise.resolve();
                        }
                        return Promise.resolve();
                      }
                    },
                  ]}
                />
              </div>
              <div onClick={async () => {
                const res = await queryCaptcha();

                if (res && res.data && res.data.authcode && res.data.uuid) {
                  setCaptcha(res.data.authcode);
                  setUuid(res.data.uuid);
                }
              }}
                   className={styles.image}><img src={`data:image/jpeg;base64,${captcha}`}
                                                 alt="验证码" height="37px" width="120px"/>
              </div>
            </div>
          </>
        )}

        {status === 'error' && loginType === 'mobile' && !submitting && (
          <LoginMessage content="验证码错误"/>
        )}
        {type === 'mobile' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileTwoTone className={styles.prefixIcon}/>,
              }}
              name="mobile"
              placeholder={intl.formatMessage({
                id: 'pages.login.phoneNumber.placeholder',
                defaultMessage: '手机号',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.phoneNumber.required"
                      defaultMessage="请输入手机号！"
                    />
                  ),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: (
                    <FormattedMessage
                      id="pages.login.phoneNumber.invalid"
                      defaultMessage="手机号格式错误！"
                    />
                  ),
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <MailTwoTone className={styles.prefixIcon}/>,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.captcha.placeholder',
                defaultMessage: '请输入验证码',
              })}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${intl.formatMessage({
                    id: 'pages.getCaptchaSecondText',
                    defaultMessage: '获取验证码',
                  })}`;
                }

                return intl.formatMessage({
                  id: 'pages.login.phoneLogin.getVerificationCode',
                  defaultMessage: '获取验证码',
                });
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.captcha.required"
                      defaultMessage="请输入验证码！"
                    />
                  ),
                },
              ]}
              onGetCaptcha={async (mobile) => {
                message.success('获取验证码成功！验证码为：1234,^0^,此功能开发中');
                /* const result = await getFakeCaptcha(mobile);

                if (result === false) {
                  return;
                }

                message.success('获取验证码成功！验证码为：1234'); */
              }}
            />
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin" checked={false}
                           defaultChecked={false}>
            <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码"/>
          </a>
          <a href={"/user/register"}
             style={{
               float: 'right',
               marginRight: 5,
             }}
          >
            <FormattedMessage id="pages.login.registerAccount" defaultMessage="注册账号"/>
          </a>
        </div>
      </ProForm>
      <Space className={styles.other}>
        <FormattedMessage id="pages.login.loginWith" defaultMessage="快捷登录"/>
        <AlipayCircleOutlined className={styles.icon}/>
        <TaobaoCircleOutlined className={styles.icon}/>
        <WeiboCircleOutlined className={styles.icon}/>
      </Space>
    </div>
  );
};

export default connect(({login, loading}) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
