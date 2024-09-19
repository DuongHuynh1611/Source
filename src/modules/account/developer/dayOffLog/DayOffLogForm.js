import { BaseForm } from "@components/common/form/BaseForm";
import BooleanField from "@components/common/form/BooleanField";
import DatePickerField from "@components/common/form/DatePickerField";
import TextField from "@components/common/form/TextField";
import { DEFAULT_FORMAT, DEFAULT_FORMAT_DAY_OFF_LOG, DEFAULT_FORMAT_ZERO_SECOND } from "@constants";
import useBasicForm from "@hooks/useBasicForm";
import { commonMessage } from "@locales/intl";
import { Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import styles from './index.module.scss';
import dayjs from "dayjs";
import useTranslate from "@hooks/useTranslate";
import { statusOptions } from "@constants/masterData";
import { convertUtcToLocalTime } from "@utils";
const DayOffLogForm = (props) => {
    const [startDateDefault, setStartDateDefault] = useState();
    const translate = useTranslate();
    const [isChecked, setIsChecked] = useState(false);
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const { form, mixinFuncs, onValuesChange, setFieldValue, getFieldValue } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.startDate = values.startDate && dayjs(values?.startDate).utc().format(DEFAULT_FORMAT);
        values.endDate = values.endDate && dayjs(values?.endDate).utc().format(DEFAULT_FORMAT);

        return mixinFuncs.handleSubmit({ ...values });
    };
    const onFieldsChange = () => {
        onValuesChange();
    };

    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    const disabledEndDate = (current) => {
        if (startDateDefault) {
            return current && current.isBefore(startDateDefault.subtract(0, 'day'), 'day');
        }
        return false;
    };

    const handleOnChangeCheckBox = () => {
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(convertUtcToLocalTime(dataDetail.startDate, DEFAULT_FORMAT, DEFAULT_FORMAT), DEFAULT_FORMAT_ZERO_SECOND);
        dataDetail.endDate = dataDetail.endDate && dayjs(convertUtcToLocalTime(dataDetail.endDate, DEFAULT_FORMAT, DEFAULT_FORMAT), DEFAULT_FORMAT_ZERO_SECOND);

        form.setFieldsValue({
            ...dataDetail,
        });  
        
    }, [dataDetail]);

    return(
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onFieldsChange={onFieldsChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <DatePickerField
                            // showTime={true}
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            name="startDate"
                            format={DEFAULT_FORMAT_DAY_OFF_LOG}
                            // disabledDate={disabledDate}
                            onChange={(value) => {
                                setStartDateDefault(value);
                            }}
                            showTime={{
                                defaultValue: dayjs(dayjs().add(1, 'hour').format('HH:00:00'), 'HH:mm:ss'),
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                                // {
                                //     validator: validateStartDate,
                                // },
                            ]}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="endDate"
                            format={DEFAULT_FORMAT_DAY_OFF_LOG}
                            disabledDate={disabledEndDate}
                            dependencies={['startDate']}
                            showTime={{
                                defaultValue: dayjs(dayjs().add(1, 'hour').format('HH:00:00'), 'HH:mm:ss'),
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(commonMessage.reason)}
                            required
                            // disabled={isEditing}
                            type ='textarea'
                            name="note"
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <BooleanField
                            className={styles.customCheckbox}
                            label={translate.formatMessage(commonMessage.isCharged)}
                            name="isCharged"
                            checked={isChecked}
                            onChange={handleOnChangeCheckBox}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DayOffLogForm;