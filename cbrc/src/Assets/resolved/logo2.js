import React from 'react';
import SVG from 'react-inlinesvg';
import logo2Raw from '../raw/logo2.svg'
import logo2StoppedRaw from '../raw/logo2Stopped.svg'
import './css/resolved.css'

export default function Logo2({stopped}){
  return(
    <span>
      {stopped ? <SVG className="profilelogo" src={logo2StoppedRaw}/> :<SVG className="profilelogo" src={logo2Raw}/>}
    </span>
  )
}
