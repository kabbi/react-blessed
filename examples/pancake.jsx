import React, { Component } from 'react';
import NativeComponent from '../src/NativeComponent';
import { render } from '../src/render.js';

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
