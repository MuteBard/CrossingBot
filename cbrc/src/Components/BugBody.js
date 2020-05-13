import React, {Component} from 'react';
import { Row, Col, Card, Button, Avatar, Progress} from 'antd'; 

import BugIcon from '../Assets/resolved/bugIcon'
import "antd/dist/antd.css";
import "./css/components.css"

const BUG = "bug"
const cardHeaderStyle = {width: 390, textAlign : "center", color : "#2A5D67", backgroundColor : "#4AE3B5" }
const cardBodyStyle = { width: 390, textAlign : "center", color : "#4AE3B5", backgroundColor : "#2A5D67" }
const cardBodyStyle2 = { width: 390, textAlign : "center", color : "#4AE3B5", border : "solid 2px #4AE3B5"}


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
    
    render(){
        let { friendlyMonth } = this.props
        let { name, bells, rarity, availability, bugs, fishTime} = this.props.data
        let percentProgress = parseInt(100 * (60 - this.state.seconds) / 60)
        let displayseconds = this.state.seconds
        return( 
            <div>
                <Row className="BugBodyContainer fade-in">
                    {this.state.seconds == 0 
                    ?
                    <Col className="BugNetCol" span={5} offset={2}> 
                        <Card className="fade-in">
                            <Button type="primary" block onClick={() => {
                                this.setState({seconds : 60})
                                setTimeout(() => {
                                    this.bugIsLocked() 
                                }, 100);
                                return this.props.handleClick(BUG) 
                            }}>
                                Catch a Bug
                            </Button>
                        </Card>
                    </Col>
                    :
                    <Col className="BugNetCol" span={5} offset={2}>
                        <div className="timer">
                            <Progress type="circle" percent={percentProgress} strokeColor={"#4AE3B5"} format={percent => `${displayseconds} sec`} />
                        </div>
                    </Col>}
                    <Col span={10} offset={4}>
                        {name != "" 
                            ?
                            <div className="fade-in">
                                <Card title={name.toUpperCase()} bordered={false} headStyle={cardHeaderStyle} bodyStyle={cardBodyStyle}>
                                    <p>You have caught a {name}!</p>
                                    <p>Bells: {bells}</p>
                                    <p>Rarity Level: {rarity}</p>
                                    <p>Availability: {availability.map(month => `${friendlyMonth(month)}, `)}</p>
                                </Card>
                            </div>
                            :
                            <div className="EmptySummary"></div>
                        }
                    </Col>
                </Row>
                {
                    bugs != []
                    ? 
                    <Row className="PocketContainer">
                        <Col className="PocketCol" span={20} offset={2}>
                            <p className="PocketColTitle">Your Pocket</p>
                            <Card>
                                {bugs}
                            </Card>
                        </Col>
                    </Row>
                    :
                    null
                }
            </div>
        )
    }
}