import React, {Component} from 'react';
import { Row, Col, Card, Button, Avatar} from 'antd'; 

import BugIcon from '../Assets/resolved/bugIcon'
import "antd/dist/antd.css";
import "./css/components.css"

export default class BugBody extends Component {
    render() {
        return( 
            <Row className="BugBodyContainer fade-in">
                <Col className="BugNetCol" span={5} offset={2}>
                    <Card className="fade-in">
                        <Button type="primary" block>
                            Catch a Bug
                        </Button>
                    </Card>
                </Col>
                <Col className="TitleCol" span={11} offset={6}>
                    <BugIcon/>
                </Col>
            </Row>
        )
    }
}
