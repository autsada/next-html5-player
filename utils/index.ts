export function createVideoOptions(src: string) {
  return {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src,
        type: 'video/mp4'
      }
    ]
  }
}

export function formatTime(seconds: number) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(`${date.getUTCSeconds()}`)
  if (hh) {
    return `${hh}:${pad(`${mm}`)}:${ss}`
  }
  return `${mm}:${ss}`
}

function pad(string: string) {
  const tt = `0${string}`
  return (tt).slice(-2)
}
