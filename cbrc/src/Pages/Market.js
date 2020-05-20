import React, {Component} from 'react';
import { Row, Col, Card, Tabs, Statistic, Input, Select, Button, Table, Tag, Modal, InputNumber } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import Route from '../Actions/Route'
import "./css/pages.css"
import Turnip from '../Assets/resolved/turnip'
import TurnipsToday from '../Components/TurnipsToday'
import LightCog from '../Assets/resolved/backgroundcogLight'
const CronJob = require('cron').CronJob

const { TabPane } = Tabs; 
const { Option } = Select;

export default class Market extends Component {
    state = {
        loadings: [],
        visible: false,
        bells: 0,
        liveTurnips : {
          quantity : 0,
          marketPrice: 0,
          netGainLossAsBells: 0,
          netGainLossAsPercentage : 0,
          totalBells : 0,
          avatar : ""
        },
        turnipTransactionHistory : [],
        latestTurnip : {
            price : 0,
            hour : 0,
            minute : 0
        },
        turnipHistory : [],
        todayHigh : 0,
        todayLow : 0,
        opening: 0,
        date : {
            day : 0,
            month : 0,
            year : 0,
        },
        select : {
            business : "",
            quantity : 1,
        },
        verified : {
            status : "",
            marketPrice : -1,
            totalBells : -1
        }

    };
    componentDidMount(){
       this.updateData()
       this.cronDataUpdate()
    }

    cronDataUpdate = () => { 
        let job = new CronJob('*/5 * * * * ', () => {
            this.updateData()
          }, null, true, 'America/Los_Angeles');
        job.start();
    }

    updateData = () => {
        let setMarketUserData = (data) => {
            this.setState({
                bells : data.getUser.bells,
                liveTurnips : {
                    quantity : data.getUser.liveTurnips.quantity,
                    marketPrice :  data.getUser.liveTurnips.marketPrice,
                    netGainLossAsBells : data.getUser.liveTurnips.netGainLossAsBells,
                    netGainLossAsPercentage :  data.getUser.liveTurnips.netGainLossAsPercentage,
                    totalBells : data.getUser.liveTurnips.totalBells
                },
                turnipTransactionHistory : data.getUser.turnipTransactionHistory
            })
        }
        let setMarketChartData = (data) => {
            this.setState({
                latestTurnip : {
                    price : data.getDayRecords.latestTurnip.price,
                    hour : data.getDayRecords.latestTurnip.hour,
                    minute : data.getDayRecords.latestTurnip.minute
                },
                turnipHistory : data.getDayRecords.turnipHistory,
                todayHigh : data.getDayRecords.todayHigh,
                todayLow : data.getDayRecords.todayLow,
                opening : data.getDayRecords.turnipHistory[data.getDayRecords.turnipHistory.length - 1].price,
                date : {
                    day: data.getDayRecords.day,
                    month: data.getDayRecords.month,
                    year: data.getDayRecords.year,
                }

            })
        }
        let CBAS_Payload = { username: "MuteBard" }
        Route.queryMarketUserData(CBAS_Payload, setMarketUserData)
        Route.queryMarketChartData(CBAS_Payload, setMarketChartData)
    }

    validateTransaction = () => {
        let setMarketUserVerificationData = (data) => {
            this.setState({
                verified : {
                    status : data.validatePendingTransaction.status,
                    marketPrice : data.validatePendingTransaction.marketPrice,
                    totalBells : data.validatePendingTransaction.totalBells
                }
            })
        }
        let CBAS_Payload = {username : "MuteBard", business: this.state.select.business, quantity: this.state.select.quantity}
        Route.queryMarketVerificationData(CBAS_Payload, setMarketUserVerificationData)
    }

    acknowledgeTransaction = () => {
        let updateUserTurnipData = (data) => {
            console.log(data.acknowledgeTransaction)
            this.setState({
                verified : {
                    status : "",
                    marketPrice : 0,
                    totalBells : 0
                }
            })
        }
        let CBAS_Payload = {username : "MuteBard", business: this.state.select.business, quantity: this.state.select.quantity, marketPrice : this.state.verified.marketPrice, totalBells : this.state.verified.totalBells}
        Route.mutateMarketAcknowledgementData(CBAS_Payload, updateUserTurnipData)
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleTurnipBusiness = value => {
        this.setState({
            select : {
                business : value.toLowerCase(),
                quantity : this.state.select.quantity
            }
        })
    }

    handleTurnipQuantity = value => {
        this.setState({
            select : {
                business : this.state.select.business,
                quantity : value
            }
        })
    }

    handleOk = e => {
        this.setState({
            visible: false,
        });
        this.updateData()

        if(this.state.verified.status != "Authorized")
        setTimeout(() => {
            if(this.state.verified.marketPrice == this.state.latestTurnip.price ){
                this.acknowledgeTransaction()
            }else{
                this.showModal()
            }
        }, 3000); 
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
        setTimeout(() => {
            this.setState({
                verified : {
                    status : "",
                    marketPrice : 0,
                    totalBells : 0
                }
            });
        }, 1000);
        
    };

    enterLoading(index){
        this.validateTransaction()
        const newLoadings = [...this.state.loadings];
        newLoadings[index] = true;
        this.setState({
            loadings: newLoadings,
        });
        setTimeout(() => {
            newLoadings[index] = false;
            this.setState({ loadings: newLoadings });
        }, 6000);
        setTimeout(() => {
            this.showModal()
        }, 3000);
        
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
       return this.state.turnipTransactionHistory.map(turnipTransaction => {
            return {
                key: '1',
                business : turnipTransaction.business,
                marketprice : turnipTransaction.marketPrice,
                quantity : turnipTransaction.quantity,
                bells : turnipTransaction.totalBells,
                growthbells : turnipTransaction.netGainLossAsBells,
                growthpercent : turnipTransaction.netGainLossAsPercentage
            }
        })
    }


    statistic(base, current, unit, arrow) {

        return (
            current >= base ?
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
                    <Col className="TurnipsCol" span={5} offset={2}>
                        <Turnip/>
                        <Card style={{ width: 450 }}>
                            <Input.Group compact className="inputGroup">
                                <Select style={{ paddingRight: "10px" }} defaultValue="Business" onChange={this.handleTurnipBusiness}>
                                    <Option value="Buy">Buy</Option>
                                    <Option value="Sell">Sell</Option>
                                </Select>
                                <InputNumber min={1} max={99999999} defaultValue={0} style={{ width: 100 }} onChange={this.handleTurnipQuantity}/>
                                <div style={{ padding: "5px 10px 0px 10px" }}>
                                    <strong>Turnips</strong>
                                </div>
                                <div>
                                {this.state.select.business === "" ? 
                                    <Button type="primary" disabled loading={loadings[0]} onClick={() =>this.enterLoading(0)}>
                                        Confirm
                                    </Button>
                                : 
                                    <Button type="primary" loading={loadings[0]} onClick={() =>this.enterLoading(0)}>
                                        Confirm
                                    </Button>
                                }
                                </div>
                            </Input.Group>
                        </Card>
                        <Card className="card" style={{ width: 450 }}>
                            <div className="stats2">
                                <strong>Bells in Wallet</strong>
                                <div>{this.statistic(0, this.state.bells, "bells", false)}</div>
                            </div>
                        </Card>
                        <Card className="card" style={{ width: 450 }}>
                            <div className="stats2">
                                <div><strong>Market Price</strong></div> 
                                {this.statistic(this.state.opening, this.state.latestTurnip.price,"bells", false)}
                            </div>
                            <div className="stats2">
                                <div><strong>Opening Price</strong></div> 
                                <div>{this.statistic(0, this.state.opening,"bells", false)}</div>
                            </div>
                            <div className="stats2">
                                <div><strong>Today's High</strong></div>
                                <div>{this.statistic(this.state.opening, this.state.todayHigh,"bells", false)}</div>
                            </div>
                            <div className="stats2">
                                <div><strong>Today's Low</strong></div>
                                <div>{this.statistic(this.state.opening, this.state.todayLow,"bells", false)}</div>
                            </div>
                        </Card>
                        {
                            this.state.liveTurnips.quantity !== 0 ? 
                            <Card className="card" style={{ width: 450 }}>
                                <div className="stats2">
                                    <div><strong>Turnips Held</strong></div>
                                    <div>{this.statistic(0, this.state.liveTurnips.quantity, "turnip(s)", false)}</div>
                                </div>
                                <div className="stats2">
                                    <strong>Avg Purchase Price</strong>
                                    <div>{this.statistic(0, this.state.liveTurnips.marketPrice, "bells", false)}</div>
                                </div>
                                <div className="stats2">
                                    <strong>Liquidated Sum</strong>
                                    <div>{this.statistic(this.state.liveTurnips.marketPrice * this.state.liveTurnips.quantity, this.state.latestTurnip.price * this.state.liveTurnips.quantity, "bells", false)}</div>
                                </div>
                                <div className="stats2">
                                    <div><strong>Overall Return (bells)</strong></div>
                                    <div>{this.statistic(0, this.state.liveTurnips.netGainLossAsBells, "bells", this.state.liveTurnips.netGainLossAsBells !== 0 ? true : false)}</div>
                                </div>
                                <div className="stats2">
                                    <div><strong>Overall Return (%)</strong></div>
                                    <div>{this.statistic(0, this.state.liveTurnips.netGainLossAsPercentage, "%", this.state.liveTurnips.netGainLossAsPercentage !== 0 ? true : false)}</div>
                                </div>
                            </Card>
                            :
                            null
                        }
                    </Col>
                    <Col className="TitleCol" span={12} offset={3}>
                        <div className="title"><strong>STALK MARKET</strong></div>
                        <Tabs defaultActiveKey="1" onChange={this.getChartTabData}>
                            <TabPane tab="Today" key="1">
                                <TurnipsToday turnipData={this.state.turnipHistory} date={this.state.date} colors={this.state.latestTurnip.price <  this.state.opening ?  ["#E34A78","#A41943"] : ["#4AE3B5","#2A5D67"] }/>
                            </TabPane>
                            {/* <TabPane tab="Past Week" key="2">
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
                            </TabPane> */}
                        </Tabs>
                    </Col>
                </Row>
                <Row>
                    <Col className="TransactionCol" span={21} offset={1}>
                        <div className="title"><strong>TRANSACTION HISTORY</strong></div>
                        <Table dataSource={this.generateTableData()} columns={this.generateTableColumns()}/>
                    </Col>
                </Row>
                { this.state.verified.marketPrice == this.state.latestTurnip.price ?
                    <Modal
                        title="Turnip Transaction"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" onClick={this.handleCancel}>
                              Cancel
                            </Button>,
                            <Button key="submit" type="primary" onClick={this.handleOk}>
                              Confirm
                            </Button>,
                          ]}
                        >   
                        {this.state.verified.status === "Authorized" 
                        ?             
                        <p>                           
                            You are {this.state.verified.status} to {this.state.select.business} {this.state.select.quantity} turnip(s) for a market price of {this.state.verified.marketPrice} bells for a total of {this.state.verified.totalBells} bells. Would you like to confirm this transaction? (Please decide before the next market price update)
                        </p>
                        :
                        <p>                           
                             {this.state.verified.status}
                        </p>
                        }
                    </Modal>
                    :
                    <Modal
                        title="Turnip Transaction"
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onOk={this.handleOk}
                        footer={[
                            <Button key="back" onClick={this.handleCancel}>
                              Cancel
                            </Button>,
                            <Button key="submit" type="primary" disabled onClick={this.handleOk}>
                              Confirm
                            </Button>,
                          ]}
                        > 
                        <p>
                            The prices for turnips has changed. Therefore your turnip transaction has expired. Please submit a new transaction based on the new market price.
                        </p>
                        
                    </Modal>
                }                   
                <LightCog/>
            </div>
            
        )
    }
}





