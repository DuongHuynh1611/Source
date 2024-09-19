import apiConfig from '@constants/apiConfig';
import CourseListPage from '.';
import CourseSavePage from './CoursesSavePage';
import LectureListPage from './lecture';
import CourseStudentListPage from './student/courseStudent';
import TaskStudentListPage from './student/taskStudent';
import MyTaskStudentListPage from './student/myTask';
import RegistrationStudentListPage from './student/registrationStudent';
import MyActivityCourseListPage from './student/activityCourseStudent';
import MyActivityProjectListPage from './student/activityProjectStudent';
import TaskLogStudentListPage from './student/taskLog';
import TaskLogStudentSavePage from './student/taskLog/TaskLogStudentSavePage';
import TaskStudentSavePage from './student/taskStudent/TasktSavePage';
import RegistrationStudentSavePage from './student/registrationStudent/RegistrationSavePage';
import AsignAllStudentListPage from './student/asignAll';
import CourseStudentSavePage from './student/courseStudent/CourseStudentSavePage';
import ActivityProjectStudentSavePage from './student/activityProjectStudent/ActivityProjectStudentSavePage';
import ActivityCourseStudentSavePage from './student/activityCourseStudent/ActivityCourseStudentSavePage';
import MyTaskLogStudentListPage from './student/myTask/taskLog';
import TaskLogMyStudentSavePage from './student/myTask/taskLog/TaskLogStudentSavePage';
export default {
    courseListPage: {
        path: '/course',
        title: 'Course List Page',
        auth: true,
        component: CourseListPage,
    },
    courseSavePage: {
        path: '/course/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseSavePage,
    },
    lectureTaskListPage: {
        path: '/course/task/lecture',
        title: 'Lecture List Page',
        auth: true,
        component: LectureListPage,
        permissions: [apiConfig.lecture.getBySubject.baseURL],
        breadcrumbs: (message, paramHead, state, location) => {
            return [
                { breadcrumbName: message.course.defaultMessage, path: paramHead },
                { breadcrumbName: message.task.defaultMessage, path: state + location },
                { breadcrumbName: message.objectName.defaultMessage },
            ];
        },
    },  
    // STUDENT
    courseStudentListPage: {
        path: '/course-student',
        title: 'Course Student List Page',
        uth: true,
        component: CourseStudentListPage,
    },
    courseStudentSavePage: {
        path: '/course-student/:id',
        title: 'Course Student Save Page',
        auth: true,
        component: CourseStudentSavePage,
    },
    taskStudentListPage: {
        path: '/course-student/task/:courseId',
        title: 'Task List Page',
        auth: true,
        component: TaskStudentListPage,
    },
    taskStudentSavePage: {
        path: '/course-student/task/:courseId/:id',
        title: 'Task Student Save Page',
        auth: true,
        component: TaskStudentSavePage,
    },
    lectureTaskStudentListPage: {
        path: '/course-student/task/:courseId/lecture',
        title: 'Lecture Leader List Page',
        auth: true,
        component: AsignAllStudentListPage,
    },
    myTaskStudentListPage: {
        path: '/my-task',
        title: 'My Task List Page',
        auth: true,
        component: MyTaskStudentListPage,
    },
    MyTaskLogStudentListPage: {
        path: '/my-task/task-log',
        title: 'Task Log Save Page',
        auth: true,
        component: MyTaskLogStudentListPage,
        permissions: [apiConfig.taskLog.getList.baseURL],
        breadcrumbs: (message, paramHead, state, location, isProject) => {
            return [
                {
                    breadcrumbName: isProject ? message.project.defaultMessage : message.course.defaultMessage,
                    path: paramHead,
                },
                { breadcrumbName: message.task.defaultMessage, path: state + location },
                { breadcrumbName: message.taskLog.defaultMessage },
            ];
        },
    },
    MyTaskLogStudentSavePage: {
        path: '/my-task/task-log/:id',
        title: 'Task Log Save Page',
        auth: true,
        component: TaskLogMyStudentSavePage,
    },
    registrationStudentListPage: {
        path: '/course-student/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationStudentListPage,
    },
    registrationStudentSavePage: {
        path: '/course-student/registration/:id',
        title: 'Registration Student Save Page',
        auth: true,
        component: RegistrationStudentSavePage,
    },
    taskLogStudentListPage: {
        path: '/course-student/task/:courseId/task-log',
        title: 'Task Log Student List Page',
        auth: true,
        component: TaskLogStudentListPage,
    },
    taskLogStudentSavePage: {
        path: '/course-student/task/:courseId/task-log/:id',
        title: 'Task Log Student List Page',
        auth: true,
        component: TaskLogStudentSavePage,
    },
    myActivityCourseStudentListPage: {
        path: '/my-activity-course',
        title: 'My Activity Course List Page',
        auth: true,
        component: MyActivityCourseListPage,
    },
    myActivityCourseStudentSavePage: {
        path: '/my-activity-course/:id',
        title: 'My Activity Course Save Page',
        auth: true,
        component: ActivityCourseStudentSavePage,
    },
    myActivityProjectStudentListPage: {
        path: '/my-activity-project',
        title: 'My Activity Project List Page',
        auth: true,
        component: MyActivityProjectListPage,
    },
    myActivityProjectStudentSavePage: {
        path: '/my-activity-project/:id',
        title: 'My Activity Project Save Page',
        auth: true,
        component: ActivityProjectStudentSavePage,
    },
};
