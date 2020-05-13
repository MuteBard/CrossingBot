import React from 'react';
import SVG from 'react-inlinesvg';
import { Popover } from 'antd';

import fishIcon from '../raw/fishIcon.svg'
import './css/resolved.css'

export default function FishIcon({traits}){

  let { name, bells, rarity, availability, small, hover} = traits

  const content = (
    hover ?
    <div>
      <p>Bells : {bells}</p>
      <p>Rarity : {rarity}</p>
      <p>Availability: {availability.map(month => `${month}, `)}</p>
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
