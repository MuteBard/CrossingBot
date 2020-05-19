import React, { Component } from 'react';
import { Row, Col } from 'antd'; 

import "antd/dist/antd.css";
import "./css/components.css"

import BugNet from '../Assets/resolved/bugnet'

export default class BugHeader extends Component {
    render() {
        return( 
            <Row className="BugHeaderContainer fade-in">
                <Col className="BugNetCol" span={4} offset={3}>
                    <BugNet/>
                </Col>
                <Col className="TitleCol" span={12} offset={4}>
                    <div className="title"><strong>CATCHING BUGS</strong></div>
                </Col>
            </Row>
        )
    }
}
