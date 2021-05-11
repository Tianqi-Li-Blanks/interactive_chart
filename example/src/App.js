//import { ExampleComponent } from 'interactive_chart'
// import 'interactive_chart/dist/index.css'
import React, { Component } from 'react';
//import ChartComponent from "./components/ChartComponent";
import { InteractiveChart }from 'interactive_chart'

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   const data = require('.../sample.json')
  //   this.state = {
  //     input: data,
  //   };
  // }

  render() {
    return (
      <div className="App">
        <InteractiveChart/>
      </div>
    );
  }
}

export default App;
