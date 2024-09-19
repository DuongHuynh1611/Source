import ListPage from '@components/common/layout/ListPage';
import React, { useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, AppConstants, commonStatusColor, commonStatus, REGISTRATION_STATE_FINISHED, REGISTRATION_STATE_CANCEL, STATE_COURSE_FINISHED, STATE_COURSE_CANCELED } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, useIntl } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { useLocation } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { lectureState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import routes from '@routes';
import { DATE_FORMAT_DISPLAY } from '@constants';
import { commonMessage } from '@locales/intl';
import styles from '../student.module.scss';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Tag } from 'antd';
import useDisclosure from '@hooks/useDisclosure';
import { CheckOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTrainingUnit from '@hooks/useTrainingUnit';

const message = defineMessages({
    objectName: 'Dự án',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    done: 'Hoàn thành dự án',
    updateTaskSuccess: 'Cập nhật trạng thái thành công',
});

const RegistrationProjectListPage = () => {
    const intl = useIntl();
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const stuId = queryParameters.get('studentId');
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    const studentName = queryParameters.get('studentName');
    const registrationId = queryParameters.get('registrationId');
    const registrationState = queryParameters.get('registrationState');
    const { numberProject } = useTrainingUnit();

    const stateValues = translate.formatKeys(lectureState, ['label']);
    const [openedStateTaskModal, handlersStateTaskModal] = useDisclosure(false);
    const [detail, setDetail] = useState();
    const notification = useNotification();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            // getList : apiConfig.student.getAllCourse,
            getList: apiConfig.registrationProject.getList,
            delete: apiConfig.registrationProject.delete,
            create: apiConfig.registrationProject.create,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?studentId=${stuId}`;
            };
            funcs.getCreateLink = (dataRow) => {
                return `${pagePath}/create?studentId=${stuId}&studentName=${studentName}&registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };
            funcs.prepareGetListPathParams = () => {
                return {
                    registrationId: registrationId,
                };
            };
            funcs.additionalActionColumnButtons = () => ({
                changeState: (item) => {
                    return (
                        <BaseTooltip title={translate.formatMessage(message.done)}>
                            <Button
                                type="link"
                                disabled={item.isDone}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDetail(item);
                                    handlersStateTaskModal.open();
                                }}
                            >
                                <CheckOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
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
    const setBreadRoutes = () => {
        const pathDefault = `?studentId=${stuId}&studentName=${studentName}`;
        const pathDefault2 = `?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
        const breadRoutes = [];
        if (courseId != 'null' && courseId != null) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.course),
                path: '/course',
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.registration),
                path: routes.registrationListPage.path + pathDefault2,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.student),
                path: routes.studentListPage.path,
            });
            breadRoutes.push({
                breadcrumbName: courseName,
                path: routes.studentCourseListPage.path + pathDefault,
            });
        }
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.registrationProject),
        });
        return breadRoutes;
    };
    const searchFields = [
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
            submitOnChanged: true,
        },
    ];
    const { execute: executeUpdate } = useFetch(apiConfig.registrationProject.update, { immediate: false });
    const handleOk = () => {
        handlersStateTaskModal.close();
        updateState(detail);
    };
    const updateState = (values) => {
        executeUpdate({
            data: {
                isDone: true,
                id: detail.id,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    mixinFuncs.getList();
                    notification({
                        message: intl.formatMessage(message.updateTaskSuccess),
                    });
                    handlersStateTaskModal.close();
                }
            },
            onError: (error) => {
                console.log(error?.response?.data?.code);
                if (error?.response?.data?.code == 'ERROR-REGISTRATION-PROJECT-ERROR-0000') {
                    notification({ type: 'error', message: 'Dự án đăng ký đã tồn tại! Không thể cập nhật!' });
                } else {
                    notification({ type: 'error', message: 'Lỗi' });
                }
            },
        });
    };
    const columns = [
        {
            title: '#',
            dataIndex: ['project', 'avatar'],
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
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: ['project', 'name'],
            render: (name, record) => <div className={styles.customDiv}>{name}</div>,
        },

        // {
        //     title: translate.formatMessage(commonMessage.startDate),
        //     dataIndex: ['project', 'startDate'],
        //     render: (startDate) => {
        //         return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
        //     },
        //     width: 140,
        //     align: 'right',
        // },
        {
            title: translate.formatMessage(commonMessage.status),
            dataIndex: ['isDone'],
            render: (isDone) => {
                return (
                    <Tag style={{ padding: '0 4px', fontSize:'14px' }} color={isDone ? 'green' : 'yellow'}>
                        {isDone ? 'Hoàn thành' : 'Chưa hoàn thành'}
                    </Tag>
                );
            },
            width: 140,
            align: 'center',
        },

        mixinFuncs.renderActionColumn(
            {
                changeState: mixinFuncs.hasPermission([apiConfig.registrationProject.update.baseURL]),
                delete: true,
                // deleteItem: true,
            },
            { width: '120px' },
        ),
    ].filter(Boolean);

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    actionBar={courseState != REGISTRATION_STATE_FINISHED && registrationState != REGISTRATION_STATE_CANCEL && data?.length <numberProject && mixinFuncs.renderActionBar()}
                    title={<span style={{ fontWeight: 'normal', fontSize: '18px' }}>{studentName}</span>}
                    // searchForm={mixinFuncs.renderSearchForm({
                    //     fields: searchFields,
                    //     initialValues: queryFilter,
                    //     className: styles.search,
                    // })}
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
                title="Thay đổi trạng thái hoàn thành dự án"
                open={openedStateTaskModal}
                onOk={handleOk}
                onCancel={() => handlersStateTaskModal.close()}
                // data={detail || {}}
            ></Modal>
        </PageWrapper>
    );
};

export default RegistrationProjectListPage;
