import React from 'react'



export default class Home extends React.Component {
  componentDidMount() {
    window.location.forcedReload(true);
}
  render() {
   
    window.location.href="static/homepage.html"
  }
}