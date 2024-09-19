import { Card, Checkbox, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import { projectRoleKind, statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import { commonMessage } from '@locales/intl';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import apiConfig from '@constants/apiConfig';

const ProjectRoleForm = (props) => {
    const translate = useTranslate();
    const {
        formId,
        actions,
        dataDetail,
        onSubmit,
        setIsChangedFormValues,
        isEditing,
        permissions,
        size = 'small',
    } = props;
    const [group, setGroup] = useState([]);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
 

    const handleSubmit = (values) => {

        const permissonArray = values?.permissions?.map((item) => {
            return JSON.parse(item);
        });
      
        values.permissions = permissonArray;
        return mixinFuncs.handleSubmit({ ...values });
    };

    const getGroupPermission = () => {
        const { permissions } = props;
        let groups;
        if (permissions && permissions.length > 0) {
            groups = permissions.reduce((r, a) => {
                r[a.nameGroup] = [...(r[a.nameGroup] || []), a];
                return r;
            }, {});
        }
        setGroup(groups);
    };

    useEffect(() => {
       
        form.setFieldsValue({
            ...dataDetail,
            projectRoleKind: dataDetail?.projectRoleKind,
        });
    }, [dataDetail]);

    useEffect(() => {
        if (permissions.length !== 0) getGroupPermission();
    }, [permissions]);


    return (
        <Form
            style={{ width: '920px' }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label="Name" required name="projectRoleName" />
                    </Col>
                    <Col span={12}>
                        <SelectField name="projectRoleKind" label="Loại" allowClear={false} options={projectRoleKind}/>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField label="Mô tả" type="textarea" name="description" />                       
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="permissions"
                            label={'GroupPermission'}
                            rules={[{ required: true, message: 'permission' }]}
                        >
                            <Checkbox.Group style={{ width: '100%', display: 'block' }} name="permissions">
                                {group
                                    ? Object.keys(group).map((groupName) => (
                                        <Card
                                            key={groupName}
                                            size="small"
                                            title={groupName}
                                            style={{ width: '100%', marginBottom: '4px' }}
                                        >
                                            <Row>
                                                {group[groupName].map((permission) => (
                                                    <Col span={8} key={permission.id}>
                                                        <Checkbox
                                                            value={JSON.stringify({
                                                                permissionId: permission?.id,
                                                                permissionCode: permission?.pcode,
                                                                action : permission?.action,
                                                            })}
                                                            // value={permission?.id}
                                                        >
                                                            {permission.name}
                                                        </Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card>
                                    ))
                                    : null}
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default ProjectRoleForm;
