import React, {Component} from 'react';
import { Link } from "react-router-dom"
import { Row, Col, Card } from 'antd'; 
import { Line } from 'react-chartjs-2';

// import "antd/dist/antd.css";


// const { Meta } = Card;


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
        let parameters = {
            title : "Two Day Turnip Price Comparison for 1/1/2020 - 1/2/2020",
            times :  ["12:00 AM","12:15 AM", "12:30 AM", "12:45 AM", "1:00 AM", "1:15 AM", "1:30 AM", "1:45 AM"],
            now : {
                name : "Today",
                prices : [112, 120, 123, 140, 132, 108, 96, 96],
                primary : "#4AE3B5",
                secondary : "#2A5D67",
                tertiary : "#171332"
            }
        }
        return ( 
            <div>
                <h2>{parameters.title}</h2>
                <Line data={data(parameters)} />
            </div>
        )
    }
}


