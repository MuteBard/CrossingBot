import React from 'react';
import SVG from 'react-inlinesvg';
import namedLogoRaw from '../raw/namedLogo.svg'
import './resolved.css'

export default function NamedLogo(){
  return(
    <span>
      <SVG className="namedLogo" src={namedLogoRaw}/>
    </span>
  )
}
