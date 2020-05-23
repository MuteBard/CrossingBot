import React from 'react';
import SVG from 'react-inlinesvg';
import { Popover, Button } from 'antd';
import bugIcon from '../raw/bugIcon.svg'
import './css/resolved.css'

const BUG = "bug"
const SELL = "sell"

export default function BugIcon({traits, handlePocketClick}){
  let { name, bells, rarity, image, availability, small, hover} = traits
  
  const content = (
    hover ?
    <div>
      <p>Bells : {bells}</p>
      <p>Rarity : {rarity}</p>
      <p>Availability: {availability.map((month, idx, array) => {
          if(idx === array.length - 1)return `${month}`
          else return `${month}, `
        })}
      </p>
      <Button type="primary" block onClick={() => handlePocketClick(SELL, {species: BUG, name})}>
        Sell for {bells} bells
      </Button>
    </div>
    :
    null
  )

  return(
    <span>
      {
        hover 
        ? 
        
        <Popover content={content} title={name}>
          {
            image 
            ? 
            <img className={small ? "bugIconSmall fade-in" : "bugIcon fade-in" } src={image}/>
            :
            <SVG className={small ? "bugIconSmall fade-in" : "bugIcon fade-in" } src={bugIcon}/>
          }  
        </Popover>
      
        :

        <div>
        {
          image 
          ? 
          <img className={small ? "bugIconSmall fade-in" : "bugIcon fade-in" } src={image}/>
          :
          <SVG className={small ? "bugIconSmall fade-in" : "bugIcon fade-in" } src={bugIcon}/>
        } 
        </div>

      }
    </span>
  )
}