import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { categoryKind } from '@constants';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import routes from './routes';
import useFetch from '@hooks/useFetch';
import { FormattedMessage } from 'react-intl';
import CompanyForm from './CompanyForm';


const messages = defineMessages({
    objectName: 'công ty',
});

const CompanySavePage = () => {
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.company.getById,
            create: apiConfig.company.create,
            update: apiConfig.company.update,
        },
        options: {
            getListUrl: routes.companyListPage.path,
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
                    kind: categoryKind.company,
                };
            };
        },
    });

    const {
        data: categories,
        loading: getCategoriesLoading,
        execute: executeGetCategories,
    } = useFetch(apiConfig.category.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.data.map((item) => ({ value: item.id, label: item.categoryName })),
    });

    useEffect(() => {
        executeGetCategories({
            params: {
                kind: categoryKind.course,
            },
        });
    }, []);

    return (
        <PageWrapper
            loading={loading || getCategoriesLoading}
            routes={[
                { breadcrumbName: <FormattedMessage defaultMessage="Công ty" />, path: routes.companyListPage.path },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CompanyForm
                categories={categories}
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

export default CompanySavePage;
