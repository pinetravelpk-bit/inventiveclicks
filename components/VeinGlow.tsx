'use client';
import {useEffect,useRef} from 'react';
/**
 * Light-only overlay derived from the portrait's own neon streaks.
 * The portrait itself is never altered; bright pulses travel along the existing
 * lines and short random flashes make them flicker like a live current.
 */
export default function VeinGlow(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const context=canvas.getContext('2d');if(!context)return;
  let frame=0,visible=true,disposed=false,ready=false,last=0,nextFlash=1800,flashStart=-1;
  const texture=document.createElement('canvas');const tx=texture.getContext('2d',{willReadFrequently:true});
  const band=document.createElement('canvas');const bx=band.getContext('2d');
  const img=new Image();img.src='/images/hero-hd.webp';
  const resize=()=>{const r=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=band.width=Math.round(r.width*dpr);canvas.height=band.height=Math.round(r.height*dpr)};
  // Flash envelope: a double strike that decays quickly (0..1).
  const flashLevel=(t:number)=>{if(flashStart<0)return 0;const e=t-flashStart;if(e>420){flashStart=-1;return 0}
   if(e<60)return e/60;if(e<120)return 1-(e-60)/60*.7;if(e<170)return .3+(e-120)/50*.7;return Math.max(0,1-(e-170)/250)};
  const tick=(time:number)=>{
   frame=0;if(disposed||reduced.matches||!visible||document.hidden||!ready||!bx)return;
   if(time-last>30){last=time;const w=canvas.width,h=canvas.height;
    if(flashStart<0&&time>nextFlash){flashStart=time;nextFlash=time+2200+Math.random()*3800}
    const flash=flashLevel(time);
    const scale=Math.max(w/texture.width,h/texture.height),dw=texture.width*scale,dh=texture.height*scale;
    const yPosition=matchMedia('(max-width:640px)').matches?.4:.5,dx=(w-dw)*.6,dy=(h-dh)*yPosition;
    // Layer 1: faint constant glow so the lines never go fully dark.
    context.clearRect(0,0,w,h);context.globalCompositeOperation='source-over';context.globalAlpha=.16+flash*.5;context.drawImage(texture,dx,dy,dw,dh);
    // Layer 2: three pulses running along the streak direction (lower-left to upper-right).
    bx.clearRect(0,0,w,h);bx.globalCompositeOperation='source-over';bx.drawImage(texture,dx,dy,dw,dh);
    const g=bx.createLinearGradient(0,h*.92,w,h*.04);
    const pulses:[number,number,number][]=[[(time%5200)/5200,.05,.95],[((time+1900)%7300)/7300,.03,.7],[((time+3600)%4100)/4100,.02,.55]];
    const stops:[number,number][]=[];
    for(const [p,hw,a] of pulses){const c=p*1.3-.15;stops.push([c-hw,0],[c,a],[c+hw,0])}
    stops.sort((m,n)=>m[0]-n[0]);let prev=-1;
    for(const [pos,a] of stops){const clamped=Math.min(1,Math.max(0,pos));if(clamped<=prev)continue;prev=clamped;g.addColorStop(clamped,`rgba(255,255,255,${a})`)}
    bx.globalCompositeOperation='destination-in';bx.fillStyle=g;bx.fillRect(0,0,w,h);
    context.globalCompositeOperation='lighter';context.globalAlpha=1;context.drawImage(band,0,0);
    // Layer 3: the strike itself, a hot white-blue surge over every line.
    if(flash>0){context.globalAlpha=flash*.9;context.drawImage(texture,dx,dy,dw,dh);context.globalAlpha=flash*.35;context.drawImage(texture,dx-1,dy,dw,dh)}
    context.globalAlpha=1;
   }frame=requestAnimationFrame(tick);
  };
  const sync=()=>{cancelAnimationFrame(frame);frame=0;context.clearRect(0,0,canvas.width,canvas.height);if(!disposed&&!reduced.matches&&visible&&!document.hidden&&ready)frame=requestAnimationFrame(tick)};
  img.onload=()=>{if(disposed||!tx)return;texture.width=img.naturalWidth;texture.height=img.naturalHeight;tx.drawImage(img,0,0);const data=tx.getImageData(0,0,texture.width,texture.height),pixels=data.data,w=texture.width,h=texture.height;
   const luminance=new Float32Array(w*h);for(let i=0;i<w*h;i++){const p=i*4;luminance[i]=(pixels[p]*.2126+pixels[p+1]*.7152+pixels[p+2]*.0722)/255;}
   // High-pass selection keeps the thin saturated streaks and drops skin highlights and backdrop.
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,p=i*4,r=pixels[p]/255,gC=pixels[p+1]/255,b=pixels[p+2]/255,max=Math.max(r,gC,b),min=Math.min(r,gC,b),sat=max?(max-min)/max:0;
    const near=(luminance[y*w+Math.max(0,x-5)]+luminance[y*w+Math.min(w-1,x+5)]+luminance[Math.max(0,y-5)*w+x]+luminance[Math.min(h-1,y+5)*w+x])/4;
    const edge=Math.max(0,luminance[i]-near-.025);const strength=Math.min(1,edge*9)*Math.min(1,Math.max(0,sat-.35)*3)*Math.min(1,Math.max(0,max-.35)*2);
    // Push the colour toward a hot core so strikes read as electricity rather than a brighter photo.
    pixels[p]=Math.min(255,pixels[p]+70);pixels[p+1]=Math.min(255,pixels[p+1]+80);pixels[p+2]=Math.min(255,pixels[p+2]+90);
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
