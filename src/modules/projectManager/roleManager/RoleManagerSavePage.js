import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import apiConfig from '@constants/apiConfig';
import ProjectRoleForm from './RoleManagerForm';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';

const messages = defineMessages({
    objectName: 'Vai trò dự án',
});

const ProjectRoleSavePage = () => {
    const { id } = useParams();
    const [permissions, setPermissions] = useState([]);
    const { execute: executeGetPermission } = useFetch(apiConfig.groupPermission.getPemissionList, {
        immediate: false,
    });
    const translate = useTranslate();
   
    const projectRoleId = useParams();
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.projectRole.getById,
            create: apiConfig.projectRole.create,
            update: apiConfig.projectRole.update,
        },
        options: {
            getListUrl: generatePath(routes.projectRoleListPage.path, { projectRoleId }),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    // status: STATUS_ACTIVE,
                    // kind: UserTypes.ADMIN,
                    // avatarPath: data.avatar,
                    ...data,
                    id: id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    // kind: UserTypes.ADMIN,
                    // avatarPath: data.avatar,
                };
            };
            funcs.mappingData = (response) => {
                if (response.result === true)
                    return {
                        ...response.data,
                        permissions: response.data?.projectRolePermissionDtos
                            ? response.data?.projectRolePermissionDtos.map((permission) => (JSON.stringify({

                                permissionId: permission?.permissionId,
                                permissionCode: permission?.pcode,
                                action:permission?.action,
                            })))
                            : [],
                    };
            };
        },
    });

    useEffect(() => {
        executeGetPermission({
            params: {
                size: 1000,
                kind: 1,
            },
            onCompleted: (res) => {
                setPermissions(res?.data);
            },
        });
    }, []);

    return (
        <PageWrapper
            loading={loading}
            routes={[{ breadcrumbName: 'Vai trò', path: routes.projectRoleListPage.path }, { breadcrumbName: title }]}
        >
            <ProjectRoleForm
                size="normal"
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                permissions={permissions || []}
            />
        </PageWrapper>
    );
};
export default ProjectRoleSavePage;
