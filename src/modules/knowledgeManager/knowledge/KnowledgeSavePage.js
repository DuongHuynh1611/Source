import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import React from 'react';
import { defineMessages } from 'react-intl';
import CourseForm from './KnowledgeForm';

import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import { generatePath, useParams } from 'react-router-dom';
import routes from '../routes';

const messages = defineMessages({
    objectName: 'kiến thức',
});

const KnowledgeSavePage = () => {
    const courseId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.course.getById,
            create: apiConfig.course.createKnowledge,
            update: apiConfig.course.updateKnowledge,
        },
        options: {
            getListUrl: generatePath(routes.knowledgeListPage.path, { courseId }),
            objectName: translate.formatMessage(messages.objectName),
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
                if (err.response.data.code === 'ERROR-COURSE-ERROR-0001') {
                    showErrorMessage('Kiến thức đã tồn tại');
                } else if (err.response.data.code === 'ERROR-COURSE-ERROR-0010') {
                    showErrorMessage('Học phí phải lớn hơn phí hoàn trả');
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                }
                mixinFuncs.setSubmit(false);
            };
        },
    });

    // const { execute: executeUpdateLeader } = useFetch(apiConfig.course.updateLeaderCourse, { immediate: false });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.knowledge),
                    path: generatePath(routes.knowledgeListPage.path, { courseId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CourseForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default KnowledgeSavePage;
