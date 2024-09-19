import ListPage from '@components/common/layout/ListPage';
import React, { useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DATE_DISPLAY_FORMAT, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, BookOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import { useNavigate, generatePath, useParams, useLocation } from 'react-router-dom';
import route from '@modules/task/routes';
import { convertDateTimeToString } from '@utils/dayHelper';
import { formSize, lectureState, stateResgistrationOptions, statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import routes from '@routes';
import { DATE_FORMAT_DISPLAY } from '@constants';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { commonMessage } from '@locales/intl';
// import styles from '../student.module.scss';
import { convertMinuteToHour, formatMoney, formatMoneyValue } from '@utils';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import styles from './index.module.scss';
import useTrainingUnit from '@hooks/useTrainingUnit';
import classNames from 'classnames';
import useDisclosure from '@hooks/useDisclosure';
import StatisticsTaskModal from '@components/common/elements/StatisticsTaskModal';
import useFetch from '@hooks/useFetch';
import { showErrorMessage } from '@services/notifyService';

const message = defineMessages({
    objectName: 'course',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const paramid = useParams();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const stuId = queryParameters.get('studentId');
    const studentName = queryParameters.get('studentName');
    const leaderName = queryParameters.get('leaderName');
    const stateValues = translate.formatKeys(lectureState, ['label']);
    // const { trainingUnit, bugUnit, numberProject } = useTrainingUnit();
    const [openedStatisticsModal, handlersStatisticsModal] = useDisclosure(false);
    const [detail, setDetail] = useState([]);
    const [isTraining, setisTraining] = useState(false);
    const { execute: executeFindTracking } = useFetch(apiConfig.projectTaskLog.findAllTrackingLog, {
        immediate: false,
    });
    const { execute: executeTrainingTracking } = useFetch(apiConfig.task.studentDetailCourseTask, {
        immediate: false,
    });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination,serializeParams,queryParams } = useListBase({
        apiConfig: {
            // getList : apiConfig.student.getAllCourse,
            getList: apiConfig.registration.getList,
            delete: apiConfig.registration.delete,
            update: apiConfig.course.update,
            getById: apiConfig.course.getById,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            // funcs.prepareGetListPathParams = () => {
            //     return {
            //         // id: stuId,
            //         id : paramid.id,
            //     };
            // };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?studentId=${stuId}`;
            };
            funcs.additionalActionColumnButtons = () => ({
                registration: ({ id, courseName, state }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.registrationProject)}>
                        <Button
                            type="link"
                            // disabled={state === 1}
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();

                                navigate(
                                    routes.studentCourseRegistrationProjectListPage.path +
                                        `?studentId=${stuId}&studentName=${studentName}&registrationId=${id}&courseName=${courseName}&courseState=${state}`,
                                );
                            }}
                        >
                            <PlusSquareOutlined />
                        </Button>
                    </BaseTooltip>
                ),

                task: ({ id, name, subject, state }) => (
                    <BaseTooltip placement="bottom" title={translate.formatMessage(commonMessage.task)}>
                        <Button
                            type="link"
                            disabled={state === 1 || state === 5}
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const path =
                                    (leaderName ? routes.leaderCourseTaskListPage.path : routes.taskListPage.path) +
                                    `?courseId=${id}&courseName=${name}&subjectId=${subject.id}&state=${state}` +
                                    (leaderName ? `&leaderName=${leaderName}` : '');
                                state !== 1 && state !== 5 && navigate(path, { state: { pathPrev: location.search } });
                            }}
                        >
                            <BookOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
            funcs.changeFilter = (filter) => {
                const studentId = queryParams.get('studentId');
                const studentName = queryParams.get('studentName');
                
                mixinFuncs.setQueryParams(
                    serializeParams({
                        studentId,
                        studentName,
                        ...filter,
                    }),
                );
            };
        },
    });

    const setBreadRoutes = () => {
        const breadRoutes = [];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.leader),
                path: routes.leaderListPage.path,
            });
        } else if (studentName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.student),
                path: routes.studentListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.course) });

        return breadRoutes;
    };
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const searchFields = [
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateRegistration,
            submitOnChanged: true,
            colSpan: 4,
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
    const handlerCancel = () => {
        setDetail([]);
        setisTraining(false);
        handlersStatisticsModal.close();
    };
    const columns = [
        {
            title: translate.formatMessage(commonMessage.courseName),
            dataIndex: ['courseName'],
            render: (courseName, record) => <div>{courseName}</div>,
        },
        {
            title: translate.formatMessage(commonMessage.totalProject),
            align: 'center',
            // dataIndex: 'totalProject',
            render: (record) => {
                const trainingLimitConfig = JSON.parse(record.trainingLimitConfig);
                let value;
                if (record.totalTimeBug === 0 || record.totalTimeWorking === 0) {
                    value = 0;
                } else {
                    value = (record.totalTimeBug / record.totalTimeWorking - 1) * 100;
                }
                return (
                    <div
                        className={classNames(
                            record.totalProject < trainingLimitConfig.numberOfTrainingProject
                                ? styles.customPercentOrange
                                : styles.customPercentGreen,
                        )}
                    >
                        <div>
                            {record.totalProject}/{trainingLimitConfig.numberOfTrainingProject}
                        </div>
                        <div>
                            {' '}
                            {record.minusTrainingProjectMoney && value < trainingLimitConfig.trainingProjectPercent ? (
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
                            onClick={() => handleOnClickTraining(record)}
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
                    value = (record.totalTimeBug / record.totalTimeWorking - 1) * 100;
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
                                mixinFuncs.hasPermission([apiConfig.task.studentDetailCourseTask?.baseURL]) &&
                                    styles.customDiv,
                                value > bugUnit ? styles.customPercent : styles.customPercentOrange,
                            )}
                            onClick={() => handleOnClickProject(record)}
                        >
                            {value > 0 ? (
                                <div>-{formatPercentValue(parseFloat(value))}</div>
                            ) : (
                                <div className={styles.customPercentGreen}>Tốt</div>
                            )}
                            {value > bugUnit && (
                                <div>
                                    {' '}
                                    {record.minusTrainingProjectMoney ? (
                                        <span>-{formatMoneyValue(record.minusTrainingProjectMoney)}</span>
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
        // courseStatus == 1 &&

        mixinFuncs.renderActionColumn({ registration: true, delete: true }, { width: '120px' }),
    ];

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    title={<span style={{ fontWeight: 'normal', fontSize: '18px' }}>{studentName}</span>}
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        initialValues: queryFilter,
                        className: styles.search,
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
            <StatisticsTaskModal
                open={openedStatisticsModal}
                close={() => handlerCancel()}
                detail={detail}
                isTraining={isTraining}
            />
        </PageWrapper>
    );
};

export default CourseListPage;
