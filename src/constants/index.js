import { commonMessage } from '@locales/intl';

export const apiUrl = process.env.REACT_APP_API;
export const enableExposure = process.env.REACT_APP_ENABLE_EXPOSURE === 'true';
export const apiTenantUrl = 'https://elms-tenant-api.developteam.net/';
export const urlVariable = '{URL}';


export const fixedPath = {
    privacy: `${apiUrl}${process.env.REACT_APP_PRIVACY_PATH}`,
    help: `${apiUrl}${process.env.REACT_APP_HELP_PATH}`,
    aboutUs: `${apiUrl}${process.env.REACT_APP_ABOUT_US_PATH}`,
};

export const brandName = 'CMS';

export const appName = 'media-cms-app';

export const storageKeys = {
    USER_ACCESS_TOKEN: `${appName}-${process.env.REACT_APP_ENV}-user-access-token`,
    USER_REFRESH_TOKEN: `${appName}-${process.env.REACT_APP_ENV}-user-refresh-token`,
    USER_KIND: `${appName}-${process.env.REACT_APP_ENV}-user-kind`,
    TENANT_ID: `${appName}-${process.env.REACT_APP_ENV}-tenant-id`,
    RESTAURANT_ID: `${appName}-${process.env.REACT_APP_ENV}-restaurant-id`,
    TENANT_HEADER: `X-tenant`,
    TENANT_API_URL: `${appName}-${process.env.REACT_APP_ENV}-tenant-api-url`,
    USER_PROJECT_ACCESS_TOKEN: `${appName}-${process.env.REACT_APP_ENV}-user-project-access-token`,
    PROJECT_PERMISSION: `${appName}-${process.env.REACT_APP_ENV}-project-permission`,
    TAB_ACTIVE_TASK: `${appName}-${process.env.REACT_APP_ENV}-tab-active-task`,

};

export const AppConstants = {
    apiRootUrl: process.env.REACT_APP_API,
    contentRootUrl: `${process.env.REACT_APP_API_MEDIA}v1/file/download`,
    mediaRootUrl: `${process.env.REACT_APP_API_MEDIA}`,
    langKey: 'vi',
};

export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
};

export const defaultLocale = 'en';
export const locales = ['en', 'vi'];

export const activityType = {
    GAME: 'game',
    VIDEO: 'video',
    ARTICLE: 'article',
    FOCUS_AREA: 'focus-area',
};

export const CATEGORY_KIND_GENERATION = 2;
const CATEGORY_KIND_EDUCATION = 1;
const CATEGORY_KIND_JOBS = 2;
const CATEGORY_KIND_DEPARTMENTS = 3;
export const CATEGORY_KIND_MAJOR = 3;
const CATEGORY_KIND_NEWS = 4;
const CATEGORY_KIND_SERVICE = 8;
const CATEGORY_KIND_KNOWLEDGE = 5;
const CATEGORY_KIND_ROLE = 4;
export const categoryKinds = {
    CATEGORY_KIND_NEWS,
    CATEGORY_KIND_JOBS,
    CATEGORY_KIND_DEPARTMENTS,
    CATEGORY_KIND_EDUCATION,
    CATEGORY_KIND_SERVICE,
    CATEGORY_KIND_KNOWLEDGE,
    CATEGORY_KIND_GENERATION,
    CATEGORY_KIND_MAJOR,
    CATEGORY_KIND_ROLE,
};

export const DATE_DISPLAY_FORMAT = 'DD-MM-YYYY HH:mm';
export const DATE_SHORT_MONTH_FORMAT = 'DD MMM YYYY';
export const TIME_FORMAT_DISPLAY = 'HH:mm';
export const DATE_FORMAT_VALUE = 'DD/MM/YYYY';
export const DATE_FORMAT_DISPLAY = 'DD/MM/YYYY';
export const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm:ss';

export const DATE_FORMAT_ZERO_TIME = 'DD/MM/YYYY 00:00:00';
export const DATE_FORMAT_END_OF_DAY_TIME = 'DD/MM/YYYY 23:59:59';
export const DEFAULT_EXCEL_DATE = 'DDMMYYHHmmss';
export const DEFAULT_FORMAT_DAY_OFF_LOG = 'DD/MM/YYYY HH:mm:00';
export const DEFAULT_FORMAT_ZERO_SECOND = 'DD/MM/YYYY HH:mm:00';

export const VERSION_STATE_PROCESS_ERROR = -1;
export const VERSION_STATE_INIT = 0;
export const VERSION_STATE_SUBMIT = 1;
export const VERSION_STATE_APPROVE = 2;
export const VERSION_STATE_REJECT = 3;
export const VERSION_STATE_PROCESS = 4;
export const VERSION_STATE_DELETE = -2;
export const VERSION_STATE_WAITING = 5;

export const STATE_STORY_TASK_CREATE = 0;
export const STATE_STORY_TASK_PROCESSING = 1;
export const STATE_STORY_TASK_DONE = 2;
export const STATE_STORY_TASK_CANCEL = 3;

export const REGISTRATION_STATE_REGISTER = 1;
export const REGISTRATION_STATE_LEARNING = 2;
export const REGISTRATION_STATE_FINISHED = 3;
export const REGISTRATION_STATE_CANCEL = 4;

export const INTERN_KIND_PROJECT = 3;
export const DEV_KIND_PROJECT = 2;
export const LEADER_KIND_PROJECT = 1;
export const STATE_ORDER_CANCEL = -1;
export const ORDER_TYPE_PICK_UP = 1;
export const ORDER_TYPE_DELIVER = 2;
export const PAYMENT_TYPE_CASH = 'OFFLINE_CASH';
export const PAYMENT_TYPE_CARD = 'OFFLINE_CARD';
export const PAYMENT_TYPE_ONLINE_PAYPAL = 'ONLINE_PAYPAL';



export const REGISTRATION_MONEY_RECEIVED = 1;
export const REGISTRATION_MONEY_RETURN = 2;

export const STATE_PROJECT_CREATE = 1;
export const STATE_PROJECT_RUNNING = 2;
export const STATE_PROJECT_DONE = 3;
export const STATE_PROJECT_CANCEL = 4;
export const STATE_PROJECT_FAILED = 5;

export const navigateTypeEnum = {
    PUSH: 'PUSH',
    POP: 'POP',
    REPLACE: 'REPLACE',
};

export const articleTypeEnum = {
    URL: 'url',
    PLAIN: 'plain',
};

export const accessRouteTypeEnum = {
    NOT_LOGIN: false,
    REQUIRE_LOGIN: true,
    BOTH: null,
};

export const UploadFileTypes = {
    AVATAR: 'AVATAR',
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
};

export const LECTURE_SECTION = 1;
export const LECTURE_LESSION = 2;
export const LECTURE_VIDEO = 3;

export const LIMIT_IMAGE_SIZE = 512000;

export const STATUS_PENDING = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_INACTIVE = -1;
export const STATUS_DELETE = -2;
//state
export const STATE_COURSE_PREPARED = 1;
export const STATE_COURSE_STARTED = 2;
export const STATE_COURSE_FINISHED = 3;
export const STATE_COURSE_CANCELED = 4;
export const STATE_COURSE_RECRUITED = 5;

export const DEFAULT_TABLE_ITEM_SIZE = 20;
export const DEFAULT_TABLE_PAGE_START = 0;

export const TASK_LOG_WORKING = 1;
export const TASK_LOG_OFF = 100;
export const TASK_LOG_BUG = 200;

export const STATE_TASK_ASIGN = 1;
export const STATE_TASK_DONE = 2;

export const STATE_PROJECT_STORY_CREATE = 1;
export const STATE_PROJECT_STORY_PROCESSING = 2;
export const STATE_PROJECT_STORY_DONE = 3;
export const STATE_PROJECT_STORY_CANCEL = 4;
export const TASK_KIND_FEATURE = 1;
export const TASK_KIND_BUG = 2;
export const TASK_KIND_TESTCASE = 3;

export const FIX_SALARY = 1;
export const HOUR_SALARY = 2;

export const PAYOUT_PERIOD_STATE_PENDING = 0;
export const PAYOUT_PERIOD_STATE_CALCULATED = 1;
export const PAYOUT_PERIOD_STATE_DONE = 2;
export const PAYOUT_PERIOD_STATE_CANCEL = 3;

export const CurrentcyPositions = {
    FRONT: 0,
    BACK: 1,
};


export const UserTypes = {
    ADMIN: 1,
    MANAGER: 2,
    STUDENT: 3,
    LEADER: 4,
    COMPANY: 5,
    DEVELOPER: 4,
};


export const categoryKind = {
    news: 1,
};

export const appAccount = {
    APP_USERNAME: process.env.REACT_APP_USERNAME,
    APP_PASSWORD: process.env.REACT_APP_PASSWORD,
};

export const GROUP_KIND_ADMIN = 1;
export const GROUP_KIND_MANAGER = 2;
export const GROUP_KIND_USER = 3;

// export const PaymentState = [
//     { value: PAYMENT_UNPAID, label: commonMessage.paymentUnpaid, color: 'green' },
//     { value: PAYMENT_PAID, label: commonMessage.paymentPaid, color: 'blue' },
// ];

export const FIXED_SALARY = 1;
export const PROJECT_SALARY = 2;
export const REFER_MONEY = 3;
export const BUG_MONEY = 4;
export const DAY_OFF = 5;

export const salaryPeriodKInd = [
    { value: FIXED_SALARY, label: commonMessage.fixed_salary, color: 'green' },
    { value: PROJECT_SALARY, label: commonMessage.task, color: 'blue' },
    { value: REFER_MONEY, label: commonMessage.refer_money, color: 'purple' },
    { value: BUG_MONEY, label: commonMessage.bug, color: 'volcano' },
    { value: DAY_OFF, label: commonMessage.day_off, color: 'red' },
];


export const groupPermissionKindsOptions = [
    { label: 'Admin', value: GROUP_KIND_ADMIN },
    { label: 'Manager', value: GROUP_KIND_MANAGER },
    { label: 'User', value: GROUP_KIND_USER },
];

export const isSystemSettingOptions = [
    { label: commonMessage.showSystemSettings, value: 1 },
    { label: commonMessage.hideSystemSettings, value: 0 },
];

export const PROVINCE_KIND = 1;
export const DISTRICT_KIND = 2;
export const VILLAGE_KIND = 3;

export const SettingTypes = {
    Money: 'Money',
    Timezone: 'Timezone',
    System: 'System',
};

export const versionState = {
    VERSION_STATE_PROCESS_ERROR,
    VERSION_STATE_INIT,
    VERSION_STATE_SUBMIT,
    VERSION_STATE_APPROVE,
    VERSION_STATE_REJECT,
    VERSION_STATE_PROCESS,
    VERSION_STATE_WAITING,
};

export const DEFAULT_GET_ALL_LIST = 1000;
export const DEFAULT_TIME = '01/01/2023 00:00:00';
export const PAYMENT_UNPAID = 0;
export const PAYMENT_PAID = 1;
export const commonStatus = {
    PENDING: 0,
    ACTIVE: 1,
    INACTIVE: -1,
    DELETE: -2,
};
export const commonStatusColor = {
    [commonStatus.PENDING]: 'warning',
    [commonStatus.ACTIVE]: 'green',
    [commonStatus.INACTIVE]: 'gray',
    [commonStatus.DELETE]: 'red',
};




export const ADMIN_LOGIN_TYPE = 'password';

