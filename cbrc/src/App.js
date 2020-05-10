import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom"

import Header from './Components/Header'
import Footer from './Components/Footer'

import Home from './Pages/Home'
import Market from './Pages/Market'
import Catch from './Pages/Catch'




function App() {
  return (
    <div>
    <BrowserRouter>
      <Header/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/profile" component={() => <div>Profile</div>}/>
        <Route exact path="/market" component={Market}/>
        <Route exact path="/catch" component={Catch}/>
      </Switch>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
