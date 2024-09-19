import PageNotFound from '@components/common/page/PageNotFound';
import PageNotAllowed from '@components/common/page/PageNotAllowed';
import LoginPage from '@modules/login/index';
import Dashboard from '@modules/entry';
import ProfilePage from '@modules/profile/index';
import adminsRoutes from '@modules/user/routes';
import nationRoutes from '@modules/nation/routes';
import GroupPermissionListPage from '@modules/groupPermission';
import PermissionSavePage from '@modules/groupPermission/PermissionSavePage';
import SettingListPage from '@modules/listSetting';
import SettingSavePage from '@modules/listSetting/SettingSavePage';
import settingsRoutes from '@modules/settings/routes';
import coursesRoutes from '@modules/courseManager/course/routes';
import CourseListPage from '@modules/courseManager/course';
import subjectRoutes from '@modules/courseManager/subject/routes';
import courseRequestRoutes from '@modules/courseManager/courseRequest/routes';
import studentRoutes from '@modules/account/student/routes';
import FinanceRoutes from '@modules/courseManager/finance/routes';
import registrationRoutes from '@modules/courseManager/course/registration/routes';
import companyRoutes from '@modules/companyManager/company/routes';
import knowledgeRoutes from '@modules/knowledgeManager/routes';
import leaderRoutes from '@modules/courseManager/course/registration/routes';
import companySubscriptionRoutes from '@modules/companyManager/companySubscription/routes';
// import CompanyRequestRoutes from '@modules/companyManager/company/com';
import MyCompanySubscriptionRoutes from '@modules/companyManager/myCompanySubscription/routes';
import categoryRoutesEdu from '@modules/category/categoryEducation/routes';
import categoryRoutesRole from '@modules/category/categoryRole/routes';
import categoryRoutesGen from '@modules/category/categoryGeneration/routes';
import projectRoleRoutes from '@modules/projectManager/roleManager/routes';
import documentTemplateRoutes from '@modules/projectManager/document/documentTemplate/routes';
import developerRoutes from '@modules/account/developer/routes';
import projectRoutes from '@modules/projectManager/project/routes';
import registerSalaryPeriodRouts from '@modules/projectManager/registerSalaryPeriod/routes';
import SalaryPeriodRoutes from '@modules/projectManager/salaryPeriod/routes';



/*
	auth
		+ null: access login and not login
		+ true: access login only
		+ false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/',
        component: Dashboard,
        auth: true,
        title: 'Home',
    },
    settingPage: {
        path: '/setting',
        component: Dashboard,
        auth: true,
        title: 'Setting',
    },
    coursePage: {
        path: '/course',
        component: CourseListPage,
        auth: true,
        title: 'Course page',
    },
    // subjectPage:{
    //     path: '/subject',
    //     component: SubjectListPage,
    //     title: 'Subject page',
    // },

    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },
    groupPermissionPage: {
        path: '/group-permission',
        component: GroupPermissionListPage,
        auth: true,
        title: 'Profile page',
    },
    groupPermissionSavePage: {
        path: '/group-permission/:id',
        component: PermissionSavePage,
        auth: true,
        title: 'Profile page',
    },
    listSettingsPage:{
        path:'/settings',
        component:SettingListPage,
        auth: true,
        title: 'Settings page',
    },
    listSettingsPageSavePage: {
        path: '/settings/:id',
        component: SettingSavePage,
        auth: true,
        title: 'Settings page',
    },
    ...adminsRoutes,
    ...nationRoutes,
    ...settingsRoutes,
    ...coursesRoutes,
    ...subjectRoutes,
    ...courseRequestRoutes,
    ...studentRoutes,
    ...FinanceRoutes,
    ...registrationRoutes,
    ...companyRoutes,
    ...knowledgeRoutes,
    ...leaderRoutes,
    ...companySubscriptionRoutes,
    // ...CompanyRequestRoutes,
    ...MyCompanySubscriptionRoutes,
    ...categoryRoutesEdu,
    ...categoryRoutesRole,
    ...categoryRoutesGen,
    ...projectRoleRoutes,
    ...documentTemplateRoutes,
    ...developerRoutes,
    ...projectRoutes,
    ...registerSalaryPeriodRouts,
    ...SalaryPeriodRoutes,
    
    // keep this at last
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
