export default class extends React.Component {
  render () {
    return <>
    <img src="/static/platzi-logo.png" alt="Platzi logo"/>
    <h1 className="text" >About us</h1>
    <p className="text" >Curso con Next JS</p>
    
    <style jsx>{`
    .text {
      color: white;
      text-align: "center";
    }
    img{
      max-width: 20%;
      display: block
      margin: 0 auto
    }
    `}
    </style>
    <style jsx global>
    {
      `
        body{
          background: #263238
        }
      
      `
    }
    </style>
    </>
  }
}