import React from 'react';
import SVG from 'react-inlinesvg';
import keyRaw from '../raw/key.svg'
import './css/resolved.css'

export default function Key(){
  return(
    <span>
      <SVG className="key" src={keyRaw}/>
    </span>
  )
}
