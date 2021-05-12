import React, { Component } from 'react';
import ChartComponent from 'interactive_chart'
import 'interactive_chart/dist/index.css'

class App extends Component {
  constructor(props) {
    super(props);
    const data = require('./sample.json')
    this.state = {
      input: data,
      selectGraph: 'Line Graph',
      dateUnit: 'Weeks',
    };
  }

  render() {
    return (
      <div className="App">
        <ChartComponent data={this.state.input}
                        selectGraph={this.state.selectGraph}
                        dataUnit={this.state.dateUnit}/>
      </div>
    );
  }
}

export default App;
