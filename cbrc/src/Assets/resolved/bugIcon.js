import React from 'react';
import SVG from 'react-inlinesvg';
import bugIcon from '../raw/bugIcon.svg'
import './css/resolved.css'

export default function BugIcon(){
  return(
    <span>
      <SVG className="bugIcon" src={bugIcon}/>
    </span>
  )
}