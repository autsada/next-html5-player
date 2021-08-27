import React, { useEffect, useRef } from 'react'
import { Cloudinary } from '@cloudinary/base'
import { accessibility, AdvancedVideo, lazyload, placeholder, responsive } from '@cloudinary/react'
import videojs, { VideoJsPlayerOptions, VideoJsPlayer } from 'video.js'

interface Props {
  options: VideoJsPlayerOptions
}

const Player: React.FC<Props> = ({ options }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const VideoHtml = () => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: 'aut-media'
      }
    })

    useEffect(() => {
      const videoEls = document.getElementsByTagName('video')

      if (videoEls.length > 0) {
        const videoEl = videoEls[0]
        videoEl.classList.add('vjs-player', 'video-js')
      }
    }, [])

    if (!options.sources || options.sources.length === 0) return <h4>Loading...</h4>

    const cldVideo = cld.video(options.sources[0].src)

    return <div data-vjs-player>
      <AdvancedVideo innerRef={videoRef} cldVid={cldVideo} plugins={[lazyload(), responsive(), accessibility(), placeholder()]} />
    </div>
  }

  useEffect(() => {
    const videoEl = videoRef.current
    let player: VideoJsPlayer | null

    if (videoEl) {
      player = videojs(videoEl, options)
    }

    return () => {
      if (player) {
        player.dispose()
      }
    }
  }, [options])

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current
    const bigBtn = document.getElementsByClassName('vjs-big-play-button')[0] as HTMLButtonElement
    const bigBtnIcon = document.querySelectorAll('.vjs-big-play-button .vjs-icon-placeholder')[0]

    // Disable toggle play on the video, allow it on the big play button and in the control bar only
    // video.style.pointerEvents = 'none'
    // bigBtn.style.pointerEvents = 'auto'


    // // Toggle play
    // function stopPlay() {
    //   console.log(video.played)
    //   if (!video.paused || !video.ended) {
    //     console.log('called1')
    //     video.pause()
    //   }
    // }

    // Handle big play button when the video is playing
    function onVideoPlay() {
      // 1. Hide the big play button
      bigBtn.style.display = 'none'

      // 2. Change the big button icon to stop icon
      bigBtnIcon.classList.add('vjs-icon-placeholder-on-play')

      // 3. Hide the big play button
      // bigBtn.style.opacity = '0'
      // bigBtn.animate([
      //   {
      //     opacity: 1
      //   },
      //   {
      //     opacity: 0
      //   }
      // ], { duration: 600 })
    }

    // Handle big play button when the video is paused
    function onVideoPause() {
      // 1. Show the big button
      bigBtn.style.display = 'block'
      // bigBtn.style.opacity = '1'
      // bigBtn.animate([
      //   {
      //     opacity: 0
      //   },
      //   {
      //     opacity: 1
      //   }
      // ], { duration: 600 })

      // 2. Change the big button icon back to play icon
      bigBtnIcon.classList.remove('vjs-icon-placeholder-on-play')
    }

    if (video) {
      video.addEventListener('play', onVideoPlay)
      video.addEventListener('pause', onVideoPause)
    }

    if (bigBtn) {
      // bigBtn.addEventListener('click', stopPlay)
      // bigBtn.addEventListener('touchstart', togglePlay)  // For mobile

    }

    return () => {
      if (video) {
        video.removeEventListener('play', onVideoPlay)
        video.removeEventListener('pause', onVideoPause)
      }

      if (bigBtn) {
        // bigBtn.removeEventListener('click', stopPlay)
        // bigBtn.removeEventListener('touchstart', togglePlay) // For mobile
      }
    }
  }, [])

  return <VideoHtml />
}

export default Player