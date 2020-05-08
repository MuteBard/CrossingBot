import React from 'react';
import { Link } from "react-router-dom"
import { Row, Col } from 'antd'; 
import "antd/dist/antd.css";
 

import NamedLogo from '../Assets/resolved/namedLogo'
import Bells from '../Assets/resolved/bells'
import BugNet from '../Assets/resolved/bugnet'
import FishRod from '../Assets/resolved/fishrod'
import Turnip from '../Assets/resolved/turnip'
import Hero from '../Assets/resolved/hero'
import Logo from '../Assets/resolved/logo'


import SVG from 'react-inlinesvg';


export default function Header(){
  return(
      <Row justify="space-around" align="middle">
        <Col span={6}><NamedLogo/></Col>
        <Col span={2} offset={8}>Market</Col>
        <Col span={2}>Catch Bugs</Col>
        <Col span={2}>Catch Fishes</Col>
        <Col span={2}>Creature Search</Col>
        <Col span={2}>Profile</Col>
      </Row>
  )
}


