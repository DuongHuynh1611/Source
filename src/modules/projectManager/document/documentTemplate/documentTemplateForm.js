import { BaseForm } from '@components/common/form/BaseForm';
import RichTextField, { insertBaseURL, removeBaseURL } from '@components/common/form/RichTextField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants } from '@constants';
import { statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Radio, Row, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import utc from "dayjs/plugin/utc";
import { useWatch } from 'antd/es/form/Form';
dayjs.extend(utc);
const DocumentTemplateForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing, mixinFuncDetails } = props;
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, content: removeBaseURL(values?.content) });
    };
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            name: dataDetail?.name,
            content: insertBaseURL(dataDetail?.content),
        });
    }, [dataDetail]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Tiêu đề" />}
                            name="name"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Status" />}
                            name="status"
                            options={statusValues}
                            disabled
                        />
                    </Col>
                </Row>
                <RichTextField
                    style={{ height: 800, marginBottom: 70 }}
                    label={
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100vw', alignContent: 'center', height: 30 }}>
                            <span style={{ textAlign: 'center', marginTop: 7, marginLeft: 10 }}>
                                <FormattedMessage defaultMessage="Mô tả" />
                            </span>
                        </div>
                    }
                    required
                    name="content"
                    baseURL={AppConstants.contentRootUrl}
                    setIsChangedFormValues={setIsChangedFormValues}
                    form={form}
                    defaultValue={dataDetail?.content}
                />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DocumentTemplateForm;
