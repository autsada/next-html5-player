import type { AppProps } from 'next/app'
// import 'video.js/dist/video-js.css'

import '../styles/index.css'
import '../styles/player.css'
// import '../styles/videojs.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
