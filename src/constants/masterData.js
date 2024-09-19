import { 
    STATUS_ACTIVE, 
    STATUS_INACTIVE, 
    STATUS_PENDING,
    PROVINCE_KIND,
    DISTRICT_KIND,
    VILLAGE_KIND,
    versionState,
    STATE_COURSE_PREPARED,
    STATE_COURSE_STARTED,
    STATE_COURSE_FINISHED,
    STATE_COURSE_CANCELED,
    STATE_COURSE_RECRUITED, 
    LECTURE_SECTION,
    LECTURE_LESSION,
    TASK_LOG_WORKING,
    TASK_LOG_OFF,
    STATE_TASK_ASIGN,
    STATE_TASK_DONE,
    STATE_STORY_TASK_CREATE,
    STATE_STORY_TASK_PROCESSING,
    STATE_STORY_TASK_DONE,
    STATE_STORY_TASK_CANCEL,
    REGISTRATION_STATE_REGISTER,
    REGISTRATION_STATE_LEARNING,
    REGISTRATION_STATE_FINISHED,
    REGISTRATION_STATE_CANCEL,
    REGISTRATION_MONEY_RECEIVED,
    REGISTRATION_MONEY_RETURN,
    DEV_KIND_PROJECT,
    LEADER_KIND_PROJECT,
    INTERN_KIND_PROJECT,
    FIX_SALARY,
    HOUR_SALARY,
    STATE_PROJECT_RUNNING,
    STATE_PROJECT_CREATE,
    STATE_PROJECT_DONE,
    STATE_PROJECT_CANCEL,
    STATE_PROJECT_FAILED,
    PAYMENT_UNPAID,
} from '@constants';
import { defineMessages } from 'react-intl';
import {
    nationKindMessage,
    actionMessage,
    lectureStateMessage,
    lectureKindMessage,
    stateCourseRequestMessage,
    taskLog,
    taskStateMessage,
    projectTaskStateMessage,
    archivedMessage,
    stateResgistrationMessage,
    registrationMoneyKindMessage,
    dayOfWeek,
    salaryMessage,
    dayOffLogMessage,
    projectStateMessage,
    salaryPeriodStateMessage,

} from './intl';

const commonMessage = defineMessages({
    statusActive: 'Active',
    statusPending: 'Pending',
    statusInactive: 'Inactive',
});

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const orderOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

export const commonStatus = [
    { value: STATUS_ACTIVE, label: 'Active', color: 'green' },
    { value: STATUS_PENDING, label: 'Pending', color: 'warning' },
    { value: STATUS_INACTIVE, label: 'Inactive', color: 'red' },
];

export const commonStatusOptions = [
    { value: STATUS_ACTIVE, label: 'Active' },
    { value: STATUS_PENDING, label: 'Pending' },
    { value: STATUS_INACTIVE, label: 'Inactive' },
];

export const statusOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_PENDING, label: commonMessage.statusPending, color: '#FFBF00' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
];

export const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
};

export const TaskLogKindOptions = [
    {
        value: TASK_LOG_WORKING,
        label: taskLog.working,
        color: 'green',
    },
    {
        value: TASK_LOG_OFF,
        label: taskLog.off,
        color: 'red',
    },

];

export const dayOfflogOptions = [
    {
        value: false,
        label: dayOffLogMessage.noCharge,
        color: 'green',
    },
    {
        value: true,
        label: dayOffLogMessage.charge,
        color: 'red',
    },

];

export const SalaryOptions = [
    {
        value: FIX_SALARY,
        label: salaryMessage.fix,
        color: '#46ae19',
    },
    {
        value: HOUR_SALARY,
        label: salaryMessage.hour,
        color: '#d2cb19',
    },
];

export const stateResgistrationOptions = [
    {
        value: REGISTRATION_STATE_REGISTER,
        label: stateResgistrationMessage.register,
        color: 'yellow',
    },
    { value: REGISTRATION_STATE_LEARNING, label: stateResgistrationMessage.learning, color: 'blue' },
    { value: REGISTRATION_STATE_FINISHED, label: stateResgistrationMessage.finished, color: 'green' },
    { value: REGISTRATION_STATE_CANCEL, label: stateResgistrationMessage.canceled, color: 'red' },
];

export const nationKindOptions = [
    {
        value: PROVINCE_KIND,
        label: nationKindMessage.province,
    },
    {
        value: DISTRICT_KIND,
        label: nationKindMessage.district,
    },
    {
        value: VILLAGE_KIND,
        label: nationKindMessage.village,
    },
];

export const registrationMoneyKind = [
    { value: REGISTRATION_MONEY_RECEIVED, label: registrationMoneyKindMessage.receivedMoney, color: 'yellow' },
    { value: REGISTRATION_MONEY_RETURN, label: registrationMoneyKindMessage.returnMoney, color: 'blue' },
];

export const kindPost = [
    {
        value: 1,
        label: 'Post',
        color: 'green',
    },
    {
        value: 2,
        label: 'Story',
        color: 'blue',
    },
   
];

export const settingGroups = {
    GENERAL: 'general',
    PAGE: 'page_config',
    REVENUE: 'revenue_config',
    TRAINING: 'training_config',
};
export const dataTypeSetting = {
    INT: 'int',
    STRING: 'string',
    BOOLEAN: 'boolean',
    DOUBLE: 'double',
    RICHTEXT: 'richtext',
};

export const settingKeyName = {
    MONEY_UNIT: 'money_unit',
    TRAINING_UNIT: 'training_percent',
    BUG_UNIT: 'training_project_percent',
    NUMBER_OF_TRAINING_PROJECT: 'number_of_training_projects',
};

export const actionOptions = [
    {
        value: 1,
        label: actionMessage.contactForm,
    },
    { value: 2, label: actionMessage.navigation },
];

export const stateCourseRequestOptions = [
    { value: 0, label: stateCourseRequestMessage.request, color: 'orange' },
    {
        value: 1,
        label: stateCourseRequestMessage.processed,
        color: 'green',
    },
    { value: 2, label: stateCourseRequestMessage.cancel, color: 'red' },
];
export const archivedOption = [
    { value: 0, label: archivedMessage.NotReset },
    { value: 1, label: archivedMessage.Reset },
];

export const lectureState = [
    { value: STATE_COURSE_PREPARED, label: lectureStateMessage.prepared, color: 'yellow' },
    { value: STATE_COURSE_RECRUITED, label: lectureStateMessage.recruit, color: 'blue' },
    { value: STATE_COURSE_STARTED, label: lectureStateMessage.started, color: 'warning' },
    { value: STATE_COURSE_FINISHED, label: lectureStateMessage.finished, color: 'green' },
    { value: STATE_COURSE_CANCELED, label: lectureStateMessage.canceled, color: 'red' },
];

export const versionStateOptions = [
    { value: versionState.VERSION_STATE_PROCESS_ERROR, label: commonMessage.error, color: 'red' },
    { value: versionState.VERSION_STATE_INIT, label: commonMessage.init, color: 'yellow' },
    { value: versionState.VERSION_STATE_SUBMIT, label: commonMessage.submit, color: 'blue' },
    { value: versionState.VERSION_STATE_APPROVE, label: commonMessage.approve, color: 'green' },
    { value: versionState.VERSION_STATE_REJECT, label: commonMessage.reject, color: 'red' },
    { value: versionState.VERSION_STATE_PROCESS, label: commonMessage.loading, color: 'orange' },
];

export const taskState = [
    { value: STATE_TASK_ASIGN, label: taskStateMessage.asign, color: 'warning' },
    { value: STATE_TASK_DONE, label: taskStateMessage.done, color: 'green' },
];

export const storyTaskState = [
    { value: STATE_STORY_TASK_CREATE, label: projectTaskStateMessage.create, color: 'yellow' },
    { value: STATE_STORY_TASK_PROCESSING, label: projectTaskStateMessage.processing, color: 'blue' },
    { value: STATE_STORY_TASK_DONE, label: projectTaskStateMessage.done, color: 'green' },
    { value: STATE_STORY_TASK_CANCEL, label: projectTaskStateMessage.cancel, color: 'red' },
];

export const projectState = [
    { value: STATE_PROJECT_CREATE, label: projectStateMessage.create, color: 'yellow' },
    { value: STATE_PROJECT_RUNNING, label: projectStateMessage.running, color: 'blue' },
    { value: STATE_PROJECT_DONE, label: projectStateMessage.done, color: 'green' },
    { value: STATE_PROJECT_CANCEL, label: projectStateMessage.cancel, color: 'red' },
    { value: STATE_PROJECT_FAILED, label: projectStateMessage.failed, color: 'orange' },
];

export const salaryPeriodState = [
    { value: 0, label: salaryPeriodStateMessage.create, color: 'yellow' },
    { value: 1, label: salaryPeriodStateMessage.processing, color: 'yellow' },
    { value: 2, label: salaryPeriodStateMessage.done, color: 'green' },
    { value: 3, label: salaryPeriodStateMessage.done, color: 'green' },
];

export const lectureKindOptions = [
    {
        value: LECTURE_SECTION,
        label: lectureKindMessage.chapter,
        color: 'yellow',
    },
    {
        value: LECTURE_LESSION,
        label: lectureKindMessage.lesson,
        color: 'green',
    },
    // {
    //     value: LECTURE_VIDEO,
    //     label: lectureKindMessage.video,
    //     color: '#FFBF00',
    // },
];

export const daysOfWeekSchedule = [
    { value: 'monday', label: dayOfWeek.monday },
    { value: 'tuesday', label: dayOfWeek.tuesday },
    { value: 'wednesday', label: dayOfWeek.wednesday },
    { value: 'thursday', label: dayOfWeek.thursday },
    { value: 'friday', label: dayOfWeek.friday },
    { value: 'saturday', label: dayOfWeek.saturday },
    { value: 'sunday', label: dayOfWeek.sunday },
];
export const CATEGORY_KIND_GENERATION = 2;
export const CATEGORY_KIND_EDUCATION = 1;
export const CATEGORY_KIND_MAJOR = 3;
export const CATEGORY_KIND_NEW = 4;
export const CATEGORY_KIND_SERVICE = 5;
export const CATEGORY_KIND_INVOICE_IN = 6;
export const CATEGORY_KIND_INVOICE_OUT = 7;
export const CATEGORY_KIND_KNOWLEDGE = 8;
export const CATEGORY_KIND_DEVICE = 9;
export const CATEGORY_KIND_PROVIDER_PRODUCT = 10;

export const categoryKind = {
    service: {
        title: 'Category',
        path: 'service',
        value: CATEGORY_KIND_SERVICE,
    },
    education: {
        title: 'Danh mục trường',
        path: 'education',
        value: CATEGORY_KIND_EDUCATION,
    },
    generation: {
        title: 'Danh mục hệ',
        path: 'generation',
        value: CATEGORY_KIND_GENERATION,
    },
    major: {
        title: 'Danh mục chuyên ngành',
        path: 'major',
        value: CATEGORY_KIND_MAJOR,
    },
    knowledge: {
        title: 'Danh mục kiến thức',
        path: 'knowledge',
        value: CATEGORY_KIND_KNOWLEDGE,
    },
};

export const projectRoleKind = [
    { value: LEADER_KIND_PROJECT, label: 'Leader' },
    { value: DEV_KIND_PROJECT, label: 'Developer' },
    { value: INTERN_KIND_PROJECT, label: 'Intern' },
];


