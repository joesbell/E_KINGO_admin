import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import SubmitForm, { Row, Col, ActionsItem } from '../../../component/SubmitForm'
import Form from '../../../component/Form'
import ProModel from '../../../model/ProModel'
import { parse } from 'querystring'

import { Button, Input, DatePicker, Select, Upload, Icon, Modal, InputNumber } from 'antd'
const { Option } = Select
const labelCol = {
  md: { span: 24 },
  lg: { span: 8 },
  xl: { span: 8 },
  xxl: { span: 8 }
}
const wrapperCol = {
  md: { span: 24 },
  lg: { span: 10, offset: 8 },
  xl: { span: 8, offset: 8 },
  xxl: { span: 8, offset: 8 }
}

function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

@controller(({ sup, pro }, { match }) => {
  let query = parse(window.location.search.slice(1))
  return {
    AllSupplier: sup.AllSupplier,
    categoryList: pro.categoryList,
    fileList: pro.fileList,
    isRevise: query.isRevise ? query.isRevise : null,
    detail: query.detail ? query.detail : null,
    id: query.id ? query.id : null
  }
})
class ProductManForm extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    name: ''
    // fileList: [
    // ]
  };
  @autowire()
  proModel: ProModel
  componentDidMount=() => {

  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    })
  };
  handleChange = ({ fileList }) => this.proModel.setFileList(fileList);
  onSubmit = (e) => {
    e.preventDefault()
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }
  onChange=(value) => {
    this.setState({
      name: value
    })
  }
  onBlur= async () => {
    await this.proModel.changeCategory(this.state.name)
    await this.props.form.setFieldsValue({ 'category': this.state.name })
  }
  onSearch= (value) => {
    if (value) {
      this.setState({
        name: value
      })
    }
  }
  handleReset = async () => {
    await this.props.form.resetFields()
    await this.proModel.setFileList([])
    await this.props.onCancle()
  }
  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    const { previewVisible, previewImage } = this.state
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>上传</div>
      </div>
    )
    return (
      <SubmitForm autoComplete='off' onSubmit={this.onSubmit}>
        <Row>
          <Col>
            <Form.Item
              label='商品编号'
            >
              {
                getFieldDecorator('number')(<Input disabled placeholder='后台自动生成' allowClear />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='商品分类'
            >
              {
                getFieldDecorator('category', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<Select
                  showSearch
                  placeholder='选择商品分类'
                  optionFilterProp='children'
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                  onSearch={this.onSearch}
                  filterOption={(input, option) =>
                    option.props.children.toString().indexOf(input.toString()) >= 0
                  }
                >
                  {(this.props.categoryList || []).map(el => (
                    <Option key={el.name} value={el.name} >{el.name}</Option>
                  ))}
                </Select>)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='商品名称'
            >
              {
                getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<Input readOnly={this.props.detail === 'true'} allowClear={!this.props.detail} />)
              }
            </Form.Item>
          </Col>
          <Col>
            {
              this.props.detail === 'true'
                ? <Form.Item
                  label='图片'
                >
                  {
                    getFieldDecorator('paths', {
                      rules: [
                        {
                          required: true,
                          message: '不能为空'
                        }
                      ]
                    })(<Upload
                      action='http://118.24.50.239:8181/file/upload'
                      listType='picture-card'
                      name='files'
                      fileList={this.props.fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    />)
                  }
                </Form.Item>
                : <Form.Item
                  label='图片'
                >
                  {
                    getFieldDecorator('paths', {
                      rules: [
                        {
                          required: true,
                          message: '不能为空'
                        }
                      ]
                    })(<Upload
                      action='http://118.24.50.239:8181/file/upload'
                      listType='picture-card'
                      name='files'
                      fileList={this.props.fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {this.props.fileList.length >= 3 ? null : uploadButton}
                    </Upload>)
                  }
                </Form.Item>
            }

          </Col>
          <Col>
            <Form.Item
              label='成本价'
            >
              {
                getFieldDecorator('costPrice', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} min={0} readOnly={this.props.detail === 'true'} step={0.1} />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='零售价'
            >
              {
                getFieldDecorator('petailPrice', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} min={0} readOnly={this.props.detail === 'true'} step={0.1} />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='限购数量'
            >
              {
                getFieldDecorator('limitNum', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} min={0} readOnly={this.props.detail === 'true'} />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='上线有效期'
              style={{ marginBottom: 0 }}
            >
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
              >
                {
                  getFieldDecorator('onlineStartDate', {
                    rules: [
                      {
                        required: true,
                        message: '不能为空'
                      }
                    ]
                  })(
                    <DatePicker format={'YYYY.MM.DD'}
                      placeholder='起始时间'
                      disabled={this.props.detail === 'true'}
                      disabledDate={d =>
                        form.getFieldValue('onlineEndDate') && d.isAfter(form.getFieldValue('onlineEndDate'), 'day')}
                    />)
                }
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }} />
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {
                  getFieldDecorator('onlineEndDate', {
                    rules: [
                      {
                        required: true,
                        message: '不能为空'
                      }
                    ]
                  })(
                    <DatePicker format={'YYYY.MM.DD'}
                      placeholder='结束时间'
                      disabled={this.props.detail === 'true'}
                      disabledDate={d =>
                        form.getFieldValue('onlineStartDate') && d.isBefore(form.getFieldValue('onlineStartDate', 'day'))} />)
                }
              </Form.Item>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='供货商'
            >
              {
                getFieldDecorator('supplerId', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<Select placeholder='请选择' disabled={this.props.detail === 'true'} onChange={this.handleAuditChange} allowClear>
                  {(this.props.AllSupplier || []).map(el => (
                    <Option key={el.id} value={el.id} >{el.name}--{el.phone}</Option>
                  ))}
                </Select>)

              }
            </Form.Item>
          </Col>
          {
            this.props.detail === 'true'
              ? null
              : <ActionsItem labelCol={labelCol} wrapperCol={wrapperCol}>
                <Button type='primary' onClick={this.onSubmit}>保存</Button>
                <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>取消</Button>
              </ActionsItem>
          }

          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt='example' style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Row>
      </SubmitForm>
    )
  }
}
const SubmitProductManForm = Form.createWithModel({
  formId: 'ProductMan/ProForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(ProductManForm)
export default SubmitProductManForm
