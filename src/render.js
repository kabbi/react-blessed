/**
 * React Custom Renderer
 * =====================
 *
 * Exposing the renderer's API.
 */
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactElement from 'react/lib/ReactElement';
import ReactUpdates from 'react/lib/ReactUpdates';
import ReactNativeIDOperations from './ReactNativeIDOperations';
import invariant from 'invariant';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';
import inject from './ReactNativeInjection';

/**
 * Injecting dependencies.
 */
inject();

/**
 * Renders the given react element with blessed.
 *
 * @param  {ReactElement}    element   - Node to update.
 * @param  {NativeComponent} root      - The root native component to render with.
 * @return {ReactComponent}            - The rendered component instance.
 */
function render(element, root) {

  // Is the given element valid?
  invariant(
    ReactElement.isValidElement(element),
    'render(): You must pass a valid ReactElement.'
  );

  // Is the given root valid?
  // TODO: validate the root somehow

  // Creating a root id & creating the root
  const id = ReactInstanceHandles.createReactRootID();

  // Mounting the app
  const component = instantiateReactComponent(element);

  // Injecting the root
  ReactNativeIDOperations.setRootComponent(root);

  // The initial render is synchronous but any updates that happen during
  // rendering, in componentWillMount or componentDidMount, will be batched
  // according to the current batching strategy.
  ReactUpdates.batchedUpdates(() => {
    // Batched mount component
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(() => {
      component.mountComponent(id, transaction, {});
    });
    ReactUpdates.ReactReconcileTransaction.release(transaction);
  });

  // Returning the api so the user can attach listeners etc.
  return component._instance;
}

export {render};
