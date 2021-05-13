import React, { Component } from 'react'
import { graphic } from 'echarts'
import ReactEcharts from 'echarts-for-react'
import randomColor from 'randomcolor'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import styles from './styles.module.css'
import PropTypes from 'prop-types'

export default class ChartComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      selectGraph: this.props.selectGraph,
      graphType: 'bar',
      withArea: false,
      dateUnit: this.props.dateUnit,
      Filter: this.props.filter,

      filterName: [],

      filterSet: new Set(),
      currentMainFilter: '',
      showMainFilter: false,
      items: [],
      clear: false,

      apply: false
    }
    let count = 0
    while (count < this.props.filter.length) {
      this.state[this.props.filter[count].value] = []
      this.state['clear' + this.props.filter[count].label] = false
      count++
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  static propTypes = {
    data: PropTypes.array,
    filter: PropTypes.array,
    selectGraph: PropTypes.string,
    dateUnit: PropTypes.string
  }

  static defaultProps = {
    data: null,
    filter: null,
    selectGraph: 'Bar Graph',
    dateUnit: 'Days'
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (
    //     this.state.brands !== prevState.brands ||
    //     this.state.plan !== prevState.plan ||
    //     this.state.processor !== prevState.processor
    // ) {
    //     this.setState({ items: this.getItems() })
    // }

    this.state.Filter.forEach((filter) => {
      if (this.state[filter.value] !== prevState[filter.value]) {
        this.setState({ items: this.getItems() })
      }
    })

    if (this.state.clear !== prevState.clear) {
      this.setState({ filterSet: new Set() })
      this.state.Filter.forEach((filter) => {
        const key = filter.value
        this.setState({ [key]: [] })
      })
      const echartInstance = this.echartRef.getEchartsInstance()
      echartInstance.clear()
    }

    this.state.Filter.forEach((filter) => {
      if (
        this.state['clear' + filter.label] !== prevState['clear' + filter.label]
      ) {
        const newFilterSet = this.state.filterSet
        const key = filter.value
        newFilterSet.delete(filter.value + '_all')
        for (let i = 1; i <= filter.options.length; i++) {
          if (newFilterSet.has(filter.value + '_' + i.toString())) {
            newFilterSet.delete(filter.value + '_' + i.toString())
          }
        }
        this.setState({ [key]: [] })
        this.setState({ filterSet: newFilterSet })
        const echartInstance = this.echartRef.getEchartsInstance()
        echartInstance.clear()
      }
    })
  }

  componentDidMount() {
    this.getType(this.state.selectGraph)
    let count = 0
    while (count < this.state.Filter.length) {
      const temp = this.state.Filter[count]
      this.setState((prevState) => ({
        filterName: [...prevState.filterName, temp.value]
      }))
      count++
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
    return this.clickSecondFilter(e.target.value)
  }

  clickSecondFilter = (dValue) => {
    const newFilterSet = this.state.filterSet

    this.state.Filter.forEach((filter) => {
      const key = filter.value
      if (dValue.includes(key)) {
        if (newFilterSet.has(key + '_all')) {
          if (dValue !== key + '_all') {
            newFilterSet.delete(key + '_all')
            for (let i = 1; i <= filter.options.length; i++) {
              newFilterSet.add(key + '_' + i.toString())
            }
            newFilterSet.delete(dValue)
          } else {
            newFilterSet.delete(dValue)
          }
        } else {
          if (dValue !== key + '_all') {
            if (newFilterSet.has(dValue)) {
              newFilterSet.delete(dValue)
            } else {
              newFilterSet.add(dValue)
            }
          } else {
            for (let i = 1; i <= filter.options.length; i++) {
              newFilterSet.delete(key + '_' + i.toString())
            }
            newFilterSet.add(dValue)
          }
        }
      }
    })

    this.setState({ filterSet: newFilterSet })
  }

  clickSecMain = (e) => {
    this.clickMainFilter(e.target.value)
  }

  clickMainFilter = (dValue) => {
    this.setState({ currentMainFilter: dValue })
  }

  renderMainFilter = () => {
    const filterItems = []
    this.state.Filter.forEach((filter) => {
      filterItems.push(this.renderSecondFilter(filter))
    })
    return (
      <ul className='main'>
        <li style={{ position: 'absolute' }}>
          <button
            className={styles.mainButton}
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
      <l1 className={styles.sec}>
        <div>
          <input
            className={styles.input}
            type='checkbox'
            id={filter.value + '_all'}
            key='All'
            value={filter.value + '_all'}
            onClick={this.clickFilter}
            checked={this.isFilterChecked(filter.value, 'all')}
          />
          <label className={styles.label} htmlFor={filter.value + '_all'}>
            All
          </label>
        </div>
      </l1>
    )

    filter.options.forEach((option) => {
      filterItems.push(
        <l1 className={styles.sec}>
          <div>
            <input
              className={styles.input}
              type='checkbox'
              id={filter.value + '_' + option.value}
              key={option.label}
              value={filter.value + '_' + option.value}
              onClick={this.clickFilter}
              checked={this.isFilterChecked(filter.value, option.value)}
            />
            <label
              className={styles.label}
              htmlFor={filter.value + '_' + option.value}
            >
              {option.label}
            </label>
          </div>
        </l1>
      )
    })

    filterItems.push(
      <l1 className={styles.sec}>
        <button className={styles.apply} key='apply' onClick={this.applyFilter}>
          Apply
        </button>
      </l1>
    )
    return (
      <li className='parent'>
        <button
          className={styles.button}
          key={filter.label}
          value={filter.value}
          onClick={this.clickSecMain}
        >
          {filter.label}
          <span />
        </button>
        {this.state.currentMainFilter === filter.value && (
          <ul className={styles.secChild}>{filterItems}</ul>
        )}
      </li>
    )
  }

  applyFilter = () => {
    const newFilterSet = this.state.filterSet
    this.state.Filter.forEach((filter) => {
      const key = filter.value
      this.setState({ [key]: [] })

      const subtitle = []
      if (newFilterSet.has(filter.value + '_all')) {
        filter.options.forEach((option) => {
          subtitle.push(option.label)
        })

        this.setState({ [key]: subtitle })
      } else {
        const subtitle = []
        for (let i = 1; i <= filter.options.length; i++) {
          if (newFilterSet.has(filter.value + '_' + i.toString())) {
            subtitle.push(filter.options[i - 1].label)
          }
          this.setState({ [key]: subtitle })
        }
      }
    })
    this.setState({ currentMainFilter: '' })
    const echartInstance = this.echartRef.getEchartsInstance()
    echartInstance.clear()
    return this.toggleMainFilter()
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

  helper2 = (newFilterList, count, length, result) => {
    const filter = newFilterList[count]
    const fs = this.state[filter]
    const output = []
    for (const legend in result) {
      for (const key in fs) {
        const string = result[legend] + '_' + fs[key]
        output.push(string)
      }
    }
    count++
    if (count < length) {
      return this.helper2(newFilterList, count, length, output)
    } else {
      return output
    }
  }

  getNameList = (newFilterList, count, length, result) => {
    const filter = newFilterList[count]
    const fs = this.state[filter]
    for (const key in fs) {
      result.push(fs[key])
    }
    count++

    if (count < length) {
      return this.helper2(newFilterList, count, length, result)
    } else {
      return result
    }
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
    this.setState({ selectGraph: e.target.value })
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
      data: this.getNameList(
        this.state.filterName,
        0,
        this.state.filterName.length,
        []
      ),
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
      right: '12%',
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

  helperCheck = (dataList, dataTK) => {
    let check = true
    for (const da in dataList) {
      let littleCheck = false
      for (const fName in this.state.filterName) {
        if (dataList[da] === dataTK[this.state.filterName[fName]]) {
          littleCheck = true
        }
      }
      check = check && littleCheck
    }
    return check
  }

  getDataByDays = (dataString) => {
    const data = this.state.data
    const dataList = dataString.split('_')
    const result = []

    if (dataList.length === this.state.filterName.length) {
      for (const time in data) {
        const dataT = this.state.data[time]
        for (const key in dataT) {
          const dataTK = dataT[key]
          if (this.helperCheck(dataList, dataTK)) {
            result.push(JSON.stringify(dataT[key].revenue))
          }
        }
      }
    }
    return result
  }

  getList = () => {
    const result = []
    const answer = []
    let check = false
    this.state.Filter.forEach((filter) => {
      if (this.state[filter.value].length === 0) {
        check = true
      }
    })

    if (check) {
      return result
    } else {
      const list = this.getNameList(
        this.state.filterName,
        0,
        this.state.filterName.length,
        []
      )
      for (const name in list) {
        const color = randomColor({ format: 'rgba', luminosity: 'dark' })
        if (this.state.graphType === 'bar') {
          answer.push({
            name: list[name],
            type: this.state.graphType,
            stack: '1',
            label: {
              show: true
            },
            barMaxWidth: '40%',
            data: this.getDataWithDaU(list[name]),
            itemStyle: { color: color.replace(/[^,]+(?=\))/, '1') }
          })
        } else {
          if (this.state.withArea) {
            answer.push({
              name: list[name],
              type: this.state.graphType,
              stack: '1',
              areaStyle: {
                color: this.getAreaColor(color)
              },
              data: this.getDataWithDaU(list[name]),
              itemStyle: {
                color: color.replace(/[^,]+(?=\))/, '1')
              }
            })
          } else {
            answer.push({
              name: list[name],
              type: this.state.graphType,
              stack: '1',
              areaStyle: {
                color: this.getAreaColor(color)
              },
              data: this.getDataWithDaU(list[name]),
              itemStyle: {
                color: color.replace(/[^,]+(?=\))/, '1')
              }
            })
          }
        }
      }
    }
    return answer
  }

  getDataWithDaU = (dataString) => {
    const result = []
    let count = 0
    let revenue = 0
    const data = this.state.data
    const dataList = dataString.split('_')
    if (this.state.dateUnit === 'Weeks') {
      if (dataList.length === this.state.filterName.length) {
        for (const time in data) {
          const dataT = this.state.data[time]
          for (const key in dataT) {
            const dataTK = dataT[key]
            if (this.helperCheck(dataList, dataTK)) {
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
        if (count !== 0 && count < 6) {
          revenue = Math.floor(revenue / (count + 1))
          result.push(JSON.stringify(revenue))
        }
      }
      return result
    } else if (this.state.dateUnit === 'Months') {
      if (dataList.length === this.state.filterName.length) {
        for (const time in data) {
          const dataT = this.state.data[time]
          for (const key in dataT) {
            const dataTK = dataT[key]
            if (this.helperCheck(dataList, dataTK)) {
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
        if (count !== 0 && count < 29) {
          revenue = Math.floor(revenue / (count + 1))
          result.push(JSON.stringify(revenue))
        }
      }
      return result
    } else {
      return this.getDataByDays(dataString)
    }
  }

  getItems = () => {
    let count = 0
    const result = []
    this.state.Filter.forEach((filter) => {
      const name = filter.value
      if (this.state[name].length !== 0) {
        let temp = ''
        temp += filter.label + ':   '
        for (const key1 in this.state[name]) {
          temp += this.state[name][key1]
          temp += ' '
        }
        count++
        result.push({ id: count.toString(), content: temp })
      }
    })

    return result
  }

  clickClear = () => {
    this.setState({ clear: !this.state.clear })
  }

  clickClearOne = (e) => {
    const v = e.target.value

    this.state.Filter.forEach((filter) => {
      if (v.includes(filter.label)) {
        const key = 'clear' + filter.label
        this.setState({ [key]: !this.state[key] })
      }
    })
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'left' }}>Revenue</h1>

        <div className={styles.row}>
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
          <div className={styles.col2}>{this.renderMainFilter()}</div>
          <div className={styles.col1}>
            {this.state.filterSet.size !== 0 &&
              this.state.currentMainFilter === '' && (
                <button className={styles.clearAll} onClick={this.clickClear}>
                  Clear all
                </button>
              )}
          </div>
          <div className={styles.col2}>
            <select
              value={this.state.selectGraph}
              className={styles.selectOption}
              onChange={this.handleChange}
            >
              <option selected disabled>
                Select Graph style
              </option>
              <option value='Bar Graph'>Bar Graph</option>
              <option value='Line Graph'>Line Graph</option>
              <option value='Area Graph'>Area Graph</option>
            </select>
          </div>
          <div className={styles.col2}>
            <select
              value={this.state.dateUnit}
              className={styles.selectOption}
              onChange={this.handleChange2}
            >
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
          style={{ height: 360, width: window.innerWidth * 0.9 }}
        />
      </div>
    )
  }
}
