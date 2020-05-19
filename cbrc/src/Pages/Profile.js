import React, { Component } from 'react';

import { Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import "antd/dist/antd.css";
import "./css/pages.css" 

import LightCog from '../Assets/resolved/backgroundcogLight'

import BugIcon from '../Assets/resolved/bugIcon'
import FishIcon from '../Assets/resolved/fishIcon'

import Bells from '../Assets/resolved/bells'
import Turnip from '../Assets/resolved/turnip'
import BugNet from '../Assets/resolved/bugnet'
import FishRod from '../Assets/resolved/fishrod'

export default class Catch extends Component {

    statistic(base, current, unit, arrow) {
        
        return (
            current > base ?
            <Statistic
                value={current}
                precision={0}
                valueStyle={{ color: '#4AE3B5' }}
                prefix={ arrow ? <ArrowUpOutlined/> : undefined }
                suffix={ unit !== undefined ? unit : undefined }
            /> 
            :
            <Statistic
                value={current}
                precision={0}
                valueStyle={{ color: '#E34A78' }}
                prefix={ arrow ? <ArrowDownOutlined/> : undefined }
                suffix={ unit !== undefined ? unit : undefined }
             /> 
        )
    }

    render() {
        return( 
            <div className="ProfileContainer">
                <Row className="row" align="middle">
                    <Col span={5} offset={1}>
                        <img alt="example" className="profilePicture" src="https://cdn.discordapp.com/attachments/688616211617284144/708405645845725194/298.png"/>    
                    </Col>
                    <Col span={15} offset={3}>
                        <div className="UsernameText">
                            <strong>MuteBard</strong>
                        </div>
                    </Col>
                </Row>
                
                <Row className="row" align="middle">
                    <Col offset={1}>
                        <Turnip profile={true}/>
                    </Col>
                    <Col span={5} offset={2}>
                        <div><strong>Turnips Held</strong></div>
                        <div>{this.statistic(0, 1, "turnip(s)", false)}</div>
                    </Col>
                    <Col span={5} offset={1}>
                        <div><strong>Today's Return</strong></div>
                        <div>{this.statistic(0, 32, "bells", true)}</div>
                    </Col>
                    <Col span={5} offset={1}>
                        <div><strong>Overall Return</strong></div>
                        <div>{this.statistic(0, 10, "%", true)}</div>
                    </Col>
                </Row>
                
                <Row className="row" align="middle">
                    <Col offset={1}>
                        <Bells profile={true}/>
                    </Col>
                    <Col span={5} offset={2}>
                        <p className="itemTitle"><strong>Bells Earned</strong></p>
                        <div>{this.statistic(0, 23232, "bells", false)}</div>
                    </Col>
                </Row>
                
                <Row className="row" align="middle">
                    <Col offset={1}>
                        
                        <BugNet profile={true}/>
                    </Col>
                    <Col span={15} offset={2}>
                        <p className="itemTitle"><strong>Bugs Owned (2/10)</strong></p>
                        <BugIcon traits={{hover: false, small:true}}/><BugIcon traits={{hover: false, small:true}}/>                     
                    </Col>
                </Row>
                
                <Row className="row" align="middle">
                    <Col offset={1}>
                        
                        <FishRod profile={true}/>
                    </Col>
                    <Col span={15} offset={2}>
                        <p className="itemTitle"><strong>Fishes Owned (2/10)</strong></p>
                        <FishIcon traits={{hover: false, small:true}}/><FishIcon traits={{hover: false, small:true}}/>                 
                    </Col>
                </Row>
                <LightCog/>             
            </div> 
        )
    }
}

