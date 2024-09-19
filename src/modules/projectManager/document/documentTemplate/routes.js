import apiConfig from "@constants/apiConfig";
import DocumentListPage from '.';
import DocumentSavePage from "./documentTemplateSavePage";

export default {
    documentListPage: {
        path: '/document-template',
        title: 'Document list Page',
        auth: true,
        component: DocumentListPage,
        permissions: [apiConfig.documentTemplate.getList.baseURL],
    },
    documentSavePage: {
        path: '/document-template/:id',
        title: 'Document save Page',
        auth: true,
        component: DocumentSavePage,
        permissions: [apiConfig.documentTemplate.create.baseURL,apiConfig.documentTemplate.update.baseURL],
    },
};