import useRouteElements from "./useRouteElements";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useContext } from "react";
import { LocalStorageEventTarget } from "./utils/auth";
import { AppContext } from "./context/app.context";
import ErrorBoundary from "./components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  const routeElements = useRouteElements();
  const { reset } = useContext(AppContext);

  useEffect(() => {
    LocalStorageEventTarget.addEventListener("clearLS", reset);
    return () => {
      LocalStorageEventTarget.removeEventListener("clearLS", reset);
    };
  }, [reset]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Provider store={store}>{routeElements}</Provider>
        <ToastContainer />
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
