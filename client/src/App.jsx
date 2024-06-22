import "./App.css";
import Dashboard from "./pages/Dashboard.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="">
      <Dashboard />
      <ToastContainer />
    </div>
  );
}

export default App;
