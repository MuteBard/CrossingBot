import React, { Component } from 'react';
import { Row, Col, Card, Button, Input } from 'antd'; 
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
      CBuserExists : false,
      searchPressed : false,
      validCBUserCreation : false,
      authenticateCBPassword : false,
      authenticatePressed : false,
      validCBChannelAddition: false,
      passwordInput : "",
    }
    addCrossingBotToChannel(){
      // let updateUserChannelWithCrossingBot = (data) => {
      //   console.log(data)
      //   if (data.isCrossingBotAdded == "Success"){
      //     this.setState({
      //       cbAddedPressed : true
      //     })
      //   }
      // }
      // let CBAS_Payload = {username : "MuteBard", added : true}
      // Route.mutateCBforUserOrCreateUser(CBAS_Payload, updateUserChannelWithCrossingBot)

      this.setState({
        validCBChannelAddition : true
      })
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
      if (this.state.passwordInput == "jyjufjydhtsdjkuylktdj"){
        this.setState({
          authenticateCBPassword : true,
          authenticatePressed  : true
        })
      }else{
        this.setState({
          authenticatePressed  : true
        })
      }
    }

    searchForUser = async() => {
      console.log("searchForUser")
      // let Twitch_Response = await axios({
      //   method: 'GET',
      //   url: `https://api.twitch.tv/helix/users?login=${this.state.usernameInput}`,
      //   headers : settings.headers,
      // })
      // .catch(error => console.log(error))
      if(this.state.usernameInput == "MuteBard"){
        this.setState({
          id : 7886767,//Number(Twitch_Response.data.data[0].id),
          avatar : "hgjhgjhg",//Twitch_Response.data.data[0].profile_image_url,
          passwordInput : "jyjufjydhtsdjkuylktdj",
          searchPressed: true,
          validTwitchAccount : true,
        })
      }else{
        this.setState({
          searchPressed: true,
        })
      }
    }

    addUserToDB(){
      console.log(this.state)
      this.setState({
        validCBUserCreation: true,
      })
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
                <div className="howToUse"><strong>How to Register / Sign In</strong></div>
                <ol className="listText">
                  <li>First make sure you have a Twitch account at https://www.twitch.tv/</li>
                  <li>
                    {
                      this.state.validTwitchAccount == true 
                      ?
                      <div>Found your account</div>
                      :
                      <div>Search for your Twitch username</div>
                    }
                    <div className="searchUser">
                    {
                      this.state.validTwitchAccount == true 
                      ?
                      <div className="searchMessageContainer">
                        <div className="searchMessage"><strong>Mutebard</strong><TwitchLogo/></div>
                        <img alt="example" className="profilePicture" src="https://cdn.discordapp.com/attachments/688616211617284144/708405645845725194/298.png"/>
                      </div>
                      :
                      <div className="searchInputContainer">
                          <input type="text" className="searchInput" value={this.state.usernameInput} onChange={event => this.usernameInputSearch(event.target.value)}/>
                          <button className="button" onClick={() => this.searchForUser()}><MagnifyingGlass/></button>
                      </div>
                    }
                    {
                      this.state.validTwitchAccount == false && this.state.searchPressed == true
                      ?
                      <div className={"error"}>This is not a valid Twitch user account</div> 
                      :
                      null
                    }

                    </div>
                  </li>
                  {this.state.validTwitchAccount == true 
                  ?
                    this.state.CBuserExists == true
                    ?
                    <li>
                      {
                        this.state.authenticateCBPassword == true
                        ?
                        <div>
                          <div>Success</div>
                          <div className="logInMessageContainer"> 
                            <div className="logInMessage"><strong>Signed In</strong><Logo tiny={true}/></div>
                          </div>
                        </div>
                        :
                        <div>
                          <div>Enter the provided <strong>Crossingbot</strong> Password (NOT your Twitch Password)</div>
                            <div className="logInUsersContainer">
                              <div className="logInUsers">
                              <input type="text" className="PasswordInput" value={this.state.passwordInput} onChange={event => this.passwordInput(event.target.value)}/>
                              <button className="button" onClick={() => this.submitUser()}><Key/></button>
                            </div>
                              {
                                this.state.authenticateCBPassword == false && this.state.authenticatePressed == true
                                ?
                                <div className={"error"}>This password is not valid</div> 
                                :
                                null
                              }
                          </div>
                        </div>
                      }


                    </li>
                    :
                    <li>
                      {
                        this.state.validCBUserCreation == true
                        ?
                        <div>Success (Store it someplace safe)</div>
                        :
                        <div>Create your CrossingBot account by requesting a password</div>

                      }
                      <div className="createUsers">
                      {
                        this.state.validCBUserCreation == true 
                        ?
                        <div className="creationMessage"><strong>{this.state.passwordInput}</strong><Logo tiny={true}/></div>
                        :
                        <button className="creationMessage button" onClick={() => this.addUserToDB()}><strong>Request a Password</strong></button>
                      }
                      </div>
                    </li>
                  :
                    null
                  }

                  {this.state.validTwitchAccount == true && this.state.validCBUserCreation == true || this.state.validTwitchAccount == true && this.state.authenticateCBPassword == true 
                  ?
                  <li>
                    Add CrossingBot to your twitch channel (Optional)
                    <div className="createUsers">
                    {
                      this.state.validCBChannelAddition == true
                      ?
                      <div className="creationMessage"><strong>Awesome! All Set</strong><Logo tiny={true}/></div>
                      :
                      <button className="creationMessage button" onClick={() => this.addCrossingBotToChannel()}><strong>Add crossingbot_ to Mutebard's chat</strong></button>
                    }
                    </div>
                  </li>
                  :
                  null
                  }
                </ol>
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