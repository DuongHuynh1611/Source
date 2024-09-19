import apiConfig from "@constants/apiConfig";
import CompanySubscriptionListPage from ".";
import CompanySubscriptionSavePage from "./CompanySubsriptionSavePage";

export default {
    companySubscriptionListPage: {
        path: '/company-subscription',
        title: 'Company Subscription',
        auth: true,
        component: CompanySubscriptionListPage,
    },
    companySubscriptionSavePage: {
        path: '/company-subscription/:id',
        title: 'Company Subscription Save Page',
        auth: true,
        component: CompanySubscriptionSavePage,
    },
};