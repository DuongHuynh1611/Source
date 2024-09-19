import apiConfig from '@constants/apiConfig';
import RegisterSalaryPeriodListPage from '.';

export default{
    registerSalaryPeriodListPage: {
        path: '/register-salary-period',
        title: 'Register Salary Period',
        auth: true,
        component: RegisterSalaryPeriodListPage,
    },
};