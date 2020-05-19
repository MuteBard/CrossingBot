import React from 'react';
import SVG from 'react-inlinesvg';
import fishRodRaw from '../raw/fishrod.svg'
import './css/resolved.css'

export default function FishRod({profile}){
  return(
    <span>
      {profile === true ? <SVG className="profilefishrod" src={fishRodRaw}/> : <SVG className="fishrod" src={fishRodRaw}/>}   
    </span>
  )
}
