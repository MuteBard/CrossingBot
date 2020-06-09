import React, { Component } from 'react';
import { Row, Col, Card, Button, Statistic, Progress} from 'antd'; 
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import PocketFish from '../Assets/resolved/fishIcon'
import "antd/dist/antd.css";
import "./css/components.css"

const CATCH = "catch"
const FISH = "fish"
const SELLALL = "sellall"
const cardHeaderStyle = {width: 470, textAlign : "center", color : "#2A5D67", backgroundColor : "#4AE3B5",  fontSize : "25px" }
const cardBodyStyle = { width: 470, textAlign : "center", color : "#4AE3B5", backgroundColor : "#2A5D67", fontSize : "15px" }

export default class FishBody extends Component{
    state = {
        seconds : 0,
    }

    componentDidMount = () => {
        let lsSeconds = localStorage.getItem('fishSeconds')
        let lsTimeStamp = localStorage.getItem('fishTimeStamp')
        localStorage.clear();
        if(lsSeconds > 0){
            let oldTime = lsTimeStamp
            let currTime = parseInt(new Date().getTime() / 1000)
            let timeAway = currTime - oldTime
            let secondsRemaining = lsSeconds - timeAway
            this.setState({seconds: secondsRemaining})
            setTimeout(() => {
                console.log(this.state.seconds)
                if(this.state.seconds > 0){
                    this.fishIsLocked() 
                }  
            }, 100);
        }else{
            this.setState({seconds: 0})
        }
    }

    statistic(base, current, unit, arrow) {
        return (
            current > base ?
            <Statistic
                value={current}
                precision={0}
                valueStyle={{ color: '#4AE3B5' }}
                prefix={ arrow ? <ArrowUpOutlined/> : undefined }
                suffix={ unit !== undefined ? unit : undefined }
            /> 
            :
            <Statistic
                value={current}
                precision={0}
                valueStyle={{ color: '#E34A78' }}
                prefix={ arrow ? <ArrowDownOutlined/> : undefined }
                suffix={ unit !== undefined ? unit : undefined }
             /> 
        )
    }
  
    fishIsLocked = () =>{
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
            localStorage.setItem('fishSeconds', seconds);
            localStorage.setItem('fishTimeStamp', timestamp);
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
            default :
                return "--"
        }
    }

    render(){
        let { name, bells, rarity, availability, pocketFishes, userBells} = this.props.data
        let { handleClick } = this.props
        let percentProgress = parseInt(100 * (60 - this.state.seconds) / 60)
        let displayseconds = this.state.seconds

        return( 
            <div>
                <Row className="FishBodyContainer fade-in">
                    <Col className="FishRodCol" span={5} offset={2}> 
                        <Card className="card">
                            <div className="stats2">
                                <strong>Bells Earned</strong>
                                <div>{this.statistic(0, userBells, "bells", false)}</div>
                            </div>
                        </Card>
                        {this.state.seconds === 0 
                        ?
                        <Card className="fade-in">
                            <Button type="primary" block onClick={() => {
                                this.setState({seconds : 60})
                                setTimeout(() => {
                                    this.fishIsLocked() 
                                }, 100);
                                return handleClick(CATCH,FISH) 
                            }}>
                                Catch a Fish
                            </Button>
                        </Card>
                        :
                        <div className="timer">
                            <Progress type="circle" percent={percentProgress} strokeColor={"#4AE3B5"} format={percent => `${displayseconds} sec`} />
                        </div>
                    }
                    </Col>





                    <Col span={10} offset={4}>
                        {name !== "" 
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
                    pocketFishes !== []
                    ? 
                    <div>
                        <Row className="PocketContainer">
                            <Col className="PocketCol" span={20} offset={2}>
                                
                                {
                                    pocketFishes.length > 0
                                ? 
                                <div>
                                    <p className="PocketColTitle">Your Pocket</p>
                                    <Card>
                                        {pocketFishes.map(data => <PocketFish handlePocketClick={handleClick} traits={{name : data.name, image : data.img, bells: data.bells, rarity: data.rarity, availability : data.availability, hover: data.hover, small: data.small}}/>)}
                                    </Card>
                                </div>
                                :
                                <p className="PocketColTitle">Your Pocket is Empty</p>
                                }

                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={2}>
                                <div className="sellAllCard">
                                {
                                    pocketFishes.length > 0
                                ? 
                                    <Card>
                                        <Button type="primary" block onClick={() => {handleClick(SELLALL,FISH)}}>
                                            Sell all Fishes
                                        </Button>
                                    </Card>
                                :
                                    null
                                }
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