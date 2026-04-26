import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import router from "./router/index.tsx";
import { store } from "@/app/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </>
  );
}

export default App;
