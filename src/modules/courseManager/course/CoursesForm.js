import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DATE_FORMAT_ZERO_TIME, DEFAULT_FORMAT, STATE_COURSE_CANCELED, STATE_COURSE_FINISHED, STATE_COURSE_PREPARED, categoryKinds } from '@constants';
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

const CourseForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const [startDateDefault, setStartDateDefault] = useState();

    const [isDisableStartDate, setIsDisableStartDate] = useState(false);
    const lectureStateOptions = translate.formatKeys(lectureState, ['label']);
    const [lectureStateFilter, setLectureStateFilter] = useState([lectureStateOptions[0]]);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [imageUrl, setImageUrl] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        if (!values?.state) {
            values.state = 1;
        }
        if (!values?.status) {
            values.status = 1;
        }
        values.dateRegister = formatDateToZeroTime(values.dateRegister);
        values.dateEnd = formatDateToZeroTime(values.dateEnd);
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl, banner: bannerUrl });
    };
    useEffect(() => {
        lectureStateOptions.map((state, index) => {
            if (dataDetail?.state == state.value) {
                const length = lectureStateOptions.length;
                console.log(state);
                let arrayStateFilter = [];
                if (index < length - 3) {
                    arrayStateFilter = [state, lectureStateOptions[index + 1], lectureStateOptions[length - 1]];
                } 
                else if (index === length - 3) {
                    arrayStateFilter = [state, lectureStateOptions[length - 1],lectureStateOptions[3]];
                } 
                else {
                    arrayStateFilter = [state];
                }

                setLectureStateFilter(arrayStateFilter);
            }
        });
        dataDetail.dateRegister = dataDetail.dateRegister && dayjs(dataDetail.dateRegister, DATE_FORMAT_VALUE);
        dataDetail.dateEnd = dataDetail.dateEnd && dayjs(dataDetail.dateEnd, DATE_FORMAT_VALUE);
        form.setFieldsValue({
            ...dataDetail,
            subjectId: dataDetail?.subject?.subjectName,
            knowledgeId: dataDetail?.knowledge?.id,
        });
    }, [dataDetail]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            leaderId: dataDetail?.leader?.id,
        });
        setBannerUrl(dataDetail.banner);
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);
    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    const validateDueDate = (_, value) => {
        const { dateRegister } = form.getFieldValue();
        if (dateRegister && value && value <= dateRegister) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
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
    const uploadBanner = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setBannerUrl(response.data.filePath);
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
    const initialRules = [
        {
            required: true,
            message: 'Vui lòng chọn ngày bắt đầu',
        },
    ];

    const getRules = () => {
        let rules = [...initialRules];

        // if (!isDisableStartDate) {
        //     rules.push({
        //         validator: validateStartDate,
        //     });
        // }

        return rules;
    };
    const disabledEndDate = (current) => {
        if (startDateDefault) {
            return current && current.isBefore(startDateDefault.subtract(0, 'day'), 'day');
        }
        return false;
    };
    return (
        <BaseForm
            formId={formId}
            onFinish={handleSubmit}
            form={form}
            onValuesChange={onValuesChange}
            initialValues={{ returnFee: 0 }}
        >
            <Card className="card-form" bordered={false}>
                <Row>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Avatar" />}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Banner" />}
                            name="banner"
                            imageUrl={bannerUrl && `${AppConstants.contentRootUrl}${bannerUrl}`}
                            aspect={4 / 3}
                            uploadFile={uploadBanner}
                        />
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Tên khoá học" />}
                            name="name"
                            required
                        />
                    </Col>

                    <Col span={12}>
                        <AutoCompleteField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            required
                            label={<FormattedMessage defaultMessage="Môn học" />}
                            name="subjectId"
                            apiConfig={apiConfig.subject.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.subjectName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            rules={getRules()}
                            onChange={(value) => {
                                setStartDateDefault(value);
                            }}
                            name="dateRegister"
                            style={{ width: '100%' }}
                            format={DATE_FORMAT_DISPLAY}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            disabled={dataDetail.state >= 3}
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="dateEnd"
                            dependencies={['dateRegister']}
                            disabledDate={disabledEndDate}

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
                            format={DATE_FORMAT_DISPLAY}
                            // required
                        />
                    </Col>
                </Row>
                <TextField
                    disabled={dataDetail.state >= 3}
                    width={'100%'}
                    required
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    name="description"
                    type="textarea"
                />
                <Row gutter={10}>
                    <Col span={12}>
                        <AutoCompleteField
                            // disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            required
                            label={<FormattedMessage defaultMessage="Leader" />}
                            name="leaderId"
                            apiConfig={apiConfig.developer.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item?.account?.fullName })}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                    {/* <Col span={12}>
                        <AutoCompleteField
                            // disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            // required
                            label={<FormattedMessage defaultMessage="Kiến thức" />}
                            name="knowledgeId"
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item?.categoryName })}
                            searchParams={(text) => ({ name: text, kind: categoryKinds.CATEGORY_KIND_KNOWLEDGE })}
                            initialSearchParams={{ kind:5 }}
                        />
                    </Col> */}
                    <Col span={12}>
                        <SelectField
                            disabled={dataDetail?.state === STATE_COURSE_FINISHED || (dataDetail?.state === STATE_COURSE_CANCELED && true)}
                            name="state"
                            defaultValue={lectureStateFilter[0]}
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={lectureStateFilter}
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            required
                            disabled={dataDetail.state !== undefined && dataDetail.state !== STATE_COURSE_PREPARED}
                            label={<FormattedMessage defaultMessage="Học phí" />}
                            name="fee"
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            addonAfter={'đ'}
                            min={0}
                            // dependencies={['returnFee']}
                            // rules={[
                            //     ({ getFieldValue }) => ({
                            //         validator(rule, value) {
                            //             if (getFieldValue('returnFee') >= value) {
                            //                 return Promise.reject(['Học phí phải lớn hơn phí hoàn trả']);
                            //             }
                            //             return Promise.resolve();
                            //         },
                            //     }),
                            // ]}
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            required
                            disabled={dataDetail.state !== undefined && dataDetail.state !== STATE_COURSE_PREPARED}
                            label={<FormattedMessage defaultMessage="Phí hoàn trả" />}
                            name="returnFee"
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            addonAfter={'đ'}
                            min={0}
                            defaultValue={0}
                            dependencies={['fee']}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (getFieldValue('fee') < value) {
                                            return Promise.reject(['Phí hoàn trả phải nhỏ hơn học phí']);
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            disabled={dataDetail?.state === STATE_COURSE_FINISHED || (dataDetail?.state === STATE_COURSE_CANCELED && true)}
                            name="status"
                            defaultValue={statusValues[1]}
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

const formatDateToZeroTime = (date) => {
    return dayjs(date, DEFAULT_FORMAT).utc().format(DATE_FORMAT_ZERO_TIME);
};

export default CourseForm;
