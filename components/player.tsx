import React, {
  useRef,
  useEffect,
  useState,
  MouseEvent,
  ChangeEvent,
} from 'react'
import ReactPlayer from 'react-player/lazy'
import { IoSettingsOutline } from 'react-icons/io5'
import { GoPlay } from 'react-icons/go'
import { IoIosPause, IoMdPlay } from 'react-icons/io'
import { FaVolumeDown, FaVolumeOff, FaVolumeUp } from 'react-icons/fa'

import { getUrls } from '../cloudinary/cld'
import { formatTime } from '../utils'

interface Props {
  src: string
  bigPlayIconColor?: string
  bigPlayIconBgColor?: string
}

interface ReactPlayerState {
  played: number
  playedSeconds?: number
  loaded: number
  loadedSeconds?: number
}

const Player = ({ src, bigPlayIconColor, bigPlayIconBgColor }: Props) => {
  const videoRef = useRef<ReactPlayer | null>(null)
  const seekBarRef = useRef<HTMLInputElement>(null)
  const bigBtnRef = useRef<HTMLButtonElement>(null)
  // const seekBtnRef = createRef<HTMLDivElement>()
  // const seekRef = useRef(0)

  const [urls, setUrls] = useState<string | string[]>('')
  const [browserSupport, setBrowserSupport] = useState(true)
  // const [canPlay, setCanPlay] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [playerState, setPlayerState] = useState<ReactPlayerState>({
    played: 0,
    loaded: 0,
  })
  const [loop, setLoop] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [seek, setSeek] = useState(false)
  const [skipTo, setSkipTo] = useState<number | null>(null)
  const [skipToPos, setSkipToPos] = useState('')
  // const [progressId, setProgressId] = useState<NodeJS.Timer | null>(null)

  useEffect(() => {
    setUrls(getUrls(src))
  }, [src])

  // Check browser support
  useEffect(() => {
    const isBrowserSupport = !!document.createElement('video').canPlayType
    if (!isBrowserSupport) setBrowserSupport(false)
  }, [])

  // Show big play button when the video is not playing
  useEffect(() => {
    if (!playing && (playerState.played === 0 || playerState.played === 1)) {
      const bigBtn = bigBtnRef.current
      if (bigBtn) {
        bigBtn.style.opacity = '1'
      }
    }
  }, [playing, playerState.played])

  // useEffect(() => {
  //   if (urls) {
  //     if (typeof urls === 'string') {
  //       if (!ReactPlayer.canPlay(urls)) setCanPlay(false)
  //       else setCanPlay(true)
  //     } else {
  //       const canPlay = urls
  //         .map((url) => {
  //           if (!ReactPlayer.canPlay(url)) return false
  //           else return true
  //         })
  //         .includes(true)
  //       setCanPlay(canPlay)
  //     }
  //   }
  // }, [])

  function togglePlay() {
    const bigBtn = bigBtnRef.current
    setPlaying(!playing)

    if (bigBtn) {
      bigBtn.style.opacity = '0'

      bigBtn.animate(
        [
          {
            opacity: 1,
            transform: 'scale(1)',
          },
          {
            opacity: 0,
            transform: 'scale(1.5)',
          },
        ],
        { duration: 500 }
      )
    }
  }

  function toggleAutoPlay() {
    setAutoPlay((prev) => !prev)
  }

  function handleProgress(state: ReactPlayerState) {
    // Set player state only when we're not seeking
    if (!seek) setPlayerState(state)
  }

  function handlePlay() {
    if (playerState.played === 1) {
      setPlayerState({ ...playerState, played: 0 })
    }
  }

  function handleEnded() {
    setPlaying(loop)
  }

  function handleDuration(d: number) {
    setDuration(d)
  }

  function handleSeekStart() {
    setSeek(true)
  }

  function handleSeekChange(e: ChangeEvent<HTMLInputElement>) {
    setSeek(false)
    if (!videoRef.current) return
    const player = videoRef.current

    player.seekTo(parseFloat((e.target as HTMLInputElement).value))
    setPlayerState({
      ...playerState,
      played: parseFloat((e.target as HTMLInputElement).value),
    })
  }

  function handleSeekEnded() {
    setSeek(false)
  }

  function skipToStart(e: MouseEvent<HTMLInputElement>) {
    const seekBar = seekBarRef.current

    if (seekBar) {
      const seekBarRec = seekBar.getBoundingClientRect()
      const left = Math.round(seekBarRec.left)
      const right = Math.round(seekBarRec.right)
      const seekTo = (e.clientX - left) / (right - left)
      setSkipTo(+seekTo.toFixed(2))
      setSkipToPos(`${e.clientX - left - 4}px`)
    }
  }

  function skipToEnd() {
    setSkipTo(null)
  }

  // if (!canPlay) return <p>Sorry, something went wrong.</p>

  return (
    <div id="player" className="player">
      <ReactPlayer
        ref={videoRef}
        className="react-player"
        url={urls}
        width="100%"
        height="auto"
        controls={!browserSupport}
        playing={playing}
        volume={volume}
        // muted
        onPlay={handlePlay}
        // onPause={() => setPlaying(false)}
        onDuration={handleDuration}
        onProgress={handleProgress}
        onEnded={handleEnded}
      />

      {/* This div is placed on top of the video and canbe clicked to play/pause */}
      <div className="gradient-box" onClick={togglePlay}></div>

      <div className="control-box control-top">
        <button
          className="control-btn btn-auto-play"
          onClick={toggleAutoPlay}
          onTouchMove={toggleAutoPlay}
        >
          {!autoPlay ? (
            <div className="icon-auto-play-wrapper pause">
              <IoIosPause className="btn-icon icon-auto-play-pause" />
            </div>
          ) : (
            <div className="icon-auto-play-wrapper play">
              <GoPlay className="btn-icon icon-auto-play-play" />
            </div>
          )}
        </button>
        <button className="control-btn btn-gear">
          <IoSettingsOutline className="btn-icon icon-gear" />
        </button>
      </div>
      <div className="control-box control-middle">
        <button
          ref={bigBtnRef}
          className="control-btn big-play-btn"
          style={{ backgroundColor: bigPlayIconBgColor }}
        >
          {playing ? (
            <IoIosPause
              className="btn-icon big-play-icon"
              color={bigPlayIconColor}
            />
          ) : (
            <IoMdPlay
              className="btn-icon play-icon big-play-icon"
              color={bigPlayIconColor}
            />
          )}
        </button>
      </div>
      <div className="control-box control-bottom">
        <div className="bottom-bar video-timing">
          <p className="video-duration">
            {formatTime(duration * playerState.played)} / {formatTime(duration)}
          </p>
        </div>

        <div className="bottom-bar progress-bar-container">
          <progress
            className="progress-bar"
            value={duration * playerState.played}
            max={duration}
          ></progress>
          <input
            ref={seekBarRef}
            type="range"
            id="seek"
            className="seek-bar"
            value={playerState.played}
            min={0}
            max={0.999999}
            step="any"
            onMouseDown={handleSeekStart}
            onChange={handleSeekChange}
            onMouseUp={handleSeekEnded}
            onMouseMove={skipToStart}
            onMouseLeave={skipToEnd}
          />
          {typeof skipTo === 'number' && (
            <p className="skip-to" style={{ left: skipToPos }}>
              {formatTime(duration * skipTo)}
            </p>
          )}
        </div>
        <div className="bottom-bar bottom-control">
          <div className="bottom-control-left">
            <button className="control-btn" onClick={togglePlay}>
              {playing ? (
                <IoIosPause
                  className="btn-icon-small"
                  color={bigPlayIconColor}
                />
              ) : (
                <IoMdPlay className="btn-icon-small" color={bigPlayIconColor} />
              )}
            </button>
            <div className="volume-control">
              <button className="control-btn">
                {volume > 0 && volume <= 0.5 ? (
                  <FaVolumeDown />
                ) : volume > 0.5 ? (
                  <FaVolumeUp />
                ) : (
                  <FaVolumeOff />
                )}
              </button>
              <input
                className="volume-level"
                type="range"
                min={0}
                max={1}
                step="any"
                value={volume}
              />
            </div>
          </div>
          <div className="bottom-control-right">Right</div>
        </div>
      </div>
    </div>
  )
}

export default Player
