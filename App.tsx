import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import Main from "./app/Main";
import { store } from "./store/store";

export default function App() {
  return (
    <>
      <StatusBar style={"inverted"} />
      <Provider store={store}>
        <Main />
      </Provider>
    </>
  );
}
