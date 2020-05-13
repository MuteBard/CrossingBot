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

const BUG = "bug"
const FISH = "fish"

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
        species : BUG,
        name : "",
        img : "",
        bells: "",
        rarity: "",
        availability: [],
        bugs : dummyBugsList.map((data) => <PocketBug traits={{name : data.name, img : data.img, bells: data.bells, rarity: data.rarity, availability : data.availability, hover: data.hover, small: data.small}}/>),
        fishes : dummyFishesList.map((data) => <PocketFish traits={{name : data.name, img : data.img, bells: data.bells, rarity: data.rarity, availability : data.availability, hover: data.hover, small: data.small}}/> ),
      };

    speciesSelect = e => {
        this.setState({ species : e.target.value, name : "", img: "", bells: "", rarity: "", availability: ""  });
    }

    handleChildClick = species => {
        if (species == BUG){
            let pocketBugs = this.state.bugs
            pocketBugs.push(<PocketBug traits={dummyBugsList[0]}/>)
            this.setState({species , name : dummyBugsList[0].name, img: "", bells: dummyBugsList[0].bells, rarity: dummyBugsList[0].rarity, availability: dummyBugsList[0].availability, bugs: pocketBugs });
        }
        else if(species == FISH){
            let pocketFishes = this.state.fishes
            pocketFishes.push(<PocketFish traits={dummyFishesList[0]}/>)
            this.setState({ species ,  name : dummyFishesList[0].name, img: "", bells: dummyFishesList[0].bells, rarity: dummyFishesList[0].rarity, availability: dummyFishesList[0].availability, fishes : pocketFishes});
        }
    }
    interpretMonth = month => {
        switch(month){
            case "JAN":
                return "January"
                break
            case "FEB":
                return "Febuary"
                break
            case "MAR":
                return "March"
                break
            case "APR":
                return "April"
                break
            case "MAY":
                return "May"
                break
            case "JUN":
                return "June"
                break
            case "JUL":
                return "July"
                break
            case "AUG":
                return "August"
                break
            case "SEP":
                return "September"
                break
            case "OCT":
                return "October"
                break
            case "NOV":
                return "November"
                break
            case "DEC":
                return "December"
                break
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
                    <Col span={5} offset={6}>
                        {this.state.img == "" ?
                            this.state.species == BUG  ? <DisplayBug traits={{hover: false, small:false}}/> : <DisplayFish traits={{hover: false, small:false}}/>
                            :
                            <img alt={this.state.name} src={this.state.img}/>
                        }
                    </Col>
                </Row>
                {this.state.species == BUG ? <BugBody data={this.state} handleClick={this.handleChildClick} friendlyMonth={this.interpretMonth}/>  : <FishBody data={this.state} handleClick={this.handleChildClick} friendlyMonth={this.interpretMonth}/>}
                <LightCog/>
            </div> 
        )
    }
}

// https://ant.design/components/list/