import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { TaskLogKindOptions, statusOptions } from '@constants/masterData';
import NumericField from '@components/common/form/NumericField';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import apiConfig from '@constants/apiConfig';
import { STATE_TASK_ASIGN } from '@constants';
const TaskLogForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const taskId = queryParameters.get('taskId');
    const taskName = queryParameters.get('taskName');
    const courseId = queryParameters.get('courseId');

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.status = statusValues[1].value;
        values.taskId = taskId || values.taskId;
        return mixinFuncs.handleSubmit({ ...values });
    };
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            task: taskName ? taskName : dataDetail?.task?.lecture?.lectureName,
        });
    }, [dataDetail]);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                kind: KindTaskLog[0].value,
                taskId: taskId,
                task: taskName ? taskName : dataDetail?.task?.lecture?.lectureName,
            });
        }
    }, [isEditing]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={24}>
                        {taskId || dataDetail?.task?.lecture?.lectureName ? (
                            <TextField disabled label={<FormattedMessage defaultMessage="Task" />} name="task" />
                        ) : (
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Task" />}
                                name="taskId"
                                apiConfig={apiConfig.task.getList}
                                mappingOptions={(item) => ({ value: item.id, label: item?.lecture.lectureName })}
                                initialSearchParams={{ courseId: courseId, taskState: STATE_TASK_ASIGN }}
                                searchParams={(text) => ({ name: text })}
                            />
                        )}
                    </Col>
                    {/* <Col span={12}>
                        <SelectField
                            required
                            name="status"
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col> */}
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            required
                            disabled={isEditing}
                            name="kind"
                            label={<FormattedMessage defaultMessage="Loại" />}
                            allowClear={false}
                            options={KindTaskLog}
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label={<FormattedMessage defaultMessage="Tổng thời gian" />}
                            name="totalTime"
                            addonAfter={<FormattedMessage defaultMessage="Phút" />}
                            min={0}
                            required
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Lời nhắn" />}
                            name="message"
                            type="textarea"
                            required
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default TaskLogForm;
