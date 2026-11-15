/** Resolution-independent glass cube rendered with CSS 3D; replaces the low-resolution sprite cell. */
export default function GlassCube({className=''}:{className?:string}){
 return <div className={`gc ${className}`} aria-hidden="true">
  <div className="gc-glow"/>
  <div className="gc-cube">
   <div className="gc-face gc-back"/>
   <div className="gc-face gc-left"/>
   <div className="gc-face gc-bottom"/>
   <div className="gc-face gc-top"><i/></div>
   <div className="gc-face gc-right"><i/></div>
   <div className="gc-face gc-front"><i/><span>Inventive<br/>Clicks</span></div>
  </div>
  <div className="gc-spark gc-s1"/><div className="gc-spark gc-s2"/><div className="gc-spark gc-s3"/>
  <div className="gc-floor"/>
 </div>;
}
