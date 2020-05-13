import React from 'react';
import SVG from 'react-inlinesvg';
import { Popover, Button } from 'antd';
import fishIcon from '../raw/fishIcon.svg'
import './css/resolved.css'

const SELL = "sell"

export default function FishIcon({traits, handlePocketClick}){

  let { name, bells, rarity, availability, small, hover} = traits
  console.log(handlePocketClick)

  const content = (
    hover ?
    <div>
      <p>Bells : {bells}</p>
      <p>Rarity : {rarity}</p>
      <p>Availability: {availability.map(month => `${month}, `)}</p>
      <Button type="primary" block onClick={() => handlePocketClick(SELL, name)}>
        Sell for {bells} bells
      </Button>
    </div>
    :
    null
  )
  
  return(
    <span>
      {hover ? 
      <Popover content={content} title={name}>
        <SVG className={small ? "fishIconSmall fade-in" : "fishIcon fade-in" } src={fishIcon}/>
      </Popover>
      :
      <SVG className={small ? "fishIconSmall fade-in" : "fishIcon fade-in" } src={fishIcon}/>
      }
    </span>
  )
}
