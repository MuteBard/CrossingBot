import React, {Component} from 'react';
import { Row, Col, Card, Button, Avatar, Progress} from 'antd'; 

import BugIcon from '../Assets/resolved/bugIcon'
import PocketBug from '../Assets/resolved/bugIcon'
import "antd/dist/antd.css";
import "./css/components.css"

const CATCH = "catch"
const BUG = "bug"
const SELLALL = "sellall"
const cardHeaderStyle = {width: 470, textAlign : "center", color : "#2A5D67", backgroundColor : "#4AE3B5" }
const cardBodyStyle = { width: 470, textAlign : "center", color : "#4AE3B5", backgroundColor : "#2A5D67" }
const cardBodyStyle2 = { width: 390, textAlign : "center", color : "#4AE3B5", border : "solid 2px #4AE3B5"}
const cardBodyStyle3 = { textAlign : "center", color : "#4AE3B5", fontSize : "2em"}


export default class BugBody extends Component{
    state = {
        seconds : 0,
    }

    componentDidMount = () => {
        let lsSeconds = localStorage.getItem('bugSeconds')
        let lsTimeStamp = localStorage.getItem('bugTimeStamp')
        if(lsSeconds > 0){
            let oldTime = lsTimeStamp
            let currTime = parseInt(new Date().getTime() / 1000)
            let timeAway = currTime - oldTime
            let secondsRemaining = lsSeconds - timeAway
            this.setState({seconds: secondsRemaining})
            setTimeout(() => {
                console.log(this.state.seconds)
                if(this.state.seconds > 0){
                    this.bugIsLocked() 
                }  
            }, 100);
        }else{
            this.setState({seconds: 0})
        }
    }
  
    bugIsLocked = () =>{
        let seconds = this.state.seconds
        let intervalId = setInterval(() => {  
            if(seconds > 0){
                this.persistSeconds(seconds, true)
                seconds--
            } else{
                this.persistSeconds(seconds, false)
                clearInterval(intervalId);
            }
        }, 1000);
    }
  
    persistSeconds = (seconds, persist) => {
        if(persist){
            var timestamp = parseInt(new Date().getTime() / 1000)
            this.setState({seconds})
            localStorage.setItem('bugSeconds', seconds);
            localStorage.setItem('bugTimeStamp', timestamp);
        }else{    
            this.setState({seconds})
            localStorage.clear();
        }
    }

    interpretMonth = month => {
        switch(month){
            case "JAN":
                return "January"
                break
            case "FEB":
                return "Febuary"
                break
            case "MAR":
                return "March"
                break
            case "APR":
                return "April"
                break
            case "MAY":
                return "May"
                break
            case "JUN":
                return "June"
                break
            case "JUL":
                return "July"
                break
            case "AUG":
                return "August"
                break
            case "SEP":
                return "September"
                break
            case "OCT":
                return "October"
                break
            case "NOV":
                return "November"
                break
            case "DEC":
                return "December"
                break
        }
    }
    
    render(){
        let { name, bells, rarity, availability, pocketBugs} = this.props.data
        let { handleClick } = this.props 
        let percentProgress = parseInt(100 * (60 - this.state.seconds) / 60)
        let displayseconds = this.state.seconds
        return( 
            <div>
                <Row className="BugBodyContainer fade-in">
                    <Col className="BugNetCol" span={5} offset={2}> 
                        <div className="bellCard">
                            <Card bodyStyle={cardBodyStyle3}>23232 Bells</Card>
                        </div>
                        {this.state.seconds == 0 
                        ?
                        <Card className="fade-in">
                            <Button type="primary" block onClick={() => {
                                this.setState({seconds : 5})
                                setTimeout(() => {
                                    this.bugIsLocked() 
                                }, 100);
                                return handleClick(CATCH,BUG) 
                            }}>
                                Catch a Bug
                            </Button>
                        </Card>
                        :
                        <div className="timer">
                            <Progress type="circle" percent={percentProgress} strokeColor={"#4AE3B5"} format={percent => `${displayseconds} sec`} />
                        </div>
                    }
                    </Col>
                    <Col span={10} offset={4}>
                        {name != "" 
                            ?
                            <div className="fade-in">
                                <Card title={name.toUpperCase()} bordered={false} headStyle={cardHeaderStyle} bodyStyle={cardBodyStyle}>
                                    <p>You have caught a {name}!</p>
                                    <p>Bells: {bells}</p>
                                    <p>Rarity Level: {rarity}</p>
                                    <p>Availability: {availability.map(month => `${this.interpretMonth(month)}, `)}</p>
                                </Card>
                            </div>
                            :
                            null
                        }
                    </Col>
                </Row>
                {
                    pocketBugs != []
                    ? 
                    <div>
                        <Row className="PocketContainer">
                            <Col className="PocketCol" span={20} offset={2}>
                                <p className="PocketColTitle">Your Pocket</p>
                                <Card>
                                    {pocketBugs.map(data => <PocketBug handlePocketClick={handleClick} traits={{name : data.name, img : data.img, bells: data.bells, rarity: data.rarity, availability : data.availability, hover: data.hover, small: data.small}}/>)}
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={2}>
                                <div className="sellAllCard">
                                    <Card>
                                        <Button type="primary" block onClick={() => {handleClick(SELLALL,BUG)}}>
                                            Sell All Bugs
                                        </Button>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}