import React, {Component} from 'react';
import { Row, Col, Card, Radio } from 'antd'; 
import Route from '../Actions/Route'

import "antd/dist/antd.css";
import "./css/pages.css" 

import BugHeader from '../Components/BugHeader'
import FishHeader from '../Components/FishHeader'
import BugBody from '../Components/BugBody'
import FishBody from '../Components/FishBody'
import LightCog from '../Assets/resolved/backgroundcogLight'

import DisplayBug from '../Assets/resolved/bugIcon'
import DisplayFish from '../Assets/resolved/fishIcon'



const CATCH = "catch"
const BUG = "bug"
const FISH = "fish"
const SELL = "sell"
const SELLALL = "sellall"


export default class Catch extends Component {
    state = {
        username: "MuteBard",
        userBells : 0,
        species : BUG,
        name : "",
        img : "",
        bells: 0,
        rarity: "",
        availability: [],
        pocketBugs : [],
        pocketFishes : [],
      };

    componentDidMount = () => {
        this.updateData()

    }

    updateData = () => {
        let CBAS_Payload = { username: "MuteBard"}
        Route.queryUserPocket(CBAS_Payload, this.setCatchPocketData)
    }

    setCatchPocketData = (data) => {
        if(data.newCreature == true){
            console.log("ENTERED", data)
            this.setState({
                name : data.name,
                bells : data.bells,
                rarity : data.rarity,
                availability : data.availability,
                img : data.img,
                hover: false,
                small:false
            })
            this.updateData()
        }
        else{
            let pocketBugs = data.getUser.pocket.bug.map(bug => Object.assign(bug, {hover: true, small: true}))
            let pocketFishes = data.getUser.pocket.fish.map(fish => Object.assign(fish, {hover: true, small: true}))
            this.setState({
                userBells : data.getUser.bells,
                pocketBugs,
                pocketFishes
            })
        }
    }

    speciesSelect = e => {
        this.setState({ species : e.target.value});
    }

    handleChildClick = (action, data) => {
        if (action === CATCH){
            let CBAS_Payload = { username: "MuteBard", species : data }
            Route.mutateCatchCatchOneCreature(CBAS_Payload, this.setCatchPocketData)
        }
        else if(action === SELL){
            let CBAS_Payload = { username: "MuteBard", species : data.species, name: data.name }
            Route.mutateCatchSellOneCreature(CBAS_Payload, this.updateData)
        }
        else if(action === SELLALL){    
            let CBAS_Payload = { username: "MuteBard", species : data}
            Route.mutateCatchSellAllSpecies(CBAS_Payload, this.updateData)
        }
    }

    render() {
        return( 
            <div className="CatchContainer"> 
                {this.state.species === BUG ? <BugHeader/> : <FishHeader/>}
                <Row className="RadioRow">
                    <Col span={5} offset={2}>
                        <Card>
                            <Radio.Group size="large" onChange={this.speciesSelect} value={this.state.species}>
                                <Radio.Button value={BUG}>Catch Bugs</Radio.Button>
                                <Radio.Button value={FISH}>Catch Fishes</Radio.Button>
                            </Radio.Group>
                        </Card>
                    </Col>
                    <Col span={5} offset={7}>
                        {this.state.img === ""
                        ?
                        this.state.species === BUG  ? <DisplayBug traits={this.state}/> : <DisplayFish traits={this.state}/>
                        :
                        <img src={this.state.img}/>
                        }
                    </Col>
                </Row>
                {this.state.species === BUG ? <BugBody data={this.state} handleClick={this.handleChildClick}/>  : <FishBody data={this.state} handleClick={this.handleChildClick}/>}
                <LightCog/>
                
            </div> 
        )
    }
}
