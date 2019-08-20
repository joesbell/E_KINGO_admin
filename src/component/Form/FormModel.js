import model from '@symph/joy/model'

@model()
export default class FormModel {
  namespace = '@form'

  initState = {
    forms: {}
  }

  async onFieldsChanged ({ formId, fields }) {
    if (!formId) {
      throw new Error('formId is required')
    }
    let { forms } = this.getState()
    this.setState({
      forms: {
        ...forms,
        [formId]: deepMerge(Object.assign({}, forms[formId]), fields)
      }
    })
  }

  resetFields ({ formId, fields }) {
    if (!formId) {
      throw new Error('formId is required')
    }
    let { forms } = this.getState()
    let formValues
    if (!fields || fields.length === 0) {
      // reset all
      formValues = {}
    } else {
      formValues = { ...forms[formId] }
      fields.forEach(i => delete formValues[i])
    }
    this.setState({
      forms: {
        ...forms,
        [formId]: formValues
      }
    })
  }
}

function deepMerge (obj1, obj2) {
  let key
  for (key in obj2) {
    if (!obj2.hasOwnProperty(key)) {
      continue
    }
    let obj1Value = obj1[key]
    obj1[key] = obj1Value && obj1Value.toString() === '[object Object]' &&
      (obj1Value.name === undefined && obj1Value.value === undefined) // is not a field
      ? deepMerge(obj1[key], obj2[key]) : obj1[key] = obj2[key]
  }
  return obj1
}
