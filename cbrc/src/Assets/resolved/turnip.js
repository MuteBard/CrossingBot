import React from 'react';
import SVG from 'react-inlinesvg';
import turnipRaw from '../raw/turnip.svg'
import './resolved.css'

export default function Turnip(){
  return(
    <span>
      <SVG className="turnip" src={turnipRaw}/>
    </span>
  )
}
