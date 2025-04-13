// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home.jsx';
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import Header from "./component/Header/Header.js";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Recharge from "./pages/Recharge/Recharge.jsx";
import TransactionHistory from "./pages/TransactionHistory/TransactionHistory.jsx";
import AccountTransfer from "./pages/AccountTransfer/AccountTransfer.jsx";

function App() {
  return (
    <Router>
      <main style={{ padding: "20px" }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<div className="signup-page"><Signup /></div>} />
          <Route path="/recharge" element={<Recharge/>}/>
          <Route path="/transactions" element={<TransactionHistory/>}/>
          <Route path="/transfer" element={<AccountTransfer/>}/>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
