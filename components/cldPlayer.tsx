import React from 'react'
import { Cloudinary } from '@cloudinary/base'
import { AdvancedVideo } from '@cloudinary/react'

interface Props {
  src: string
  className?: string
}

const Player: React.FC<Props> = ({ src, className }) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'aut-media'
    }
  })
  const cldVideo = cld.video(src)

  return <div className={`player-container ${className ? className : ''}`}>
    <AdvancedVideo cldVid={cldVideo} controls />
  </div>
}

export default Player