import React from 'react';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { defineMessages,FormattedMessage } from 'react-intl';
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
    objectName: 'ProjectRole',
    
});

const ProjectRoleListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.projectRole,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
    });

    const columns = [
        {
            title: translate.formatMessage(commonMessage.projectRoleName),
            dataIndex: 'projectRoleName',
        },

        mixinFuncs.renderStatusColumn({ width: '120px' }),
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
            key: 'projectRoleName',
            placeholder: translate.formatMessage(commonMessage.projectRoleName),
            colSpan: 6,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.projectRole) },
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

export default ProjectRoleListPage;
