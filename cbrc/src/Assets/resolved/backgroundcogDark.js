import React from 'react';
import SVG from 'react-inlinesvg';
import cog from '../raw/backgroundcogDark.svg'
import './css/resolved.css'

export default function DarkCog(){
  return(
    <div className="CogContainer">
      <SVG className="backgroundcogLight" src={cog}/>
    </div>
  )
}