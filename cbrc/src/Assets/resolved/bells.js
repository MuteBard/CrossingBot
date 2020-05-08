import React from 'react';
import SVG from 'react-inlinesvg';
import bellsRaw from '../raw/bells.svg'
import './resolved.css'

export default function Bells(){
  return(
    <span>
      <SVG className="bells" src={bellsRaw}/>
    </span>
  )
}
