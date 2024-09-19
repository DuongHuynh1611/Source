import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag,Flex } from 'antd';
import React, { useEffect, useState } from 'react';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE,DATE_DISPLAY_FORMAT,DATE_FORMAT_DISPLAY } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions,lectureState } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertUtcToLocalTime } from '@utils';
import { defineMessages, FormattedMessage } from 'react-intl';
import styles from './index.module.scss';
import {  orderNumber } from '@utils';
import dayjs from 'dayjs';


const message = defineMessages({
    objectName: 'course',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const notification = useNotification();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const { execute: executeUpdateCoursesPin, loading: updateCoursesPinLoading } = useFetch(apiConfig.course.update);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.course,
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
            funcs.additionalActionColumnButtons = () => {
                if (!mixinFuncs.hasPermission([apiConfig.course.getById.baseURL])) return {};
                return {
                    preview: ({ id }) => {
                        return (
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={() => {
                                    executeGetCourses({
                                        pathParams: {
                                            id,
                                        },
                                        onCompleted: () => setShowPreviewModal(true),
                                        onError: () =>
                                            notification({
                                                type: 'error',
                                                title: 'Error',
                                                message: translate.formatMessage(commonMessage.previewFailed),
                                            }),
                                    });
                                }}
                            >
                                <EyeOutlined />
                            </Button>
                        );
                    },
                };
            };
        },
    });

    const {
        execute: executeGetCourses,
        loading: getCourseLoading,
        data: newsContent,
    } = useFetch(apiConfig.course.getById, {
        immediate: false,
        mappingData: ({ data }) => data.content,
    });

    const {
        data: categories,
        loading: getCategoriesLoading,
        execute: executeGetCategories,
    } = useFetch(apiConfig.category.autocomplete, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content
                .map((item) => ({
                    value: item?.id,
                    label: item?.name,
                }))
                .filter((item, index, self) => {
                    // Lọc ra các phần tử duy nhất bằng cách so sánh value
                    return index === self.findIndex((t) => t.value === item.value);
                }),
    });

    const handleUpdatePinTop = (item) => {
        executeGetCourses({
            pathParams: {
                id: item.id,
            },
            data: {
                ...item,
                pinTop: Number(!item.pinTop),
            },
        });
    };

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
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 100,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {  title: translate.formatMessage(commonMessage.courseName),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(commonMessage.subjectName),
            width: 200,
            render: (dataRow) => {
                return (
                    <Flex vertical>
                        <span>{dataRow.subject.subjectName}</span>
                        <span style={{ fontSize: 12 }}>Leader: {dataRow?.leader?.account?.fullName}</span>
                    </Flex>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'dateEnd',
            render: (dateEnd) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(dateEnd, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '130px' },
        ),
    ];

    const searchFields = [
        {
            key: 'courseName',
            placeholder: translate.formatMessage(commonMessage.courseName),
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
        },
    ];

    useEffect(() => {
        executeGetCategories({
            params: {
                kind: categoryKind.course,
            },
        });
    }, []);

    return (
        <PageWrapper
            loading={getCourseLoading}
            routes={[{ breadcrumbName: translate.formatMessage(commonMessage.course) }]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading || getCategoriesLoading || updateCoursesPinLoading}
                        pagination={pagination}
                    />
                }
            />
            <Modal
                title={<FormattedMessage defaultMessage="Preview" />}
                width={1000}
                open={showPreviewModal}
                footer={null}
                centered
                onCancel={() => setShowPreviewModal(false)}
            >
                {newsContent && (
                    <div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: newsContent }}></div>
                )}
            </Modal>
        </PageWrapper>
    );
};

export default CourseListPage;
