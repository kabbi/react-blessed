/**
 * React Native Component
 * ========================
 *
 * React component abstraction for the blessed library.
 */
import ReactMultiChild from 'react/lib/ReactMultiChild';
import ReactNativeIDOperations from './ReactNativeIDOperations';
import invariant from 'invariant';

import extend from 'lodash/object/extend';
import groupBy from 'lodash/collection/groupBy';
import startCase from 'lodash/string/startCase';

/**
 * Variable types that must be solved as content rather than real children.
 */
const CONTENT_TYPES = {string: true, number: true};

/**
 * Renders the given react element with blessed.
 *
 * @constructor ReactNativeComponent
 * @extends ReactMultiChild
 */
export default class ReactNativeComponent {
  constructor(tag) {
    this._tag = tag.toLowerCase();
    this._updating = false;
    this._renderedChildren = null;
    this._previousStyle = null;
    this._previousStyleCopy = null;
    this._rootNodeID = null;
    this._wrapperState = null;
    this._topLevelWrapper = null;
    this._nodeWithLegacyProperties = null;
  }

  construct(element) {

    // Setting some properties
    this._currentElement = element;
    this._eventListener = (type, ...args) => {
      if (this._updating) return;

      const handler = this._currentElement.props['on' + startCase(type).replace(/ /g, '')];

      if (typeof handler === 'function') {
        if (type === 'focus' || type === 'blur') {
          args[0] = ReactNativeIDOperations.get(this._rootNodeID)
        }
        handler(...args);
      }
    };
  }

  /**
   * Mounting the root component.
   *
   * @internal
   * @param  {string} rootID - The root blessed ID for this node.
   * @param  {ReactNativeReconcileTransaction} transaction
   * @param  {object} context
   */
  mountComponent(rootID, transaction, context) {
    this._rootNodeID = rootID;

    // Mounting blessed node
    const node = this.mountNode(
      ReactNativeIDOperations.getParent(rootID),
      this._currentElement
    );

    ReactNativeIDOperations.add(rootID, node);

    // Mounting children
    let childrenToUse = this._currentElement.props.children;
    childrenToUse = childrenToUse === null ? [] : [].concat(childrenToUse);

    if (childrenToUse.length) {

      // Discriminating content components from real children
      const {content=null, realChildren=[]} = groupBy(childrenToUse, (c) => {
        return CONTENT_TYPES[typeof c] ? 'content' : 'realChildren';
      });

      // Setting textual content
      if (content) {
        node.setContent('' + content.join(''));
      }

      // Mounting real children
      this.mountChildren(
        realChildren,
        transaction,
        context
      );
    }

    // Rendering the screen
    ReactNativeIDOperations.debouncedRender();
  }

  /**
   * Mounting the blessed node itself.
   *
   * @param   {NativeNode|NativeScreen} parent  - The parent node.
   * @param   {ReactElement}              element - The element to mount.
   * @return  {NativeNode}                       - The mounted node.
   */
  mountNode(parent, element) {
    const {props, type} = element,
          { root } = ReactNativeIDOperations;

    const node = root.createComponent(type, props);

    // TODO: handle events
    // node.on('event', this._eventListener);
    parent.addChild(node);

    return node;
  }

  /**
   * Receive a component update.
   *
   * @param {ReactElement}              nextElement
   * @param {ReactReconcileTransaction} transaction
   * @param {object}                    context
   * @internal
   * @overridable
   */
  receiveComponent(nextElement, transaction, context) {
    const {props: {children, ...rest}} = nextElement,
          { api } = ReactNativeIDOperations,
          node = ReactNativeIDOperations.get(this._rootNodeID);

    this._updating = true;
    node.update(nextElement.props);
    this._updating = false;

    // Updating children
    const childrenToUse = children === null ? [] : [].concat(children);

    // Discriminating content components from real children
    const {content=null, realChildren=[]} = groupBy(childrenToUse, (c) => {
      return CONTENT_TYPES[typeof c] ? 'content' : 'realChildren';
    });

    // Setting textual content
    if (content) {
      node.setContent('' + content.join(''));
    }

    this.updateChildren(realChildren, transaction, context);

    ReactNativeIDOperations.debouncedRender();
  }

  /**
   * Dropping the component.
   */
  unmountComponent() {
    this.unmountChildren();

    const node = ReactNativeIDOperations.get(this._rootNodeID);

    // TODO: handle events
    // node.off('event', this._eventListener);
    node.destroy();

    ReactNativeIDOperations.drop(this._rootNodeID);

    this._rootNodeID = null;

    ReactNativeIDOperations.debouncedRender();
  }

  /**
   * Getting a public instance of the component for refs.
   *
   * @return {NativeNode} - The instance's node.
   */
  getPublicInstance() {
    return ReactNativeIDOperations.get(this._rootNodeID);
  }
}

/**
 * Extending the component with the MultiChild mixin.
 */
extend(
  ReactNativeComponent.prototype,
  ReactMultiChild.Mixin
);
