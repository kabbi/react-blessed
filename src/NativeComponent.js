/**
 * Native Component
 * ======================
 *
 * React component abstraction for the 'native component' api entity, to allow
 * the simple use of the external react-custom-renderer api.
 */
import invariant from 'invariant';

export default class NativeComponent {
  constructor(props = {}, components = {}) {
    this.components = components;
    this.children = [];
    this.props = props;
  }

  /**
   * Destroy the native component.
   * You can do all your clean-up work here, and this method will be called by
   * react-custom-renderer when the component instance is destroyed.
   *
   * @internal
   */
  destroy() {
    // Nothing to do here
  }

  addChild(component) {
    this.children.push(component);
  }

  removeChild(component) {
    const index = this.children.indexOf(component);
    if (index === -1) {
      return;
    }
    this.children.splice(index, 1);
  }

  update(newProps) {
    this.props = newProps;
  }

  render() {
    for (const child of this.children) {
      child.render();
    }
  }

  createComponent(type, props) {
    const Component = this.components[type];
    invariant(
      !!Component,
      `Invalid element "${type}".`
    );
    return new Component(props);
  }
}
