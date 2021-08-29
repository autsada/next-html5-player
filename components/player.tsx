import React, {
  useRef,
  useEffect,
  useState,
  MouseEvent,
  ChangeEvent,
} from 'react'
import ReactPlayer from 'react-player/lazy'
import fscreen from 'fscreen'
import {
  IoVolumeMute,
  IoVolumeLow,
  IoVolumeMedium,
  IoVolumeHigh,
} from 'react-icons/io5'
import { MdReplay } from 'react-icons/md'
import { IoIosPause, IoMdPlay } from 'react-icons/io'
import {
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiSettings4Fill,
} from 'react-icons/ri'
import { CgInpicture } from 'react-icons/cg'
import { ImLoop } from 'react-icons/im'

import { formatTime } from '../utils'

interface Props {
  src: string | string[]
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
  const videoContainerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<ReactPlayer | null>(null)
  const seekBarRef = useRef<HTMLInputElement>(null)
  const bigBtnConRef = useRef<HTMLDivElement>(null)
  const bigBtnRef = useRef<HTMLButtonElement>(null)
  const controlBoxRef = useRef<HTMLDivElement>(null)

  const [videoReady, setVideoReady] = useState(false)
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
  const [canPip, setCanPip] = useState(false)
  const [pip, setPip] = useState(false)
  const [canFullscreen, setCanFullscreen] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [seek, setSeek] = useState(false)
  const [skipTo, setSkipTo] = useState<number | null>(null)
  const [skipToPos, setSkipToPos] = useState('')

  // Check browser support
  useEffect(() => {
    const isBrowserSupport = !!document.createElement('video').canPlayType
    if (!isBrowserSupport) setBrowserSupport(false)
  }, [])

  // Pip mode
  useEffect(() => {
    if (typeof window === 'undefined') return

    const canPip = ReactPlayer.canEnablePIP(
      typeof src === 'string' ? src : src.length > 0 ? src[0] : ''
    )
    setCanPip(canPip)
  }, [src])

  // Check for fullscreen mode support and anf if yes listen to fullscreen change
  useEffect(() => {
    if (!fscreen.fullscreenEnabled) {
      setCanFullscreen(false)
    } else {
      setCanFullscreen(true)
      fscreen.addEventListener('fullscreenchange', updateFullscreen, false)
    }

    function updateFullscreen() {
      if (fscreen.fullscreenElement !== null) {
        // Entered fullscreen mode
        setFullscreen(true)
      } else {
        // Exited fullscreen mode
        setFullscreen(false)
      }
    }

    return () => {
      fscreen.removeEventListener('fullscreenchange', updateFullscreen, false)
    }
  }, [])

  function onReady() {
    setVideoReady(true)
  }

  // When the user clicks/tabs on the video, show/hide the big play icon and the control box
  function onVideoClick() {
    const bigBtnCon = bigBtnConRef.current
    const controlBox = controlBoxRef.current

    if (bigBtnCon && controlBox) {
      bigBtnCon.classList.toggle('hide')
      bigBtnCon.classList.toggle('hide-animate')
      bigBtnCon.classList.toggle('unhide')
      bigBtnCon.classList.toggle('unhide-animate')
      controlBox.classList.toggle('invisible')
      controlBox.classList.toggle('invisible-animate')
      controlBox.classList.toggle('visible')
      controlBox.classList.toggle('visible-animate')
    }
  }

  function togglePlay() {
    setPlaying(!playing)

    // Animate the big play button
    const bigBtn = bigBtnRef.current
    if (bigBtn) {
      if (!playing) {
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
    setPlaying(true)
  }

  function handlePause() {
    setPlaying(false)
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

  function toggleMuted() {
    setMuted(!muted)
    setVolume((prev) => (prev === 0 && muted ? 0.8 : prev))
  }

  function handleVolumeChange(
    e: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLInputElement>
  ) {
    setVolume(parseFloat((e.target as HTMLInputElement).value))
  }

  function toggleFullscreen() {
    const videoEl = videoContainerRef.current

    if (videoEl) {
      if (fscreen.fullscreenEnabled) {
        if (fscreen.fullscreenElement === null) {
          fscreen.requestFullscreen(videoEl)
          screen.orientation.lock('landscape-primary')
        } else {
          fscreen.exitFullscreen()
          screen.orientation.lock('natural')
        }
      }
    }
  }

  function togglePip() {
    setPip(!pip)
  }

  function enablePip() {
    setPip(true)
  }

  function disablePip() {
    setPip(false)
  }

  function toggleLoop() {
    setLoop(!loop)
  }

  // if (!canPlay) return <p>Sorry, something went wrong.</p>

  return (
    <div
      ref={videoContainerRef}
      id="player"
      className="player"
      style={{ opacity: !videoReady ? '0' : '1' }}
    >
      <ReactPlayer
        ref={videoRef}
        className="react-player"
        url={src}
        width="100%"
        height="auto"
        controls={!browserSupport}
        onReady={onReady}
        playing={playing}
        volume={volume}
        muted={muted}
        pip={pip}
        onPlay={handlePlay}
        onPause={handlePause}
        onDuration={handleDuration}
        onProgress={handleProgress}
        onEnded={handleEnded}
        onEnablePIP={enablePip}
        onDisablePIP={disablePip}
      />

      <div
        ref={bigBtnConRef}
        className={`big-play-btn-container ${
          playing ? 'hide hide-animate' : 'unhide unhide-animate'
        }`}
        onClick={onVideoClick}
      >
        <button ref={bigBtnRef} className="big-play-btn" onClick={togglePlay}>
          {playing ? (
            <IoIosPause className="big-btn-icon" />
          ) : playerState.played < 0.95 ? (
            <IoMdPlay className="big-btn-icon" style={{ marginLeft: '2px' }} />
          ) : (
            <MdReplay className="big-btn-icon" />
          )}
        </button>
      </div>

      <div
        ref={controlBoxRef}
        className={`control-box bottom-control-box ${
          playing ? 'invisible invisible-animate' : 'visible visible-animate'
        }`}
      >
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
          <div className="control-area left-control">
            <button className="control-btn play-pause-btn" onClick={togglePlay}>
              {playing ? (
                <IoIosPause className="btn-icon" />
              ) : playerState.played === 1 ? (
                <MdReplay className="btn-icon" />
              ) : (
                <IoMdPlay className="btn-icon" />
              )}
            </button>
            <div className="volume-control">
              <button
                className="control-btn volume-icon-btn"
                onClick={toggleMuted}
              >
                <IoVolumeMute
                  className={`btn-icon volume-icon ${
                    volume === 0 || muted
                      ? 'unhide unhide-animate'
                      : 'hide hide-animate'
                  }`}
                />

                <IoVolumeLow
                  className={`btn-icon volume-icon ${
                    !muted && volume > 0 && volume <= 0.4
                      ? 'unhide unhide-animate'
                      : 'hide hide-animate'
                  }`}
                />

                <IoVolumeMedium
                  className={`btn-icon volume-icon ${
                    !muted && volume > 0.4 && volume <= 0.8
                      ? 'unhide unhide-animate'
                      : 'hide hide-animate'
                  }`}
                />

                <IoVolumeHigh
                  className={`btn-icon volume-icon ${
                    !muted && volume > 0.8 && volume <= 1
                      ? 'unhide unhide-animate'
                      : 'hide hide-animate'
                  }`}
                />

                {/* <IoVolumeMute
                  className={`volume-icon ${
                    volume === 0 || muted
                      ? 'unhide unhide-animate'
                      : 'hide hide-animate'
                  }`}
                />

                <IoVolumeLow
                  className={`volume-icon ${
                    !muted && volume > 0 && volume <= 0.4
                      ? 'unhide unhide-animate'
                      : 'hide hide-animate'
                  }`}
                />

                <IoVolumeMedium
                  className={`volume-icon ${
                    !muted && volume > 0.4 && volume <= 0.8
                      ? 'unhide unhide-animate'
                      : 'hide hide-animate'
                  }`}
                />

                <IoVolumeHigh
                  className={`volume-icon ${
                    !muted && volume > 0.8 && volume <= 1
                      ? 'unhide unhide-animate'
                      : 'hide hide-animate'
                  }`}
                /> */}
              </button>
              <div className="volume-level-wrapper">
                <progress
                  className="volume-progress"
                  value={muted ? 0 : volume}
                  max={1}
                ></progress>
                <input
                  className="volume-level"
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  onClick={handleVolumeChange}
                />
              </div>
            </div>
          </div>
          <div className="control-area right-control">
            <button className="control-btn loop-btn">
              <ImLoop
                className="btn-icon loop-icon"
                color={loop ? 'red' : '#fff'}
                onClick={toggleLoop}
              />
            </button>
            <button
              className="control-btn auto-play-btn"
              onClick={toggleAutoPlay}
              onTouchMove={toggleAutoPlay}
            >
              <IoIosPause
                className="btn-icon pause-icon"
                style={{ opacity: autoPlay ? '0' : '1' }}
              />
              <IoMdPlay
                className="btn-icon play-icon"
                style={{ opacity: autoPlay ? '1' : '0' }}
              />
            </button>
            <button className="control-btn settings-btn">
              <RiSettings4Fill className="btn-icon settings-icon" />
            </button>
            {canPip && (
              <button className="control-btn pip-btn">
                <CgInpicture
                  className="btn-icon pip-icon"
                  onClick={togglePip}
                />
              </button>
            )}
            {canFullscreen && (
              <button className="control-btn fullscreen-btn">
                {!fullscreen ? (
                  <RiFullscreenLine
                    className="btn-icon fullscreen-icon"
                    onClick={toggleFullscreen}
                  />
                ) : (
                  <RiFullscreenExitLine
                    className="btn-icon fullscreen-icon"
                    onClick={toggleFullscreen}
                  />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Player
