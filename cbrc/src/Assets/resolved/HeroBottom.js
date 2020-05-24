import React from 'react';
import SVG from 'react-inlinesvg';
import heroTop from '../raw/HeroBottom.svg'
import './css/resolved.css'

export default function HeroBottom(){
  return(
    <span>
      <SVG src={heroTop}/>
    </span>
  )
}
