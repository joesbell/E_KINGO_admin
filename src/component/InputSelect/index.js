import React, { Component } from 'react'
import { Select } from 'antd'
import { callApi } from '../../util/api'

const { Option } = Select

let timeout
let currentValue

function fetchPass (value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function name (params) {
    if (currentValue === value) {
      // const result = params
      const data = []
      // if (result){
      //   result.forEach(r => {
      //     data.push({
      //       value: r.name,
      //       text: r.name
      //     })
      //   })
      // }else{
      data.push(
        {
          value: value,
          text: value
        }
      )
      // }

      callback(data)
    }
  }
  async function fake () {
    let { data: { data } } = await callApi('/mallCommon/queryCategory', { name: value }, { method: 'POST' })
    await name(data)
  }

  timeout = setTimeout(fake, 300)
}
export default class InputSelect extends Component {
  state = {
    data: [],
    value: undefined
  };

  componentDidMount=() => {
    // if (this.props.value) {
    // this.setState({ value: 'dsfds' })
    // }
  }
  handleSearch = value => {
    if (value) {
      this.setState({ value })
      this.props.setValue(value)
      fetchPass(value, data => this.setState({ data }))
    } else {
      this.setState({ data: [] })
    }
  };

  handleChange = value => {
    this.setState({ value })
    this.props.setValue(value)
  };
  render () {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)
    return (
      <Select
        showSearch
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
        allowClear
      >
        {options}
      </Select>
    )
  }
}
