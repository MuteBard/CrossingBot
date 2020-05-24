import React, {Component} from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom"

import Header from './Components/Header'
import Footer from './Components/Footer'

import Home from './Pages/Home'
import Market from './Pages/Market'
import Catch from './Pages/Catch'
import Profile from './Pages/Profile'


export default class App extends Component{
  state = {

  }
  
  render(){
    return (
      <div>
      <BrowserRouter>
        <Header/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/profile" render={(props) => <Profile {...props} state={this.state}/>}/>
          <Route exact path="/market" render={(props) => <Market {...props} state={this.state}/>}/>
          <Route exact path="/catch" render={(props) => <Catch {...props} state={this.state}/>}/>
          <Route path='/twitter' component={() => { 
                window.location.href = 'https://twitter.com/MutinyBard'; 
                return <Route exact path="/" component={Home}/>
          }}/>
          <Route path='/paypal' component={() => { 
                window.location.href = 'https://paypal.me/MuteBard'; 
                return <Route exact path="/" component={Home}/>
          }}/>
        </Switch>
        <Footer/>
        </BrowserRouter>
      </div>
    );
  }
}
