import React from 'react';
import SVG from 'react-inlinesvg';
import logoRaw from '../raw/logo.svg'
import './css/resolved.css'

export default function Logo({tiny}){
  return(
    <span>
      {tiny === true 
        ? 
          <SVG className="tinylogo" src={logoRaw}/>
        :
          <SVG className="logo" src={logoRaw}/>
      }
    </span>
  )
}
