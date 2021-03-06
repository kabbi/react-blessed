# react-custom-renderer

A [React](https://facebook.github.io/react/) renderer abstraction to simplify custom renderer implementation.

**WARNING:**
This renderer should currently be considered as experimental, is subject to change and will only work with the React's latest version (`0.14.x`).
API would not be stable until v1.0.0 release.

**EXAMPLE:**

```bash
npm install
npm run demo:pancake
```

```js
import React, { Component } from 'react';
import render, { NativeComponent } from 'react-custom-renderer';

class Pancake extends NativeComponent {
  constructor(props) {
    super(props);
    console.log(`+ will be cooking at ${props.fryingTemperature}°C`);
  }
}

class Butter extends NativeComponent {
  constructor(props) {
    super(props);
    console.log('+ adding butter');
  }
}

class Milk extends NativeComponent {
  constructor(props) {
    super(props);
    console.log('+ adding milk');
    if (props.bestBefore < Date.now()) {
      console.log('e your milk is expired, dont\'t try to eat the pancake');
    }
  }
}

class Jam extends NativeComponent {
  constructor(props) {
    super(props);
    console.log(`+ adding ${props.flavour} jam`);
  }
}

class Flour extends NativeComponent {
  constructor(props) {
    super(props);
    console.log('+ adding flour');
  }
}

class PancakeFryer extends NativeComponent {
  constructor(props) {
    super(props, {
      pancake: Pancake,
      butter: Butter,
      milk: Milk,
      jam: Jam,
      flour: Flour
    });
  }

  render() {
    console.log('x frying');
  }
}

const CoolPancake = () => (
  <pancake fryingTemperature={145}>
    <butter/>
    <milk bestBefore={Date.now() - 1000}/>
    <jam flavour="orange"/>
    <flour/>
  </pancake>
);

render(<CoolPancake/>, PancakeFryer);
```

## Roadmap

* Stabilize API.
* Provide a way to customize more react renderer implementation details:
  - custom empty element name (like `<div>` in HTML or `<g>` in SVG)
  - global renderer events hooks, like node create/destroy/update, etc
  - an ability to define lightweight components
  - proper children management
  - events support

## License

MIT
