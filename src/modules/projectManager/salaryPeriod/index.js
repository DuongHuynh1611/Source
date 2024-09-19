import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { FileSearchOutlined } from '@ant-design/icons';
import {
    DATE_FORMAT_DISPLAY,
    DEFAULT_EXCEL_DATE,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    PAYOUT_PERIOD_STATE_CALCULATED,
    PAYOUT_PERIOD_STATE_DONE,
    PAYOUT_PERIOD_STATE_PENDING,
    apiTenantUrl,
    apiUrl,
    storageKeys,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { salaryPeriodState, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './salaryPeriod.module.scss';
import useNotification from '@hooks/useNotification';
import { Button, Modal, Tag } from 'antd';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useFetch from '@hooks/useFetch';
import { IconCheck, IconX } from '@tabler/icons-react';
import { FileExcelOutlined, CalculatorOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getCacheAccessToken } from '@services/userService';
import { formatDateString, formatMoney } from '@utils';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import useMoneyUnit from '@hooks/useMoneyUnit';
import { getData } from '@utils/localStorage';
const message = defineMessages({
    objectName: 'Kỳ lương',
});
const notificationMessage = defineMessages({
    rejectSuccess: 'Huỷ {objectName} thành công',
    rejectTitle: 'Bạn muốn huỷ {objectName} này?',
    recalculateTitle: 'Bạn muốn tính lại {objectName} này?',
    approveSuccess: 'Chấp nhận {objectName} thành công',
    approveTitle: 'Bạn muốn chấn nhận {objectName} này?',
    ok: 'Đồng ý',
    cancel: 'Hủy',
});
const SalaryPeriodListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const moneyUnit = useMoneyUnit();
    const stateValues = translate.formatKeys(salaryPeriodState, ['label']);
    const { execute: approvePayout, loading: loadingApprove } = useFetch(apiConfig.salaryPeriod.approve);
    const { execute: executeRecalculate, loading: loadingRecalculate } = useFetch(apiConfig.salaryPeriod.recalculate);
    const notification = useNotification();
    const userAccessToken = getCacheAccessToken();
    const intl = useIntl();
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.salaryPeriod,
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
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({ ...params });
                };
                funcs.additionalActionColumnButtons = () => ({
                    reject: ({ id, state }) =>
                        state === PAYOUT_PERIOD_STATE_CALCULATED && (
                            <BaseTooltip title={<FormattedMessage defaultMessage={'Từ chối'} />}>
                                <Button
                                    type="link"
                                    style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showRejectItemConfirm(id);
                                    }}
                                >
                                    <IconX
                                        color={state === PAYOUT_PERIOD_STATE_CALCULATED ? 'red' : 'gray'}
                                        size={16}
                                    />
                                </Button>
                            </BaseTooltip>
                        ),
                    approve: ({ id, state }) =>
                        state === PAYOUT_PERIOD_STATE_CALCULATED && (
                            <BaseTooltip title={<FormattedMessage defaultMessage={'Chấp nhận'} />}>
                                <Button
                                    type="link"
                                    style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showApproveItemConfirm(id, state);
                                    }}
                                >
                                    <IconCheck
                                        color={state === PAYOUT_PERIOD_STATE_CALCULATED ? 'green' : 'gray'}
                                        size={16}
                                    />
                                </Button>
                            </BaseTooltip>
                        ),
                    export: ({ id, name }) => (
                        <BaseTooltip title={<FormattedMessage defaultMessage={'Export'} />}>
                            <Button
                                // disabled={state === PAYOUT_PERIOD_STATE_DONE}
                                type="link"
                                style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    exportToExcel(id, name);
                                }}
                            >
                                <FileExcelOutlined style={{ color: 'green' }} size={16} />
                            </Button>
                        </BaseTooltip>
                    ),
                    recalculate: ({ id, state, name }) => (
                        <BaseTooltip title={<FormattedMessage defaultMessage={'Tính lại kỳ lương'} />}>
                            <Button
                                disabled={state !== PAYOUT_PERIOD_STATE_PENDING} 
                                type="link"
                                style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRecalculate(id, name);
                                }}
                            >
                                <CalculatorOutlined  size={18} />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });

    const convertDate = (date, format = DEFAULT_FORMAT, addHour = 0) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT).add(addHour, 'hour');
        return convertDateTimeToString(dateConvert, format);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.salaryPeriodName),
            colSpan: 6,
        },
    ].filter(Boolean);
    const handleOnClick = (event, record) => {
        navigate(routes.salaryPeriodDetailListPage.path + `?salaryPeriodId=${record.id}`);
    };

    const exportToExcel = (value, nameExcel) => {
        axios({
            url: `${getData(storageKeys.TENANT_API_URL)}/v1/salary-period/export-to-excel/${value}`,
            method: 'GET',
            responseType: 'blob',
            // withCredentials: true,
            headers: {
                Authorization: `Bearer ${userAccessToken}`, // Sử dụng token từ state
            },
        })
            .then((response) => {
                // const fileName="uy_nhiem_chi";
                const date = new Date();
                const day = formatDateString(date, DEFAULT_EXCEL_DATE);

                const excelBlob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });

                const link = document.createElement('a');

                link.href = URL.createObjectURL(excelBlob);
                link.download = `KyLuong_${nameExcel}.xlsx`;
                link.click();
                showSucsessMessage('Tạo tệp ủy nhiệm chi thành công');
            })
            .catch((error) => {
                console.log(error);
                // Xử lý lỗi tải file ở đây
            });
    };

    const handleApprovepayout = (id, state) => {
        approvePayout({
            data: {
                id,
                state: 2,
                // ...(refcode && { referralCode: refcode }),
            },
            onCompleted: (res) => {
                mixinFuncs.getList();
                showSucsessMessage(translate.formatMessage(commonMessage.registerPeriodSalarySuccess));
            },
            onError: (error) => {
                showErrorMessage(translate.formatMessage(commonMessage.registerPeriodSalaryFail));
            },
        });
    };

    const handleRecalculate = (id, state) => {
        Modal.confirm({
            title: intl.formatMessage(notificationMessage.recalculateTitle, {
                objectName: translate.formatMessage(message.objectName),
            }),
            content: '',
            okText: intl.formatMessage(notificationMessage.ok),
            cancelText: intl.formatMessage(notificationMessage.cancel),
            centered: true,
            onOk: () => {
                executeRecalculate({
                    data: {
                        salaryPeriodId: id,
                        // ...(refcode && { referralCode: refcode }),
                    },
                    onCompleted: (res) => {
                        mixinFuncs.getList();
                        showSucsessMessage(translate.formatMessage(commonMessage.recalculateSalarySuccess));
                    },
                    onError: (error) => {
                        showErrorMessage(translate.formatMessage(commonMessage.recalculateSalaryFail));
                    },
                });
            },
        });
        
    };

    const showRejectItemConfirm = (id) => {
        Modal.confirm({
            title: intl.formatMessage(notificationMessage.rejectTitle, {
                objectName: translate.formatMessage(message.objectName),
            }),
            content: '',
            okText: intl.formatMessage(notificationMessage.ok),
            cancelText: intl.formatMessage(notificationMessage.cancel),
            centered: true,
            onOk: () => {
                // handleRejectPayout(id);
            },
        });
    };
    const showApproveItemConfirm = (id, state) => {
        Modal.confirm({
            title: intl.formatMessage(notificationMessage.approveTitle, {
                objectName: translate.formatMessage(message.objectName),
            }),
            content: '',
            okText: intl.formatMessage(notificationMessage.ok),
            cancelText: intl.formatMessage(notificationMessage.cancel),
            centered: true,
            onOk: () => {
                handleApprovepayout(id, state);
            },
        });
    };

    const columns = [
        {
            title: translate.formatMessage(commonMessage.salaryPeriodName),
            dataIndex: 'name',
            width: 300,
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'start',
            render: (startDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate, DATE_FORMAT_DISPLAY)}</div>
                );
            },
            width: 180,
            align: 'right',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'end',
            align: 'right',
            render: (endDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate, DATE_FORMAT_DISPLAY)}</div>
                );
            },
            width: 180,
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(createdDate, DEFAULT_FORMAT, 7)}</div>
                );
            },
            width: 200,
            align: 'right',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues?.find((item) => item?.value == dataRow);
                return (
                    <Tag color={state?.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state?.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: <FormattedMessage defaultMessage={'Tổng tiền'} />,
            dataIndex: 'totalMoney',
            align: 'right',
            width: 150,
            render: (dataRow) => {
                var formattedValue = formatMoney(dataRow, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '2',
                });
                return <div>{formattedValue}</div>;
            },
        },
        mixinFuncs.renderActionColumn(
            {
                edit: false,
                delete: false,
                reject: false,
                approve: mixinFuncs.hasPermission([apiConfig.salaryPeriod.approve?.baseURL]),
                recalculate: true,
                export: true,
            },
            { width: '150px' },
        ),
    ].filter(Boolean);

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(message.objectName),
        },
    ];
    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                })}
                // actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                        onRow={(record, rowIndex) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                handleOnClick(e, record);
                            },
                        })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default SalaryPeriodListPage;

