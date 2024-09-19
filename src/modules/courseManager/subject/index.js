import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { useNavigate } from 'react-router-dom';
import { statusOptions } from '@constants/masterData';
import apiConfig from '@constants/apiConfig';
import { DEFAULT_TABLE_ITEM_SIZE,DEFAULT_FORMAT } from '@constants';
import { showErrorMessage } from '@services/notifyService';
import { commonMessage } from '@locales/intl';
import { FieldTypes } from '@constants/formConfig';
import { orderNumber } from '@utils';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import useListBase from '@hooks/useListBase';
import BaseTable from '@components/common/table/BaseTable';
import styles from './subject.module.scss';

const messages= defineMessages({
    objectName: 'môn học',
    code: 'Mã môn học',
    id: 'Id',
});

const SubjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValue = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination,setLoading } = useListBase({
        apiConfig: apiConfig.subject,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.handleDeleteItemError=(error) => {
                if (error.response?.data?.code === 'ERROR-COURSE-ERROR-0001') {
                    showErrorMessage('Môn học đã được liên kết với khóa học');
                    // mixinFuncs.setSubmit(false);
                    setLoading(false);
                } else {
                    showErrorMessage(error?.response?.data?.message);
                    // mixinFuncs.setSubmit(false);
                    setLoading(false);
                }
            };
        },
    });
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.subject) }];
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.subjectName),
            colSpan: 6,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValue,
            submitOnChanged: true,
        },
    ];
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(`./lecture/${record.id}?subjectName=${record.subjectName}`);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'id',
            render: (text, record, index) => {
                return orderNumber(pagination, index);
            },
            width: 50,
        },
        {
            title: translate.formatMessage(commonMessage.subjectName),
            dataIndex: 'subjectName',
            render: (subjectName, record) =>
                !record.parentId ? (
                    <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                        {subjectName}
                    </div>
                ) : (
                    <div>{subjectName}</div>
                ),
        },
        {
            title: translate.formatMessage(messages.code),
            dataIndex: 'subjectCode',
            width: 200,
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const modifiedDate = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(
                    7,
                    'hour',
                );
                const modifiedDateTimeString = convertDateTimeToString(modifiedDate, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
            },
            width: 200,
            align: 'right',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
        </PageWrapper>
    );
};

export default SubjectListPage;
