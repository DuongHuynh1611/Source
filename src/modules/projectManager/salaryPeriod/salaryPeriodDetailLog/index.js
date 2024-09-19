import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import {
    BUG_MONEY,
    DAY_OFF,
    DEFAULT_FORMAT,
    storageKeys,
    salaryPeriodKInd,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { Button, Flex, Tag, Tooltip } from 'antd';
import useMoneyUnit from '@hooks/useMoneyUnit';
import {
    convertMinuteToHour,
    convertToCamelCase,
    formatMoney,
    orderNumber,
} from '@utils';
import { getData } from '@utils/localStorage';
import { getCacheAccessToken } from '@services/userService';
import { showSucsessMessage } from '@services/notifyService';
import { FileExcelOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import axios from 'axios';
import useFetch from '@hooks/useFetch';


const message = defineMessages({
    objectName: 'Chi tiết nhật ký kỳ lương',
});
const SalaryPeriodDetailLogListPage = () => {
    const moneyUnit = useMoneyUnit();
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const salaryPeriodId = queryParameters.get('salaryPeriodId');
    const salaryPeriodDetailId = queryParameters.get('detailId');
    const stateValues = translate.formatKeys(salaryPeriodKInd, ['label']);
    const userAccessToken = getCacheAccessToken();
    const [bugPercent, setBugPercent] = useState();
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.salaryPeriodDetailLog,
            options: {
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
                const prepareGetListParams = funcs.prepareGetListParams;
                funcs.prepareGetListParams = (params) => {
                    return {
                        ...prepareGetListParams(params),
                        salaryPeriodId: salaryPeriodDetailId,
                        ignoreKind: 6,
                    };
                };
                funcs.changeFilter = (filter) => {
                    const salaryPeriodId = queryParams.get('salaryPeriodId');
                    mixinFuncs.setQueryParams(serializeParams({ salaryPeriodId, ...filter }));
                };
            },
        });



    const { data: dataSum, execute: executeTimeSum } = useFetch(apiConfig.salaryPeriodDetailLog.getSum, {
        immediate: false,
        params: { salaryPeriodId: salaryPeriodDetailId },
        mappingData: ({ data }) => data,
    });
    useEffect(() => {
        if (salaryPeriodDetailId)
            executeTimeSum({
                params: { salaryPeriodId: salaryPeriodDetailId },
            });
    }, [salaryPeriodDetailId]);

    console.log(dataSum);
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
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const modifiedDate = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(
                    7,
                    'hour',
                );
                const modifiedDateTimeString = convertDateTimeToString(modifiedDate, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
            },
            width: 200,
            align: 'start',
        },
        {
            title: translate.formatMessage(commonMessage.projectName),
            width: 200,
            render: (dataRow) => {
                return dataRow.kind === 3 ? `Ref: ${dataRow.sourceDevName}` : dataRow.projectName;
            },
        },
        {
            title: translate.formatMessage(commonMessage.task),
            dataIndex: 'taskName',
        },
        {
            title: translate.formatMessage(commonMessage.kind),
            dataIndex: 'kind',
            align: 'center',
            width: 80,
            render(kind) {
                const state = stateValues.find((item) => item.value == kind);
                return (
                    <div>
                        <Tag color={state?.color}>
                            <div style={{ padding: '0 1px', fontSize: 14 }}>{state?.label}</div>
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.totalTimeWorking),
            dataIndex: 'totalTime',
            align: 'right',
            width: 150,

            render: (record) => {
                if (!record) return <span></span>;

                let result = record / 60;
                let time = result;
                if (result % 1 !== 0) {
                    time = parseFloat(result.toFixed(2));
                } else {
                    time = result.toFixed(0);
                }

                return <span>{time}h</span>;
            },
        },

        {
            title: translate.formatMessage(commonMessage.salary),
            align: 'right',
            width: 150,
            render: (dataRow) => {
                var money = dataRow.money;
                if (dataRow?.kind == BUG_MONEY || dataRow?.kind == DAY_OFF) {
                    money = money * -1;
                }
                var formattedValue = formatMoney(money, {
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
                delete: false,
            },
            { width: '120px' },
        ),
    ].filter(Boolean);

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.salaryPeriod),
            path: routes.salaryPeriodListPage.path,
        },
        {
            breadcrumbName: <FormattedMessage defaultMessage={'Chi tiết kì lương'} />,
            path: routes.salaryPeriodDetailListPage.path + `?salaryPeriodId=${salaryPeriodId}`,
        },
        {
            breadcrumbName: translate.formatMessage(message.objectName),
        },
    ];
    const formatMoneyValue = (value) => {
        return formatMoney(value ? value : 0, {
            groupSeparator: ',',
            decimalSeparator: '.',
            currentcy: moneyUnit,
            currentDecimal: '2',
        });
    };
    const exportToExcel = (value, nameExcel, nameLog) => {
        axios({
            url: `${getData(storageKeys.TENANT_API_URL)}/v1/salary-period-detail/export-to-excel/${value}`,
            method: 'GET',
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${userAccessToken}`, // Sử dụng token từ state
            },
        })
            .then((response) => {
                const date = new Date();

                const excelBlob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });

                const link = document.createElement('a');

                link.href = URL.createObjectURL(excelBlob);
                link.download = `KyLuong_${nameExcel}_${convertToCamelCase(nameLog)}.xlsx`;
                link.click();
                showSucsessMessage('Tạo tệp ủy nhiệm chi thành công');
            })
            .catch((error) => {
                console.log(error);
                // Xử lý lỗi tải file ở đây
            });
    };
    useEffect(() => {
        let value;
        if (
            data?.[0]?.salaryPeriodDetail?.totalTimeBug === 0 ||
            data?.[0]?.salaryPeriodDetail?.totalTimeWorking === 0
        ) {
            value = 0;
        } else {
            value =
                (data?.[0]?.salaryPeriodDetail?.totalTimeBug / data?.[0]?.salaryPeriodDetail?.totalTimeWorking) * 100;
        }
        setBugPercent(value);
    }, [data]);
    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                title={
                    <div className={styles.title}>
                        <span className={styles.studentName}>
                            {data?.[0]?.devName} - {data?.[0]?.salaryPeriodDetail.salaryPeriod.name}
                        </span>
                        <ul className={styles.groupTotal}>
                            <li className={styles.totalItem}>
                                <Tooltip
                                    title={
                                        <div>
                                            <span style={{ display: 'block' }}>
                                                {translate.formatMessage(commonMessage.totalTimeBug)}:{' '}
                                                {convertMinuteToHour(dataSum?.totalTimeBug)}
                                            </span>
                                            <span style={{ display: 'block' }}>
                                                {translate.formatMessage(commonMessage.totalTimeWorking)}:{' '}
                                                {convertMinuteToHour(dataSum?.totalTimeWorking)}
                                            </span>
                                            <span style={{ display: 'block' }}>
                                                {translate.formatMessage(commonMessage.rateAllowable)}:{' '}
                                                {formatPercentValue(
                                                    parseFloat(dataSum?.limitBugRate),
                                                )}
                                            </span>
                                        </div>
                                    }
                                    placement="bottom"
                                >
                                    {translate.formatMessage(commonMessage.bugPercent)}
                                    {dataSum?.totalBugMoney > data?.[0]?.salaryPeriodDetail?.limitBugHour ? (
                                        <div className={styles.customPercent}>
                                            {' '}
                                            <div>{dataSum ? formatMoneyValue(dataSum?.totalBugMoney) : formatMoneyValue(0)}</div>
                                        </div>
                                    ) : (
                                        <div className={styles.customPercentGreen}>0 $</div>
                                    )}
                                </Tooltip>
                            </li>
                            <li className={styles.totalItem}>
                                <FormattedMessage defaultMessage="Tiền giới thiệu" />
                                <div>{dataSum ? formatMoneyValue(dataSum?.totalReferMoney) : formatMoneyValue(0)}</div>
                            </li>
                            <li>
                                <Flex align="center">
                                    <div>
                                        <FormattedMessage defaultMessage="Tổng tiền" />
                                        <div>{dataSum ? formatMoneyValue(dataSum?.totalSalary) : formatMoneyValue(0)}</div>
                                    </div>
                                    <div>
                                        <BaseTooltip title={<FormattedMessage defaultMessage={'Export'} />}>
                                            <Button
                                                // disabled={state === PAYOUT_PERIOD_STATE_DONE}
                                                type="link"
                                                style={{
                                                    paddingLeft: 10,
                                                    paddingTop: 0,
                                                    display: 'table-cell',
                                                    verticalAlign: 'middle',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    exportToExcel(
                                                        salaryPeriodDetailId,
                                                        data?.[0]?.salaryPeriodDetail.salaryPeriod.name,
                                                        data?.[0]?.devName,
                                                    );
                                                }}
                                            >
                                                <FileExcelOutlined style={{ color: 'green', fontSize: '18px' }} />
                                            </Button>
                                        </BaseTooltip>
                                    </div>
                                </Flex>
                            </li>
                            <li></li>
                        </ul>
                    </div>
                }
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
        </PageWrapper>
    );
};

const formatPercentValue = (value) => {
    return formatMoney(value, {
        groupSeparator: ',',
        decimalSeparator: '.',
        currentcy: '%',
        currentDecimal: '0',
    });
};

export default SalaryPeriodDetailLogListPage;
