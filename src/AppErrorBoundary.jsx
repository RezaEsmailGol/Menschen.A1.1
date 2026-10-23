import React from 'react';
import { AlertTriangle, Home, RotateCcw, Copy } from 'lucide-react';

/**
 * Browser-side safety net: catch React render errors and show recoverable UI
 * instead of leaving users with a white screen. Never erase learning storage.
 */
export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError:false, message:'' };
  }
  static getDerivedStateFromError(error) {
    return { hasError:true, message: String(error?.message || 'Unknown error').slice(0,260) };
  }
  componentDidCatch(error, info) {
    console.error('DEUTSCH_TRAINER_RENDER_FAILURE', error, info);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <div dir="rtl" role="alert" style={{
      minHeight:'100dvh',background:'#f3f4fa',fontFamily:'Vazirmatn,Tahoma,sans-serif',
      display:'flex',alignItems:'center',justifyContent:'center',padding:18,color:'#25284c'
    }}>
      <section style={{background:'white',border:'1px solid #e5e5f2',borderRadius:22,padding:24,maxWidth:520,width:'100%',
        boxShadow:'0 14px 40px #38396818',textAlign:'center'}}>
        <AlertTriangle size={34} color="#bf7131"/>
        <h1 style={{fontSize:22,margin:'12px 0'}}>اپلیکیشن با خطا روبه‌رو شد</h1>
        <p style={{fontSize:13,lineHeight:2,color:'#68718a'}}>
          اطلاعات یادگیری و فلش‌کارت‌ها پاک نشده‌اند. می‌توانی صفحه را دوباره بارگذاری کنی یا به خانه برگردی.
        </p>
        <div dir="ltr" style={{background:'#f5f6fb',padding:12,borderRadius:10,
          color:'#6a6d83',fontFamily:'monospace',fontSize:11,overflowWrap:'anywhere',textAlign:'left'}}>
          {this.state.message}
        </div>
        <div style={{display:'flex',gap:9,flexWrap:'wrap',justifyContent:'center',marginTop:20}}>
          <button onClick={()=>window.location.reload()}
            style={{border:0,borderRadius:11,background:'#5c56c9',color:'white',padding:'12px 17px',
              fontFamily:'inherit',display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}>
            <RotateCcw size={17}/> تلاش دوباره
          </button>
          <button onClick={()=>{window.location.assign('/');}}
            style={{border:0,borderRadius:11,background:'#eeedff',color:'#4a47a1',padding:'12px 17px',
              fontFamily:'inherit',display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}>
            <Home size={17}/> صفحه اصلی
          </button>
        </div>
        <small style={{color:'#99a0b3',display:'block',marginTop:14,fontSize:11}}>
          اگر دوباره رخ داد، از این پیام عکس بگیر و بفرست.
        </small>
      </section>
    </div>;
  }
}
