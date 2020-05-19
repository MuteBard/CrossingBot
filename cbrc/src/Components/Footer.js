import React from 'react';
import { Row, Col } from 'antd'; 
import "antd/dist/antd.css";

import {
  TwitterOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
 
export default function Footer(){
  return(
    <div className = "Footer">
      <Row justify="space-around" align="middle">
        <Col span={2} className="iconText" offset={20}>Issues?</Col>
        <Col span={2} className="iconText">Donate</Col>
      </Row>
      <Row>
        <Col span={2} offset={20}><TwitterOutlined className="icon" style={{fontSize:"3em", color:"#4AE3B5"}}/></Col>
        <Col span={2}><DollarCircleOutlined className="icon" style={{fontSize:"3em", color:"#4AE3B5"}}/></Col>
      </Row>
    </div>
  )
}


