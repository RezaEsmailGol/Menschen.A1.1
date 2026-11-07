import {mkdirSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateSync} from 'node:zlib';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const PNG_SIGNATURE=Buffer.from([137,80,78,71,13,10,26,10]);
const CRC_TABLE=new Uint32Array(256);
for(let n=0;n<256;n++){
  let c=n;
  for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);
  CRC_TABLE[n]=c>>>0;
}
function pngChunk(type,data){
  const kind=Buffer.from(type,'ascii');
  const out=Buffer.alloc(12+data.length);
  out.writeUInt32BE(data.length,0);
  kind.copy(out,4);
  data.copy(out,8);
  let crc=0xffffffff;
  for(let i=4;i<out.length-4;i++)crc=CRC_TABLE[(crc^out[i])&255]^(crc>>>8);
  out.writeUInt32BE((crc^0xffffffff)>>>0,out.length-4);
  return out;
}
function roundedInside(x,y,left,top,width,height,radius){
  if(x<left||y<top||x>=left+width||y>=top+height)return false;
  const cx=Math.max(left+radius,Math.min(x,left+width-radius));
  const cy=Math.max(top+radius,Math.min(y,top+height-radius));
  const dx=x-cx,dy=y-cy;
  return dx*dx+dy*dy<=radius*radius;
}

// Generated at build time so the binary icons never require separate GitHub upload.
// Identical, locally generated assets are shipped as static files by Vite/Vercel.
export function createPwaIcon(size,{maskable=false}={}){
  if(!Number.isInteger(size)||size<64||size>1024)throw new RangeError('Invalid PWA icon size');
  const side=maskable?0.56:0.72;
  const width=Math.round(size*side),height=Math.round(size*side*0.66);
  const left=Math.round((size-width)/2),top=Math.round((size-height)/2);
  const radius=Math.max(8,Math.round(size*(maskable?0.045:0.062)));
  const rowBytes=size*4+1;
  const raw=Buffer.alloc(rowBytes*size);
  for(let y=0;y<size;y++){
    const row=y*rowBytes;
    raw[row]=0;
    for(let x=0;x<size;x++){
      const at=row+1+x*4;
      let rgb=[29,30,66];
      if(roundedInside(x,y,left,top,width,height,radius)){
        const band=Math.min(2,Math.floor((y-top)*3/height));
        rgb=band===0?[22,22,22]:band===1?[220,0,0]:[255,206,0];
      }
      raw[at]=rgb[0];raw[at+1]=rgb[1];raw[at+2]=rgb[2];raw[at+3]=255;
    }
  }
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);
  ihdr[8]=8;ihdr[9]=6; // RGBA, 8 bits/channel
  return Buffer.concat([
    PNG_SIGNATURE,pngChunk('IHDR',ihdr),
    pngChunk('IDAT',deflateSync(raw,{level:9})),
    pngChunk('IEND',Buffer.alloc(0))
  ]);
}
export function generatePwaIcons(){
  const folder=join(ROOT,'public','icons');
  mkdirSync(folder,{recursive:true});
  for(const [name,size,maskable] of [
    ['icon-192.png',192,false],
    ['icon-512.png',512,false],
    ['icon-maskable-512.png',512,true],
    ['apple-touch-icon.png',180,false]
  ])writeFileSync(join(folder,name),createPwaIcon(size,{maskable}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  generatePwaIcons();
  process.stdout.write('Generated installable PWA icons (192/512/maskable/apple).\n');
}
