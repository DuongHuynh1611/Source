import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from './routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import StudentForm from './studentForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { showErrorMessage } from '@services/notifyService';
const message = defineMessages({
    objectName: 'Sinh viên',
    student: 'Sinh viên',
});

const StudentSavePage = () => {
    const studentId = useParams();
    const translate = useTranslate();

    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.student.getById,
            create: apiConfig.student.create,
            update: apiConfig.student.update,
        },
        options: {
            getListUrl: routes.studentListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
            funcs.onSaveError = (err) => {
                if (err.response.data.code === 'ERROR-STUDENT-ERROR-0001') {
                    showErrorMessage('Sinh viên đã tồn tại!');
                    mixinFuncs.setSubmit(false);
                } else if (err.response.data.code === 'ERROR-STUDENT-ERROR-0009') {
                    showErrorMessage('MSSV đã tồn tại');
                    mixinFuncs.setSubmit(false);
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                    mixinFuncs.setSubmit(false);
                }
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.student),
                    path: generatePath(routes.studentListPage.path, { studentId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <StudentForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};
export default StudentSavePage;
