import React from 'react'
import {TbError404} from 'react-icons/tb';

export default function NotFound() {
  return (
    <div className="not-found">
      <TbError404 style={{'fontSize':'4rem'}}/> 
      <h1 style={{'color': 'red', 'marginLeft':'0.5rem', 'fontSize':'2rem', 'fontWeight':'bold'}}>
        Not Found
        </h1>
    </div>
  );
}
