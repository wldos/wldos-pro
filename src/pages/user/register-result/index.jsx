import {Button, Result} from 'antd';
import {FormattedMessage, Link, useIntl} from 'umi';
import React from 'react';
import styles from './style.less';
import {mailist} from "@/pages/user/register-result/maillist";

const actions = (location) => {
    const account = location.state ? location.state.account : 'support@zhiletu.com';
    const mail = account.indexOf('@') > -1 ? account.substring(account.indexOf('@') + 1) : 'zhiletu.com';
    const target = mailist[mail] || 'https://www.zhiletu.com'
    return (
        <div className={styles.actions}>
            <a href={target} target="_blank">
                <Button size="large" type="primary">
                    <FormattedMessage
                        id="userandregister-result.register-result.view-mailbox"/>
                </Button>
            </a>
            <Link to="/">
                <Button size="large">
                    <FormattedMessage
                        id="userandregister-result.register-result.back-home"/>
                </Button>
            </Link>
        </div>
    );
}

const RegisterResult = ({location}) => {
    const intl = useIntl();
    return (
        <Result
            className={styles.registerResult}
            status="success"
            title={
                <div className={styles.title}>
                    <FormattedMessage
                        id="userandregister-result.register-result.msg"
                        values={{
                            email: location.state ? location.state.account : 'support@zhiletu.com',
                        }}
                    />
                </div>
            }
            subTitle={intl.formatMessage({
                id: 'userandregister-result.register-result.activation-email',
            })}
            extra={actions(location)}
        />
    );
}

export default RegisterResult;
