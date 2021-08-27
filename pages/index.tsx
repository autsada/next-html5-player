import type { NextPage } from 'next'

import styles from '../styles/Home.module.css'
import Player from '../components/player'
// import Player from '../components/cldPlayer'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Player src='pilates/assets/customize' />
    </div>
  )
}

export default Home

/* <CldVjsPlayer options={createVideoOptions('https://res.cloudinary.com/aut-media/video/upload/v1628945022/pilates/assets/customize.mp4')} /> */
/* <CldPlayer src='pilates/assets/customize' /> */