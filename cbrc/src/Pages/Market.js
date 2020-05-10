import React, {Component} from 'react';
import { Link } from "react-router-dom"
import { Row, Col, Card, Tabs } from 'antd';
import { Line } from 'react-chartjs-2';
import "./css/pages.css"
import Turnip from '../Assets/resolved/turnip'
import TurnipsToday from '../Components/TurnipsToday'
import LightCog from '../Assets/resolved/backgroundcogLight'

const { TabPane } = Tabs; 

// const { Meta } = Card;

function getTabData(key) {
    console.log(key);
}

export default class Market extends Component {
    render() {
        return ( 
            <div className="MarketContainer">
                <Row align="middle">
                    <Col span={16} offset={4}>
                        <Tabs defaultActiveKey="1" onChange={getTabData}>
                            <TabPane tab="Today" key="1">
                                <TurnipsToday/>
                            </TabPane>
                            <TabPane tab="Past Week" key="2">
                                2
                            </TabPane>
                            <TabPane tab="Past Month" key="3">
                                3
                            </TabPane>
                            <TabPane tab="Past Year" key="4">
                                4
                            </TabPane>
                            <TabPane tab="All Time" key="5">
                                5
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                <LightCog/>
            </div>
        )
    }
}



