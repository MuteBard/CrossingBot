import React, { Component } from 'react';
import { Row, Col, Card } from 'antd'; 

import "antd/dist/antd.css";
import "./css/pages.css"

import Hero from '../Assets/resolved/hero'
import LightCog from '../Assets/resolved/backgroundcogLight'

export default class Home extends Component {
    render() {
      return ( 
        <div className="HomeContainer"> 
          <Hero/>
          <Row align="middle">
            <Col span={24}>
              <div className="Top3Title"><strong>TOP EARNERS THIS WEEK</strong></div>
            </Col>
          </Row>
          <Row align="middle" justify="space-around">
            <Col span={7} offset={1}>
              <Card
                hoverable
                style={{ width: 350 }}
                cover={<img alt="example" src="https://cdn.discordapp.com/attachments/688616211617284144/708405645845725194/298.png"/>}>
                <p><strong>MuteBard</strong></p>
                <p>Rank #1 </p>
                <p>Bells : </p>
                <p>Turnips : </p>
                <p>Gains : </p>
                <p>Stream : </p>
              </Card>
            </Col> 
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 350 }}
                cover={<img alt="example" src="https://cdn.discordapp.com/attachments/688616211617284144/708405645845725194/298.png"/>}>
                <p><strong>MuteBard</strong></p>
                <p>Rank #2 </p>
                <p>Bells : </p>
                <p>Turnips : </p>
                <p>Gains : </p>
                <p>Stream : </p>
              </Card>
            </Col> 
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 350 }}
                cover={<img alt="example" src="https://cdn.discordapp.com/attachments/688616211617284144/708405645845725194/298.png"/>}>
                <p><strong>MuteBard</strong></p>
                <p>Rank #3 </p>
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