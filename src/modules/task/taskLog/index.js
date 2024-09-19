import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DEFAULT_TABLE_ITEM_SIZE,
    DEFAULT_FORMAT,
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_ZERO_TIME,
    DATE_FORMAT_END_OF_DAY_TIME,
    STATE_TASK_DONE,
    STATE_COURSE_FINISHED,
    STATE_COURSE_CANCELED,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { TaskLogKindOptions, taskState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Button, Flex, Tag } from 'antd';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import { RightOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import {
    convertLocalTimeToUtc,
    convertUtcToLocalTime,
    deleteSearchFilterInLocationSearch,
    formatDateString,
    formatDateToEndOfDayTime,
    formatDateToZeroTime,
} from '@utils';
import dayjs from 'dayjs';
import { FieldTypes } from '@constants/formConfig';
import styles from './taskLog.module.scss';
import useFetch from '@hooks/useFetch';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';

const message = defineMessages({
    objectName: 'Nhật ký',
});

function TaskLogListPage({ setBreadCrumbName }) {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const taskName = queryParameters.get('taskName');
    const courseName = queryParameters.get('courseName');
    const courseId = queryParameters.get('courseId');
    const taskId = queryParameters.get('taskId');
    const courseState = queryParameters.get('state');
    const stateTask = queryParameters.get('taskState');
    const state = location?.state?.prevPath;
    const taskParam = routes.taskListPage.path;
    const search = location.search;

    const paramHead = routes.courseListPage.path;
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(taskState, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, queryParams, changePagination, serializeParams } =
        useListBase({
            apiConfig: apiConfig.taskLog,
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
                funcs.getCreateLink = () => {
                    return `${pagePath}/create${search}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}${search}`;
                };
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({ ...params, courseName: null, taskName: null, subjectId: null });
                };
                const handleFilterSearchChange = funcs.handleFilterSearchChange;
                funcs.handleFilterSearchChange = (values) => {
                    if (values.toDate == null && values.fromDate == null) {
                        delete values.toDate;
                        delete values.fromDate;
                        handleFilterSearchChange({
                            ...values,
                        });
                    } else if (values.toDate == null) {
                        const fromDate = values.fromDate && formatDateToZeroTime(values.fromDate);
                        delete values.toDate;
                        handleFilterSearchChange({
                            ...values,
                            fromDate: fromDate,
                        });
                    } else if (values.fromDate == null) {
                        const toDate = values.toDate && formatDateToEndOfDayTime(values.toDate);
                        delete values.fromDate;
                        handleFilterSearchChange({
                            ...values,
                            toDate: toDate,
                        });
                    } else {
                        const fromDate = values.fromDate && formatDateToZeroTime(values.fromDate);
                        const toDate = values.toDate && formatDateToEndOfDayTime(values.toDate);
                        handleFilterSearchChange({
                            ...values,
                            fromDate: fromDate,
                            toDate: toDate,
                        });
                    }
                };
                funcs.changeFilter = (filter) => {
                    const courseId = queryParams.get('courseId');
                    const subjectId = queryParams.get('subjectId');
                    const courseName = queryParams.get('courseName');
                    const taskId = queryParams.get('taskId');
                    const taskName = queryParams.get('taskName');
                    const state = queryParams.get('state');
                    const courseStatus = queryParams.get('courseStatus');
                    const params = {
                        courseId,
                        courseName,
                        taskId,
                        taskName,
                        subjectId,
                        state,
                        courseStatus,
                        ...filter,
                    };
                    const filteredParams = Object.fromEntries(
                        Object.entries(params).filter(([_, value]) => value != null),
                    );
                    mixinFuncs.setQueryParams(serializeParams(filteredParams));
                };
                funcs.additionalActionColumnButtons = () => ({
                    edit: (item) => (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(message.objectName)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                disabled={courseState == STATE_COURSE_FINISHED || courseState == STATE_COURSE_CANCELED}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(mixinFuncs.getItemDetailLink(item), {
                                        state: { action: 'edit', prevPath: location.pathname },
                                    });
                                }}
                            >
                                <EditOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    delete: ({ id, buttonProps }) => (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(message.objectName)}>
                            <Button
                                {...buttonProps}
                                type="link"
                                disabled={courseState == STATE_COURSE_FINISHED || courseState == STATE_COURSE_CANCELED}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(id);
                                }}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined
                                    style={{
                                        color:
                                            courseState == STATE_COURSE_FINISHED || courseState == STATE_COURSE_CANCELED
                                                ? null
                                                : 'red',
                                    }}
                                />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });

    const columns = [
        {
            title: translate.formatMessage(commonMessage.createdDate),
            width: 200,
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.name),
            width: 250,
            dataIndex: ['task', 'student', 'account', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.task),
            dataIndex: ['task', 'lecture', 'lectureName'],
            width: 250,
        },
        {
            title: translate.formatMessage(commonMessage.message),
            dataIndex: 'message',
            width: 250,
        },
        {
            title: translate.formatMessage(commonMessage.totalTime),
            dataIndex: 'totalTime',
            align: 'center',
            width: 150,
            render(totalTime) {
                return <div>{Math.ceil((totalTime / 60) * 100) / 100} h</div>;
            },
        },

        {
            title: 'Loại',
            dataIndex: 'kind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const kindLog = KindTaskLog.find((item) => item.value == dataRow);
                return (
                    <Tag color={kindLog.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{kindLog.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: ['task','state'],
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = statusValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },

        // {
        //     title: translate.formatMessage(commonMessage.modifiedDate),
        //     width: 180,
        //     dataIndex: 'modifiedDate',
        //     align: 'right',
        //     render: (modifiedDate) => {
        //         const modifiedDateLocal = convertUtcToLocalTime(modifiedDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
        //         return <div>{modifiedDateLocal}</div>;
        //     },
        // },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);
    const { data: registration } = useFetch(apiConfig.registration.getList, {
        immediate: true,
        params: {
            courseId: courseId,
        },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.studentId,
                label: item.studentName,
            })),
    });

    const searchFields = [
        !taskId &&{
            key: 'studentId',
            placeholder: <FormattedMessage defaultMessage={'Sinh viên'} />,
            type: FieldTypes.SELECT,
            options: registration,
            submitOnChanged: true,
            colSpan: 4,
        },
        {
            key: 'fromDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.fromDate),
            colSpan: 3,
        },
        {
            key: 'toDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.toDate),
            colSpan: 3,
        },
    ].filter(Boolean);

    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            fromDate: queryFilter.fromDate && dayjs(formatDateToLocal(queryFilter.fromDate), DEFAULT_FORMAT),
            toDate:
                queryFilter.toDate && dayjs(formatDateToLocal(queryFilter.toDate), DEFAULT_FORMAT),
        };

        return initialFilterValues;
    }, [queryFilter?.fromDate, queryFilter?.toDate]);
    return (
        <PageWrapper
            routes={
                setBreadCrumbName
                    ? setBreadCrumbName(['fromDate', 'toDate'])
                    : taskId ? routes.taskLogListPage.breadcrumbs(
                        commonMessage,
                        paramHead,
                        taskParam,
                        deleteSearchFilterInLocationSearch(search, ['fromDate', 'toDate']),
                    ) :
                        routes.taskLogCourseListPage.breadcrumbs(
                            commonMessage,
                            paramHead,
                        )   
            }
        >
            <div>
                <ListPage
                    title={
                        <span style={{ fontWeight: 'normal', fontSize: '16px' }}>
                            <Flex>
                                <span>{courseName}</span>
                                {taskName && <span>
                                    {' '}
                                    <RightOutlined /> {taskName}
                                </span>}
                            </Flex>
                        </span>
                    }
                    actionBar={courseState != STATE_COURSE_FINISHED &&  stateTask != STATE_TASK_DONE && mixinFuncs.renderActionBar()}

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
            </div>
        </PageWrapper>
    );
}

const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};

export default TaskLogListPage;
