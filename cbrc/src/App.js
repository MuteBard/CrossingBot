import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom"

import Header from './Components/Header'
import Footer from './Components/Footer'

import Home from './Pages/Home'


function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Header/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/profile" component={() => <div>Profile</div>}/>
        <Route exact path="/market" component={() => <div>Market</div>}/>
        <Route exact path="/catchbug" component={() => <div>Catch Bug</div>}/>
        <Route exact path="/catchfish" component={() => <div>Catch Fish</div>}/>
        <Route exact path="/summary" component={() => <div>Summary</div>}/>
      </Switch>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
