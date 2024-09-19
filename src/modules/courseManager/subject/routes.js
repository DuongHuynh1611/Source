import apiConfig from "@constants/apiConfig";
import SubjectListPage from ".";
import SubjectSavePage from "./SubjectSavePage";
import LectureListPage from "./lecture";
import LectureSavePage from "./lecture/lectureSavePage";

export default{
    subjectListPage: {
        path: '/subject',
        title: 'Subject List Page',
        auth: true,
        component: SubjectListPage,
    },
    subjectSavePage: {
        path: '/subject/:id',
        title: 'Subject Save Page',
        auth: true,
        component: SubjectSavePage,
    },
    lectureListPage:{
        path: '/subject/lecture/:subjectId',
        title: 'lecture List Page',
        auth: true,
        component: LectureListPage,
        // permissions: [apiConfig.lecture.getBySubject.baseURL],
    },

    lectureSavePage: {
        path: '/subject/lecture/:subjectId/:id',
        title: 'Lecture Save Page',
        auth: true,
        component: LectureSavePage,
        // permissions: [apiConfig.lecture.update.baseURL, apiConfig.lecture.create.baseURL],
    },
};