import React, { useEffect, useRef, useState, ChangeEvent } from 'react'
import { Cloudinary } from '@cloudinary/base'
import { AdvancedVideo } from '@cloudinary/react'

interface Props {
  src: string
  className?: string
}

const Player: React.FC<Props> = ({ src, className }) => {
  const [seekValue, setSeekValue] = useState(0)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const controlBarRef = useRef<HTMLDivElement | null>(null)

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'aut-media'
    }
  })
  const cldVideo = cld.video(src)

  useEffect(() => {
    const video = videoRef.current
    const controlBar = controlBarRef.current

    if (video) {
      video.classList.add('player')

      const canPlayMp4 = video.canPlayType('video/mp4')
      const canPlayWebm = video.canPlayType('video/webm')
      const canPlayOgg = video.canPlayType('video/ogg')

      // Hide the native control bar if the browser can play one of these types, and show the custom one
      if (!!canPlayMp4 || !!canPlayWebm || !!canPlayOgg) {
        video.controls = false

        if (controlBar) {
          controlBar.classList.remove('hidden')
        }
      }
    }
  }, [])

  function handleSeek(e: ChangeEvent<HTMLInputElement>) {
    setSeekValue(+e.target.value)
  }

  return <div className={`player-container ${className ? className : ''}`}>
    <AdvancedVideo innerRef={videoRef} cldVid={cldVideo} controls />
    <div ref={controlBarRef} className='control-bar hidden'>
      <div className="progress-bar-container">
        {/* <progress id='progress-bar' className='progress-bar' value='0' max='1' ></progress> */}
        <input type="range" id='progress-bar' className='progress-bar' value={seekValue} min={0} max={10} step={0.1} onChange={handleSeek} />
      </div>
      <div className="bottom-control">
        Bottom Control
      </div>
    </div>
  </div>
}

export default Player