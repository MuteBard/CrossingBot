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
    avatar : "https://cdn.discordapp.com/attachments/688616211617284144/708405645845725194/298.png",
    authorized : false
  }

  setUser(data){
    console.log("FOund Me")
    // this.setState({
    //   username : data.username,
    //   avatar : data.avatar,
    //   authorized : data.authorized
    // })
  }
  
  render(){ 
    return (
      <div>
      <BrowserRouter>
        <Header state={this.state}/>/>
        {
          this.state.authorized === true
          ?
          <Switch>
            <Route exact path="/" render={(props) => <Home setGlobalUser={this.setUser} {...props}/>}/>       
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
          :
          <Switch>
            <Route exact path="/" component={Home}/>
          </Switch>
        }
        <Footer/>
        </BrowserRouter>
      </div>
    );
  }
}
