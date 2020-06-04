import React from 'react';
import SVG from 'react-inlinesvg';
import MagnifyingGlassRaw from '../raw/magnifyingGlass.svg'
import './css/resolved.css'

export default function MagnifyingGlass(){
  return(
    <span>
      <SVG className="magnifyingGlass" src={MagnifyingGlassRaw}/>
    </span>
  )
}
