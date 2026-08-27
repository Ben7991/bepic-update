import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import { store } from './store';
import { router } from './route';

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
