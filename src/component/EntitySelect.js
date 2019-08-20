import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

export default class EntitySelect extends Component {
  static propTypes = {
    fetchOptions: PropTypes.func,
    nameField: PropTypes.string,
    valueField: PropTypes.string,
    placeholder: PropTypes.string,
    inputs: PropTypes.array
  }

  static defautProps = {
    inputs: []
  }

  constructor (...args) {
    super(...args)
    this.isMount = true
  }

  state={
    allOptions: []
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    let oldInputs = prevProps.inputs || []
    let newInputs = this.props.inputs || []
    for (let i = 0; i < newInputs.length; i++) {
      if (newInputs[i] !== oldInputs[i]) {
        // 数据有变，重新获取选项
        this.fetchOptions()
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(undefined)
        }
      }
    }
  }

  componentDidMount () {
    this.fetchOptions()
  }

   fetchOptions = async () => {
     const { fetchOptions, valueField } = this.props
     let allOptions = await fetchOptions() || []
     if (!this.isMount) {
       return
     }

     // 去掉重复项
     let exitIds = {}
     allOptions = allOptions.filter(item => {
       if (!exitIds[item[valueField]]) {
         exitIds[item[valueField]] = true
         return true
       } else {
         return false
       }
     })

     this.setState({
       allOptions: allOptions
     })
   }

   componentWillUnmount () {
     this.isMount = false
   }

   render () {
     let { nameField, valueField } = this.props
     return (
       <Select
         ref={select => { this.select = select }}
         allowClear
         showSearch
         showArrow
         filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
         style={{ width: '100%' }}
         {...this.props}
       >
         {
           this.state.allOptions.map(item => {
             return <Select.Option key={item[valueField]} value={item[valueField]}>{item[nameField]}</Select.Option>
           })
         }
       </Select>
     )
   }
}
