import apiConfig from "@constants/apiConfig";
import CompanytListPage from ".";
import CompanySavePage from "./ComponySavePage";
import CompanySubscriptionIdListPage from "./CompanySubscriptionID";
import CompanySubscriptionIdSavePage from "./CompanySubscriptionID/CompanySubscriptionIDSavePage";
import ServiceCompanySubListPage from '../serviceCompanySubscription';
import ServiceCompanySubscriptionSavePage from "../serviceCompanySubscription/ServiceCompanySubscriptionSavePage";

export default{
    companyListPage: {
        path: '/company',
        title: 'Company List Page',
        auth: true,
        component: CompanytListPage,
    },
    coursesSavePage: {
        path: '/company/:id',
        title: 'Courses Save Page',
        auth: true,
        component: CompanySavePage,
        // permission: [apiConfig.course.create.baseURL,apiConfig.course.update.baseURL],
    },
    companySubscriptionIdListPage: {
        path: '/company/company-subscription',
        title: 'Company Subscription By Id ',
        auth: true,
        component: CompanySubscriptionIdListPage,
        permissions: [apiConfig.companySubscription.getList.baseURL],
    },
    companySubscriptionIdSavePage: {
        path: '/company/company-subscription/:id',
        title: 'Company Subscription Save page By Id ',
        auth: true,
        component: CompanySubscriptionIdSavePage,
        permissions: [apiConfig.companySubscription.create.baseURL, apiConfig.companySubscription.update.baseURL],
    },
    serviceCompanySubListPage: {
        path: '/service-company-subscription',
        title: 'Service Company Subscription',
        auth: true,
        component: ServiceCompanySubListPage,
    },
    serviceCompanySubSavePage: {
        path: '/service-company-subscription/:id',
        title: 'Service Company Subscription Save page',
        auth: true,
        component: ServiceCompanySubscriptionSavePage,
    },
};