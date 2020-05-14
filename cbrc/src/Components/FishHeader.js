import React, {Component} from 'react';
import { Row, Col, Card, Button } from 'antd'; 

import "antd/dist/antd.css";
import "./css/components.css"

import FishRod from '../Assets/resolved/fishrod'

export default class FishHeader extends Component {
    render() {
        return( 
            <Row className="FishHeaderContainer fade-in">
                <Col className="FishRodCol" span={4} offset={3}>
                    <FishRod/>
                </Col>
                <Col className="TitleCol" span={12} offset={4}>
                    <div className="title"><strong>CATCHING FISHES</strong></div> 
                </Col>
            </Row>
        )
    }
}
