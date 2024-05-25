import React, { useRef, memo } from 'react';
import { Row, Col, Form, Input, Button, MessagePlugin, Select } from 'tdesign-react';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';

const { FormItem } = Form;

export type FormValueType = {
  name?: string;
  status?: string;
  number?: string;
  time?: string;
  type?: string;
};

export type SearchFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
};

const SearchForm: React.FC<SearchFormProps> = (props) => {
  const formRef = useRef<FormInstanceFunctions>();
  const onSubmit = (e: SubmitContext) => {
    if (e.validateResult === true) {
      MessagePlugin.info('提交成功');
    }
    const queryValue = formRef?.current?.getFieldsValue?.(true);
    props.onSubmit(queryValue as FormValueType);
  };

  const onReset = () => {
    props.onCancel();
    MessagePlugin.info('重置成功');
  };

  return (
    <div className='list-common-table-query'>
      <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} labelWidth={80} colon>
        <Row gutter={[16, 16]}>
          <Col flex={1}>
            <FormItem label='邮箱' name='email'>
              <Input placeholder='请输入反馈者邮箱' />
            </FormItem>
          </Col>
          <Col flex={1}>
            <FormItem label='反馈内容' name='content'>
              <Input placeholder='请输入反馈内容' />
            </FormItem>
          </Col>
          <Col>
            <Button theme='primary' type='submit' style={{ margin: '0px 20px' }}>
              查询
            </Button>
            <Button type='reset' variant='base' theme='default'>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default memo(SearchForm);
