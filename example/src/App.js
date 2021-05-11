import React, { Component } from 'react';
//import ChartComponent from "./components/ChartComponent";
import ChartComponent from 'interactive_chart'
//import { ExampleComponent } from 'interactive_chart'
// import 'interactive_chart/dist/index.css'

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
        <ChartComponent/>
      </div>
    );
  }
}

export default App;
