import React, { Component } from 'react';
import NativeComponent from '../src/NativeComponent';
import { render } from '../src/render.js';

class Box extends NativeComponent {
  render() {
    console.log(`x rendering ${this.props.visible ? 'visible' : 'invisible'} box`);
  }
}

class BoxRenderer extends NativeComponent {
  constructor(props) {
    super(props, {
      box: Box
    });
  }
}

class BlinkingBox extends Component {
  componentWillMount() {
    this.setState({});
    setInterval(() => {
      this.setState({
        visible: !this.state.visible
      });
    }, 1000);
  }

  render() {
    return <box visible={this.state.visible}/>;
  }
}

render(<BlinkingBox/>, BoxRenderer);
