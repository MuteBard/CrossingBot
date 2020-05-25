import React from 'react';
import SVG from 'react-inlinesvg';
import heroTop from '../raw/HeroTop.svg'
import './css/resolved.css'

export default function HeroTop(){
  return(
    <span>
      <SVG className="heroBottom" src={heroTop}/>
    </span>
  )
}