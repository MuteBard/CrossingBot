import React from 'react';
import SVG from 'react-inlinesvg';
import twitchRaw from '../raw/twitch.svg'
import './css/resolved.css'

export default function TwitchLogo(){
  return(
    <span>
      <SVG className="twitchIcon" src={twitchRaw}/>
    </span>
  )
}
