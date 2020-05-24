import React, {Component} from 'react';
import { Line } from 'react-chartjs-2';
import { month } from '../Cron/Timing';
import Route from '../Actions/Route'


let data = (parameters) =>{ return {
  labels: parameters.times,
  datasets: [
    {
        label: parameters.now.name,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor:  parameters.now.primary,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: parameters.now.tertiary,
        pointBackgroundColor: parameters.now.primary,
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: parameters.now.secondary,
        pointHoverBorderColor: parameters.now.tertiary,
        pointHoverBorderWidth: 2,
        pointRadius: 2,
        pointHitRadius: 10,
        data: parameters.now.prices
      }
  ]
}};

export default class MarketToday extends Component {
    state = {
        turnipsHistory : [],
        latestDate : "",
        earliestDate: "",
        firstRecordedPrice : 0,
        lastRecordedPrice :0

    }

    componentDidMount() {
        this.nDaysRequest(this.props.days)
    }
    
    nDaysRequest = (days) => {
        let marketForNDays = (data) => {
            // console.log(data.getNDayRecords.map(mr => mr))
            let last = data.getNDayRecords.length - 1 
            let latestDate = `${data.getNDayRecords[0].month}/${data.getNDayRecords[0].day}/${data.getNDayRecords[0].year}`
            let earliestDate = `${data.getNDayRecords[last].month}/${data.getNDayRecords[last].day}/${data.getNDayRecords[last].year}`

            let turnipsHistory = data.getNDayRecords.map(mr => {
                    return mr.turnipHistory.map((turnip, idx, turnipHistory) => {
                        return {
                            price : turnip.price,
                            minute : turnip.minute,
                            hour : turnip.hour,
                            day : mr.day,
                            month : mr.month,
                            year: mr.year,
                        } 
                    }) 
                }
            ).map(list => {
                //remove the last element since it is a repeat upon opening price
                return list.filter((turnip, idx) => idx < list.length - 1)
            }).reduce((finalList, list) => finalList.concat(list))

            this.setState({
                turnipsHistory,
                latestDate,
                earliestDate,
                firstRecordedPrice : turnipsHistory.slice().reverse()[0],
                lastRecordedPrice : turnipsHistory[0].price
            })
        }

        let CBAS_Payload = { days }
        Route.queryMarketChartDataForNDays(CBAS_Payload, marketForNDays)
    }

    render() {


        let colors = ["#4AE3B5","#2A5D67"] 
        // let colors = this.state.firstRecordedPrice >  this.state.lastRecordedPrice ?  ["#E34A78","#A41943"] : ["#4AE3B5","#2A5D67"] 

        let parameters = {
            title : `TURNIP PRICES FOR ${this.state.earliestDate} - ${this.state.latestDate}`,
            times :  this.state.turnipsHistory.map(data => `${data.hour}:${data.minute < 10 ? "0"+data.minute : data.minute} ${data.month}/${data.day}`).reverse(),
            now : {
                name : "Prices",
                prices : this.state.turnipsHistory.map(data => data.price).reverse(),
                primary : colors[0],
                secondary : colors[1],
                tertiary : "#171332"
            }
        }
        return ( 
            <div>
                <div className="chartTitle" style={{fontSize:"30px", fontFamily:"Ubuntu", textAlign:"center"}}><strong>{parameters.title}</strong></div>
                <Line data={data(parameters)} />
            </div>
        )
    }
}


