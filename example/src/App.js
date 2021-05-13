import React, { Component } from 'react';
import ChartComponent from 'interactive_chart'
import 'interactive_chart/dist/index.css'

class App extends Component {
  constructor(props) {
    super(props);
    const data = require('./sample.json')
    const filter = [
      {
        label: 'Processor',
        value: 'processor',
        options: [
          { label: 'IOS', value: 1 },
          { label: 'Paypal', value: 2 }
        ]
      },
      {
        label: 'Brand',
        value: 'brand',
        options: [
          { label: 'meshare', value: 1 },
          { label: 'zmodo', value: 2 },
          // { label: 'zmodo2', value: 3 }
        ]
      },
      {
        label: 'www',
        value: 'www',
        options: [
          { label: 'awday', value: 1 },
          { label: 'wwwwa', value: 2 },
        ]
      },
    ]
    this.state = {
      input: data,
      selectGraph: 'Line Graph',
      dateUnit: 'Weeks',
      filterData: filter
    };
  }


  render() {
    return (
      <div className="App">
        <ChartComponent data={this.state.input}
                        selectGraph={this.state.selectGraph}
                        dataUnit={this.state.dateUnit}
                        filter={this.state.filterData}/>
      </div>
    );
  }
}

export default App;
