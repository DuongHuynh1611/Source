import { BulbOutlined } from '@ant-design/icons';
import routes from '@routes';
import {
    IconBuildingCommunity,
    IconClipboardText,
    IconSchool,
    IconSettings,
    IconUserBolt,
    IconBook2,
} from '@tabler/icons-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import apiConfig from './apiConfig';
import { categoryKind } from './masterData';

export const navMenuConfig = [
    {
        label: <FormattedMessage defaultMessage="Quản lý hệ thống" />,
        key: 'quan-ly-he-thong',
        icon: <IconSettings size={16} />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Cài đặt" />,
                key: 'setting',
                path: generatePath(routes.settingsPage.path,{}),
            },
            {
                label: <FormattedMessage defaultMessage="Danh mục trường" />,
                key: 'education-category',
                path: generatePath(routes.categoryListPageEdu.path, {}),
            },
            {
                label: <FormattedMessage defaultMessage="Quản lí vai trò dự án"/>,
                key:  'project - role',
                path: generatePath(routes.categoryListPageRole.path, {}),

            },
            {
                label: categoryKind.generation.title,
                key: 'generation-category',
                path: generatePath(routes.categoryListPageGen.path, {
                    kind: categoryKind.generation.value,
                }),
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý Khóa học" />,
        key: 'quan-ly-khóa-học',
        icon: <IconSchool size={16} />,
        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản lý sinh viên" />,
                key: 'student-management',
                path: routes.studentListPage.path,
                
                permission: apiConfig.student.getList.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý tài chính" />,
                key: 'financial-management',
                path: routes.financeListPage.path,
                // permission: apiConfig.registrationMoney.listSum.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Khoá học" />,
                key: 'khoa-hoc',
                path: generatePath(routes.courseListPage.path, {}),
                // permission: apiConfig.course.getList.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Môn học" />,
                key: 'mon-hoc',
                path: generatePath(routes.subjectListPage.path, {}),
                permission: apiConfig.subject.getList.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Yêu cầu khóa học" />,
                key: 'yeu-cau-khoa-hoc',
                path: generatePath(routes.courseRequestListPage.path, {}),
                permission: apiConfig.subject.getList.baseURL,
            },
        ],
    },

    {
        label: <FormattedMessage defaultMessage="Quản lý kiến thức" />,
        key: 'quan-ly-kien-thuc',
        icon: <IconBook2 size={16} />,
        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: <FormattedMessage defaultMessage="Kiến thức" />,
                key: 'knowledge',
                path: generatePath(routes.knowledgeListPage.path, {}),
            },
            {
                label: categoryKind.knowledge.title,
                key: 'knowledge-category',
                path: generatePath(routes.categoryListPageKnowledge.path, {
                    kind: categoryKind.knowledge.value,
                }),
            },
        ],
    },

    {
        label: <FormattedMessage defaultMessage="Quản lý công ty" />,
        key: 'quan-ly-công-ty',
        icon: <IconBuildingCommunity size={16} />,
        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản lý công ty" />,
                key: 'quan-ly-cong-ty',
                path: generatePath(routes.companyListPage.path,{}),
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý đăng ký gói dịch vụ" />,
                key: 'company-subscription-management',
                path: generatePath(routes.companySubscriptionListPage.path, {}),
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý gói dịch vụ" />,
                key: 'service-company-subscription',
                path: generatePath(routes.serviceCompanySubListPage.path, {}),
            },
            
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý dự án" />,
        key: 'quan-ly-du-an',
        icon: <IconClipboardText size={16} />,
        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản lý roles" />,
                key: 'quan-ly-roles',
                path: generatePath(routes.projectRoleListPage.path,{}),
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý biểu mẫu" />,
                key: 'quan-ly-bieu-mau',
                path: generatePath(routes.documentListPage.path,{}),
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý lập trình viên" />,
                key: 'developer-management',
                path: generatePath(routes.developerListPage.path, {}),
                // permission: apiConfig.developer.getList.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Dự án" />,
                key: 'du-an',
                path: generatePath(routes.projectListPage.path,{}),
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý kỳ lương" />,
                key: 'salary-period',
                path: generatePath(routes.salaryPeriodListPage.path, {}),
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý đăng ký kỳ lương" />,
                key: 'quan-ly-dang-ky-ky-luong',
                path: generatePath(routes.registerSalaryPeriodListPage.path,{}),
            },
        ],
    },
];

export default navMenuConfig;

