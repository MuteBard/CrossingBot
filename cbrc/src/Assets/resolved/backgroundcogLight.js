import React from 'react';
import SVG from 'react-inlinesvg';
import cog from '../raw/backgroundcogLight.svg'
import './css/resolved.css'

export default function LightCog(){
  return(
    <div className="CogContainer">
      <SVG className="backgroundcogLight" src={cog}/>
    </div>
  )
}
