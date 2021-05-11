import React, { Component } from 'react'
import { graphic } from 'echarts'
import ReactEcharts from 'echarts-for-react'
import randomColor from 'randomcolor'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './Test5.css'

export default class ChartComponent extends Component {
  constructor(props) {
    super(props)
    const data = require('../sample.json')

    this.state = {
      data: data,
      graphType: 'line',
      withArea: false,
      dateUnit: 'Days',

      brand: [],
      plan: [],
      processor: [],

      filterSet: new Set(),
      currentMainFilter: '',
      showMainFilter: false,
      items: [],
      clear: false,

      clearBrand: false,
      clearPlan: false,
      clearProcessor: false
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.state.brand !== prevState.brand ||
      this.state.plan !== prevState.plan ||
      this.state.processor !== prevState.processor
    ) {
      this.setState({ items: this.getItems() })
    }

    if (this.state.clear !== prevState.clear) {
      this.setState({ filterSet: new Set() })
      this.setState({ brand: [] })
      this.setState({ plan: [] })
      this.setState({ processor: [] })
      const echartInstance = this.echartRef.getEchartsInstance()
      echartInstance.clear()
    }

    if (this.state.clearBrand !== prevState.clearBrand) {
      const newFilterSet = this.state.filterSet
      newFilterSet.delete('brands_all')
      newFilterSet.delete('brands_1')
      newFilterSet.delete('brands_2')
      this.setState({ brand: [] })
      this.setState({ filterSet: newFilterSet })
      const echartInstance = this.echartRef.getEchartsInstance()
      echartInstance.clear()
    }

    if (this.state.clearPlan !== prevState.clearPlan) {
      const newFilterSet = this.state.filterSet
      newFilterSet.delete('plan_all')
      newFilterSet.delete('plan_1')
      newFilterSet.delete('plan_2')
      this.setState({ plan: [] })
      const echartInstance = this.echartRef.getEchartsInstance()
      echartInstance.clear()
    }

    if (this.state.clearProcessor !== prevState.clearProcessor) {
      const newFilterSet = this.state.filterSet
      newFilterSet.delete('processor_all')
      newFilterSet.delete('processor_1')
      newFilterSet.delete('processor_2')
      this.setState({ processor: [] })
      const echartInstance = this.echartRef.getEchartsInstance()
      echartInstance.clear()
    }
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 3.5 * 2,
    margin: `0 3.5px 0 0`,
    borderRadius: 30,

    // change background colour if dragging
    background: isDragging ? 'grey' : 'lightgrey',
    fontSize: 14,

    // styles we need to apply on draggables
    ...draggableStyle
  })

  getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightgreen' : 'white',
    display: 'flex',
    alignSelf: 'flex-start',
    borderRadius: 30,
    padding: 3.5,
    textAlign: 'center',
    overflow: 'auto'
  })

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = this.reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    )

    this.setState({ items })
  }

  _FILTERS = [
    {
      label: 'Processor',
      value: 'processor',
      options: [
        { label: 'Ios', value: 1 },
        { label: 'Paypal', value: 2 }
      ]
    },
    {
      label: 'Brands',
      value: 'brands',
      options: [
        { label: 'meShare', value: 1 },
        { label: 'Zmodo', value: 2 }
      ]
    },
    {
      label: 'Plan',
      value: 'plan',
      options: [
        { label: '7-day', value: 1 },
        { label: '30-day', value: 2 }
      ]
    }
  ]

  toggleMainFilter = () => {
    this.setState({
      showMainFilter: !this.state.showMainFilter,
      currentMainFilter: ''
    })
  }

  isFilterChecked = (father, childen) => {
    if (
      this.state.filterSet.has(father + '_' + childen) ||
      this.state.filterSet.has(father + '_all')
    ) {
      return 'checked'
    } else {
      return ''
    }
  }

  clickFilter = (e) => {
    console.log(e.target.value)
    return this.clickSecondFilter(e.target.value)
  }

  clickSecondFilter = (dValue) => {
    const newFilterSet = this.state.filterSet
    if (dValue.includes('brands')) {
      if (newFilterSet.has('brands_all')) {
        if (dValue !== 'brands_all') {
          newFilterSet.delete('brands_all')
          newFilterSet.add('brands_1')
          newFilterSet.add('brands_2')
          newFilterSet.delete(dValue)
        } else {
          newFilterSet.delete(dValue)
        }
      } else {
        if (dValue !== 'brands_all') {
          if (newFilterSet.has(dValue)) {
            newFilterSet.delete(dValue)
          } else {
            newFilterSet.add(dValue)
          }
        } else {
          newFilterSet.delete('brands_1')
          newFilterSet.delete('brands_2')
          newFilterSet.add(dValue)
        }
      }
    } else if (dValue.includes('processor')) {
      if (newFilterSet.has('processor_all')) {
        if (dValue !== 'processor_all') {
          newFilterSet.delete('processor_all')
          newFilterSet.add('processor_1')
          newFilterSet.add('processor_2')
          newFilterSet.delete(dValue)
        } else {
          newFilterSet.delete(dValue)
        }
      } else {
        if (dValue !== 'processor_all') {
          if (newFilterSet.has(dValue)) {
            newFilterSet.delete(dValue)
          } else {
            newFilterSet.add(dValue)
          }
        } else {
          newFilterSet.delete('processor_1')
          newFilterSet.delete('processor_2')
          newFilterSet.add(dValue)
        }
      }
    } else if (dValue.includes('plan')) {
      if (newFilterSet.has('plan_all')) {
        if (dValue !== 'plan_all') {
          newFilterSet.delete('plan_all')
          newFilterSet.add('plan_1')
          newFilterSet.add('plan_2')
          newFilterSet.delete(dValue)
        } else {
          newFilterSet.delete(dValue)
        }
      } else {
        if (dValue !== 'plan_all') {
          if (newFilterSet.has(dValue)) {
            newFilterSet.delete(dValue)
          } else {
            newFilterSet.add(dValue)
          }
        } else {
          newFilterSet.delete('plan_1')
          newFilterSet.delete('plan_2')
          newFilterSet.add(dValue)
        }
      }
    } else {
      if (newFilterSet.has(dValue)) {
        newFilterSet.delete(dValue)
      } else {
        newFilterSet.add(dValue)
      }
    }

    this.setState({ filterSet: newFilterSet })
    console.log(this.state.filterSet)
  }

  clickSecMain = (e) => {
    console.log(e.target.value)
    this.clickMainFilter(e.target.value)
  }

  clickMainFilter = (dValue) => {
    this.setState({ currentMainFilter: dValue })
  }

  renderMainFilter = () => {
    const filterItems = []
    this._FILTERS.forEach((filter) => {
      filterItems.push(this.renderSecondFilter(filter))
    })
    return (
      <ul className='main'>
        <li style={{ position: 'absolute' }}>
          <button
            className='main-button'
            id='main filter'
            onClick={this.toggleMainFilter}
          >
            Add Filter
          </button>
          {this.state.showMainFilter && (
            <ul className='child' style={{ left: 0 }}>
              {filterItems}
            </ul>
          )}
        </li>
      </ul>
    )
  }

  renderSecondFilter = (filter) => {
    const filterItems = []
    filterItems.push(
      <l1 className='sec'>
        <div>
          <input
            className='input'
            type='checkbox'
            id={filter.value + '_all'}
            key='All'
            value={filter.value + '_all'}
            onClick={this.clickFilter}
            checked={this.isFilterChecked(filter.value, 'all')}
          />
          <label className='label' htmlFor={filter.value + '_all'}>
            All
          </label>
        </div>
      </l1>
    )

    filter.options.forEach((option) => {
      filterItems.push(
        <l1 className='sec'>
          <div>
            <input
              className='input'
              type='checkbox'
              id={filter.value + '_' + option.value}
              key={option.label}
              value={filter.value + '_' + option.value}
              onClick={this.clickFilter}
              checked={this.isFilterChecked(filter.value, option.value)}
            />
            <label
              className='label'
              htmlFor={filter.value + '_' + option.value}
            >
              {option.label}
            </label>
          </div>
        </l1>
      )
    })

    filterItems.push(
      <l1 className='sec'>
        <button className='apply' key='apply' onClick={this.applyFilter}>
          Apply
        </button>
      </l1>

      //  <Dropdown.Item key='apply' text='Apply'
      // onClick={this.applyFilter}></Dropdown.Item>
    )
    return (
      <li className='parent'>
        <button
          className='button'
          key={filter.label}
          value={filter.value}
          onClick={this.clickSecMain}
        >
          {filter.label}
          <span />
        </button>
        {this.state.currentMainFilter === filter.value && (
          <ul className='secChild'>{filterItems}</ul>
        )}
      </li>
    )
  }

  applyFilter = () => {
    //! !!TODO: apply filter
    // has error
    const newFilterSet = this.state.filterSet
    if (this.state.currentMainFilter === 'processor') {
      this.setState({ processor: [] })
      console.log(this.state.processor.length)
      console.log(newFilterSet)
      if (newFilterSet.has('processor_all')) {
        this.setState({ processor: ['IOS', 'Paypal'] })
      } else {
        if (newFilterSet.has('processor_1')) {
          this.setState((prevState) => ({
            processor: [...prevState.processor, 'IOS']
          }))
        }
        if (newFilterSet.has('processor_2')) {
          this.setState((prevState) => ({
            processor: [...prevState.processor, 'Paypal']
          }))
        }
      }

      console.log(this.state.processor.length)
    }
    if (this.state.currentMainFilter === 'brands') {
      this.setState({ brand: [] })
      if (newFilterSet.has('brands_all')) {
        this.setState({ brand: ['meshare', 'zmodo'] })
      } else {
        if (newFilterSet.has('brands_1')) {
          this.setState((prevState) => ({
            brand: [...prevState.brand, 'meshare']
          }))
        }
        if (newFilterSet.has('brands_2')) {
          this.setState((prevState) => ({
            brand: [...prevState.brand, 'zmodo']
          }))
        }
      }
    }

    if (this.state.currentMainFilter === 'plan') {
      this.setState({ plan: [] })
      if (newFilterSet.has('plan_all')) {
        this.setState({ plan: ['7-day', '30-day'] })
      } else {
        if (newFilterSet.has('plan_1')) {
          this.setState((prevState) => ({ plan: [...prevState.plan, '7-day'] }))
        }
        if (newFilterSet.has('plan_2')) {
          this.setState((prevState) => ({
            plan: [...prevState.plan, '30-day']
          }))
        }
      }
    }
    this.setState({ currentMainFilter: '' })
    const echartInstance = this.echartRef.getEchartsInstance()
    echartInstance.clear()
    return this.toggleMainFilter()
  }

  componentDidMount() {
    this.getType('Bar Graph')
  }

  getType = (str) => {
    if (str === 'Bar Graph') {
      this.setState({ graphType: 'bar' })
    } else if (str === 'Line Graph') {
      this.setState({ withArea: false })
      this.setState({ graphType: 'line' })
    } else if (str === 'Area Graph') {
      this.setState({ withArea: true })
      this.setState({ graphType: 'line' })
    }
  }

  getAllLegend = () => {
    const result = []
    for (const key1 in this.state.brand) {
      for (const key2 in this.state.plan) {
        for (const key3 in this.state.processor) {
          result.push(
            this.state.brand[key1] +
              '-' +
              this.state.plan[key2] +
              '-' +
              this.state.processor[key3]
          )
        }
      }
    }
    return result
  }

  getAllTData = (brand, plan, processor) => {
    const data = this.state.data
    const result = []
    if (brand !== '' && plan !== '' && processor !== '') {
      for (const time in data) {
        const dataT = this.state.data[time]
        for (const key in dataT) {
          if (brand === dataT[key].brand) {
            if (plan === dataT[key].plan) {
              if (processor === dataT[key].processor) {
                result.push(JSON.stringify(dataT[key].revenue))
              }
            }
          }
        }
      }
    }
    return result
  }

  getTimebyUnit = () => {
    const data = this.state.data
    const result = []
    let count = 0
    let currTime = ''
    if (this.state.dateUnit === 'Weeks') {
      for (const time in data) {
        if (count === 6) {
          currTime = currTime + time.slice(time.length - 4)
          result.push(currTime)
          count = 0
        } else {
          if (count === 0) {
            currTime = time
            currTime = currTime + '-'
          }
          count++
        }
      }
      if (count !== 0 && count < 6) {
        currTime = currTime + 'current'
        result.push(currTime)
      }
    } else if (this.state.dateUnit === 'Months') {
      for (const time in data) {
        if (count === 29) {
          currTime = currTime + time.slice(time.length - 4)
          result.push(currTime)
          count = 0
        } else {
          if (count === 0) {
            currTime = time
            currTime = currTime + '-'
          }
          count++
        }
      }
      if (count !== 0 && count < 29) {
        currTime = currTime + 'current'
        result.push(currTime)
      }
    } else {
      for (const time in data) {
        result.push(time)
      }
    }
    return result
  }

  getAreaColor = (str) => {
    if (this.state.withArea) {
      return new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: str.replace(/[^,]+(?=\))/, '0.8')
        },
        {
          offset: 1,
          color: str.replace(/[^,]+(?=\))/, '0.3')
        }
      ])
    } else {
      return 'rgba(0,0,0,0)'
    }
  }

  handleChange = (e) => {
    this.getType(e.target.value)
  }

  handleChange2 = (e) => {
    this.setState({ dateUnit: e.target.value })
  }

  getOption = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#7a7a7a'
        }
      },
      backgroundColor: '#fffefe',
      borderColor: '#010126',
      textStyle: {
        color: '#010126'
      }
    },

    legend: {
      data: this.getAllLegend(),
      x: 50,
      y: 340
    },

    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },

    grid: {
      left: '3%',
      right: '3%',
      top: '3%',
      bottom: '6%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: this.state.graphType === 'bar',
        data: this.getTimebyUnit(),
        axisLabel: {
          show: true,
          color: 'rgb(0,3,66)'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          show: true,
          color: 'rgb(0,3,66)',
          formatter: '{value}',
          fontSize: 8
        }
      }
    ],
    series: this.getList()
  })

  getList = () => {
    const result = []
    if (
      this.state.brand === [] ||
      this.state.plan === [] ||
      this.state.processor === []
    ) {
      return result
    } else {
      for (const key1 in this.state.brand) {
        for (const key2 in this.state.plan) {
          for (const key3 in this.state.processor) {
            const color = randomColor({ format: 'rgba', luminosity: 'dark' })
            if (this.state.graphType === 'bar') {
              result.push({
                name:
                  this.state.brand[key1] +
                  '-' +
                  this.state.plan[key2] +
                  '-' +
                  this.state.processor[key3],
                type: this.state.graphType,
                stack: '1',
                label: {
                  show: true
                },
                barMaxWidth: '40%',
                data: this.getDataWithDate(
                  this.state.brand[key1],
                  this.state.plan[key2],
                  this.state.processor[key3]
                ),
                itemStyle: { color: color.replace(/[^,]+(?=\))/, '1') }
              })
            } else {
              if (this.state.withArea) {
                result.push({
                  name:
                    this.state.brand[key1] +
                    '-' +
                    this.state.plan[key2] +
                    '-' +
                    this.state.processor[key3],
                  type: this.state.graphType,
                  stack: '1',
                  areaStyle: {
                    color: this.getAreaColor(color)
                  },
                  data: this.getDataWithDate(
                    this.state.brand[key1],
                    this.state.plan[key2],
                    this.state.processor[key3]
                  ),
                  itemStyle: { color: color.replace(/[^,]+(?=\))/, '1') }
                })
              } else {
                result.push({
                  name:
                    this.state.brand[key1] +
                    '-' +
                    this.state.plan[key2] +
                    '-' +
                    this.state.processor[key3],
                  type: this.state.graphType,
                  stack: '1',
                  areaStyle: {
                    color: this.getAreaColor(color)
                  },
                  data: this.getDataWithDate(
                    this.state.brand[key1],
                    this.state.plan[key2],
                    this.state.processor[key3]
                  ),
                  itemStyle: { color: color.replace(/[^,]+(?=\))/, '1') }
                })
              }
            }
          }
        }
      }
      return result
    }
  }

  getDataWithDate = (brand, plan, processor) => {
    const data = this.state.data
    const result = []
    let count = 0
    let revenue = 0
    if (this.state.dateUnit === 'Weeks') {
      if (brand !== '' && plan !== '' && processor !== '') {
        for (const time in data) {
          const dataT = this.state.data[time]
          for (const key in dataT) {
            if (brand === dataT[key].brand) {
              if (plan === dataT[key].plan) {
                if (processor === dataT[key].processor) {
                  count++
                  if (count === 6) {
                    revenue += dataT[key].revenue
                    revenue = Math.floor(revenue / 7)
                    result.push(JSON.stringify(revenue))
                    revenue = 0
                    count = 0
                  } else {
                    revenue += dataT[key].revenue
                  }
                }
              }
            }
          }
        }
        if (count !== 0 && count < 6) {
          revenue = Math.floor(revenue / (count + 1))
          result.push(JSON.stringify(revenue))
        }
      }
      return result
    } else if (this.state.dateUnit === 'Months') {
      if (brand !== '' && plan !== '' && processor !== '') {
        for (const time in data) {
          const dataT = this.state.data[time]
          for (const key in dataT) {
            if (brand === dataT[key].brand) {
              if (plan === dataT[key].plan) {
                if (processor === dataT[key].processor) {
                  count++
                  if (count === 29) {
                    revenue += dataT[key].revenue
                    revenue = Math.floor(revenue / 30)
                    result.push(JSON.stringify(revenue))
                    revenue = 0
                    count = 0
                  } else {
                    revenue += dataT[key].revenue
                  }
                }
              }
            }
          }
        }
        if (count !== 0 && count < 29) {
          revenue = Math.floor(revenue / (count + 1))
          result.push(JSON.stringify(revenue))
        }
      }
      return result
    } else {
      return this.getAllTData(brand, plan, processor)
    }
  }

  getItems = () => {
    let count = 0
    const result = []
    let brand = ''
    let plan = ''
    let processor = ''
    if (this.state.brand.length !== 0) {
      brand += 'Brand:   '
      for (const key1 in this.state.brand) {
        brand += this.state.brand[key1]
        brand += ' '
      }
      count++
      result.push({ id: count.toString(), content: brand })
    }

    if (this.state.plan.length !== 0) {
      plan += 'Plan: '
      for (const key1 in this.state.plan) {
        plan += this.state.plan[key1]
        plan += ' '
      }
      count++
      result.push({ id: count.toString(), content: plan })
    }

    if (this.state.processor.length !== 0) {
      processor += 'Processor:   '
      for (const key1 in this.state.processor) {
        processor += this.state.processor[key1]
        processor += ' '
      }
      count++
      result.push({ id: count.toString(), content: processor })
    }
    return result
  }

  clickClear = () => {
    this.setState({ clear: !this.state.clear })
  }

  clickClearOne = (e) => {
    console.log(e.target.value)
    const v = e.target.value
    if (v.includes('Processor')) {
      this.setState({ clearProcessor: !this.state.clearProcessor })
    } else if (v.includes('Plan')) {
      this.setState({ clearPlan: !this.state.clearPlan })
    } else if (v.includes('Brand')) {
      this.setState({ clearBrand: !this.state.clearBrand })
    }
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'left' }}>Revenue</h1>

        <div className='row'>
          <div>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId='droppable' direction='horizontal'>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={this.getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                  >
                    {this.state.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={this.getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.content}
                            <button
                              style={{
                                borderRadius: 100,
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                              type='button'
                              value={item.content}
                              onClick={this.clickClearOne}
                            >
                              x
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className='col-2'>{this.renderMainFilter()}</div>
          <div className='col-1'>
            {this.state.filterSet.size !== 0 &&
              this.state.currentMainFilter === '' && (
                <button className='clear-all' onClick={this.clickClear}>
                  Clear all
                </button>
              )}
          </div>
          <div className='col-1'>
            <select className='select-option' onChange={this.handleChange}>
              <option selected disabled>
                Select Graph style
              </option>
              <option value='Bar Graph'>Bar Graph</option>
              <option value='Line Graph'>Line Graph</option>
              <option value='Area Graph'>Area Graph</option>
            </select>
          </div>
          <div className='col-2'>
            <select className='select-option' onChange={this.handleChange2}>
              <option selected disabled>
                Select Date Unit
              </option>
              <option value='Days'>Days</option>
              <option value='Weeks'>Weeks</option>
              <option value='Months'>Months</option>
            </select>
          </div>
        </div>

        <br />
        <ReactEcharts
          id='chart'
          ref={(e) => {
            this.echartRef = e
          }}
          option={this.getOption()}
          style={{ height: 360, width: window.innerWidth * 0.8 }}
        />
      </div>
    )
  }
}
