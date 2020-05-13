import React from 'react';
import SVG from 'react-inlinesvg';
import { Popover } from 'antd';
import bugIcon from '../raw/bugIcon.svg'
import './css/resolved.css'


export default function BugIcon({traits}){
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
        <SVG className={small ? "bugIconSmall fade-in" : "bugIcon fade-in" } src={bugIcon}/>
      </Popover>
      :
      <SVG className={small ? "bugIconSmall fade-in" : "bugIcon fade-in" } src={bugIcon}/>
      }
    </span>
  )
}