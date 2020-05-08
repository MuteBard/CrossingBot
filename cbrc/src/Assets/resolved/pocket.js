import React from 'react';
import SVG from 'react-inlinesvg';
import pocketRaw from '../raw/pocket.svg'
import './css/resolved.css'

export default function Pocket(){
  return(
    <span>
      <SVG className="pocket" src={pocketRaw}/>
    </span>
  )
}
