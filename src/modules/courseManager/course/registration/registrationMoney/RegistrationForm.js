import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import { DEFAULT_FORMAT, REGISTRATION_MONEY_RETURN } from '@constants';
import { projectTaskState, statusOptions, registrationMoneyKind } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { formatDateString } from '@utils';
import { Card, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import SelectField from '@components/common/form/SelectField';
import { FormattedMessage } from 'react-intl';
import NumericField from '@components/common/form/NumericField';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';

const RegistrationMoneyForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const queryParameters = new URLSearchParams(window.location.search);
    const registrationId = queryParameters.get('registrationId');
    const courseFee = queryParameters.get('courseFee');
    const totalMoneyInput = queryParameters.get('totalMoneyInput');
    const [optionActive, setOptionActive] = useState();
    
    const registrationMoneyKindValue = translate.formatKeys(registrationMoneyKind, ['label']);
    const { data: regisData } = useFetch(apiConfig.registration.getDetail, {
        immediate: true,
        pathParams: { id: registrationId },
    });
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        if (values.kind == REGISTRATION_MONEY_RETURN) {
            values.money = regisData.data.totalReturnMoney;
        }

        console.log(values);
        return mixinFuncs.handleSubmit({ ...values });
    };
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setOptionActive(dataDetail?.kind);
    }, [dataDetail]);

    const validateReturnFee = (_, value) => {
        console.log('value',value);
        if (value > courseFee-totalMoneyInput) {
            return Promise.reject('Tiền hoàn lại không được cao hơn tiền thực nhận');
        }
        return Promise.resolve();
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <SelectField
                    required
                    name={['kind']}
                    label={<FormattedMessage defaultMessage="Loại tiền" />}
                    allowClear={false}
                    options={registrationMoneyKindValue}
                    onChange={(value) => {
                        setOptionActive(value);
                    }}
                />
                {optionActive == REGISTRATION_MONEY_RETURN ? (
                    <NumericField
                        label={<FormattedMessage defaultMessage="Số tiền" />}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        readOnly
                        addonAfter={'đ'}
                        defaultValue={regisData.data.totalReturnMoney}
                        min={0}
                        
                    />
                ) : (
                    <NumericField
                        label={<FormattedMessage defaultMessage="Số tiền" />}
                        name={['money']}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        addonAfter={'đ'}
                        min={0}
                       
                        max={courseFee-totalMoneyInput}

                    />
                )}
                {/* <NumericField
                    label={<FormattedMessage defaultMessage="Tiền khóa học" />}
                    name={['money']}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonAfter={'đ'}
                    min={0}
                /> */}

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default RegistrationMoneyForm;
