import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Avatar, Button, Flex, Tag,Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserOutlined,ShoppingCartOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import ReviewListModal from '@modules/review/student/ReviewListModal';
import { 
    AppConstants, 
    categoryKind, 
    DATE_FORMAT_DISPLAY, 
    DEFAULT_FORMAT, 
    DEFAULT_TABLE_ITEM_SIZE,
    DATE_DISPLAY_FORMAT,
    STATE_COURSE_PREPARED,
    STATE_COURSE_RECRUITED,
    STATE_COURSE_FINISHED,
    STATE_COURSE_CANCELED,
} from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions,lectureState } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertUtcToLocalTime, formatMoney } from '@utils';
import { defineMessages, FormattedMessage } from 'react-intl';
import styles from './company.module.scss';
import dayjs from 'dayjs';
import { filter } from 'lodash';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import routes from './routes';
import { useNavigate,useLocation } from 'react-router-dom';
import useDisclosure from '@hooks/useDisclosure';
import { orderNumber } from '@utils';




const message = defineMessages({
    objectName: 'Công ty',
});

const CompanyListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const navigate = useNavigate();

    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: apiConfig.company,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.additionalActionColumnButtons = () => ({
                registration: ({ id, companyName }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.registration)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.companyListPage.path +
                                        `/company-subscription?companyId=${id}&companyName=${companyName}`,
                                );
                            }}
                        >
                            <ShoppingCartOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });

    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.company) }];
    const breadLeaderRoutes = [
        // { breadcrumbName: translate.formatMessage(commonMessage.leader), path: routes.leaderListPage.path },
        { breadcrumbName: translate.formatMessage(commonMessage.company) },
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.companyName),
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

    const columns = [
        {
            title: '#',
            dataIndex: 'logo',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Tên công ty" />,
            dataIndex: 'companyName',
            width: 200,
        },
        {
            title: <FormattedMessage defaultMessage="Địa chỉ" />,
            dataIndex: 'address',
        },
        {
            title: <FormattedMessage defaultMessage="Hotline" />,
            dataIndex: 'hotline',
            width: 200,
        },
        {
            title: <FormattedMessage defaultMessage="Email" />,
            dataIndex: 'email',
            width: 200,
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ registration: mixinFuncs.hasPermission([apiConfig.company.getList?.baseURL]), edit: true, delete: true }, { width: '150px' }),
    ];
 

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.company) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};

export default CompanyListPage;
