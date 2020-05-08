import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom"

import NamedLogo from '../Assets/resolved/namedLogo'
import Bells from '../Assets/resolved/bells'
import BugNet from '../Assets/resolved/bugnet'
import FishRod from '../Assets/resolved/fishrod'
import Turnip from '../Assets/resolved/turnip'
import Hero from '../Assets/resolved/hero'
import Logo from '../Assets/resolved/logo'



import SVG from 'react-inlinesvg';


function Header(){

  return(
    <React.Fragment>
      <NamedLogo/>
    </React.Fragment>
  )
}

export default Header

