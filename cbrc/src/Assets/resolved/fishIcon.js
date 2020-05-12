import React from 'react';
import SVG from 'react-inlinesvg';
import fishIcon from '../raw/fishIcon.svg'
import './css/resolved.css'

export default function FishIcon(){
  return(
    <span>
      <SVG className="fishIcon" src={fishIcon}/>
    </span>
  )
}
