import {Header,Footer} from '../../components/SiteChrome';
import Motion from '../../components/Motion';
export default function InnerLayout({children}:{children:React.ReactNode}){return <><a className="skip-link" href="#main-content">Skip to content</a><Header/><main id="main-content" className="inner-main">{children}</main><Footer/><Motion/></>}
