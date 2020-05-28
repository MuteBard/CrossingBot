import React, { Component } from 'react';
import { Row, Col, Card, Button } from 'antd'; 

import "antd/dist/antd.css";
import "./css/pages.css"

import Route from '../Actions/Route'
import HeroTop from '../Assets/resolved/HeroTop'
import HeroBottom from '../Assets/resolved/HeroBottom'
import LightCog from '../Assets/resolved/backgroundcogLight'

export default class Home extends Component {
    state = {
      pressed : false
    }
    addCrossingBotToChannel(){
      let updateUserChannelWithCrossingBot = (data) => {
        console.log(data)
        if (data.isCrossingBotAdded == "Success"){
          this.setState({
            pressed : true
          })
        }
      }
      let CBAS_Payload = {username : "MuteBard", added : true}
      Route.mutateCBforUserOrCreateUser(CBAS_Payload, updateUserChannelWithCrossingBot)
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
                <div className="howToUse"><strong>How to Register</strong></div>
                <ol className="listText">
                  <li> Press this button <br/>
                    
                    {
                      this.state.pressed == false 
                      ? 
                      <div>
                        <Button type="primary" key="back" onClick={() => this.addCrossingBotToChannel()}>
                            Add crossingbot_ to Mutebard's chat
                        </Button> <br/> 
                        <div>Or go to a twitch channel that has crossingbot_</div>
                      </div>
                      :
                      <div>Awesome! Now head to your Twitch channel page</div>
                    }

                    </li>
                  <li>Type <strong>!bug</strong> or <strong>!fish</strong> in the Twitch text channel</li>
                  <li>Refresh this page</li>
                  And thats it! You are ready to use CrossingBot either on Twitch and on this website!
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