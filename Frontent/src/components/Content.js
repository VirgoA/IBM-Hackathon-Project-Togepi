import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';

import CustomeDataTable from './CustomeDataTable.js';

import CustomGoogleMap from './CustomGoogleMap.js';

import loadinggif from '../resources/load.gif'

import Container from '@material-ui/core/Container';

import Box from '@material-ui/core/Box';

import axios from 'axios'


const styles = theme => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});


const arrayDisasters = [{id:0, title:'Prank'},
{id:1, title:'Drowning'},
{id:2, title:'Fire'},
{id:3, title:'Injured'},
{id:4, title:'Murder'},
{id:5, title:'Sick'},
{id:6, title:'StuckInRoom'},
{id:7, title:'Trapped'},
{id:8, title:'Car Crush'}]

function b(idToSearch) {
  return arrayDisasters.filter(item => {
    return item.id === idToSearch
  })
};

class Content extends Component {
getEventsData2 = async () => {
    console.log('Get Request Sent')
    await axios.get('https://togepi-backend.azurewebsites.net/api/events')
    .then(response => this.setState({data:response.data.events }))


  }

createDataList = async () => {
    var newDataList =[];


    this.state.data.forEach(function(element) {
      console.log(element);
      var obj = {
          id: element.eventId,
          eventType:b(element.type)[0].title,
          eventLocation: element.displayLocation,
          eventStatus: "Unanswered"
      };
    newDataList.push(obj)
});
  this.setState({dataList:newDataList})
}

createMarkUpList = async () => {
    var markUpList =[];


    this.state.data.forEach(function(element) {
      console.log(element);
      var obj = {
          lat: element.latitude,
          lng: element.longitude
      };
    markUpList.push(obj)
});
  this.setState({markUpList:markUpList})
}



getPressedEventId = (val) => {
      // do not forget to bind getData in constructor
      console.log(val);
  }


  constructor(props) {
    super(props);
    this.getPressedEventId = this.getPressedEventId.bind(this);
    this.state = {
      classes: this.props,
      isThereData: false
    };
    if(this.state.isThereData == false){
    this.getEventsData2().then(response => {
      console.log(this.state.data)
  }).then(response =>{this.createDataList()})
  .then(response =>{this.createMarkUpList()})
  .then(response => {this.setState({isThereData: true})})
}
  }

render(){
  if (this.state.isThereData == false) {
    return(
      <div>
      <h1>Fetching Data From Server...</h1>
      <img src={loadinggif} alt="loading..." style={{width:500 +"px", height:400 + "px"}}/>

      </div>
    )
  }else{
    return (
    <Paper className={this.state.classes.paper} style={{width:1450+"px", height:800+"px"}}>

      <AppBar className={this.state.classes.searchBar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Grid container spacing={2} alignItems="center">

            <Grid item>

              <Tooltip title="Reload">
                <IconButton>
                  <RefreshIcon className={this.state.classes.block} color="inherit" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <div className={this.state.classes.contentWrapper}>
      <Grid container spacing={0} alignItems="center">

      <Grid item xs={5} style={{height:500 +'px'}}>
        <Container maxWidth="sm">
              <CustomeDataTable  data={this.state.dataList} getEventId={this.getPressedEventId}/>
        </Container>
      </Grid>

      <Grid item xs={7} style={{height: 450 + 'px', width: 350 + 'px'}}>
        <h1>Live Events Map</h1>
        <div id="mapDiv" style={{background: '#fff', pointerevents: 'none'}}>
        <CustomGoogleMap data={this.state.markUpList}/>
        </div>
      </Grid>

      </Grid>
      </div>


    </Paper>
  );
}
}

}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
