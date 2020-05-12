import React, {Component} from 'react';
import { Row, Col, Card, Button, Avatar} from 'antd'; 

import FishIcon from '../Assets/resolved/fishIcon'
import "antd/dist/antd.css";
import "./css/components.css"


export default class FishBody extends Component {
    render() {
        return( 
            <Row className="FishBodyContainer fade-in">
                <Col className="FishRodCol" span={5} offset={2}>
                    <Card className="fade-in">
                        <Button type="primary" block>
                            Catch a Fish
                        </Button>
                    </Card>
                </Col>
                <Col className="TitleCol" span={11} offset={6}>
                    <FishIcon/>
                </Col>
            </Row>
        )
    }
}
