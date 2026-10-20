import React from 'react';
import {pathForRoute} from './appRoutes.js';

export default function RouteLink({to,navigate,children,onClick,...rest}){
  function open(event){
    onClick?.(event);
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || rest.target==='_blank')return;
    event.preventDefault();
    navigate(to);
  }
  return <a {...rest} href={pathForRoute(to)} onClick={open}>{children}</a>;
}
