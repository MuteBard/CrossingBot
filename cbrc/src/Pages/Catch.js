import React, {Component} from 'react';
import { Link } from "react-router-dom"
import {Carousel, Row, Col, Space, Card, Avatar } from 'antd'; 
import { UserOutlined } from '@ant-design/icons'; 

import "antd/dist/antd.css";
import "./css/pages.css" 

import Hero from '../Assets/resolved/hero'
import FishRod from '../Assets/resolved/fishrod'
import BugNet from '../Assets/resolved/bugnet'
import DarkCog from '../Assets/resolved/backgroundcogDark'
import LightCog from '../Assets/resolved/backgroundcogLight'

const { Meta } = Card;


export default class Catch extends Component {
    render() {
        return( 
            <div className="CatchContainer"> 
                <Row className="svgRow" align="middle" justify="space-around">
                    <Col span={2}>
                        <FishRod/>
                    </Col> 
                    <Col span={2} offset={5}>
                        <BugNet/>
                    </Col> 
                </Row>
                <Row className="contentRow" align="middle" justify="space-around">
                    <Col span={5}>
                        <Card
                            hoverable
                            style={{ width: 350 }}
                            >
                            <p><strong>MuteBard</strong></p>
                            <p>Rank #1 </p>
                            <p>Bells : </p>
                            <p>Turnips : </p>
                            <p>Gains : </p>
                            <p>Stream : </p>
                        </Card>
                    </Col> 
                    <Col span={5} offset={5}>
                        <Card
                            hoverable
                            style={{ width: 300 }}
                            >
                            <p><strong>MuteBard</strong></p>
                            <p>Rank #1 </p>
                            <p>Bells : </p>
                            <p>Turnips : </p>
                            <p>Gains : </p>
                            <p>Stream : </p>
                        </Card>
                    </Col> 
                </Row>
                
                <LightCog/>
            </div> 
        )
    }
}

// https://ant.design/components/list/ display pockets