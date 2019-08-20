import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import { Col, Form, Row } from 'antd'
import FormModel from './FormModel'
import styles from './index.less'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { ContainerQuery } from 'react-container-query'

const formIds = []

function createWithModel ({ formId, autoReset = false, name, validateMessages, onValuesChange, onFieldsChange, mapPropsToFields }) {
  if (!formId) {
    throw new Error('formId is required')
  }
  if (formIds.includes(formId)) {
    throw new Error(`formId is repeat. ${formId}， it's must unique in app`)
  }
  formIds.push(formId)

  return function (FormClazz, { hotLoader } = {}) {
    // if (!hotLoader) {
    //   if (process.env.NODE_ENV === 'development') {
    //     console.warn(`formId:${formId}, hotLoader params is required, should call as` +
    //       " `Form.createWithModel(opts)(Form, {hotLoader: require('react-hot-loader/root').hot})` " +
    //       'otherwise react-hot-loader maybe not work.')
    //   }
    //   hotLoader = C => C
    // }

    function _onFieldsChange (props, fields) {
      if (onFieldsChange && onFieldsChange(props, fields)) {
        return
      }
      let { formModel } = props
      formModel.onFieldsChanged({ formId, fields })
    }

    function _mapPropsToFields (props) {
      let maps = {}
      let { fields } = props
      if (fields) {
        let formFields = {}
        let currentPath = []
        const readFields = (_fields) => {
          Object.keys(_fields).forEach((key, index) => {
            currentPath.push(key)
            let _field = _fields[key]
            if (_field.name === undefined && _field.value === undefined && typeof _field === 'object') {
              readFields(_field)
              return
            }
            if (_field.name === null || _field.name.length === 0) {
              return
            }
            formFields[_field.name] = Form.createFormField({ ..._field })
            currentPath.pop()
          })
        }
        readFields(fields)
        maps = Object.assign(maps, formFields)
      }
      if (mapPropsToFields) {
        Object.assign(maps, mapPropsToFields(props))
      }
      return maps
    }

    const WrappedForm = Form.create({
      mapPropsToFields: _mapPropsToFields,
      name,
      validateMessages,
      onFieldsChange: _onFieldsChange,
      onValuesChange
    })(FormClazz)

    // return WrappedForm

    @controller((store) => {
      return {
        fields: store['@form'].forms[formId]
      }
    }, { hotLoader })
    class FormWrap extends Component {
      constructor (...args) {
        super(...args)
        if (autoReset) {
          this.formModel.resetFields({ formId })
        }
      }

      @autowire()
      formModel: FormModel

      render () {
        let { formRef, ...remainingProps } = this.props
        return <WrappedForm {...remainingProps} wrappedComponentRef={formRef} formModel={this.formModel} />
      }
    }
    return FormWrap
  }
}

Form.createWithModel = createWithModel

const FormForEditStyle = {
  maxWidth: 960,
  transform: 'translateX(-50%)',
  left: '50%',
  position: 'relative'
}

export class FormForEdit extends Form {
  static defaultProps = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 }
    },
    style: FormForEditStyle
  }
}

FormForEdit.Section = class Section extends React.Component {
  static propTypes = {
    title: PropTypes.string
  }
  render () {
    let { title, children, ...retainProps } = this.props
    return <div {...retainProps} className={classNames([styles.section, this.props.className])} >
      <div className={styles.title}>{title}</div>
      <div className={styles.children}>{children}</div>
    </div>
  }
}

const query = {
  [styles.sectionItemXs]: {
    maxWidth: 575
  },
  [styles.sectionItemSm]: {
    minWidth: 576
  }
}
FormForEdit.SectionFormItem = class SectionFormItem extends React.Component {
  static defaultProps = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 15 }
    }
  }

  render () {
    let { className, ...retainProps } = this.props
    return (
      <ContainerQuery query={query}>
        {params => {
          return (<Form.Item required={false} colon={false} {...retainProps} className={classNames(params, styles.sectionItem, className)} />)
        } }
      </ContainerQuery>
    )
  }
}

FormForEdit.Actions = class FormForEditActions extends React.Component {
  render () {
    let { className, children } = this.props
    return (
      <Row style={FormForEditStyle} className={className}>
        <Col xs={{ span: 24 }} sm={{ span: 10, offset: 7 }} className={styles.actions}>
          {children}
        </Col>
      </Row>
    )
  }
}

export class ModalForm extends Form {
  static defaultProps = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 }
    }
  }
}

export class ActionsItem extends Component {
  render () {
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 6
        }
      }
    }
    return (
      <Form.Item {...tailFormItemLayout} {...this.props} />
    )
  }
}

export default Form
