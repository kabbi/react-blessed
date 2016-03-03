/**
 * React Native ID Operations
 * ============================
 *
 * Cache register for native nodes stored by ID.
 */
import debounce from 'lodash/function/debounce';

/**
 * The native nodes internal index;
 */
const nativeNodes = {};

/**
 * Backend for native ID operations.
 *
 * @constructor ReactNativeIDOperations
 */
class ReactNativeIDOperations {
  constructor() {
    this.root = null;
  }

  /**
   * Set the current api.
   *
   * @param  {NativeComponent} component - The root component to render with.
   * @return {ReactNativeIDOperations}   - Returns itself.
   */
  setRootComponent(Component) {
    this.root = new Component();

    // Creating a debounced version of the render method so we won't render
    // multiple time per frame, in vain.
    this.debouncedRender = debounce(() => {
      this.root.render();
    }, 0);

    return this;
  }

  /**
   * Add a new node to the index.
   *
   * @param  {string}          ID      - The node's id.
   * @param  {NativeComponent} node    - The node itself.
   * @return {ReactNativeIDOperations} - Returns itself.
   */
  add(ID, node) {
    nativeNodes[ID] = node;
    return this;
  }

  /**
   * Get a node from the index.
   *
   * @param  {string} ID       - The node's id.
   * @return {NativeComponent} - The node.
   */
  get(ID) {
    return nativeNodes[ID];
  }

  /**
   * Get the parent of a node from the index.
   *
   * @param  {string} ID       - The node's id.
   * @return {NativeComponent} - The node.
   */
  getParent(ID) {
    if (ID.match(/\./g).length === 1) {
      return this.root;
    }

    const parentID = ID.split('.').slice(0, -1).join('.');
    return this.get(parentID);
  }

  /**
   * Drop a node from the index.
   *
   * @param  {string} ID               - The node's id.
   * @return {ReactNativeIDOperations} - Returns itself.
   */
  drop(ID) {
    delete nativeNodes[ID];
    return this;
  }
}

export default new ReactNativeIDOperations();
