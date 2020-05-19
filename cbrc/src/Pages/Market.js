import React, {Component} from 'react';
import { Row, Col, Card, Tabs, Statistic, Input, Select, Button, Table, Tag } from 'antd';

import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import "./css/pages.css"
import Turnip from '../Assets/resolved/turnip'
import TurnipsToday from '../Components/TurnipsToday'
import LightCog from '../Assets/resolved/backgroundcogLight'

const { TabPane } = Tabs; 
const { Option } = Select;

export default class Market extends Component {
    state = {
        loadings: [],
      };

    enterLoading(index){
        const newLoadings = [...this.state.loadings];
        newLoadings[index] = true;
        this.setState({
            loadings: newLoadings,
        });
        setTimeout(() => {
            newLoadings[index] = false;
            this.setState({ loadings: newLoadings });
        }, 6000);
    };


    generateTableColumns(){
        return [
            {
                title: 'Business',
                key: 'business',
                dataIndex: 'business',
                render: business => ( 
                    <Tag color={business === "buy" ? "#4AE3B5" : "#2a5d67" } key={business}>
                        {business.toUpperCase()}
                    </Tag>
                ),
            },
            {
                title: 'Market Price',
                dataIndex: 'marketprice',
                key: 'marketprice',
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
            },
            {
                title: 'Bells',
                dataIndex: 'bells',
                key: 'bells',
            },
            {
                title: 'Growth (Bells)',
                dataIndex: 'growthbells',
                key: 'growthbells',
            },
            {
                title: 'Growth (%)',
                dataIndex: 'growthpercent',
                key: 'growthpercent',
            },
        ]
    }
     
    generateTableData(){
        return [
            {
              key: '1',
              business: "buy",
              marketprice: 0,
              quantity: 0,
              bells: 0,
              growthbells: 0,
              growthpercent: 0,  
            },
            {
              key: '2',
              business: "sell",
              marketprice: 0,
              quantity: 0,
              bells: 0,
              growthbells: 0,
              growthpercent: 0  
            },
            {
              key: '3',
              business: "buy",
              marketprice: 0,
              quantity: 0,
              bells: 0,
              growthbells: 0,
              growthpercent: 0
            },
        ];
    }


    statistic(base, current, unit, arrow) {

        return (
            current > base ?
            <Statistic
                value={current}
                precision={0}
                valueStyle={{ color: '#4AE3B5' }}
                prefix={ arrow ? <ArrowUpOutlined/> : undefined }
                suffix={ unit !== undefined ? unit : undefined }
            /> 
            :
            <Statistic
                value={current}
                precision={0}
                valueStyle={{ color: '#E34A78' }}
                prefix={ arrow ? <ArrowDownOutlined/> : undefined }
                suffix={ unit !== undefined ? unit : undefined}
             /> 
        )
    }

    getChartTabData(key) {
        console.log(key);
    }

    render() {
        const { loadings } = this.state;
        return ( 
            <div className="MarketContainer fade-in">
                <Row className="MarketRow">
                    <Col className="TurnipsCol" span={4} offset={2}>
                        <Turnip/>
                        <Card className="card" style={{ width: 350 }}>
                            <Input.Group compact className="inputGroup">
                                <Select defaultValue="Buy">
                                    <Option value="Buy">Buy</Option>
                                    <Option value="Sell">Sell</Option>
                                </Select>
                                <Input defaultValue="0" style={{ width: 100 }} />
                                <div className="TurnipsText">
                                    <strong>Turnips</strong>
                                </div>
                                <div>
                                    <Button type="primary" loading={loadings[0]} onClick={() => this.enterLoading(0)}>
                                        confirm
                                    </Button>
                                </div>
                            </Input.Group>
                        </Card>
                        <Card className="card" style={{ width: 350 }}>
                            <div className="stats2">
                                <strong>Bells Earned</strong>
                                <div>{this.statistic(0, 23232, "bells", false)}</div>
                            </div>
                        </Card>
                        <Card className="card" style={{ width: 350 }}>
                            <div className="stats2">
                                <div><strong>Turnip Prices</strong></div> 
                                {this.statistic(300, 350, "bells", false)}
                            </div>
                            <div className="stats1">
                                <div>Opening Price</div> 
                                <div>322</div>
                            </div>
                            <div className="stats1">
                                <div>Today's High</div>
                                <div>400</div>
                            </div>
                            <div className="stats1">
                                <div>Today's Low</div>
                                <div>300</div>
                            </div>
                        </Card>
                        <Card className="card" style={{ width: 350 }}>
                            <div className="stats2">
                                <div><strong>Turnips Held</strong></div>
                                <div>{this.statistic(0, 1, "turnip(s)", false)}</div>
                            </div>
                            <div className="stats2">
                                <div><strong>Today's Return</strong></div>
                                <div>{this.statistic(0, 32, "bells", true)}</div>
                            </div>
                            <div className="stats2">
                                <div><strong>Overall Return</strong></div>
                                <div>{this.statistic(0, 10, "%", true)}</div>
                            </div>
                        </Card>
                    </Col>
                    <Col className="TitleCol" span={12} offset={4}>
                        <div className="title"><strong>STALK MARKET</strong></div>
                        <Tabs defaultActiveKey="1" onChange={this.getChartTabData}>
                            <TabPane tab="Today" key="1">
                                <TurnipsToday/>
                            </TabPane>
                            <TabPane tab="Past Week" key="2">
                                2
                            </TabPane>
                            <TabPane tab="Past Month" key="3">
                                3
                            </TabPane>
                            <TabPane tab="Past Year" key="4">
                                4
                            </TabPane>
                            <TabPane tab="All Time" key="5">
                                5
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                <Row>
                    <Col className="TransactionCol" span={21} offset={1}>
                        <div className="title"><strong>TRANSACTIONS</strong></div>
                        <Table dataSource={this.generateTableData()} columns={this.generateTableColumns()}/>
                    </Col>
                </Row>
                <LightCog/>
            </div>
        )
    }
}





