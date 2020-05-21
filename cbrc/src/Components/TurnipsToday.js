import React, {Component} from 'react';
import { Line } from 'react-chartjs-2';

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
        pointRadius: 5,
        pointHitRadius: 10,
        data: parameters.now.prices
      }
  ]
}};

export default class MarketToday extends Component {
    render() {
        let {turnipData, date, colors} = this.props
        let parameters = {
            title : `TURNIP PRICES FOR ${date.month}/${date.day}/${date.year}`,
            times :  turnipData.map(data => `${data.hour}:${data.minute < 10 ? "0"+data.minute : data.minute}`).reverse(),
            now : {
                name : "Prices",
                prices : turnipData.map(data => data.price).reverse(),
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


