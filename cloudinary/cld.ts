import { Cloudinary } from '@cloudinary/base'

export function getUrls(src: string) {
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'aut-media'
    }
  })

  const cldVideo = cld.video(src)
  const url = cldVideo.toURL()
  const urls = createUrls(url)

  return urls
}

export function createUrls(url: string) {
  const videoTypes = ['webm', 'mp4', 'ogg']

  return videoTypes.map(type => `${url}.${type}`)
}