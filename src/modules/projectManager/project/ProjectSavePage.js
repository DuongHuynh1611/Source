import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import ProjectForm from './ProjectForm';
import { generatePath, useParams } from 'react-router-dom';
import routes from '@routes';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import { commonMessage } from '@locales/intl';

const messages = defineMessages({
    project: 'Dự án',
    objectName: 'Dự án',
});

const ProjectSavePage = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const developerId = queryParameters.get('developerId');
    const developerName = queryParameters.get('developerName');
    const projectId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.project.getById,
            create: apiConfig.project.create,
            update: apiConfig.project.update,
        },
        options: {
            getListUrl: developerId
                ? generatePath(routes.developerProjectListPage.path, { developerId, developerName })
                : generatePath(routes.projectListPage.path, { projectId }),
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
        },
    });

    const { execute: executeUpdateLeader } = useFetch(apiConfig.project.updateLeaderProject, { immediate: false });
    const setBreadRoutes = () => {
        const breadRoutes = [];
        if (developerName) {
            breadRoutes.push(
                {
                    breadcrumbName: translate.formatMessage(commonMessage.developer),
                    path: routes.developerListPage.path,
                },
                {
                    breadcrumbName: translate.formatMessage(commonMessage.project),
                    path:
                        routes.developerProjectListPage.path +
                        `?developerId=${developerId}&developerName=${developerName}`,
                },
            );
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: routes.projectListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };

    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <ProjectForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
                executeUpdateLeader={executeUpdateLeader}
            />
        </PageWrapper>
    );
};

export default ProjectSavePage;
