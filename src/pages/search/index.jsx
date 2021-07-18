import React, { useEffect } from 'react';
import { Button, Card, Col, Form, List, Row, Select, Tag } from 'antd';
import { LoadingOutlined, StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import SearchListContent from './components/SearchListContent';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import styles from './search.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 5;

const Search = (props) => {
   const {
       dispatch,
       loading,
       ...restProps
   } = props;
    const [form] = Form.useForm();
    const { location: { state = { wd: '', tp: '' } } } = restProps;
    let param = { wd: '', tp: ''};
    if (state && state.wd && state.wd !== param.wd) {
        const { wd, tp } = state;
        param = { wd, tp };
        sessionStorage.setItem('wldsearch', JSON.stringify(param));
        const temp = JSON.parse(sessionStorage.getItem('wldsearch'));
        console.log('1设置缓存==', param.wd, state.wd, temp.wd);
    }else{
        const temp = JSON.parse(sessionStorage.getItem('wldsearch'));
        if (temp && temp.wd){
            param = temp;
            console.log('2取缓存》》', param.wd, temp.wd);
        }
    }

    /*
    useEffect特性：
    1.什么都不传，组件每次 render 之后 useEffect 都会调用，相当于 componentDidMount
    和 componentDidUpdate，等于直接在组件里写可执行代码。
    2.传入一个空数组 [], 只会调用一次，相当于 componentDidMount 和 componentWillUnmount
    3.传入一个数组，其中包括变量，只有这些变量变动时，useEffect 才会执行
     */
    useEffect(() => {

    }, [param.wd, param.tp]);

    const setOwner = () => {
        form.setFieldsValue({
            owner: ['wzj'],
        });
    };

    const fetchMore = () => {

    };

        const owners = [
            {
                id: 'wzj',
                name: '我自己',
            },
            {
                id: 'wjh',
                name: '吴家豪',
            },
            {
                id: 'zxx',
                name: '周星星',
            },
            {
                id: 'zly',
                name: '赵丽颖',
            },
            {
                id: 'ym',
                name: '姚明',
            },
        ];

    const IconText = ({ type, text }) => {
        switch (type) {
            case 'star-o':
                return (
                    <span>
            <StarOutlined
                style={{
                    marginRight: 8,
                }}
            />
                        {text}
          </span>
                );

            case 'like-o':
                return (
                    <span>
            <LikeOutlined
                style={{
                    marginRight: 8,
                }}
            />
                        {text}
          </span>
                );

            case 'message':
                return (
                    <span>
            <MessageOutlined
                style={{
                    marginRight: 8,
                }}
            />
                        {text}
          </span>
                );

            default:
                return null;
        }
    };

    const formItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 24,
            },
            md: {
                span: 12,
            },
        },
    };
    const list = [];
    const loadMore = list.length > 0 && (
        <div
            style={{
                textAlign: 'center',
                marginTop: 16,
            }}
        >
            <Button
                onClick={fetchMore}
                style={{
                    paddingLeft: 48,
                    paddingRight: 48,
                }}
            >
                {loading ? (
                    <span>
            <LoadingOutlined /> 加载中...
          </span>
                ) : (
                    '查看更多'
                )}
            </Button>
        </div>
    );
    return (
        <>
            <Card bordered={false} className={styles.antCardWldos}>
                <Form
                    layout="inline"
                    form={form}
                    initialValues={{
                        owner: ['wjh', 'zxx'],
                    }}
                    onValuesChange={() => {

                    }}
                >
                    <StandardFormRow
                        title="所属类目"
                        block
                        style={{
                            paddingBottom: 11,
                        }}
                    >
                        <FormItem name="category">
                            <TagSelect expandable>
                                <TagSelect.Option value="cat1">类目一</TagSelect.Option>
                                <TagSelect.Option value="cat2">类目二</TagSelect.Option>
                                <TagSelect.Option value="cat3">类目三</TagSelect.Option>
                                <TagSelect.Option value="cat4">类目四</TagSelect.Option>
                                <TagSelect.Option value="cat5">类目五</TagSelect.Option>
                                <TagSelect.Option value="cat6">类目六</TagSelect.Option>
                                <TagSelect.Option value="cat7">类目七</TagSelect.Option>
                                <TagSelect.Option value="cat8">类目八</TagSelect.Option>
                                <TagSelect.Option value="cat9">类目九</TagSelect.Option>
                                <TagSelect.Option value="cat10">类目十</TagSelect.Option>
                                <TagSelect.Option value="cat11">类目十一</TagSelect.Option>
                                <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                            </TagSelect>
                        </FormItem>
                    </StandardFormRow>
                    <StandardFormRow title="owner" grid>
                        <FormItem name="owner" noStyle>
                            <Select mode="multiple" placeholder="选择 owner">
                                {owners.map((owner) => (
                                    <Option key={owner.id} value={owner.id}>
                                        {owner.name}
                                    </Option>
                                ))}
                            </Select>
                        </FormItem>
                        <a className={styles.selfTrigger} onClick={setOwner}>
                            只看自己的
                        </a>
                    </StandardFormRow>
                    <StandardFormRow title="其它选项" grid last>
                        <Row gutter={16}>
                            <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                                <FormItem {...formItemLayout} label="活跃用户" name="user">
                                    <Select
                                        placeholder="不限"
                                        style={{
                                            maxWidth: 200,
                                            width: '100%',
                                        }}
                                    >
                                        <Option value="lisa">李三</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                                <FormItem {...formItemLayout} label="好评度" name="rate">
                                    <Select
                                        placeholder="不限"
                                        style={{
                                            maxWidth: 200,
                                            width: '100%',
                                        }}
                                    >
                                        <Option value="good">优秀</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </StandardFormRow>
                </Form>
            </Card>
            <Card className={styles.antCardWldos}
                style={{
                    marginTop: 24,
                }}
                bordered={false}
                bodyStyle={{
                    padding: '8px 32px 32px 32px',
                }}
            >
                <List
                    size="large"
                    loading={list.length === 0 ? loading : false}
                    rowKey="id"
                    itemLayout="vertical"
                    loadMore={loadMore}
                    dataSource={list}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <IconText key="star" type="star-o" text={item.star} />,
                                <IconText key="like" type="like-o" text={item.like} />,
                                <IconText key="message" type="message" text={item.message} />,
                            ]}
                            extra={<div className={styles.listItemExtra} />}
                        >
                            <List.Item.Meta
                                title={
                                    <a className={styles.listItemMetaTitle} href={item.href}>
                                        {item.title}
                                    </a>
                                }
                                description={
                                    <span>
                    <Tag>Ant Design</Tag>
                    <Tag>设计语言</Tag>
                    <Tag>wldos-pro</Tag>
                  </span>
                                }
                            />
                            <SearchListContent data={item} />
                        </List.Item>
                    )}
                />
            </Card>
        </>
    );
};

export default Search;
