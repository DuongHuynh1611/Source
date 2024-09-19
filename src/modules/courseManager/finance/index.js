import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, STATE_COURSE_STARTED, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { lectureState, statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { formatMoney } from '@utils';
import React, { useEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './finance.module.scss';
import useQueryParams from '@hooks/useQueryParams';
const message = defineMessages({
    objectName: 'Tài chính',
});

const FinanceListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValue = translate.formatKeys(statusOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const studentId = queryParameters.get('studentId');
    const courseState = queryParameters.get('courseState');
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const { setQueryParams, params } = useQueryParams();
    useEffect(() => {
        setQueryParams({ courseState: STATE_COURSE_STARTED });
    }, []);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, serializeParams, queryParams } =
        useListBase({
            apiConfig: { getList: apiConfig.registrationMoney.listSum },
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    try {
                        if (response.result === true) {
                            return {
                                data: response.data.content,
                                total: response.data.totalElements,
                            };
                        }
                    } catch (error) {
                        return [];
                    }
                };
                funcs.getList = () => {
                    const courseState = queryParams.get('courseState');
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({
                        ...params,
                        courseState: STATE_COURSE_STARTED,
                    });
                };

                funcs.changeFilter = (filter) => {
                    const courseState = queryParams.get('courseState');
                    const projectName = queryParams.get('projectName');
                    mixinFuncs.setQueryParams(serializeParams({ courseState: courseState, ...filter }));
                };
            },
        });
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.finance) }];
    const searchFields = [
        {
            key: 'studentId',
            placeholder: translate.formatMessage(commonMessage.studentName),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.student.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.account.fullName,
            }),
            colSpan: 5,
            searchParams: (text) => ({ name: text }),
        },
        {
            key: 'courseId',
            placeholder: translate.formatMessage(commonMessage.courseName),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.course.autocomplete,
            initialSearchParams:{
                isKnowledge:false,
                status: STATUS_ACTIVE,
            },
            mappingOptions: (item) => ({
                value: item.id,
                label: item.name,
            }),
            colSpan: 5,
            searchParams: (text) => ({ name: text }),
        },
        {
            key: 'courseState',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
            submitOnChanged: true,
        },
    ];

    const formatMoneyValue = (value) => {
        return formatMoney(value, {
            groupSeparator: ',',
            decimalSeparator: '.',
            currentcy: 'đ',
            currentDecimal: '0',
        });
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'studentAvatar',
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
            title: translate.formatMessage(commonMessage.studentName),
            dataIndex: 'studentName',
        },
        {
            title: translate.formatMessage(commonMessage.courseName),
            dataIndex: 'courseName',
        },
        {
            title: translate.formatMessage(commonMessage.moneyReceived),
            dataIndex: 'totalMoneyInput',
            render: (totalMoneyInput) => {
                return <div>{formatMoneyValue(totalMoneyInput)}</div>;
            },
            align: 'right',
        },
        {
            title: translate.formatMessage(commonMessage.moneyReturn),
            dataIndex: 'totalMoneyReturn',
            render: (totalMoneyReturn) => {
                return <div>{formatMoneyValue(totalMoneyReturn)}</div>;
            },
            align: 'right',
        },
    ];
    const { data: moneySum, execute: executeGetSum } = useFetch(apiConfig.registrationMoney.getSum, {
        immediate: false,
        params: { courseId, studentId },
        mappingData: ({ data }) => data,
    });

    useEffect(() => {
        executeGetSum({ params: { courseId, studentId, courseState: courseState ? queryFilter?.courseState : STATE_COURSE_STARTED } });
    }, [courseId, studentId, courseState]);

    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            courseState: queryFilter?.courseState !== 'null' ? queryFilter?.courseState : STATE_COURSE_STARTED,
        };

        return initialFilterValues;
    }, [queryFilter?.courseState]);

    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div></div>
                        <div>
                            <span style={{ marginLeft: '5px' }}>
                                Tổng nhận: {moneySum && formatMoneyValue(moneySum?.totalMoneyInput || 0)}
                            </span>
                            <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>| </span>
                            <span style={{ marginLeft: '5px' }}>
                                Tổng trả: {moneySum && formatMoneyValue(moneySum?.totalMoneyReturn || 0)}
                            </span>
                            <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>| </span>
                            <span style={{ marginLeft: '5px', color: 'red' }}>
                                Tổng nợ:{' '}
                                {moneySum &&
                                    formatMoneyValue(
                                        Math.abs(
                                            parseInt(moneySum?.totalMoneyInput) -
                                                parseInt(moneySum?.totalMoneyReturn) -
                                                parseInt(moneySum?.totalMinusMoney),
                                        ) || 0,
                                    )}
                            </span>
                        </div>
                    </div>
                }
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    className: styles.search,
                    initialValues: initialFilterValues,
                })}
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

export default FinanceListPage;
