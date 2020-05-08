import React from 'react';
import { Link } from "react-router-dom"
import { Row, Col } from 'antd'; 
import "antd/dist/antd.css";
 
export default function Footer(){
  return(
    <div>
      <Row justify="space-around" align="middle">
        <Col span={2} offset={20}>Something wrong?</Col>
        <Col span={2}>Donate</Col>
      </Row>
      <Row>
        <Col span={2} offset={20}>Twitter Icon</Col>
        <Col span={2}>Paypal Icon</Col>
      </Row>
    </div>
  )
}


