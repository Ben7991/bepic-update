import { RouterProvider } from "react-router";

import { router } from "./route";

export default function App(): React.JSX.Element {
  return <RouterProvider router={router} />;
}
