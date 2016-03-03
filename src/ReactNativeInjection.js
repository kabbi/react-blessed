/**
 * React Native Dependency Injection
 * ===================================
 *
 * Injecting the renderer's needed dependencies into React's internals.
 */
import ReactInjection from 'react/lib/ReactInjection';
import ReactComponentEnvironment from 'react/lib/ReactComponentEnvironment';
import ReactNativeReconcileTransaction from './ReactNativeReconcileTransaction';
import ReactNativeComponent from './ReactNativeComponent';

export default function inject() {

  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactNativeComponent
  );

  ReactInjection.Updates.injectReconcileTransaction(
    ReactNativeReconcileTransaction
  );

  // TODO: provide empty element name customization possibility
  ReactInjection.EmptyComponent.injectEmptyComponent('element');

  // NOTE: we're monkeypatching ReactComponentEnvironment because
  // ReactInjection.Component.injectEnvironment() currently throws,
  // as it's already injected by ReactDOM for backward compat in 0.14 betas.
  // Read more: https://github.com/Yomguithereal/react-blessed/issues/5
  ReactComponentEnvironment.processChildrenUpdates = function () {};
  ReactComponentEnvironment.replaceNodeWithMarkupByID = function () {};
}
