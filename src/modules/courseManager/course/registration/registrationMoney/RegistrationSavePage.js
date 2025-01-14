import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';
import routes from '@routes';
import RegistrationForm from './RegistrationForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import { formatDateString } from '@utils';
import { DATE_FORMAT_VALUE } from '@constants';
import { showErrorMessage } from '@services/notifyService';
// import routes from '@modules/course/routes';

const messages = defineMessages({
    objectName: 'Danh sách đăng kí khóa học',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    courseRequest: 'Yêu cầu khoá học',
});

function RegistrationSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    const location = useLocation();

    const { data: dataLocation } = location.state;
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.registration.getById,
            create: dataLocation ? apiConfig.registration.acceptRequest : apiConfig.registration.create,
            update: apiConfig.registration.update,
        },
        options: {
            getListUrl: dataLocation ? routes.courseRequestListPage.path : routes.registrationListPage.path,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    id: detail.id,
                    isIntern: detail?.isIntern,
                    moneyState: detail?.moneyState,
                    isIssuedCertify: detail?.isIssuedCertify,
                    status: detail?.status,
                    ...data,
                };
            };
            funcs.prepareCreateData = (data) => {
                if (dataLocation) {
                    data.courseRequestId = dataLocation.id;
                    return {
                        ...data,
                        // courseId: courseId,
                        // isIssuedCertify: 1,
                        // studentId: data.studentInfo.account.fullName,
                        // moneyState: 1,
                    };
                }
                return {
                    ...data,              
                    courseId: courseId,
                    isIssuedCertify: 1,
                    moneyState: 1,
                    contractSign : "contractSign",
                };
            };
            funcs.onSaveError = (err) => {
                if (err.code === 'ERROR-REGISTRATION-ERROR-0002') {
                    showErrorMessage('Khoá học này không ở trạng thái chiêu sinh');
                    mixinFuncs.setSubmit(false);
                } else if (err.code === 'ERROR-REGISTRATION-ERROR-0003') {
                    showErrorMessage('Sinh viên đã đăng ký khoá học này');
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                }
                mixinFuncs.setSubmit(false);
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                !dataLocation && {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: routes.courseListPage.path,
                },
                !dataLocation && {
                    breadcrumbName: translate.formatMessage(messages.registration),
                    path: routes.registrationListPage.path + `?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`,
                },
                dataLocation && {
                    breadcrumbName: translate.formatMessage(messages.courseRequest),
                    path: routes.courseRequestListPage.path,
                },
                { breadcrumbName: title },
            ].filter(Boolean)}
            title={title}
        >
            <RegistrationForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                isError={errors}
                courseId={courseId}
            />
        </PageWrapper>
    );
}

export default RegistrationSavePage;
