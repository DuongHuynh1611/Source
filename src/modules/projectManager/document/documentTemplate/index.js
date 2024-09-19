
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import {
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    STATE_PROJECT_TASK_CANCEL,
    STATE_PROJECT_TASK_DONE,
    storageKeys,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import {
    convertUtcToLocalTime,
    orderNumber,
} from '@utils';
import { Button, Modal } from 'antd';
import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import useDisclosure from '@hooks/useDisclosure';
import RichTextField from '@components/common/form/RichTextField';
import useFetch from '@hooks/useFetch';
import PageWrapper from '@components/common/layout/PageWrapper';
import RichTextRender from '@components/common/form/RichTextRender';

const message = defineMessages({
    objectName: 'Tài liệu',
    cancel: 'Huỷ',
    done: 'Hoàn thành',
    updateTaskSuccess: 'Cập nhật tình trạng thành công',
    updateTaskError: 'Cập nhật tình trạng thất bại',
});

function DocumentListPage({ setSearchFilter }) {
    const translate = useTranslate();
    const [openedModalDetail, handlersModalDetail] = useDisclosure(false);
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    localStorage.setItem('pathPrev', location.search);
    const search = useMemo(() => {
        return location.search;
    }, []);

    const { execute: executeDetailDocument, data: documentData } = useFetch(
        apiConfig.documentTemplate.getById,
        {
            immediate: false,
            mappingData: (data) => data.data,
        },
    );
    const handleOnClick = (record) => {
        executeDetailDocument({
            pathParams: {
                id: record.id,
            },
            onCompleted: (res) => {
                handlersModalDetail.open();
            },
            onError: (err) => {
                console.log(err);
            },
        });
    };


    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.documentTemplate,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response?.data?.content,
                            total: response?.data?.totalElements,
                        };
                    }
                };

                funcs.getCreateLink = (record) => {
                    return `${pagePath}/create${search}`;
                };

                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}${search}`;
                };
            },
        });

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'id',
            render: (text, record, index) => {
                return orderNumber(pagination, index);
            },
            width: 50,
        },
        {
            title: translate.formatMessage(commonMessage.document),
            dataIndex: 'name',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
            align: 'end',
            width: 200,
        },
        mixinFuncs.renderStatusColumn({ width: '80px' }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: 120 },
        ),
    ].filter(Boolean);

    const searchFields = [
        {
            key: 'name',
            type: FieldTypes.STRING,
            placeholder: translate.formatMessage(commonMessage.document),
            colSpan: 4,
        },
    ].filter(Boolean);

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.documentTemplate) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                        onRow={(record) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                handleOnClick(record);
                            },
                        })}
                    />
                }
            />
            <Modal
                centered
                open={openedModalDetail}
                onCancel={() => handlersModalDetail.close()}
                width={'70vh'}
                style={{ minHeight: 1000 }}
                footer={[]}
                title={translate.formatMessage(message.objectName)}
            >
                <RichTextRender data={documentData?.content}/>
            </Modal>
        </PageWrapper>
    );
}
export default DocumentListPage;