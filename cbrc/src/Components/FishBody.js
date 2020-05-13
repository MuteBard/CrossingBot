// import React, {Component} from 'react';
// import { Row, Col, Card, Button, Avatar, Progress} from 'antd'; 

// import FishIcon from '../Assets/resolved/fishIcon'
// import "antd/dist/antd.css";
// import "./css/components.css"

// const FISH = "fish"
// const cardHeaderStyle = {width: 390, textAlign : "center", color : "#2A5D67", backgroundColor : "#4AE3B5" }
// const cardBodyStyle = { width: 390, textAlign : "center", color : "#4AE3B5", backgroundColor : "#2A5D67" }
// const cardBodyStyle2 = { width: 390, textAlign : "center", color : "#4AE3B5", border : "solid 2px #4AE3B5"}


// export default function FishBody({creature, handleClick, friendlyMonth}){
//     let { name, bells, rarity, availability, fishes, fishTime} = creature
    
//     let seconds = fishTime

//     let fishIsReady = (condition, seconds) => {
//         if(condition){
//             return(
//                 <Card className="fade-in">
//                     <Button type="primary" block onClick={() => handleClick(FISH)}>
//                         Catch a Fish
//                     </Button>
//                 </Card>
//             )
//         }else{
//             let percentProgress = parseInt(100 * (60 - seconds) / 60)
//             let seconds = (60 - seconds)

//             return(
//                 <Progress type="circle" percent={percentProgress} format={percent => `${seconds} seconds left`} />
//             )
//         }
//     }

//     let fishIsLocked = () => {
//         console.log(seconds)
//         if (seconds == 60){
//             setInterval(() => {  
//                 if(seconds <= 0){
//                     return(
//                         <Card className="fade-in">
//                             <Button type="primary" block onClick={() => handleClick(FISH)}>
//                                 Catch a Fish
//                             </Button>
//                         </Card>
//                     )
//                 }else{
//                     let percentProgress = parseInt(100 * (60 - seconds) / 60)
//                     let displayseconds = seconds
//                     console.log(percentProgress)
//                     console.log(displayseconds)
//                     seconds--
//                     return(
//                         <Progress type="circle" percent={75} format={percent => `${15} sec`} />
//                     )
//                 } 
//             }, 1000);
//         }else{
//             return(
//                 <Card className="fade-in">
//                     <Button type="primary" block onClick={() => handleClick(FISH)}>
//                         Catch a Fish
//                     </Button>
//                 </Card>
//             )
//         }
//     }

//     // let item = (x) => {
//     //     return x + 1
//     // }

//     return( 
//         <div>
//             <Row className="FishBodyContainer fade-in">
//                 <Col className="FishRodCol" span={5} offset={2}>
//                     {fishIsLocked()}
//                 </Col>
//                 <Col span={10} offset={4}>
//                     {name != "" 
//                         ?
//                         <div className="fade-in">
//                             <Card title={name.toUpperCase()} bordered={false} headStyle={cardHeaderStyle} bodyStyle={cardBodyStyle}>
//                                 <p>You have caught a {name}!</p>
//                                 <p>Bells: {bells}</p>
//                                 <p>Rarity Level: {rarity}</p>
//                                 <p>Availability: {availability.map(month => `${friendlyMonth(month)}, `)}</p>
//                             </Card>
//                         </div>
//                         :
//                         <div className="EmptySummary"></div>
//                     }
//                 </Col>
//             </Row>
//             {
//                 fishes != []
//                 ? 
//                 <Row className="PocketContainer">
//                     <Col className="PocketCol" span={20} offset={2}>
//                         <p className="PocketColTitle">Your Pocket</p>
//                         <Card>
//                             {fishes}
//                         </Card>
//                     </Col>
//                 </Row>
//                 :
//                 null
//             }
//         </div>
//     )
// }


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
        seconds : 0,
        fishLock : false
    }


    fishIsLocked = () => {
        var intervalId = null 
        if (this.state.fishLock == true){
            this.setState({seconds : 60})
            intervalId = setInterval(() => {  
                if(this.state.seconds > 0){
                    let seconds = this.state.seconds - 1
                    this.setState({seconds})
                } else{
                    this.setState({fishLock : false})
                    clearInterval(intervalId);
                }
            }, 1000);
        }
    }
    
    render(){
        console.log(this.props.data)
        let { friendlyMonth } = this.props
        let { name, bells, rarity, availability, fishes, fishTime} = this.props.data
        let percentProgress = parseInt(100 * (60 - this.state.seconds) / 60)
        let displayseconds = this.state.seconds
        return( 
            <div>
                <Row className="FishBodyContainer fade-in">
                    {this.state.seconds == 0 
                    ?
                    <Col className="FishRodCol" span={5} offset={2}> 
                        <Card className="fade-in">
                            <Button type="primary" block onClick={() => {
                                this.setState({fishLock : true})
                                setTimeout(() => {
                                    this.fishIsLocked() 
                                }, 100);
                                return this.props.handleClick(FISH) 
                            }}>
                                Catch a Fish
                            </Button>
                        </Card>
                    </Col>
                    :
                    <Col className="FishRodCol" span={5} offset={2}>
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