import React, { Component } from 'react';
import { Row, Col, Card, Button, Input, Radio } from 'antd'; 
import generator from 'generate-password';
import "antd/dist/antd.css";
import "./css/pages.css"
import Route from '../Actions/Route'
import HeroTop from '../Assets/resolved/HeroTop'
import HeroBottom from '../Assets/resolved/HeroBottom'
import LightCog from '../Assets/resolved/backgroundcogLight'
import TwitchLogo from '../Assets/resolved/twitchLogo'
import Logo from '../Assets/resolved/logo'
import MagnifyingGlass from '../Assets/resolved/magnifyingGlass'
import Key from '../Assets/resolved/key'
import {settings} from '../Configurations/Options'
import axios from 'axios'

const { Search } = Input
const { Meta } = Card;

export default class Home extends Component {
  state = {
    usernameInput : "",
    validTwitchAccount : false,
    searchPressed : false,
    validCBUserCreation : false,
    authenticateCBPassword : false,
    authenticatePressed : false,
    validCBChannelAddition: false,
    authorized : false,
    passwordInput : "",
    scenario : 0,
    avatar : "",
    radio : "REGISTER"
  }

  passwordInput(e){
    console.log(e)
    this.setState({
      passwordInput : e
    })
  }


  usernameInputSearch(e){
    console.log(e)
    this.setState({
      usernameInput : e
    })
  }

  submitUser(){
    let setUserState = (data) => {
      console.log(data)
      this.setState({authorized : data.signIn})
    }
    let encryptedPw = this.state.usernameInput
    let CBAS_Payload = {"username" : this.state.usernameInput, "encryptedPw" : encryptedPw}
    Route.signIn(CBAS_Payload, setUserState)
  }

  confirmUser(){
    let userAuthenticated = (data) => {
      console.log(data)
      if(data.responded == true){
          if(data.scenario == 1){
            this.setState({
              validTwitchAccount : true,
              searchPressed : true,
              avatar : data.avatar,
              scenario : data.scenario,
              radio : "SIGN IN"
            })

          }else{
            console.log("Scenario 2")
            Route.signUp(this.generatePayload(data)) 
          }
        
      }else{
        this.setState({
          validTwitchAccount : false,
          searchPressed : true,
        })
      }
    }
    console.log("searchForUser")
    let CBTC_payload = {username: this.state.usernameInput}
    Route.authenticateUser(CBTC_payload, userAuthenticated)
  }
  
  generatePayload(data){
    let pw = generator.generate({
        length : 12,
        numbers : true,
        lowercase : true,
        uppercase : true,
        symbols : true,
        excludeSimilarCharacters : true,
    });

    let encryptedPw = pw 
    this.setState({
      validTwitchAccount : true,
      searchPressed : true,
      passwordInput : pw,
      avatar : data.avatar,
      scenario : data.scenario,
      authorized : true
    })
    return {"username" : this.state.usernameInput,  "encryptedPw" : encryptedPw}
  }


  addUserToDB(){
    console.log(this.state)
    this.setState({
      validCBUserCreation: true,
    })
  }

  onChange = e => {
    this.setState({
      radio: e.target.value,
    });
  };

  searchStep(message){
    let stepTitle = (message) => {
      return(
        this.state.validTwitchAccount == true 
        ?
        <div>Found your account</div>
        :
        <div>{message}</div>
      )
    }

    let searchBox = () => {
      return(
        this.state.scenario > 0
        ?
        <div className="searchMessageContainer">
          <div className="searchMessage"><strong>Mutebard</strong><TwitchLogo/></div>
          <img alt="example" className="profilePicture" src="https://cdn.discordapp.com/attachments/688616211617284144/708405645845725194/298.png"/>
        </div>
        :
        <div className="searchInputContainer">
            <input type="text" className="searchInput" value={this.state.usernameInput} onChange={event => this.usernameInputSearch(event.target.value)}/>
            <button className="button" onClick={() => this.confirmUser()}><MagnifyingGlass/></button>
        </div>
      )
    }

    let errorDisplay = () => {
      return(   
        this.state.validTwitchAccount == false && this.state.searchPressed == true
        ?
        <div className={"error"}>This is not a valid Twitch user account</div> 
        :
        null
      )
    }

    return(
      <li>
        {stepTitle(message)}
        <div className="searchUser">
        {searchBox()}
        {errorDisplay()}
        </div>
      </li>
    )
  }


  providedPwBox(){
    let stepTitle = () =>{
        return <div>Success! This is your CrossingBot password, Store it someplace safe!</div>  
    }

    let providedBox = () => {
      return(
        <div className="creationMessageContainer">
          <div className="creationMessage"><strong>{this.state.passwordInput}</strong><Logo tiny={true}/></div>
        </div>
      )
    }

    if (this.state.searchPressed){
      if(this.state.scenario == 2 || this.state.scenario == 3){
        return(
          <li>
            {stepTitle()}
            {providedBox()}
          </li>
        )
      }
      else return null
    }
  }

  inputPwBox(){
    let stepTitle = () =>{
      return(
        this.state.authorized == true
        ?
        <div>Successfully Logged In!</div>
        :
        <div>Enter the provided <strong>Crossingbot</strong> Password (NOT your Twitch Password)</div>
      )
    }

    let inputBox = () => {
      return(
        this.state.authorized == true
        ?
        null
        :
        <div className="PasswordInputContainer">
          <input type="text" className="PasswordInput" value={this.state.passwordInput} onChange={event => this.passwordInput(event.target.value)}/>
          <button className="button" onClick={() => this.submitUser()}><Key/></button>
        </div>
      )
    }


    let errorDisplay = () => {
      return(   
        this.state.authenticateCBPassword == false && this.state.authenticatePressed == true
        ?
        <div className={"error"}>This password is not valid</div> 
        :
        null
      )
    }

    if (this.state.searchPressed){
      if(this.state.scenario == 1){
        return(
          <li className="li">
            {stepTitle()}
            {inputBox()}
            {errorDisplay()}
          </li>
        )
      }
      else return null
    }
  }


  render() {
    return ( 
      <div className="HomeContainer"> 
        <HeroTop/>
        <Row align="middle">
          <Col span={24}>
            <div className="welcome"><strong>WELCOME TO CROSSINGBOT</strong></div>
          </Col>
        </Row>
        <HeroBottom/>
        <Row className="row" align="middle">
          <Col span={22} offset={2}>
            <Card style={{ width: 1200, backgroundColor : "#EEEEEE" }}>
              
              <Radio.Group onChange={this.onChange} value={this.state.radio} defaultValue="REGISTER">
                <Radio.Button value={"REGISTER"}>REGISTER</Radio.Button>
                <Radio.Button value={"SIGN IN"}>SIGN IN</Radio.Button>
              </Radio.Group>
              {
                this.state.radio === "REGISTER"
                ?
                <div className="howToUse"><strong>Join The Village!</strong></div>
                :
                <div className="howToUse"><strong>Welcome Back!</strong></div>
              }
              
              {
                this.state.radio == "REGISTER" 
                ?
                <ol className="listText">
                  <li>First make sure you have a Twitch account at https://www.twitch.tv/</li>
                  {this.searchStep("Please enter for your Twitch username here (Case Sensitive)")}
                  <li>In another tab, open your Twitch chat within your channel and type !invite</li>
                  {this.providedPwBox()}
                  {
                    this.state.scenario > 1
                    ?
                    <li>Awesome! {this.state.usernameInput}, you are all set to use CrossingBot either on Twitch or on this website!  </li>
                    :
                    null
                  }
                </ol>
                
                :
                <ol className="listText">
                  {this.searchStep("Welcome Back! Please enter your username")}
                  {this.inputPwBox()}
                </ol>
              }
            </Card>
          </Col>
        </Row>
        <Row className="row" align="middle">
          <Col span={22} offset={2}>
            <Card style={{ width: 1200, backgroundColor : "#EEEEEE" }}>
              <div className="howToUse"><strong>Twitch Commands</strong></div>
              <ul className="listText">
              <li><strong>!bug</strong> Catch a bug</li>
              <li><strong>!fish</strong> Catch a fish</li>
              <li><strong>!sell [creature name]</strong> Removes a bug or fish from your pocket and you get its value in bells stored to your own bells</li>
              <li><strong>!sell all</strong> Removes everything from your pocket and you get the total value in bells added to your own bells</li>
              <li><strong>!rare bugs</strong> List rare bugs available this month</li>
              <li><strong>!rare fishes</strong> List rare fishes available this month</li>
              <li><strong>!pocket</strong> Displays all bugs and fish in your pocket</li>
              <li><strong>!bells</strong> Displays current bells owned</li>
              <li><strong>!turnips</strong> Displays how many turnips you own and how they are faring in the market</li>
              <li><strong>!market</strong> Displays the prices of turnips on the ever changing Stalk Market</li>
              <li><strong>!buy [quantity] turnips</strong> Allows you to buy turnips</li>
              <li><strong>!sell [quantity] turnips</strong> Allows you to sell turnips</li>
              <li><strong>!confirm</strong> Allows for execution of a turnip transaction</li>
              <li><strong>!cancel</strong> Allows for termination of a turnip transaction</li>
              </ul>
            </Card>
          </Col>
        </Row>
        <LightCog/>
      </div> 
    )
  }
}