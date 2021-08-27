import React, { Component, createRef } from 'react';
import ReactPlayer from 'react-player'
import { IoSettingsOutline } from 'react-icons/io5'
import { GoPlay } from 'react-icons/go'
import { IoIosPause, IoMdPlay } from 'react-icons/io'

import { getUrls } from '../cloudinary/cld'

interface Props {
  src: string
  bigPlayIconColor?: string
  bigPlayIconBgColor?: string
}

interface State {
  urls: string | string[] | null
  pip?: boolean
  playing?: boolean
  controls?: boolean
  muted?: boolean
  played?: number
  loaded?: number
  duration?: number
  playbackRate?: number
  loop?: boolean
}

class Player extends Component<Props, State> {
  player = createRef<ReactPlayer>()

  constructor(props: Props) {
    super(props)
    this.state = {
      urls: null,
      pip: false,
      playing: false,
      controls: true,
      muted: true,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1,
      loop: false
    }
  }

  togglePlay() {
    this.setState({ playing: !this.state.playing })
  }

  render() {
    const { playing } = this.state
    const { src, bigPlayIconBgColor, bigPlayIconColor } = this.props

    return (
      <div id="player" className="player">
        <ReactPlayer
          ref={this.player}
          className="react-player"
          url={getUrls(src)}
          width="100%"
          height="100%"
          controls
          playing={playing}
        />
        <div className="control-box control-top">
          <button
            className="control-btn btn-auto-play"
          >
            <div className="icon-auto-play-wrapper pause">
              <IoIosPause className="btn-icon icon-auto-play-pause" />
            </div>

            <div className="icon-auto-play-wrapper play">
              <GoPlay className="btn-icon icon-auto-play-play" />
            </div>
          </button>
          <button className="control-btn btn-gear">
            <IoSettingsOutline className="btn-icon icon-gear" />
          </button>
        </div>
        <div className="control-box control-middle">
          <button className="control-btn big-play-btn" style={{ backgroundColor: bigPlayIconBgColor }} onClick={() => {
            this.togglePlay()
          }}>
            <IoMdPlay className='btn-icon big-play-icon' color={bigPlayIconColor} />
            {/* <IoIosPause className='btn-icon big-play-icon' color={bigPlayIconColor} /> */}
          </button>
        </div>
        {/* <div className="control-box control-bottom">Bottom</div> */}
      </div>
    );
  }
}

export default Player;