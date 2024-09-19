import apiConfig from '@constants/apiConfig';
import RegistrationListPage from '.';
import RegistrationSavePage from './RegistrationSavePage';
import RegistrationMoneyListPage from './registrationMoney';
import RegistrationMoneySavePage from './registrationMoney/RegistrationSavePage';
import StudentActivityCourseListPage from './activity';
import RegistrationProjectListPage from '@modules/account/student/RegistrationProjectOfCourse';
import RegistrationProjectSavePage from '@modules/account/student/RegistrationProjectOfCourse';
export default {
    registrationListPage: {
        path: '/course/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationListPage,
        // permissions: [apiConfig.registration.getList.baseURL],
    },
    registrationSavePage: {
        path: '/course/registration/:id',
        title: 'Registration Save Page',
        auth: true,
        component: RegistrationSavePage,
        // permissions: [apiConfig.registration.create.baseURL, apiConfig.registration.update.baseURL],
    },
    registrationMoneyListPage: {
        path: '/course/registration/money-history',
        title: 'Registration',
        auth: true,
        component: RegistrationMoneyListPage,
        // permissions: [apiConfig.registration.getList.baseURL],
    },
    registrationMoneySavePage: {
        path: '/course/registration/money-history/:id',
        title: 'Registration Save Page',
        auth: true,
        component: RegistrationMoneySavePage,
        // permissions: [apiConfig.registration.create.baseURL, apiConfig.registration.update.baseURL],
    },
    studentActivityCourseListPage: {
        path: '/course/registration/student-activity-course',
        title: 'Student Activity Course List Page',
        auth: true,
        component: StudentActivityCourseListPage,
        permissions: [apiConfig.taskLog.getList.baseURL],
    },
    courseRegistrationProjectListPage: {
        path: '/course/registration-project',
        title: 'Student Course Registration Project List Page',
        auth: true,
        component: RegistrationProjectListPage,
        permissions: [apiConfig.registrationProject.getList.baseURL],
    },
    courseRegistrationProjectSavePage: {
        path: '/course/registration-project/:id',
        title: 'Student Course Registration Project Save Page',
        auth: true,
        component: RegistrationProjectSavePage,
        permissions: [apiConfig.registrationProject.create.baseURL],
    },
    
};
