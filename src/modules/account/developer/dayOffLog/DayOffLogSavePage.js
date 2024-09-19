import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { generatePath } from 'react-router-dom';
import apiConfig from '@constants/apiConfig';
import { showErrorMessage } from '@services/notifyService';
import { commonMessage } from '@locales/intl';
import { commonStatus } from '@constants';
import routes from '../routes';
import DayOffLogForm from './DayOffLogForm';

const messages = defineMessages({
    objectName: 'Nhật ký nghỉ',
});

const DayOffLogSavePage = () => {
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.dayOffLog.getById,
            create: apiConfig.dayOffLog.create,
            update: apiConfig.dayOffLog.update,
        },
        options: {
            getListUrl: generatePath(routes.dayOffLogListPage.path, {}),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    status: commonStatus.ACTIVE,
                    id: detail.id,
                };
            };
           
            funcs.onSaveError = (err) => {
                // if (err.response.data.code === 'ERROR-ACCOUNT-ERROR-0001') {
                //     showErrorMessage('Lập trình viên đã tồn tại');
                //     mixinFuncs.setSubmit(false);
                // } else {
                //     mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                //     mixinFuncs.setSubmit(false);
                // }
                mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                mixinFuncs.setSubmit(false);
            };
        },
    });


    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.dayOffLog),
                    path: generatePath(routes.dayOffLogListPage.path, {}),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <DayOffLogForm
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

export default DayOffLogSavePage;
