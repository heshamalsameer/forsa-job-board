import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { Context } from "./Context/Context";
import { Home } from "./Pages/Home";
import { Signin } from "./Pages/Signin";
import { Signup } from "./Pages/Signup";
import { Dashboard } from "./Pages/Dashboard";
import { Applications } from "./Pages/Applications";
import { Pagenotfound } from "./Pages/Pagenotfound";
import { Addnewjob } from "./Components/Addnewjob";
import { PrivateRoutes } from "./Pages/Utils";

const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Context>
        <ScrollTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoutes role="company" />}>
            <Route path="/addnewjob" element={<Addnewjob />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<PrivateRoutes role="employee" />}>
            <Route path="/applications" element={<Applications />} />
          </Route>
          <Route path="/*" element={<Pagenotfound />} />
        </Routes>
      </Context>
    </Router>
  );
}

export default App;
