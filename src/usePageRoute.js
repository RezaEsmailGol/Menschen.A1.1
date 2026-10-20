import {useCallback,useEffect,useState} from 'react';
import {normalizeRoute,pathForRoute,routeFromPath} from './appRoutes.js';

export function usePageRoute() {
  const [route,setRoute]=useState(()=>routeFromPath(window.location.pathname));
  useEffect(()=>{
    const onPop=()=>setRoute(routeFromPath(window.location.pathname));
    window.addEventListener('popstate',onPop);
    return()=>window.removeEventListener('popstate',onPop);
  },[]);
  const navigate=useCallback((destination,{replace=false}={})=>{
    const next=normalizeRoute(destination);
    const path=pathForRoute(next);
    if(window.location.pathname!==path){
      if(replace)window.history.replaceState({},'',path);
      else window.history.pushState({},'',path);
    }
    setRoute(next);
  },[]);
  return [route,navigate];
}
