import React from 'react';
import SVG from 'react-inlinesvg';
import bugNetRaw from '../raw/bugnet.svg'
import './css/resolved.css'

export default function BugNet({profile}){
  return(
    <span>
      {profile == true ? <SVG className="profilebugnet" src={bugNetRaw}/> : <SVG className="bugnet" src={bugNetRaw}/>}
    </span>
  )
}
