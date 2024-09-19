import apiConfig from "@constants/apiConfig";
import StudentListPage from ".";
import StudentSavePage from "./studentSavePage";
import CourseListPage from "@modules/account/student/CourseOfStudent/index";
import RegistrationProjectListPage from "./RegistrationProjectOfCourse";
import RegistrationProjectSavePage from "./RegistrationProjectOfCourse/registrationSavePage";

export default {
    studentListPage: {
        path: '/student',
        title: 'Student',
        auth: true,
        component: StudentListPage,
        // permissions: [apiConfig.student.getList.baseURL],
    },
    studentSavePage: {
        path: '/student/:id',
        title: 'Student Save Page',
        auth: true,
        component: StudentSavePage,
        // permissions: [apiConfig.student.create.baseURL, apiConfig.student.update.baseURL],
    },
    studentCourseListPage: {
        path: '/student/course',
        title: 'Student Course List Page',
        auth: true,
        component: CourseListPage,
        // permissions: [apiConfig.course.getList.baseURL],
    },
    studentCourseRegistrationProjectListPage: {
        path: '/student/registration-project',
        title: 'Student Course Registration Project List Page',
        auth: true,
        component: RegistrationProjectListPage,
        // permissions: [apiConfig.registrationProject.getList.baseURL],
    },
    studentCourseRegistrationProjectSavePage: {
        path: '/student/registration-project/:id',
        title: 'Student Course Registration Project Save Page',
        auth: true,
        component: RegistrationProjectSavePage,
        // permissions: [apiConfig.registrationProject.create.baseURL],
    },
};
