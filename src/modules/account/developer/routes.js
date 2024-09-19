import apiConfig from '@constants/apiConfig';
import DeveloperSavePage from './DeveloperSavePage';
import DeveloperListPage from '.';
import ProjectListPage from '@modules/projectManager/project/index';
// import ProjectTaskListPage from '@modules/projectManage/project/projectTask';
// import TeamListPage from '@modules/projectManage/project/team';
import KnowledgePermissionListPage from './knowledge';
import DayOffLogListPage from './dayOffLog';
import DayOffLogSavePage from './dayOffLog/DayOffLogSavePage';

export default {
    developerListPage: {
        path: '/developer',
        title: 'Developer',
        auth: true,
        component: DeveloperListPage,
        permissions: [apiConfig.developer.getList.baseURL],
    },
    developerSavePage: {
        path: '/developer/:id',
        title: 'Developer Save Page',
        auth: true,
        component: DeveloperSavePage,
        permissions: [apiConfig.developer.create.baseURL, apiConfig.developer.update.baseURL],
    },
    developerProjectListPage: {
        path: '/developer/project',
        title: 'Developer',
        auth: true,
        component: ProjectListPage,
        permissions: [apiConfig.project.getList.baseURL],
    },
    // developerProjectTeamListPage: {
    //     path: '/developer/project/team',
    //     title: 'Developer Team',
    //     auth: true,
    //     component: TeamListPage,
    //     permissions: [apiConfig.team.getList.baseURL],
    // },
    // developerProjectTaskListPage: {
    //     path: '/developer/project/task',
    //     title: 'Developer',
    //     auth: true,
    //     component: ProjectTaskListPage,
    //     permissions: [apiConfig.projectTask.getList.baseURL],
    // },
    developerPermissionListPageKnowledge: {
        path: '/developer/permission-knowledge-category',
        title: 'Permission knowledge',
        auth: true,
        component: KnowledgePermissionListPage,
        // permissions: apiConfig.knowledgePermission.getList.baseURL,
    },
    dayOffLogListPage: {
        path: '/developer/day-off-log',
        title: 'Day off log ',
        auth: true,
        component: DayOffLogListPage,
        permissions: apiConfig.dayOffLog.getList.baseURL,
    },
    dayOffLogSavePage: {
        path: '/developer/day-off-log/:id',
        title: 'Day off log save page',
        auth: true,
        component: DayOffLogSavePage,
        permissions: [ apiConfig.dayOffLog.update.baseURL],
    },
};
