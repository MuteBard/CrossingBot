import React from 'react';
import SVG from 'react-inlinesvg';
import turnipRaw from '../raw/turnip.svg'
import './css/resolved.css'

export default function Turnip({profile}){
  return(
    <span>
      {profile == true ? <SVG className="profileturnip" src={turnipRaw}/> : <SVG className="turnip" src={turnipRaw}/>}
    </span>
  )
}
