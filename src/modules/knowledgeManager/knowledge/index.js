import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import {
    AppConstants,
    categoryKinds,
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { formatMoney } from '@utils';
import { Button, Flex } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
const message = defineMessages({
    objectName: 'Kiến thức',
});

const KnowledgeListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const leaderName = queryParameters.get('leaderName');

    const { data: dataListKnowledge } = useFetch(apiConfig.category.getList, {
        params: { kind: categoryKinds.CATEGORY_KIND_KNOWLEDGE },
        immediate: true,
        mappingData: (data) =>
            data.data.content.map((item) => {
                return { label: item.categoryName, value: item.id };
            }),
    });
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.course,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({
                        ...params,
                        isKnowledge: true,
                    });
                };

                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
                funcs.additionalActionColumnButtons = () => ({
                    developer: ({ id, name, state, status, knowledge }) => {
                        if (knowledge) {
                            return (
                                <BaseTooltip title={translate.formatMessage(commonMessage.developer)}>
                                    <Button
                                        type="link"
                                        style={{ padding: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(
                                                routes.developerKnowledgeListPage.path +
                                                    `?courseId=${id}&courseName=${name}&courseState=${state}&courseStatus=${status}&knowledgeId=${knowledge.id}`,
                                            );
                                        }}
                                    >
                                        <UserOutlined />
                                    </Button>
                                </BaseTooltip>
                            );
                        }
                    },
                });
            },
        });
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.knowledge) }];
    const breadLeaderRoutes = [
        // { breadcrumbName: translate.formatMessage(commonMessage.leader), path: routes.leaderListPage.path },
        { breadcrumbName: translate.formatMessage(commonMessage.knowledge) },
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.courseName),
            colSpan: 6,
        },
        {
            key: 'knowledgeId',
            type: FieldTypes.SELECT,
            options: dataListKnowledge,
            submitOnChanged: true,
            colSpan: 6,
            placeholder: translate.formatMessage(commonMessage.catalogue),
        },
        !leaderName && {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
            submitOnChanged: true,
        },

    ].filter(Boolean);

    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
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
            title: translate.formatMessage(commonMessage.knowledgeName),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(commonMessage.subjectName),
            dataIndex: ['subject','subjectName'],
            width:200,
        },
        {
            title: translate.formatMessage(commonMessage.catalogue),
            dataIndex: ['knowledge', 'categoryName'],
            width:200,
        },

        // {
        //     title: translate.formatMessage(commonMessage.endDate),
        //     dataIndex: 'dateEnd',
        //     align: 'right',
        //     render: (dateEnd) => {
        //         return (
        //             <div style={{ padding: '0 4px', fontSize: 14 }}>
        //                 {dayjs(dateEnd, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
        //             </div>
        //         );
        //     },
        //     width: 130,
        // },
        !leaderName && mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                developer: mixinFuncs.hasPermission([apiConfig.knowledgePermission.getList.baseURL]),
                edit: !leaderName && true,
                delete: !leaderName && true,
            },
            { width: '180px' },
        ),
    ].filter(Boolean);

    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(routes.lectureKnowledgeListPage.path + `?knowledgeId=${record.id}`);
    };

    return (
        <PageWrapper routes={leaderName ? breadLeaderRoutes : breadRoutes}>
            <ListPage
                title={leaderName && <span style={{ fontWeight: 'normal' }}>{leaderName}</span>}
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                    className: styles.search,
                })}
                actionBar={!leaderName && mixinFuncs.renderActionBar()}
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
                                handleOnClick(e, record);
                                // handleFetchDetail(record.id);
                            },
                        })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default KnowledgeListPage;
