import React, {Component} from 'react';
import { Link } from "react-router-dom"
import { Row, Col, Space, Card, Radio } from 'antd'; 
import { UserOutlined } from '@ant-design/icons'; 

import "antd/dist/antd.css";
import "./css/pages.css" 

import BugHeader from '../Components/BugHeader'
import FishHeader from '../Components/FishHeader'
import BugBody from '../Components/BugBody'
import FishBody from '../Components/FishBody'
import LightCog from '../Assets/resolved/backgroundcogLight'

const BUG = "bug"
const FISH = "fish"


export default class Catch extends Component {
    state = {
        species : BUG,
      };

    speciesSelect = e => {
        this.setState({ species : e.target.value });
    }

    render() {
        return( 
            <div className="CatchContainer"> 
                {this.state.species == BUG ? <BugHeader/> : <FishHeader/>}
                <Row className="RadioRow">
                    <Col span={5} offset={2}>
                        <Card>
                            <Radio.Group size="large" onChange={this.speciesSelect} value={this.state.value}>
                                <Radio.Button value={BUG}>Catch Bugs</Radio.Button>
                                <Radio.Button value={FISH}>Catch Fishes</Radio.Button>
                            </Radio.Group>
                        </Card>
                    </Col>
                </Row>
                {this.state.species == BUG ? <BugBody/> : <FishBody/>}
                <LightCog/>
            </div> 
        )
    }
}

// https://ant.design/components/list/