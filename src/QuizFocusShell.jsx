import React,{useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import {ArrowRight,X} from 'lucide-react';
import './quizFocus.css';

/**
 * A focused, viewport-sized quiz surface. Its parent workbook may be very tall;
 * a portal avoids scroll/clipping and keeps answers within one phone screen.
 * Overflow is enabled inside the sheet only for zoom, landscape or tiny devices.
 */
export default function QuizFocusShell({title='تمرین آلمانی',onClose,children,variant='choice'}){
 const overlayRef=useRef(null);
 useEffect(()=>{
  const prevFocus=document.activeElement;
  const prevOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  overlayRef.current?.focus();
  const handleEscape=event=>{
   if(event.key==='Escape'&&typeof onClose==='function'){event.preventDefault();onClose();}
  };
  document.addEventListener('keydown',handleEscape);
  return ()=>{
   document.body.style.overflow=prevOverflow;
   document.removeEventListener('keydown',handleEscape);
   if(prevFocus?.isConnected)prevFocus.focus?.({preventScroll:true});
  };
 },[onClose]);
 if(typeof document==='undefined')return children;
 return createPortal(<div className={'qfOverlay qf-'+variant} role="dialog" aria-modal="true"
  aria-label={title} tabIndex={-1} ref={overlayRef} dir="rtl">
  <div className="qfTop">
   <button type="button" className="qfClose" onClick={onClose}
    aria-label="بستن آزمون و برگشت به درس"><X size={19}/><span>بستن</span></button>
   <strong>{title}</strong>
   <span className="qfTopMark" aria-hidden="true">🇩🇪</span>
  </div>
  <div className="qfContent">{children}</div>
 </div>,document.body);
}
