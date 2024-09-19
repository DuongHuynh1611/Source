import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useParams } from 'react-router-dom';
import CoursesForm from './CoursesForm';
import routes from './routes';
import useFetch from '@hooks/useFetch';
import { VERSION_STATE_REJECT } from '@constants';

const messages = defineMessages({
    objectName: 'khoá học',
});

const CourseSavePage = () => {
    const courseId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.course.getById,
            create: apiConfig.course.create,
            update: apiConfig.course.update,
        },
        options: {
            getListUrl: generatePath(routes.courseListPage.path, { courseId }),
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
                    showErrorMessage('Khóa học đã tồn tại');
                } else if (err.response.data.code === 'ERROR-COURSE-ERROR-0010') {
                    showErrorMessage('Học phí phải lớn hơn phí hoàn trả');
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                }
                mixinFuncs.setSubmit(false);
            };
        },
    });

    const { execute: executeResetRejected } = useFetch(apiConfig.courseReviewHistory.resetRejected, {
        immediate: false,
    });

    useEffect(() => {
        if (detail?.courseReviewHistory?.state === VERSION_STATE_REJECT) {
            executeResetRejected({
                data: {
                    id: detail?.courseReviewHistory?.id,
                },
            });
        }
    }, [ detail ]);

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: generatePath(routes.courseListPage.path, { courseId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CoursesForm
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

export default CourseSavePage;
