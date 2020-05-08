import React from 'react';
import SVG from 'react-inlinesvg';
import logoRaw from '../raw/logo.svg'
import './resolved.css'

export default function Logo(){
  return(
    <span>
      <SVG className="logo" src={logoRaw}/>
    </span>
  )
}
