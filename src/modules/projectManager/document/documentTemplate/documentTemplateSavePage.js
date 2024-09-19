import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { showErrorMessage } from '@services/notifyService';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import { validatePermission } from '@utils';
import PageUnauthorized from '@components/common/page/unauthorized';
import useAuth from '@hooks/useAuth';
import { getData } from '@utils/localStorage';
import { storageKeys } from '@constants';
import DocumentTemplateForm from './documentTemplateForm';

const messages = defineMessages({
    objectName: 'Tài liệu',
});

function DocumentSavePage() {
    const translate = useTranslate();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.documentTemplate.getById,
            create: apiConfig.documentTemplate.create,
            update: apiConfig.documentTemplate.update,
        },
        options: {
            getListUrl: generatePath(routes.documentListPage.path),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    status: 1,
                };
            };
        },
    });
    const setBreadRoutes = () => {
        const breadRoutes = [
            {
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: routes.documentListPage.path,
            },
        ];
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };

    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <DocumentTemplateForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
                mixinFuncDetails={mixinFuncs}
            />
        </PageWrapper>
    );
}

export default DocumentSavePage;
