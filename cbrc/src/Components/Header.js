import React from 'react';
import { Link } from "react-router-dom"
import { Row, Col, Badge, Avatar} from 'antd';
import { UserOutlined, BugOutlined, BellOutlined, StockOutlined, SearchOutlined} from '@ant-design/icons'; 
import "antd/dist/antd.css";
import SVG from 'react-inlinesvg';
import './css/components.css'

import NamedLogo from '../Assets/resolved/namedLogo'

export default function Header(){
  return(
      <Row className = "Header" align="middle">
        <Col span={6}>
          <NamedLogo/>
        </Col>
        <Col className="headerItem" span={3} offset={6}>
          <div class="headerText">Market</div>
          <StockOutlined style={{fontSize:"3em", color:"#2A5D67"}}/>
        </Col>
        <Col className="headerItem" span={3}>
          <div class="headerText">Catch</div>
          <BugOutlined style={{fontSize:"3em", color:"#2A5D67"}}/>
        </Col>
        <Col className="headerItem" span={3}>
          <div class="headerText">Search</div>
          <SearchOutlined style={{fontSize:"3em", color:"#2A5D67"}}/>
        </Col>
        <Col className="headerProfile" span={3}>
          <Badge count={1}>
            <Avatar shape="square" size={64} icon={<UserOutlined />} />
          </Badge>
        </Col> 
      </Row>
  )
}
