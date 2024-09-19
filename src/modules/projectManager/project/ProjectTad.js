import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Tabs } from 'antd';
import useQueryParams from '@hooks/useQueryParams';
import routes from '@routes';
import ProjectTaskListPage from '.';
import { getData, setData } from '@utils/localStorage';
import { storageKeys } from '@constants';
import ProjectMemberListPage from '../member';
import TestPlanListPage from './TestPlan';
import TestCaseListPage from './TestCase';
import ProjectDocumentListPage from '../document';

const ProjectTab = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);

    const storyName = queryParameters.get('storyName');
    const storyId = queryParameters.get('storyId');
    const active = queryParameters.get('active');
    const [searchFilter, setSearchFilter] = useState([]);

    const { params: queryParams, setQueryParams, serializeParams, deserializeParams } = useQueryParams();
    const projectName = queryParams.get('projectName');
    const [activeTab, setActiveTab] = useState(
        getData(storageKeys.TAB_ACTIVE_TASK)
            ? getData(storageKeys.TAB_ACTIVE_TASK)
            : translate.formatMessage(commonMessage.task),
    );
    const projectId = queryParams.get('projectId');


    const dataTab = [
        {
            label: translate.formatMessage(commonMessage.task),
            key: translate.formatMessage(commonMessage.task),
            children: <ProjectTaskListPage setSearchFilter={setSearchFilter} />,
        },
        {
            label: translate.formatMessage(commonMessage.testPlan),
            key: translate.formatMessage(commonMessage.testPlan),
            children: <TestPlanListPage setSearchFilter={setSearchFilter} />,
        },
        {
            label: translate.formatMessage(commonMessage.testCase),
            key: translate.formatMessage(commonMessage.testCase),
            children: <TestCaseListPage setSearchFilter={setSearchFilter} />,
        },
    ];

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.project),
            path: routes.projectListPage.path,
        },
        {
            breadcrumbName: projectName,
            path:
                routes.projectTabPage.path +
                `?projectId=${projectId}&storyId=${storyId}&active=${active}&projectName=${projectName}`,
        },
        {
            breadcrumbName: `${storyName}`,
        },
    ];
    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                baseTable={
                    <Tabs
                        style={{ marginTop: -10 }}
                        type="card"
                        onTabClick={(key) => {
                            queryParams.delete('page');
                            setQueryParams(queryParams);
                            setActiveTab(key);
                            setData(storageKeys.TAB_ACTIVE_TASK, key);
                        }}
                        activeKey={activeTab}
                        items={dataTab.map((item) => {
                            return {
                                label: item.label,
                                key: item.key,
                                children: item.children,
                            };
                        })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ProjectTab;
