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
import PocketBug from '../Assets/resolved/bugIcon'
import PocketFish from '../Assets/resolved/fishIcon'

import DisplayBug from '../Assets/resolved/bugIcon'
import DisplayFish from '../Assets/resolved/fishIcon'

const CATCH = "catch"
const BUG = "bug"
const FISH = "fish"
const SELL = "sell"
const SELLALL = "sellall"

const dummyBugsList = [
    {
        name : "Common Butterfly",
        img : "",
        bells: 90,
        rarity: 2,
        availability : ["MAR", "APR", "MAY", "JUN", "SEP"],
        hover: true, small: true
    },
    {
        name : "Oak Silk Moth",
        img : "",
        bells: 1200,
        rarity: 4,
        availability : ["JUN", "JUL", "AUG", "SEP"],
        hover: true, small: true
    },
] 

const dummyFishesList = [
    {
        name : "Dace",
        img : "",
        bells: 200,
        rarity: 3,
        availability : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
        hover: true, small: true
    },
    {
        name : "Tadpole",
        img : "",
        bells: 100,
        rarity: 2,
        availability : ["MAR", "APR", "MAY", "JUN", "JUL"],
        hover: true, small: true
    },
    {
        name : "Eel",
        img : "",
        bells: 2000,
        rarity: 3,
        availability : ["JUN", "JUL", "AUG", "SEP"],
        hover: true, small: true
    },
] 

export default class Catch extends Component {
    state = {
        username: "MuteBard",
        userBells : "",
        species : BUG,
        name : "",
        img : "",
        bells: "",
        rarity: "",
        availability: [],
        pocketBugs : [],
        pocketFishes : [],
      };

    componentDidMount = () => {

        this.setState({
            pocketBugs : dummyBugsList.map((data) => {return {name : data.name, img : data.img, bells: data.bells, rarity: data.rarity, availability : data.availability, hover: data.hover, small: data.small }}),
            pocketFishes : dummyFishesList.map((data) => {return {name : data.name, img : data.img, bells: data.bells, rarity: data.rarity, availability : data.availability, hover: data.hover, small: data.small }})
        })
    }

    speciesSelect = e => {
        this.setState({ species : e.target.value});
    }

    handleChildClick = (action, data) => {
        if (action == CATCH){
            if (data == BUG){
                let pocketBugs = this.state.pocketBugs
                pocketBugs.push(dummyBugsList[0])
                this.setState({species : BUG , name : dummyBugsList[0].name, img: "", bells: dummyBugsList[0].bells, rarity: dummyBugsList[0].rarity, availability: dummyBugsList[0].availability, bugs: pocketBugs });
            }else if (data == FISH){
                let pocketFishes = this.state.pocketFishes
                pocketFishes.push(dummyFishesList[0])
                this.setState({ species : FISH ,  name : dummyFishesList[0].name, img: "", bells: dummyFishesList[0].bells, rarity: dummyFishesList[0].rarity, availability: dummyFishesList[0].availability, fishes : pocketFishes});
            }
        }
        else if(action == SELL){
            console.log(data)
            // this.state.bugs.filter
        }
        else if(action == SELLALL){
            if(data == BUG){
                // this.state.bugs.map
                console.log(data)
            }else if (data == FISH){
                console.log(data)
            }
        }
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
                    <Col span={5} offset={7}>
                        {this.state.img == "" ?
                            this.state.species == BUG  ? <DisplayBug traits={{hover: false, small:false}}/> : <DisplayFish traits={{hover: false, small:false}}/>
                            :
                            <img alt={this.state.name} src={this.state.img}/>
                        }
                    </Col>
                </Row>
                {this.state.species == BUG ? <BugBody data={this.state} handleClick={this.handleChildClick}/>  : <FishBody data={this.state} handleClick={this.handleChildClick}/>}
                <LightCog/>
                
            </div> 
        )
    }
}

// https://ant.design/components/list/