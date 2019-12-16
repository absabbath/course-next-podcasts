import 'isomorphic-fetch'
import ChannelGrid from '../components/ChannelGrid'
import PodcastList from '../components/PodcastList'
import Layout from '../components/Layout'
import Error from 'next/error'

export default class extends React.Component {

  static async getInitialProps({ query, res }) {
    try{
        let idChannel = query.id

        let [reqChannel, reqSeries, reqAudios] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${idChannel}`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`)
        ])

        if(reqChannel.status >= 400){
            res.statusCode = reqChannel.status
            return { channel: null, audioClips: null, series: null, statusCode:404 }
        }

        let dataChannel = await reqChannel.json()
        let channel = dataChannel.body.channel

        let dataAudios = await reqAudios.json()
        let audioClips = dataAudios.body.audio_clips

        let dataSeries = await reqSeries.json()
        let series = dataSeries.body.channels

        return { channel, audioClips, series, statusCode:200 }

    }catch(e){
        res.statusCode = 503
        return { channel: null, audioClips: null, series: null, statusCode:503 }
    }
  }

  render() {

    const { channel, audioClips, series, statusCode } = this.props

    if(statusCode >= 400){
        return <Error statusCode={statusCode} />
    }

    return <Layout title={channel.title}>

      <div className="banner" style={{ backgroundImage: `url(${channel.urls.banner_image.original})` }} />

      <h1>{ channel.title }</h1>
      <h2>Series</h2>
      { series.length > 0 &&
        <ChannelGrid channels={series} />
      }

      <h2>Ultimos Podcasts</h2>
      { audioClips.length > 0 &&
       <PodcastList podcasts={audioClips} />
      }


      <style jsx>{`
        .banner {
            width: 100%;
            padding-bottom: 25%;
            background-position: 50% 50%;
            background-size: cover;
            background-color: #aaa;
        }

        h1 {
          font-weight: 600;
          padding: 15px;
        }
        h2 {
          padding: 5px;
          font-size: 0.9em;
          font-weight: 600;
          margin: 0;
          text-align: center;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: system-ui;
          background: white;
        }
      `}
      </style>
    </Layout>
  }
}