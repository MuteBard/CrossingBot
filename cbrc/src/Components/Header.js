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
      <Row className = "Header" align="middle" component={Link} to="/">
        <Col span={6}>
          <Link to='/'>
            <NamedLogo/>
          </Link>
        </Col>
        <Col className="headerItem" span={3} offset={8} component={Link} to="/market">
          <Link className="linkWrap" to='/market'>
            <div class="headerText">Market</div>
            <StockOutlined style={{fontSize:"3em", color:"#2A5D67"}}/>
          </Link>
        </Col>
        <Col className="headerItem" span={3}>
          <Link className="linkWrap" to='/catch'>
            <div class="headerText">Catch</div>
            <BugOutlined style={{fontSize:"3em", color:"#2A5D67"}}/>
          </Link>
        </Col>
        <Col className="headerProfile" span={3} offset={1}>
          <Link className="linkWrap" to='/'>
            <Badge count={1}>
              <Avatar shape="square" size={64} icon={<UserOutlined />} />
            </Badge>
          </Link>
        </Col> 
      </Row>
  )
}
