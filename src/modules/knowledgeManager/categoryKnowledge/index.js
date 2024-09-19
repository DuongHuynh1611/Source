import CategoryListPageCommon from '@components/common/page/category/index';
import { categoryKinds } from '@constants';
import { statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import React from 'react';
import { defineMessages } from 'react-intl';

const message = defineMessages({
    objectName: 'Loại',
    name: 'Tên',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    home: 'Trang chủ',
    category: 'Danh mục kiến thức',
    
});

const CategoryListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const kindOfKnowledge = categoryKinds.CATEGORY_KIND_KNOWLEDGE;

    return (
        <CategoryListPageCommon
            routes={[
                { breadcrumbName: translate.formatMessage(message.category) },
            ]}
            kind={kindOfKnowledge}
        />
    );
};
export default CategoryListPage;
