import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DEFAULT_TABLE_ITEM_SIZE,
    DEFAULT_FORMAT,
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_ZERO_TIME,
    DATE_FORMAT_END_OF_DAY_TIME,
    DEFAULT_FORMAT_DAY_OFF_LOG,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { dayOfflogOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Button, Card, Col, Form, Modal, Row, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import { PlusOutlined } from '@ant-design/icons';

import { convertUtcToLocalTime, formatDateString, formatDateToEndOfDayTime, formatDateToZeroTime } from '@utils';
import { FieldTypes } from '@constants/formConfig';
import styles from './index.module.scss';
import useDisclosure from '@hooks/useDisclosure';
import { BaseForm } from '@components/common/form/BaseForm';
import useFetch from '@hooks/useFetch';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import DatePickerField from '@components/common/form/DatePickerField';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import BooleanField from '@components/common/form/BooleanField';
import TextField from '@components/common/form/TextField';

dayjs.extend(utc);
const message = defineMessages({
    objectName: 'Nhật ký nghỉ',
    create: {
        id: 'components.common.elements.actionBar.create',
        defaultMessage: 'Add new',
    },
});

function DayOffLogListPage({ setBreadCrumbName }) {
    const translate = useTranslate();
    const intl = useIntl();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const developerName = queryParameters.get('developerName');
    const developerId = queryParameters.get('developerId');
    const [openedModalDayOffLog, handlerModalDayOffLog] = useDisclosure(false);
    const dayOffLogKind = translate.formatKeys(dayOfflogOptions, ['label']);
    const [startDateDefault, setStartDateDefault] = useState();
    const search = location.search;
    const [isChecked, setIsChecked] = useState(false);
    const { execute: executeTakeDayOff } = useFetch(apiConfig.dayOffLog.create);
    const { data, mixinFuncs, queryFilter, loading, pagination, queryParams, changePagination, serializeParams } =
        useListBase({
            apiConfig: apiConfig.dayOffLog,
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
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({ ...params, developerId });
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
                    const developerId = queryParams.get('developerId');
                    const developerName = queryParams.get('developerName');
                    const params = {
                        developerId,
                        developerName,
                        ...filter,
                    };
                    const filteredParams = Object.fromEntries(
                        Object.entries(params).filter(([_, value]) => value != null),
                    );
                    mixinFuncs.setQueryParams(serializeParams(filteredParams));
                };
            },
        });

    const [form] = Form.useForm();
    const handleFinish = (values) => {
        values.isCharged = isChecked;
        values.startDate = values.startDate && dayjs(values?.startDate).utc().format(DEFAULT_FORMAT);
        values.endDate = values.endDate && dayjs(values?.endDate).utc().format(DEFAULT_FORMAT);
        executeTakeDayOff({
            data: { ...values },
            onCompleted: (response) => {
                handlerModalDayOffLog.close();
                if (response?.result == true) {
                    showSucsessMessage(translate.formatMessage(commonMessage.success_day_off));
                }
                mixinFuncs.getList();
            },
            onError: (error) => {
                handlerModalDayOffLog.close();
                showErrorMessage(translate.formatMessage(commonMessage.error_day_off));
            },
        });
        form.resetFields();
    };
    const columns = [
        {
            title: translate.formatMessage(commonMessage.startDate),
            width: 200,
            dataIndex: 'startDate',
            render: (startDate) => {
                const startDateLocal = convertUtcToLocalTime(startDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{startDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            width: 200,
            dataIndex: 'endDate',
            render: (endDate) => {
                const endDateLocal = convertUtcToLocalTime(endDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{endDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.totalTime),
            dataIndex: 'totalHour',
            align:'center',
            width: 120,
            render: (dataRow) => {
                return <div>{dataRow}h</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.reason),
            dataIndex: 'note',
           
            width: 500,
            render: (dataRow) => {
                return <div>{dataRow}</div>;
            },
        },

        {
            title: 'Loại',
            dataIndex: 'isCharged',
            align: 'center',
            width: 120,
            render(dataRow) {
                const kindLog = dayOffLogKind.find((item) => item.value == dataRow);
                return (
                    <Tag color={kindLog?.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{kindLog?.label}</div>
                    </Tag>
                );
            },
        },
       

        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);
    const searchFields = [
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
    ];

    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            fromDate: queryFilter.fromDate && dayjs(formatDateToLocal(queryFilter.fromDate), DEFAULT_FORMAT),
            toDate:
                queryFilter.toDate && dayjs(formatDateToLocal(queryFilter.toDate), DEFAULT_FORMAT),
        };

        return initialFilterValues;
    }, [queryFilter?.fromDate, queryFilter?.toDate]);
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };
    const handleOnChangeCheckBox = () => {
        setIsChecked(!isChecked);
    };
    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.developer),
            path: routes.developerListPage.path,
        });
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.dayOffLog),
        });
        return breadRoutes;
    };
    // const validateStartDate = (_, value) => {
    //     const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DEFAULT_FORMAT);
    //     if (date && value && value.isBefore(date)) {
    //         return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
    //     }
    //     return Promise.resolve();
    // };
    const disabledEndDate = (current) => {
        if (startDateDefault) {
            return current && current.isBefore(startDateDefault.subtract(0, 'day'), 'day');
        }
        return false;
    };

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    title={
                        <span style={{ fontWeight: 'normal', fontSize: '16px' }}>
                            <span>{developerName}</span>
                        </span>
                    }
                    actionBar={
                        mixinFuncs.hasPermission([apiConfig.knowledgePermission.create?.baseURL]) && (
                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                <Button
                                    type="primary"
                                    style={styles}
                                    onClick={() => {
                                        handlerModalDayOffLog.open();
                                    }}
                                >
                                    <PlusOutlined />{' '}
                                    {intl.formatMessage(message.create, { objectName: message.objectName })}
                                </Button>
                            </div>
                        )
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
            </div>
            <Modal
                title={<span>{translate.formatMessage(commonMessage.take_off)}</span>}
                open={openedModalDayOffLog}
                onOk={() => form.submit()}
                onCancel={() => handlerModalDayOffLog.close()}
            >
                <BaseForm
                    form={form}
                    onFinish={(values) => {
                        values.developerId = developerId;
                        handleFinish(values);
                    }}
                    size="100%"
                >
                    <div style={{ marginTop: 20 }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <DatePickerField
                                    // showTime={true}
                                    label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                    name="startDate"
                                    format={DEFAULT_FORMAT_DAY_OFF_LOG}
                                    // disabledDate={disabledDate}
                                    onChange={(value) => {
                                        setStartDateDefault(value);
                                    }}
                                    showTime={{
                                        defaultValue: dayjs(dayjs().add(1, 'hour').format('HH:00:00'), 'HH:mm:ss'),
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày bắt đầu',
                                        },
                                        // {
                                        //     validator: validateStartDate,
                                        // },
                                    ]}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col span={12}>
                                <DatePickerField
                                    label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                    name="endDate"
                                    format={DEFAULT_FORMAT_DAY_OFF_LOG}
                                    disabledDate={disabledEndDate}
                                    showTime={{
                                        defaultValue: dayjs(dayjs().add(1, 'hour').format('HH:00:00'), 'HH:mm:ss'),
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày kết thúc',
                                        },
                                        {
                                            validator: validateDueDate,
                                        },
                                    ]}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.reason)}
                                    required
                                    // disabled={isEditing}
                                    type ='textarea'
                                    name="note"
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <BooleanField
                                    className={styles.customCheckbox}
                                    label={translate.formatMessage(commonMessage.isCharged)}
                                    name="isCharged"
                                    checked={isChecked}
                                    onChange={handleOnChangeCheckBox}
                                />
                            </Col>
                        </Row>
                    </div>
                </BaseForm>
            </Modal>
        </PageWrapper>
    );
}

const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};

export default DayOffLogListPage;
