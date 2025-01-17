import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '../company/routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import ServiceCompanySubscriptionForm from './ServiceCompanySubscriptionForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName:'Quản lý gói dịch vụ',
});

const ServiceCompanySubscriptionSavePage = () => {
    const serviceId = useParams();
    const translate = useTranslate();
    
    const { detail, onSave, mixinFuncs,setIsChangedFormValues,isEditing,errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.serviceCompanySubscription.getById,
            create: apiConfig.serviceCompanySubscription.create,
            update: apiConfig.serviceCompanySubscription.update,
        },
        options:{
            getListUrl: routes.serviceCompanySubListPage.path,
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
        },

    });
    return(
        <PageWrapper
            loading = {loading}
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.serviceCompanySubscription),
                    path: generatePath(routes.serviceCompanySubListPage.path, { serviceId } ) },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <ServiceCompanySubscriptionForm
                formId={mixinFuncs.getFormId()}
                actions = {mixinFuncs.renderActions()}
                dataDetail = {detail ? detail : {}}
                onSubmit = {onSave}
                setIsChangedFormValues = {setIsChangedFormValues}
                isError = {errors}
                isEditing = {isEditing}
            />
        </PageWrapper>
    );
};
export default ServiceCompanySubscriptionSavePage;