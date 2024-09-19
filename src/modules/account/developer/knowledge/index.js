import { PlusOutlined } from '@ant-design/icons';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { categoryKinds, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { Button, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Modal from 'antd/es/modal/Modal';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import style from './knowledge.module.scss';
const message = defineMessages({
    objectName: 'Phân quyền kiến thức',
    name: 'Tên kiến thức',
    home: 'Trang chủ',
    permission: 'Phân quyền kiến thức',
    developer: 'Lập trình viên',
    addPermission: 'Thêm phân quyền',
    create: {
        id: 'components.common.elements.actionBar.create',
        defaultMessage: 'Add new',
    },
    add: 'Thêm mới',
    cancel: 'Hủy bỏ',
});
const KnowledgePermissionListPage = () => {
    const translate = useTranslate();
    const [showModal, setShowModal] = useState(false);
    const intl = useIntl();
    const [form] = useForm();
    const queryParameters = new URLSearchParams(window.location.search);
    const developerId = queryParameters.get('developerId');
    const developerName = queryParameters.get('developerName');
    const { execute: executeCreateKnowledgePermission } = useFetch(apiConfig.knowledgePermission.create, {
        immediate: false,
    });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.knowledgePermission.getList,
            update: apiConfig.knowledgePermission.update,
            create: apiConfig.knowledgePermission.create,
            delete: apiConfig.knowledgePermission.delete,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareGetListPathParams = () => {
                return {
                    developerId: developerId,
                };
            };
        },
    });
    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(message.developer),
            path: routes.developerListPage.path,
        });
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(message.permission),
        });
        return breadRoutes;
    };
    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: ['knowledge', 'name'],
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    actionBar={
                        mixinFuncs.hasPermission([apiConfig.knowledgePermission.create?.baseURL]) && (
                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                <Button type="primary" style={style} onClick={() => setShowModal(true)}>
                                    <PlusOutlined />{' '}
                                    {intl.formatMessage(message.create, { objectName: message.objectName })}
                                </Button>
                            </div>
                        )
                    }
                    title={<span style={{ fontWeight: 'normal', fontSize: '18px' }}>{developerName}</span>}
                    baseTable={
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    }
                />
                <Modal
                    title={<FormattedMessage defaultMessage="Thêm phân quyền kiến thức" />}
                    open={showModal}
                    onOk={() => {
                        form.submit();
                        if (form.getFieldValue('courseId')) {
                            executeCreateKnowledgePermission({
                                data: {
                                    developerId: parseInt(developerId),
                                    courseId: form.getFieldValue('courseId'),
                                },
                                onCompleted: (result) => {
                                    showSucsessMessage('Tạo phân quyền kiến thức thành công!');
                                    mixinFuncs.handleFetchList({ developerId });
                                    form.resetFields();
                                    setShowModal(false);
                                },
                                onError: (error) => {
                                    if (error.response.data.code === 'ERROR-KNOWLEDGE-PERMISSION-ERROR-0001') {
                                        showErrorMessage('Phân quyền kiến thức đã tồn tại');
                                    } else {
                                        showErrorMessage('Tạo phân quyền kiến thức thất bại!');
                                    }
                                    setShowModal(false);
                                },
                            });
                        }
                    }}
                    okText={intl.formatMessage(message.add)}
                    cancelText={intl.formatMessage(message.cancel)}
                    onCancel={() => {
                        form.resetFields();
                        setShowModal(false);
                    }}
                >
                    <div>
                        <Form form={form}>
                            <Form.Item>
                                <AutoCompleteField
                                    label={<FormattedMessage defaultMessage="Kiến thức" />}
                                    name="courseId"
                                    apiConfig={apiConfig.course.autocomplete}
                                    mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                    searchParams={(text) => ({ name: text })}
                                    required
                                    initialSearchParams={{
                                        // kind: categoryKinds.CATEGORY_KIND_KNOWLEDGE,
                                        isKnowledge: true,
                                    }}
                                    optionsParams={{ isKnowledge: true }}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </div>
        </PageWrapper>
    );
};
export default KnowledgePermissionListPage;
