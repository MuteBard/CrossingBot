import React, {Component} from 'react';
import { Link } from "react-router-dom"
import {Carousel, Row, Col, Space, Card, Avatar } from 'antd'; 
import { UserOutlined } from '@ant-design/icons'; 

import "antd/dist/antd.css";
import "./css/pages.css"

import Hero from '../Assets/resolved/hero'
import Turnip from '../Assets/resolved/turnip'
import Bells from '../Assets/resolved/bells'
import DarkCog from '../Assets/resolved/backgroundcogDark'
import LightCog from '../Assets/resolved/backgroundcogLight'

const { Meta } = Card;

export default class Home extends Component {
    render() {
      return ( 
        <span className="HomeContainer"> 
          <div className="Top3Title">Top Earners This Week</div>
          <div className="Top3Container">
            <Row className="row" align="middle" justify="space-around">
              <Col span={7} offset={3}>
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
              <Col span={7}>
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
              <Col span={7}>
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
          </div>
          <DarkCog/>
        </span> 
      )
    }
  }