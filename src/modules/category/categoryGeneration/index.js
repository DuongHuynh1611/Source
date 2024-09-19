import React from 'react';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { defineMessages } from 'react-intl';
import { useParams, Link, generatePath } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import { statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { categoryKinds } from '@constants';
import { showErrorMessage } from '@services/notifyService';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'Loại',
    name: 'Tên',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    home: 'Trang chủ',
    category: 'Danh mục hệ',
});

const CategoryListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const kindOfGen = categoryKinds.CATEGORY_KIND_GENERATION;

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.category,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.additionalActionColumnButtons = () => ({
                deleteItem: ({ buttonProps, ...dataRow }) => (
                    <Button
                        {...buttonProps}
                        type="link"
                        onClick={(e) => {
                            e.stopPropagation();
                            mixinFuncs.showDeleteItemConfirm(dataRow._id);
                        }}
                        style={{ padding: 0 }}
                    >
                        <DeleteOutlined />
                    </Button>
                ),
            });

            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => ({
                ...prepareGetListParams(params),
                kind: kindOfGen,
            });

            funcs.handleDeleteItemError = (err) => {
                const errorCode = err.response?.data?.code;
                if (errorCode === "ERROR-CATEGORY-ERROR-0002") {
                    showErrorMessage('Không xoá được khi đã có sinh viên');
                } else if (errorCode === "ERROR-CATEGORY-ERROR-0003") {
                    showErrorMessage('Không xoá được khi đã có lập trình viên');
                }
            };
        },
    });

    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'categoryName',
        },
        {
            title: translate.formatMessage(message.createDate),
            dataIndex: 'createdDate',
            align: 'right',
            width: 200,
        },
        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '120px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
            colSpan: 6,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(message.status),
            type: FieldTypes.SELECT,
            options: statusValues,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.category) },
            ]}
        >
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
                    />
                }
            />
        </PageWrapper>
    );
};

export default CategoryListPage;