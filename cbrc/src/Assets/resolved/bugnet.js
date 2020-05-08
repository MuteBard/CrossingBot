import React from 'react';
import SVG from 'react-inlinesvg';
import bugNetRaw from '../raw/bugnet.svg'
import './resolved.css'

export default function BugNet(){
  return(
    <span>
      <SVG className="bugnet" src={bugNetRaw}/>
    </span>
  )
}
