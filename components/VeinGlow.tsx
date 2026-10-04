'use client';
import {useEffect,useRef} from 'react';
/** Light-only overlay, derived from the portrait's existing bright neon details. */
export default function VeinGlow(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const context=canvas.getContext('2d');if(!context)return;
  let frame=0,visible=true,disposed=false,ready=false,last=0;
  const texture=document.createElement('canvas');const tx=texture.getContext('2d',{willReadFrequently:true});
  const img=new Image();img.src='/images/hero-hd.webp';
  const resize=()=>{const r=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr)};
  const tick=(time:number)=>{
   frame=0;if(disposed||reduced.matches||!visible||document.hidden||!ready)return;
   if(time-last>32){last=time;const w=canvas.width,h=canvas.height;context.clearRect(0,0,w,h);
    const scale=Math.max(w/texture.width,h/texture.height),dw=texture.width*scale,dh=texture.height*scale;
    const yPosition=matchMedia('(max-width:640px)').matches?.4:.5;
    context.globalCompositeOperation='source-over';context.drawImage(texture,(w-dw)*.6,(h-dh)*yPosition,dw,dh);
    // A soft, slow pulse travels over the existing lines rather than moving the image.
    const progress=(time%9000)/9000,center=h*(1.35-progress*1.7);
    const mask=context.createLinearGradient(0,center-h*.3,w,center+h*.3);
    mask.addColorStop(0,'rgba(255,255,255,0)');mask.addColorStop(.35,'rgba(255,255,255,0)');mask.addColorStop(.5,'rgba(255,255,255,.75)');mask.addColorStop(.65,'rgba(255,255,255,0)');mask.addColorStop(1,'rgba(255,255,255,0)');
    context.globalCompositeOperation='destination-in';context.fillStyle=mask;context.fillRect(0,0,w,h);
   }frame=requestAnimationFrame(tick);
  };
  const sync=()=>{cancelAnimationFrame(frame);frame=0;context.clearRect(0,0,canvas.width,canvas.height);if(!disposed&&!reduced.matches&&visible&&!document.hidden&&ready)frame=requestAnimationFrame(tick)};
  img.onload=()=>{if(disposed||!tx)return;texture.width=img.naturalWidth;texture.height=img.naturalHeight;tx.drawImage(img,0,0);const data=tx.getImageData(0,0,texture.width,texture.height),pixels=data.data,w=texture.width,h=texture.height;
   const luminance=new Float32Array(w*h);for(let i=0;i<w*h;i++){const p=i*4;luminance[i]=(pixels[p]*.2126+pixels[p+1]*.7152+pixels[p+2]*.0722)/255;}
   // High-pass selection excludes broad skin highlights and the dark backdrop.
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,p=i*4,r=pixels[p]/255,g=pixels[p+1]/255,b=pixels[p+2]/255,max=Math.max(r,g,b),min=Math.min(r,g,b),sat=max?(max-min)/max:0;
    const near=(luminance[y*w+Math.max(0,x-5)]+luminance[y*w+Math.min(w-1,x+5)]+luminance[Math.max(0,y-5)*w+x]+luminance[Math.min(h-1,y+5)*w+x])/4;
    const edge=Math.max(0,luminance[i]-near-.025);const strength=Math.min(1,edge*9)*Math.min(1,Math.max(0,sat-.35)*3)*Math.min(1,Math.max(0,max-.35)*2);
    pixels[p+3]=Math.round(strength*255);
   }tx.putImageData(data,0,0);ready=true;resize();sync();
  };
  const ro=new ResizeObserver(resize);ro.observe(canvas);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()});io.observe(canvas);
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  return()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);img.onload=null;};
 },[]);
 return <canvas ref={ref} className="vein-glow" aria-hidden="true"/>;
}
