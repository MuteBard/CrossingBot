import React from 'react';
import SVG from 'react-inlinesvg';
import fishRodRaw from '../raw/fishrod.svg'
import './css/resolved.css'

export default function FishRod(){
  return(
    <span>
      <SVG className="fishrod" src={fishRodRaw}/>
    </span>
  )
}
