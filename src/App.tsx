import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import router from "./router/index.tsx";
import { store } from "@/app/store";
import { useEffect } from "react";
import { GetprofileFunction } from "@/features/profile/redux/features/GetProfile/getProfileSlice";
import { useAppDispatch } from "@/app/hooks";

const AppShell = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(GetprofileFunction());
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <>
      <Provider store={store}>
        <AppShell />
      </Provider>
    </>
  );
}

export default App;
