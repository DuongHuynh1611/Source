import { DATE_DISPLAY_FORMAT, DATE_FORMAT_VALUE, DEFAULT_EXCEL_DATE, DEFAULT_FORMAT, TASK_KIND_BUG, TASK_KIND_FEATURE, TASK_KIND_TESTCASE, storageKeys } from '@constants';
import useDisclosure from '@hooks/useDisclosure';
import { Button, Flex, Modal, Space, Tag, Tooltip } from 'antd';
import React from 'react';
import BaseTable from '../table/BaseTable';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import ListPage from '../layout/ListPage';
import { columnProjectTaskKind, kindTask, stateResgistrationOptions } from '@constants/masterData';
import {
    calculateTimes,
    calculateTrainingTimes,
    convertMinuteToHour,
    convertToCamelCase,
    convertUtcToLocalTime,
    formatMoney,
    formatMoneyValue,
} from '@utils';
import useTrainingUnit from '@hooks/useTrainingUnit';
import styles from './modal.module.scss';
import { FileExcelOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { getData } from '@utils/localStorage';
import { showSucsessMessage } from '@services/notifyService';
import { getCacheAccessToken } from '@services/userService';
import { IconAlarm, IconAlarmOff, IconBugFilled } from '@tabler/icons-react';
import axios from 'axios';
import classNames from 'classnames';
// import feature from '@assets/images/feature.png';
// import testCase from '@assets/icons/testCase.svg';
// import helpTask from '@assets/icons/helpIcon.svg';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';

const StatisticsTaskModal = ({ detail = [], open, close, detailTraing = [], isTraining = false, sumTracking, sumRegistration }) => {
    const [openedStateTaskModal, handlersStateTaskModal] = useDisclosure(false);

    const translate = useTranslate();
    const { trainingUnit, bugUnit } = useTrainingUnit();
    const userAccessToken = getCacheAccessToken();
    const { upTime, bugTime } = calculateTimes(detail);
    const { completeTime, assignedTime, differenceTime } = calculateTrainingTimes(detail);
    const columns = () => {
        if (isTraining)
            return [
                {
                    title: <FormattedMessage defaultMessage="Ngày tạo" />,
                    dataIndex: ['createdDate'],
                    render: (date) => {
                        const result = convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
                        return <div>{result}</div>;
                    },
                    width: 180,
                },
                {
                    title: translate.formatMessage(commonMessage.developer),
                    dataIndex: ['studentName'],
                    width: 220,
                },
                {
                    title: translate.formatMessage(commonMessage.course),
                    dataIndex: ['courseName'],
                },
                {
                    title: translate.formatMessage(commonMessage.task),
                    dataIndex: ['lectureName'],
                },
                {
                    title: translate.formatMessage(commonMessage.assignedCourseTime),
                    dataIndex: 'assignedCourseTime',
                    align: 'center',
                    width: 150,
                    render(totalTime) {
                        return <div>{Math.ceil((totalTime / 60) * 100) / 100} h</div>;
                    },
                },
                {
                    title: translate.formatMessage(commonMessage.learnCourseTime),
                    dataIndex: 'learnCourseTime',
                    align: 'center',
                    width: 170,
                    render(totalTime) {
                        return <div>{Math.ceil((totalTime / 60) * 100) / 100} h</div>;
                    },
                },
                {
                    title: <FormattedMessage defaultMessage={'Chênh lệnh'} />,
                    align: 'center',
                    width: 150,
                    render(record) {
                        let value = record.assignedCourseTime - record.learnCourseTime;
                        return (
                            <div
                                className={classNames(
                                    record.assignedCourseTime < record.learnCourseTime
                                        ? styles.customPercent
                                        : styles.customPercentGreen,
                                )}
                            >
                                {Math.ceil((value / 60) * 100) / 100} h
                            </div>
                        );
                    },
                },
            ];
        else
            return [
                {
                    title: <FormattedMessage defaultMessage="Ngày tạo" />,
                    dataIndex: ['createdDate'],
                    render: (date) => {
                        const result = convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
                        return <div>{result}</div>;
                    },
                    width: 180,
                },
                {
                    title: translate.formatMessage(commonMessage.developer),
                    dataIndex: ['projectTaskInfo', 'developer', 'account', 'fullName'],
                    width: 220,
                },
                {
                    title: translate.formatMessage(commonMessage.project),
                    dataIndex: ['projectTaskInfo', 'project', 'name'],

                },
                {
                    title: translate.formatMessage(commonMessage.task),
                    render: (dataRow, record) => {
                        let checkBug = false;
                        if (
                            dataRow.projectTaskInfo.kind === TASK_KIND_BUG &&
                            dataRow.projectTaskInfo.developer?.account.id !==
                            dataRow.projectTaskInfo.bugOfTask?.developer?.account?.id
                        ) {
                            checkBug = true;
                        }
                        let checkFix = false;
                        if (
                            dataRow.projectTaskInfo.kind === TASK_KIND_BUG &&
                            (dataRow.projectTaskInfo.developer.account.id ===
                                dataRow.projectTaskInfo?.bugOfTask?.developer?.account?.id || dataRow.projectTaskInfo?.bugOfTask?.developer?.account.id == dataRow?.developerId)
                        )
                            checkFix = true;
                        return (
                            <Flex vertical>
                                <div>
                                    {dataRow.projectTaskInfo.taskName}
                                </div>
                                {checkBug && checkFix ? (
                                    <Tooltip
                                        title={
                                            <div>
                                                <span style={{ display: 'block' }}>
                                                    Task: {dataRow?.projectTaskInfo?.bugOfTask?.taskName}
                                                </span>
                                            </div>
                                        }
                                        placement={'bottomLeft'}
                                    >
                                        <span style={{ fontSize: 12 }}>
                                            {dataRow.projectTaskInfo.developer.account.fullName} fix bug hộ
                                        </span>
                                    </Tooltip>
                                ) : checkBug && !checkFix && (
                                    <Tooltip
                                        title={
                                            <div>
                                                <span style={{ display: 'block' }}>
                                                    Task: {dataRow.projectTaskInfo?.bugOfTask?.taskName}
                                                </span>
                                            </div>
                                        }
                                        placement={'bottomLeft'}
                                    >
                                        <span style={{ fontSize: 12 }}>
                                            Fix bug hộ cho {dataRow.projectTaskInfo?.bugOfTask?.developer?.account?.fullName}
                                        </span>
                                    </Tooltip>
                                )}
                            </Flex>
                        );
                    },
                },
                {
                    title: translate.formatMessage(commonMessage.kind),
                    // dataIndex: ['projectTaskInfo', 'kind'],
                    width: 80,
                    align: 'center',
                    render(dataRow) {
                        let checkBug = false;
                        if (
                            dataRow.projectTaskInfo.kind === TASK_KIND_BUG &&
                            (dataRow.projectTaskInfo.developer.account.id ===
                                dataRow.projectTaskInfo?.bugOfTask?.developer?.account?.id || dataRow.projectTaskInfo.bugOfTask.developer.account.id == dataRow?.developerId)
                        ) {
                            checkBug = true;
                        }

                        // if (dataRow.projectTaskInfo.kind === TASK_KIND_FEATURE)
                        //     return (
                        //         <div>
                        //             <img src={feature} height="30px" width="30px" />
                        //         </div>
                        //     );
                        // if (dataRow.projectTaskInfo.kind === TASK_KIND_BUG)
                        //     return (
                        //         <div>
                        //             {checkBug ? (
                        //                 <img src={bug} height="30px" width="30px" />
                        //             ) : (
                        //                 <img src={helpTask} height="30px" width="30px" />
                        //             )}
                        //         </div>
                        //     );

                        // if (dataRow.projectTaskInfo.kind === TASK_KIND_TESTCASE)
                        //     return (
                        //         <div>
                        //             <img src={testCase} height="30px" width="30px" />
                        //         </div>
                        //     );
                    },
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
            ];
    };
    const exportToExcel = ({ courseId, studentId, nameLog }) => {
        axios({
            url: `${getData(storageKeys.TENANT_API_URL)}/v1/project-task-log/export-to-excel`,
            method: 'GET',
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${userAccessToken}`,
            },
            params: {
                courseId: courseId,
                studentId: studentId,
            },
        })
            .then((response) => {
                const date = new Date();

                const excelBlob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });

                const link = document.createElement('a');

                link.href = URL.createObjectURL(excelBlob);
                link.download = `ThongKeTask_${convertToCamelCase(nameLog)}.xlsx`;
                link.click();
                showSucsessMessage('Tạo tệp thống kê thành công');
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const exportToExcelTraining = ({ courseId, studentId, nameLog }) => {
        axios({
            url: `${getData(storageKeys.TENANT_API_URL)}/v1/task/export-to-excel`,
            method: 'GET',
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${userAccessToken}`,
            },
            params: {
                courseId: courseId,
                studentId: studentId,
            },
        })
            .then((response) => {
                const date = new Date();

                const excelBlob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });

                const link = document.createElement('a');

                link.href = URL.createObjectURL(excelBlob);
                link.download = `ThongKeTask_${convertToCamelCase(nameLog)}.xlsx`;
                link.click();
                showSucsessMessage('Tạo tệp thống kê thành công');
            })
            .catch((error) => {
                console.log(error);
                // Xử lý lỗi tải file ở đây
            });
    };
    return (
        <Modal
            title={
                <Flex justify="space-between">
                    <div>
                        <Space style={{ fontSize: '17px' }}>Thống kê các task hoàn thành</Space>
                        <Tooltip title={<FormattedMessage defaultMessage={'Export'} />}>
                            <Button
                                type="link"
                                style={{
                                    padding: 0,
                                    marginTop: '-5px',
                                    marginLeft: 10,
                                    display: 'table-cell',
                                    verticalAlign: 'middle',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    isTraining
                                        ? exportToExcelTraining({
                                            courseId: detail[0]?.courseId,
                                            studentId: detail[0]?.studentId,
                                            nameLog: detail[0].studentName,
                                        })
                                        : exportToExcel({
                                            courseId: detail[0]?.courseId,
                                            studentId: detail[0]?.studentId,
                                            nameLog: detail[0].projectTaskInfo.developer.account.fullName,
                                        });
                                }}
                            >
                                <FileExcelOutlined style={{ color: 'green' }} size={18} />
                            </Button>
                        </Tooltip>
                    </div>
                    {!isTraining ? (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'end',
                                marginRight: 25,
                            }}
                        >
                            <span>
                                <Tooltip title={'Tổng thời gian hoàn thành task'} placement="bottom">
                                    <span style={{ marginLeft: '5px' }}>
                                        <IconAlarm style={{ marginBottom: '-5px' }} />:{' '}
                                        <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                            {sumRegistration ? Math.ceil((sumRegistration?.totalTimeWorking / 60) * 10) / 10 : 0}h{' '}
                                            <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>
                                                |{' '}
                                            </span>
                                        </span>
                                    </span>
                                </Tooltip>
                                <Tooltip title={'Tổng thời gian hoàn thành bug'} placement="bottom">
                                    <span style={{ marginLeft: '10px' }}>
                                        <IconBugFilled style={{ marginBottom: '-5px', color: 'red' }} />:{' '}
                                        <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                            {sumRegistration ? Math.ceil((sumRegistration?.totalTimeBug / 60) * 10) / 10 : 0}h
                                        </span>
                                    </span>
                                </Tooltip>
                            </span>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'end',
                                marginRight: 25,
                            }}
                        >
                            <span>
                                <span style={{ marginLeft: '10px' }}>
                                    Yêu cầu:{' '}
                                    <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                        {sumTracking ? Math.ceil((sumTracking?.totalAssignedCourseTime / 60) * 10) / 10 : 0}h{' '}
                                        <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>
                                            |{' '}
                                        </span>
                                    </span>
                                </span>
                                <span style={{ marginLeft: '5px' }}>
                                    Hoàn thành:{' '}
                                    <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                        {sumTracking ? Math.ceil((sumTracking?.totalLearnCourseTime / 60) * 10) / 10 : 0}h{' '}
                                        <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>
                                            |{' '}
                                        </span>
                                    </span>
                                </span>
                                <span style={{ marginLeft: '10px' }}>
                                    Chênh lệch:{' '}
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '17px',
                                            color: differenceTime < 0 && 'red',
                                        }}
                                    >
                                        {sumTracking?.totalDiffCourseTime ? Math.ceil((sumTracking?.totalDiffCourseTime / 60) * 10) / 10 : 0}h
                                    </span>
                                </span>
                            </span>
                        </div>
                    )}
                </Flex>
            }
            open={open}
            destroyOnClose={true}
            footer={null}
            onCancel={close}
            data={detail || {}}
            width={'80%'}
            centered
        >
            <BaseTable
                dataSource={detail || detailTraing}
                columns={columns()}
                className={classNames(styles.modalStyles)}
            />
        </Modal>
    );
};

export default StatisticsTaskModal;