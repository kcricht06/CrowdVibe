import React, { Component } from 'react';
import Nav from 'Nav';
import Footer from 'Footer';
import SearchCity from './SearchCity';
import {Link, IndexLink} from 'react-router';
import Request from 'superagent';

import * as Redux from 'react-redux';
import router from 'app/router/';

class Main extends Component {

  constructor(props){
    super(props)

    this.state = {
      events: []
    };
  }

  populateEvents(events){
    // go through dom and add events
    console.log('from main: ', events)
    this.setState({
      events: this.state.events.concat(events)
    })
  }



  getDetails(index){
    // ajax request
    console.log('e: ', index);
    // this.refs.event.getAttribute('data-coords')
    console.log('ref: ', this.refs['event'+index])
    /*
      var info = {
      latitude : req.body.latitude || '30.134466',
      longitude : req.body.longitude|| '-97.638717',
      name : req.body.name,
      date: req.body.date || '2017-03-14',
      location : req.body.location
    };
    */

    // Coords
    console.log( JSON.parse(this.refs['event'+index].getAttribute('data-coords')).latitude );
    console.log( JSON.parse(this.refs['event'+index].getAttribute('data-coords')).longitude  );
    // name
    console.log( this.refs['event'+index].querySelector('.title').innerText );
    // date
    console.log(this.refs['event'+index].querySelector('.date').innerText );
    console.log(this.refs['event'+index].querySelector('.info').innerText);

    console.log('coords: ', JSON.parse(this.refs['event'+index].getAttribute('data-coords')) )

    var url="http://localhost:3000/api/details/";
    Request.post(url)
        .send({
          latitude: JSON.parse(this.refs['event'+index].getAttribute('data-coords')).latitude,
          longitude: JSON.parse(this.refs['event'+index].getAttribute('data-coords')).longitude ,
          name: this.refs['event'+index].querySelector('.title').innerText,
          date: this.refs['event'+index].querySelector('.date').innerText ,
          info: this.refs['event'+index].querySelector('.info').innerText,
          img: this.refs['event'+index].querySelector('.logo').getAttribute('src')
        })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((response) => {
        // console.log('Response from Details', response.text);

        // Populate the details page


        localStorage.setItem('eventDetails', response.text);


      });
  }

  render(){

    let events = this.state.events.map((event,index)=>{
      // console.log(event.latitude,event.longitude)
      // data="{latitude:"+event.latitude+", longitude: "+event.longitude+"}"
      const coords = JSON.stringify({
        latitude : event.latitude,
        longitude : event.longitude
      });


      return (
        <Link to="/results" onClick={()=>{ this.getDetails.bind(this)(index) } }>

          <div data-coords={coords} className="col-md-4 card event" key={index} ref={'event'+index}>
            <h5 className="title">{event.name}</h5>
            <img className="logo" src={event.eventImage} alt="event"/>
            <p className="date">{event.date}</p>
            <p className="info">{event.info}</p>
          </div>
        </Link>

      )
    });

    return (
      <div className="font-main">
        <Nav/>
          <div className="mainlandingsection">
            <div className="mainlandingsectiontext">
              <div className="feelingstitle">
                Real Acts. Real Feelings. Now.
              </div>
              <div className="titlesubtext">
                Find Out What's Going On
              </div>
              <SearchCity populateEvents={this.populateEvents.bind(this)}/>
            </div>
          </div>
          <div className="row">
            <div className="cardsection">
              {events}
            </div>
          </div>

        <Footer />
      </div>
    )
  }
};

export default Main;
