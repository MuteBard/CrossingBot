import React from 'react';
import SVG from 'react-inlinesvg';
import namedLogoRaw from '../raw/namedLogo.svg'
import './css/resolved.css'

export default function NamedLogo(){
  return(
    <span className="namedLogoContainer">
      <SVG className="namedLogo" src={namedLogoRaw}/>
    </span>
  )
}
