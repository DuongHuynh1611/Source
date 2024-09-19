import React from "react";
import AutoCompleteField from "@components/common/form/AutoCompleteField";
import { FormattedMessage } from "react-intl";
import apiConfig from "@constants/apiConfig";
import { Flex } from "antd";

export default function DocumentAutocomplete({ form, setContent }) {
    return (
        <Flex gap={10} >
            <span style={{ lineHeight: '30px' }}>
                <FormattedMessage defaultMessage="Chọn biểu mẫu: " />
            </span>
            <AutoCompleteField
                style={{ width: 200, marginRight: '-12px' }}
                name="documentId"
                apiConfig={apiConfig.documentTemplate.getList}
                mappingOptions={(item) => ({
                    value: item.id,
                    label: item.name,
                    content: item?.content,

                })}
                onChange={(_, value) => {
                    setContent(value.content);
                    form.setFieldValue('description', value?.content);
                }}
                searchParams={(text) => ({ name: text })}

            />
        </Flex>

    );
}