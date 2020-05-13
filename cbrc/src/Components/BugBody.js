import React, {Component} from 'react';
import { Row, Col, Card, Button, Avatar} from 'antd'; 

import BugIcon from '../Assets/resolved/bugIcon'
import "antd/dist/antd.css";
import "./css/components.css"

const BUG = "bug"

const cardHeaderStyle = {width: 390, textAlign : "center", color : "#2A5D67", backgroundColor : "#4AE3B5" }
const cardBodyStyle = { width: 390, textAlign : "center", color : "#4AE3B5", backgroundColor : "#2A5D67" }
const cardBodyStyle2 = { backgroundColor : "#4AE3B5"}

export default function BugBody({creature, handleClick, friendlyMonth}){

    let { name, bells, rarity, availability, bugs} = creature
    return( 
        <div>
            <Row className="BugBodyContainer fade-in">
                <Col className="BugNetCol" span={5} offset={2}>
                    <Card className="fade-in">
                        <Button type="primary" block onClick={() => handleClick(BUG)}>
                            Catch a Bug
                        </Button>
                    </Card>
                </Col>
                <Col span={10} offset={4}>
                    {name != "" 
                        ?
                        <div className="fade-in">
                            <Card title={name.toUpperCase()} bordered={false} headStyle={cardHeaderStyle} bodyStyle={cardBodyStyle}>
                                <p>You have caught a {name}!</p>
                                <p>Worth {bells} Bells</p>
                                <p>Has a rarity of {rarity}</p>
                                <p>Available during {availability.map(month => `${friendlyMonth(month).toLowerCase()}, `)}</p>
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
                        <Card bodyStyle={cardBodyStyle2}>
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
