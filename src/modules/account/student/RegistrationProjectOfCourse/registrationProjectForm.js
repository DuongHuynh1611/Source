import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { BaseForm } from '@components/common/form/BaseForm';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { FormattedMessage } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';

const RegistrationProjectForm = ({
    isEditing,
    formId,
    actions,
    dataDetail,
    onSubmit,
    setIsChangedFormValues,
    handleFocus,
    developerId,
    registrationId,
}) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    useEffect(() => {
        if (!isEditing > 0) {
            // form.setFieldsValue({
            //     status: statusValues[1].value,
            // });
        }
    }, [isEditing]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            // university: dataDetail?.category?.categoryName,
        });
    }, [dataDetail]);

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={24}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Dự án" />}
                            name="projectId"
                            disabled={isEditing}
                            apiConfig={apiConfig.project.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{ registrationId: registrationId, ignoreRegisteredProject: true }}
                            optionsParams={{ registrationId: registrationId, ignoreRegisteredProject: true }}
                            searchParams={(text) => ({ name: text })}
                            onFocus={handleFocus}
                            required
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default RegistrationProjectForm;
