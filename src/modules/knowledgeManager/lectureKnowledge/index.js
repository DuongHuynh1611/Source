import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useTranslate from '@hooks/useTranslate';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '@store/actions/app';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';
import BaseTable from '@components/common/table/BaseTable';
import { lectureKindOptions } from '@constants/masterData';
import { Button, Tag } from 'antd';
import useListBase from '@hooks/useListBase';
import { DEFAULT_GET_ALL_LIST, DEFAULT_TABLE_ITEM_SIZE, LECTURE_SECTION } from '@constants';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { EyeOutlined } from '@ant-design/icons';

const message = defineMessages({
    objectName: 'Bài giảng',
});

const LectureKnowledgeListPage = () => {
    const translate = useTranslate();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const subjectName = queryParameters.get('subjectName');
    const knowledgeId = queryParameters.get('knowledgeId');
    const { courseId } = useParams();
    const lectureKind = translate.formatKeys(lectureKindOptions, ['label']);

    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.course.getDetails,
            },
            options: {
                pageSize: DEFAULT_GET_ALL_LIST,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response?.data?.lectureList,
                            total: response.data.totalElements,
                        };
                    }
                };

                funcs.prepareGetListPathParams = () => {
                    return {
                        id: knowledgeId,
                    };
                };
                funcs.additionalActionColumnButtons = () => ({
                    preview: ({ id,lectureKind }) => {
                        if(lectureKind !== LECTURE_SECTION ){
                            return (
                                <BaseTooltip title={translate.formatMessage(commonMessage.viewDetail)}>
                                    <Button
                                        type="link"
                                        style={{ padding: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        
                                        }}
                                    >
                                        <EyeOutlined />
                                    </Button>
                                </BaseTooltip>
                            );
                        }
                    }
                        
                    ,
                });
            },
        });

    console.log(data);

    const columns = [
        {
            title: translate.formatMessage(commonMessage.lectureName),
            dataIndex: 'lectureName',
            render: (lectureName, record) => {
                let styles;
                if (record?.lectureKind === 2) {
                    styles = {
                        paddingLeft: '30px',
                    };
                } else {
                    styles = {
                        textTransform: 'uppercase',
                        fontWeight: 700,
                    };
                }

                return <div style={styles}>{lectureName}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.kind),
            dataIndex: 'lectureKind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = lectureKind?.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        // mixinFuncs.renderActionColumn(
        //     {
        //         preview: true,
        //         edit: false,
        //         delete: false,
        //     },
        //     { width: '120px' },
        // ),
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.knowledge), path: `/knowledge` },
                { breadcrumbName: translate.formatMessage(message.objectName) },
            ]}
        >
            <ListPage
                title={
                    <span style={{ fontWeight: 'normal', position: 'absolute', fontSize: '16px' }}>{subjectName}</span>
                }
                style={{ width: '50vw' }}
                baseTable={
                    <>
                        <BaseTable
                            dataSource={data}
                            columns={columns}
                        />
                    </>
                }
            />
        </PageWrapper>
    );
};

export default LectureKnowledgeListPage;