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
    username : "",
    avatar : "",
    authorized : false
  }

  setGlobalUser = (data) => {
    this.setState({
      username : data.username,
      avatar : data.avatar,
      authorized : data.authorized
    })
  }
  
  render(){ 
    console.log(this.setState)
    return (
      <div>
      <BrowserRouter>
        <Header state={this.state}/>/>
        {
          this.state.authorized === false
          ?
          <Switch>
            <Route exact path="/" render={() => <Home setGlobalUser={(data) => this.setGlobalUser(data)} />}/>  
          </Switch>
          :
          <Switch>
            <Route exact path="/" render={() => <Home setGlobalUser={this.setUser} />}/>       
            <Route exact path="/profile" render={() => <Profile state={this.state}/>}/>
            <Route exact path="/market" render={() => <Market state={this.state}/>}/>
            <Route exact path="/catch" render={() => <Catch state={this.state}/>}/>
            <Route path='/twitter' component={() => { 
                  window.location.href = 'https://twitter.com/MutinyBard'; 
                  return <Route exact path="/" component={Home}/>
            }}/>
            <Route path='/paypal' component={() => { 
                  window.location.href = 'https://paypal.me/MuteBard'; 
                  return <Route exact path="/" component={Home}/>
            }}/>
          </Switch>
        }
        <Footer/>
        </BrowserRouter>
      </div>
    );
  }
}
