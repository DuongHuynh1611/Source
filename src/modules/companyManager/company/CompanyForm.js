import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { 
    AppConstants, 
    DATE_FORMAT_DISPLAY, 
    DATE_FORMAT_VALUE, 
    DATE_FORMAT_ZERO_TIME, 
    DEFAULT_FORMAT, 
    STATE_COURSE_CANCELED, 
    STATE_COURSE_FINISHED, 
    STATE_COURSE_PREPARED, categoryKinds } from '@constants';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import { formatDateString } from '@utils';
import { Card, Col, Form, Row, notification } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { formSize, lectureState, statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import NumericField from '@components/common/form/NumericField';
import CropImageField from '@components/common/form/CropImageField';

const CompanyForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const [startDateDefault, setStartDateDefault] = useState();

    const [isDisableStartDate, setIsDisableStartDate] = useState(false);
    const lectureStateOptions = translate.formatKeys(lectureState, ['label']);
    const [lectureStateFilter, setLectureStateFilter] = useState([lectureStateOptions[0]]);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [imageUrl, setImageUrl] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        if (!values.status) {
            values.status = 0;
        }
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            leaderId: dataDetail?.leader?.id,
        });
        setImageUrl(dataDetail.logo);
    }, [dataDetail]);
    
    const uploadLogo = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'Logo',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };
    
    useEffect(() => {
        if (dataDetail.state !== undefined && dataDetail.state !== 1) {
            setIsDisableStartDate(true);
        } else {
            setIsDisableStartDate(false);
        }
    }, [dataDetail.state]);

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    return (
        <BaseForm
            formId={formId}
            onFinish={handleSubmit}
            form={form}
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Logo" />}
                            name="logo"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadLogo}
                        />
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Tên công ty" />}
                            name="companyName"
                            required
                        />
                    </Col>

                    <Col span={12}>
                        <TextField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Tài khoản đăng nhập" />}
                            name="userName"
                            required
                        />
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Email" />}
                            name="email"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Hotline" />}
                            name="number"
                            required
                        />
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Mật khẩu" />}
                            name="password"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Địa chỉ" />}
                            name="location"
                            required
                        />
                    </Col>
                </Row>
                
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CompanyForm;
