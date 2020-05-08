import React from 'react';
import SVG from 'react-inlinesvg';
import heroRaw from '../raw/hero.svg'
import './css/resolved.css'

export default function Hero(){
  return(
    <span>
      <SVG className="hero" src={heroRaw}/>
    </span>
  )
}
