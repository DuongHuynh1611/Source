import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    AppConstants,
    DEFAULT_TABLE_ITEM_SIZE,
    STATE_COURSE_CANCELED,
    STATE_COURSE_FINISHED,
    storageKeys,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { stateResgistrationOptions, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Flex, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import { Link, generatePath, useLocation, useParams } from 'react-router-dom';
import { FormattedMessage, defineMessages } from 'react-intl';
import { date } from 'yup/lib/locale';
import BaseTable from '@components/common/table/BaseTable';
import { CheckCircleOutlined, DollarOutlined, PlusSquareOutlined } from '@ant-design/icons';
import styles from './Registration.module.scss';
import { useNavigate } from 'react-router-dom';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import { commonMessage } from '@locales/intl';
import { convertMinuteToHour, convertToCamelCase, formatMoney, formatMoneyValue } from '@utils';
import useTrainingUnit from '@hooks/useTrainingUnit';
import classNames from 'classnames';
import useDisclosure from '@hooks/useDisclosure';
import StatisticsTaskModal from '@components/common/elements/StatisticsTaskModal';
import useFetch from '@hooks/useFetch';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { FileExcelOutlined } from '@ant-design/icons';
import { getData } from '@utils/localStorage';
import { getCacheAccessToken } from '@services/userService';
import axios from 'axios';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const message = defineMessages({
    objectName: 'Đăng kí khoá học',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    money: 'Thanh Toán',
});

function RegistrationListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    localStorage.setItem('pathPrev', location.search);
    const navigate = useNavigate();
    const [openedStatisticsModal, handlersStatisticsModal] = useDisclosure(false);
    const [detail, setDetail] = useState([]);
    const [isTraining, setisTraining] = useState(false);
    const userAccessToken = getCacheAccessToken();
    const [sumTracking, setSumTracking] = useState();
    const [sumRegistration, setSumRegistration] = useState();

    const { execute: executeFindTracking } = useFetch(apiConfig.projectTaskLog.findAllTrackingLog, {
        immediate: false,
    });

    const { execute: executeTrainingTracking } = useFetch(apiConfig.task.studentDetailCourseTask, {
        immediate: false,
    });
    const { execute: executeGetSumTracking } = useFetch(apiConfig.task.getSumTracking, {
        immediate: false,
    });
    const { execute: executeGetSumRegistration } = useFetch(apiConfig.task.getSumRegistraion, {
        immediate: false,
    });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, options } = useListBase({
        apiConfig: apiConfig.registration,
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
                return `${pagePath}/create?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };

            funcs.additionalActionColumnButtons = () => ({
                money: ({ id, name, status, studentName, state }) => (
                    <BaseTooltip title={translate.formatMessage(message.money)}>
                        <Button
                            type="link"
                            style={{ padding: '0' }}
                            disabled={status === -1}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.registrationMoneyListPage.path +
                                    `?registrationId=${id}&projectName=${name}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}&name=${studentName}&registrationState=${state}`,
                                );
                            }}
                        >
                            <DollarOutlined />
                        </Button>
                    </BaseTooltip>
                ),
                registration: ({ id, studentId, studentName, trainingLimitConfig, totalProject, state }) => {
                    const numberProject = JSON.parse(trainingLimitConfig).numberOfTrainingProject;
                    return (
                        <BaseTooltip title={translate.formatMessage(commonMessage.registrationProject)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                // disabled={totalProject >= numberProject}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.courseRegistrationProjectListPage.path +
                                        `?registrationId=${id}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}&studentId=${studentId}&studentName=${studentName}&registrationState=${state}&numberProject=${numberProject}
                                            `,
                                    );
                                }}
                            >
                                <PlusSquareOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
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
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(
            routes.studentActivityCourseListPage.path +
            `?courseId=${record?.courseId}&studentId=${record?.studentId}&studentName=${record?.studentName}`,
        );
    };
    const handleOnClickProject = (record) => {
        mixinFuncs.hasPermission([apiConfig.projectTaskLog.findAllTrackingLog?.baseURL]) &&
            executeFindTracking({
                params: {
                    courseId: record?.courseId,
                    studentId: record?.studentId,
                },
                onCompleted: (res) => {
                    if (res?.data && res?.data?.length > 0) {
                        const updatedData = res.data.map((item) => ({
                            ...item,
                            courseId: record?.courseId,
                            studentId: record?.studentId,
                            developerId: record?.developerId,
                        }));
                        setDetail(updatedData);
                    }
                    handlersStatisticsModal.open();
                },
                onError: (error) => {
                    console.log(error);
                },
            });
    };
    const handleOnClickTraining = (record) => {
        setisTraining(true);
        mixinFuncs.hasPermission([apiConfig.task.studentDetailCourseTask?.baseURL]) &&
            executeTrainingTracking({
                params: {
                    courseId: record?.courseId,
                    studentId: record?.studentId,
                },
                onCompleted: (res) => {
                    if (res?.data?.content && res?.data?.content?.length > 0) {
                        const updatedData = res.data.content.map((item) => ({
                            ...item,
                            courseId: record?.courseId,
                            studentId: record?.studentId,
                            developerId: record?.developerId,
                        }));

                        setDetail(updatedData);
                    }
                    handlersStatisticsModal.open();
                },
                onError: (error) => {
                    console.log(error);
                },
            });


    };

    const handleGetSumTracking = (record) => {
        executeGetSumTracking({
            params: {
                courseId: record?.courseId,
                studentId: record?.studentId,
            },
            onCompleted: (res) => {
                if (res?.data) {
                    setSumTracking(res?.data);
                }
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };
    const handleGetSumRegistration = (record) => {
        executeGetSumRegistration({
            params: {
                courseId: record?.courseId,
                studentId: record?.studentId,
            },
            onCompleted: (res) => {
                if (res?.data) {
                    setSumRegistration(res?.data);
                }
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };
    const handlerCancel = () => {
        setDetail([]);
        setisTraining(false);
        handlersStatisticsModal.close();
    };

    const columns = [
        {
            title: '#',
            align: 'center',
            width: 80,
            dataIndex: ['avatar'],
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
            dataIndex: ['studentName'],
            render: (studentName, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                    {studentName}
                </div>
            ),
        },
        {
            title: translate.formatMessage(commonMessage.coursePrice),
            align: 'right',
            dataIndex: 'courseFee',
            render: (price) => {
                const formattedValue = formatMoney(price, {
                    currentcy: 'đ',
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
            width: 130,
        },
        {
            title: translate.formatMessage(commonMessage.amountPaid),
            align: 'right',
            dataIndex: 'totalMoneyInput',
            render: (price) => {
                const formattedValue = formatMoney(price, {
                    currentcy: 'đ',
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
            width: 150,
        },
        {
            title: translate.formatMessage(commonMessage.totalProject),
            align: 'center',
            // dataIndex: 'totalProject',
            render: (record) => {
                const numberProject = JSON.parse(record.trainingLimitConfig).numberOfTrainingProject;
                // const trainingUnit = JSON.parse(record.trainingLimitConfig).trainingPercent;
                const bugUnit = JSON.parse(record.trainingLimitConfig).trainingProjectPercent;
                let value;
                if (record.totalTimeBug === 0 || record.totalTimeWorking === 0) {
                    value = 0;
                } else {
                    value = (record.totalTimeBug / record.totalTimeWorking) * 100;
                }
                return (
                    <div
                        className={classNames(
                            record.totalProject < numberProject
                                ? styles.customPercentOrange
                                : styles.customPercentGreen,
                        )}
                    >
                        <div>
                            {record.totalProject}/{numberProject}
                        </div>
                        <div>
                            {' '}
                            {record.minusTrainingProjectMoney && value < bugUnit ? (
                                <span>-{formatMoneyValue(record.minusTrainingProjectMoney)}</span>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.rateTraining),
            align: 'center',
            render: (record) => {
                const trainingUnit = JSON.parse(record.trainingLimitConfig).trainingPercent;
                let value;
                if (record.totalLearnCourseTime === 0 || record.totalAssignedCourseTime === 0) {
                    value = 0;
                } else {
                    value = (record.totalLearnCourseTime / record.totalAssignedCourseTime - 1) * 100;
                }
                return (
                    <Tooltip
                        style={{ width: 500 }}
                        placement="bottom"
                        title={
                            <div>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.totalLearnCourseTime)}:{' '}
                                    {convertMinuteToHour(record.totalLearnCourseTime)}
                                </span>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.totalAssignedCourseTime)}:{' '}
                                    {convertMinuteToHour(record.totalAssignedCourseTime)}
                                </span>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.rateAllowable)}:{' '}
                                    {formatPercentValue(parseFloat(trainingUnit))}
                                </span>
                            </div>
                        }
                    >
                        <div
                            className={classNames(
                                mixinFuncs.hasPermission([apiConfig.task.studentDetailCourseTask?.baseURL]) &&
                                styles.customDiv,
                                value > trainingUnit ? styles.customPercent : styles.customPercentOrange,
                            )}
                            onClick={() => {

                                handleGetSumTracking(record);
                                handleOnClickTraining(record);
                            }}
                        >
                            {value > 0 ? (
                                <div>-{formatPercentValue(parseFloat(value))}</div>
                            ) : (
                                <div className={styles.customPercentGreen}>Tốt</div>
                            )}
                            {record.minusTrainingMoney > 0 && (
                                <span>-{formatMoneyValue(record.minusTrainingMoney)}</span>
                            )}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.rateBug),
            align: 'center',
            render: (record) => {
                const bugUnit = JSON.parse(record.trainingLimitConfig).trainingProjectPercent;
                let value;
                if (record.totalTimeBug === 0 || record.totalTimeWorking === 0) {
                    value = 0;
                } else {
                    value = (record.totalTimeBug / record.totalTimeWorking) * 100;
                }

                return (
                    <Tooltip
                        placement="bottom"
                        title={
                            <div>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.totalTimeBug)}:{' '}
                                    {convertMinuteToHour(record.totalTimeBug)}
                                </span>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.totalTimeWorking)}:{' '}
                                    {convertMinuteToHour(record.totalTimeWorking)}
                                </span>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.rateAllowable)}:{' '}
                                    {formatPercentValue(parseFloat(bugUnit))}
                                </span>
                            </div>
                        }
                    >
                        <div
                            className={classNames(
                                mixinFuncs.hasPermission([apiConfig.projectTaskLog.findAllTrackingLog?.baseURL]) &&
                                styles.customDiv,
                                value > bugUnit ? styles.customPercent : styles.customPercentOrange,
                            )}
                            onClick={() => {
                                handleGetSumRegistration(record);
                                handleOnClickProject(record);
                            }}
                        >
                            {value > bugUnit ? (
                                <div>-{formatPercentValue(parseFloat(value))}</div>
                            ) : (
                                <div className={styles.customPercentGreen}>Tốt</div>
                            )}
                            {value > bugUnit && (
                                <div>
                                    {' '}
                                    {record.minusTrainingProjectMoney ? (
                                        <span> -{formatMoneyValue(record.minusTrainingProjectMoney)}</span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            )}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            align: 'center',
            render: (schedule) => {
                return <ScheduleFile schedule={schedule} />;
            },
            width: 180,
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateRegistration.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        courseStatus == 1 &&
        mixinFuncs.renderActionColumn(
            {
                registration: mixinFuncs.hasPermission([apiConfig.registrationProject.getList?.baseURL]),
                money: mixinFuncs.hasPermission([apiConfig.registrationMoney.getList?.baseURL]),
                edit: true,
                delete: true,
            },
            { width: 180 },
        ),
    ].filter(Boolean);

    const searchFields = [
        {
            key: 'id',
            placeholder: translate.formatMessage(commonMessage.studentName),
        },
    ];

    const formatPercentValue = (value) => {
        return formatMoney(value, {
            groupSeparator: ',',
            decimalSeparator: '.',
            currentcy: '%',
            currentDecimal: '0',
        });
    };

    const exportToExcel = (value, nameLog) => {
        axios({
            url: `${getData(storageKeys.TENANT_API_URL)}/v1/registration/export-to-excel?courseId=${value}`,
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

                const excelBlob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });

                const link = document.createElement('a');

                link.href = URL.createObjectURL(excelBlob);
                link.download = `Danh_sach_dang_ky_Khoa_${convertToCamelCase(nameLog)}.xlsx`;
                link.click();
                showSucsessMessage('Tạo danh sách đăng ký khóa học thành công!');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: '/course',
                },
                { breadcrumbName: translate.formatMessage(message.registration) },
            ]}
        >
            <ListPage
                title={
                    <Flex>
                        <span>
                            {courseName}
                        </span>
                        <span>
                            <BaseTooltip title={<FormattedMessage defaultMessage={'Export'} />}>
                                <Button
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
                                            courseId,
                                            courseName,
                                        );
                                    }}
                                >
                                    <FileExcelOutlined style={{ color: 'green', fontSize: '18px' }} />
                                </Button>
                            </BaseTooltip>
                        </span>
                    </Flex>
                }
                actionBar={courseState == 5 && courseStatus == 1 && mixinFuncs.renderActionBar()}
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
            <StatisticsTaskModal
                open={openedStatisticsModal}
                close={() => handlerCancel()}
                detail={detail}
                isTraining={isTraining}
                sumTracking={sumTracking}
                sumRegistration={sumRegistration}
            />
        </PageWrapper>
    );
}

export default RegistrationListPage;
