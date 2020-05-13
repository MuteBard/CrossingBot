import React, {Component} from 'react';
import { Row, Col, Card, Button, Avatar, Progress} from 'antd'; 

import FishIcon from '../Assets/resolved/fishIcon'
import "antd/dist/antd.css";
import "./css/components.css"

const FISH = "fish"
const cardHeaderStyle = {width: 390, textAlign : "center", color : "#2A5D67", backgroundColor : "#4AE3B5" }
const cardBodyStyle = { width: 390, textAlign : "center", color : "#4AE3B5", backgroundColor : "#2A5D67" }
const cardBodyStyle2 = { width: 390, textAlign : "center", color : "#4AE3B5", border : "solid 2px #4AE3B5"}


export default class FishBody extends Component{
    state = {
        seconds: 0,
      };

    fishIsReady = (condition) => {
        if(condition){
            return(
                <Card className="fade-in">
                    <Button type="primary" block onClick={() => this.prop.handleClick(FISH)}>
                        Catch a Fish
                    </Button>
                </Card>
            )
        }else{
            let percentProgress = parseInt(100 * (60 - seconds) / 60)
            let seconds = (60 - seconds)

            return(
                <Progress type="circle" percent={percentProgress} format={percent => `${seconds} seconds left`} />
            )
        }
    }

    fishIsLocked = () => {
        if (this.prop.creature.fishTime != 60){
            this.fishIsReady(true)
        }
    }

    render(){
        let { friendlyMonth} = this.prop
        let { name, bells, rarity, availability, fishes } = this.prop.creature
    
        
        return( 
            <div>
                <Row className="FishBodyContainer fade-in">
                    <Col className="FishRodCol" span={5} offset={2}>
                        {this.fishIsLocked} 
                    </Col>
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
                    fishes != []
                    ? 
                    <Row className="PocketContainer">
                        <Col className="PocketCol" span={20} offset={2}>
                            <p className="PocketColTitle">Your Pocket</p>
                            <Card>
                                {fishes}
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


// fishIsLocked = () => {
//     if (seconds == 60){
//         setInterval(() => {  
//             if(seconds <= 0){
//                 this.fishIsReady(true, 0)
//             }else{
//                 this.fishIsReady(false, seconds)
//                 seconds--
//             } 
//         }, 1000);
//     }else{
//         this.fishIsReady(true, 0)
//     }
// }