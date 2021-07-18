import {Button, Form, Input, message, Popover, Progress, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {connect, FormattedMessage, history, Link, useIntl} from 'umi';
import styles from './style.less';
import {SafetyCertificateOutlined} from "@ant-design/icons";
import {checkCaptcha, queryCaptcha} from "@/services/login";
import {ProFormText} from "@ant-design/pro-form";

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
    ok: (
        <div className={styles.success}>
            <FormattedMessage id="userandregister.strength.strong"/>
        </div>
    ),
    pass: (
        <div className={styles.warning}>
            <FormattedMessage id="userandregister.strength.medium"/>
        </div>
    ),
    poor: (
        <div className={styles.error}>
            <FormattedMessage id="userandregister.strength.short"/>
        </div>
    ),
};
const passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    poor: 'exception',
};

const Register = ({submitting, dispatch, userAndregister}) => {
    const [count, setcount] = useState(0);
    const [visible, setvisible] = useState(false);
    const [prefix, setprefix] = useState('86');
    const [popover, setpopover] = useState(false);
    const intl = useIntl();
    const [captcha, setCaptcha] = useState('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');
    const [uuid, setUuid] = useState('');
    const [verify, setVerify] = useState('');
    const confirmDirty = false;
    let interval;
    const [form] = Form.useForm();
    useEffect(() => {
        if (!userAndregister) {
            return;
        }

        const account = form.getFieldValue('email');

        if (userAndregister.status === 'ok') {
            message.success('注册成功！');
            history.push({
                pathname: '/user/register-result',
                state: {
                    account,
                },
            });
        } else if (userAndregister.status === 'error')
               message.error('抱歉，某些原因注册失败，请重试！');
    }, [userAndregister]);
    useEffect(
        () => () => {
            clearInterval(interval);
        },
        [],
    );
    useEffect(async () => {
        const res = await queryCaptcha();

        if (res.data.status === 'error') {
            return;
        }

        if (res && res.data && res.data.authcode && res.data.uuid) {
            setCaptcha(res.data.authcode);
            setUuid(res.data.uuid);
        }
    }, []);

    const onGetCaptcha = () => {
        let counts = 59;
        setcount(counts);
        interval = window.setInterval(() => {
            counts -= 1;
            setcount(counts);

            if (counts === 0) {
                clearInterval(interval);
            }
        }, 1000);
    };

    const getPasswordStatus = () => {
        const value = form.getFieldValue('passwd');

        if (value && value.length > 9) {
            return 'ok';
        }

        if (value && value.length > 5) {
            return 'pass';
        }

        return 'poor';
    };

    const onFinish = (values) => {
        if (verify !== 'ok') {
            return;
        }
        dispatch({
            type: 'userAndregister/submit',
            payload: {...values, prefix},
        });
    };

    const checkConfirm = (_, value) => {
        const promise = Promise;

        if (value && value !== form.getFieldValue('passwd')) {
            return promise.reject(
                intl.formatMessage({
                    id: 'userandregister.password.twice',
                }),
            );
        }

        return promise.resolve();
    };

    const checkPassword = (_, value) => {
        const promise = Promise; // 没有值的情况

        if (!value) {
            setvisible(!!value);
            return promise.reject(
                intl.formatMessage({
                    id: 'userandregister.password.required',
                }),
            );
        } // 有值的情况

        if (!visible) {
            setvisible(!!value);
        }

        setpopover(!popover);

        if (value.length < 6) {
            return promise.reject('');
        }

        if (value && confirmDirty) {
            form.validateFields(['confirm']);
        }

        return promise.resolve();
    };

    const changePrefix = (value) => {
        setprefix(value);
    };

    const renderPasswordProgress = () => {
        const value = form.getFieldValue('passwd');
        const passwordStatus = getPasswordStatus();
        return value && value.length ? (
            <div className={styles[`progress-${passwordStatus}`]}>
                <Progress
                    status={passwordProgressMap[passwordStatus]}
                    className={styles.progress}
                    strokeWidth={6}
                    percent={value.length * 10 > 100 ? 100 : value.length * 10}
                    showInfo={false}
                />
            </div>
        ) : null;
    };

    return (
        <div className={styles.main}>
            <h3>
                <FormattedMessage id="userandregister.register.register"/>
            </h3>
            <Form form={form} name="UserRegister" onFinish={onFinish}>
                <FormItem
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'userandregister.email.required',
                            }),
                        },
                        {
                            type: 'email',
                            message: intl.formatMessage({
                                id: 'userandregister.email.wrong-format',
                            }),
                        },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder={intl.formatMessage({
                            id: 'userandregister.email.placeholder',
                        })}
                    />
                </FormItem>
                <FormItem
                    name="accountName"
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'userandregister.accountName.required',
                            }),
                        },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder={intl.formatMessage({
                            id: 'userandregister.accountName.placeholder',
                        })}
                    />
                </FormItem>
                <Popover
                    getPopupContainer={(node) => {
                        if (node && node.parentNode) {
                            return node.parentNode;
                        }

                        return node;
                    }}
                    content={
                        visible && (
                            <div
                                style={{
                                    padding: '4px 0',
                                }}
                            >
                                {passwordStatusMap[getPasswordStatus()]}
                                {renderPasswordProgress()}
                                <div
                                    style={{
                                        marginTop: 10,
                                    }}
                                >
                                    <FormattedMessage id="userandregister.strength.msg"/>
                                </div>
                            </div>
                        )
                    }
                    overlayStyle={{
                        width: 240,
                    }}
                    placement="right"
                    visible={visible}
                >
                    <FormItem
                        name="passwd"
                        className={
                            form.getFieldValue('passwd') &&
                            form.getFieldValue('passwd').length > 0 &&
                            styles.password
                        }
                        rules={[
                            {
                                validator: checkPassword,
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            type="password"
                            placeholder={intl.formatMessage({
                                id: 'userandregister.password.placeholder',
                            })}
                        />
                    </FormItem>
                </Popover>
                <FormItem
                    name="confirm"
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'userandregister.confirm-password.required',
                            }),
                        },
                        {
                            validator: checkConfirm,
                        },
                    ]}
                >
                    <Input
                        size="large"
                        type="password"
                        placeholder={intl.formatMessage({
                            id: 'userandregister.confirm-password.placeholder',
                        })}
                    />
                </FormItem>
                <div className={styles.captcha}>
                    <div className={styles.input}>
                        <ProFormText
                            name="verifycode"
                            fieldProps={{
                                size: 'large',
                                prefix: <SafetyCertificateOutlined
                                    className={styles.prefixIcon}/>,
                            }}
                            placeholder={intl.formatMessage({
                                id: 'pages.register.verifycode.placeholder',
                                defaultMessage: '验证码',
                            })}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <FormattedMessage
                                            id="pages.register.verifycode.required"
                                            defaultMessage="请输入验证码!"
                                        />
                                    ),
                                },
                                {
                                    validator: async (rule, value) => {
                                        if (value === undefined || value.length < 4) {
                                            return Promise.reject();
                                        }
                                        const res = await checkCaptcha({
                                            captcha: value,
                                            uuid
                                        });
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
                         className={styles.image}><img
                        src={`data:image/jpeg;base64,${captcha}`} alt="验证码" height="37px"
                        width="120px"/></div>
                </div>
                <FormItem>
                    <Button
                        size="large"
                        loading={submitting}
                        className={styles.submit}
                        type="primary"
                        htmlType="submit"
                    >
                        <FormattedMessage id="userandregister.register.register"/>
                    </Button>
                    <Link className={styles.login} to="/user/login">
                        <FormattedMessage id="userandregister.register.sign-in"/>
                    </Link>
                </FormItem>
            </Form>
        </div>
    );
};

export default connect(({userAndregister, loading}) => ({
    userAndregister,
    submitting: loading.effects['userAndregister/submit'],
}))(Register);
