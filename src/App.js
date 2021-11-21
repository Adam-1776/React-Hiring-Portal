import './App.css';
import Card from './Card';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(window.localStorage.getItem('state')) || {
      undecided_applicants: [],
      shortlisted_applicants: [],
      rejected_applicants: [],
      display_undecided: true,
      display_shortlisted: true,
      display_rejected: true
    }
    this.userList = this.userList.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.handleShortlist = this.handleShortlist.bind(this);
    this.refreshList = this.refreshList.bind(this);
  }

  componentDidMount(){
    if(JSON.parse(window.localStorage.getItem('state'))==null) this.userList();
    if(window.location.pathname=='/shortlisted'){
      console.log("shortlisted");
      if(this.state.display_rejected==true || this.state.display_undecided==true)
        this.setState({display_undecided: false, display_rejected: false, display_shortlisted: true});
    }
    else if(window.location.pathname=='/rejected'){
      console.log("rejected");
      if(this.state.display_shortlisted==true || this.state.display_undecided==true)
        this.setState({display_undecided: false, display_shortlisted: false, display_rejected: true});
    }
    else if(window.location.pathname=='/' || window.location.pathname==''){
      this.setState({display_undecided: true, display_shortlisted: true, display_rejected: true});
    }
  }

  userList() {
    fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/users49b8675.json')
    .then(function(response) {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json();
    })
    .then(function(json) {
        this.setState({undecided_applicants: json});
    }.bind(this))
    .catch(function(error) {
      console.log('Error: ' + error.message)
    });
  }

  refreshList(){
    localStorage.clear();
    window.location.reload();
  }

  handleReject(applicant_id){
    console.log(applicant_id + " has been rejected");
    let temp = this.state.undecided_applicants.findIndex((e) => {return e.id === applicant_id});
    let temp2 = this.state.undecided_applicants[temp];
    let updated_applicants = [...this.state.undecided_applicants];
    updated_applicants.splice(temp,1);
    let updateObj = {
      undecided_applicants: updated_applicants,
      shortlisted_applicants: this.state.shortlisted_applicants,
      rejected_applicants: [...this.state.rejected_applicants, temp2],
      display_undecided: this.state.display_undecided,
      display_shortlisted: this.state.display_shortlisted,
      display_rejected: this.state.display_rejected
    };
    window.localStorage.setItem('state', JSON.stringify(updateObj));
    this.setState({undecided_applicants: updated_applicants, rejected_applicants: [...this.state.rejected_applicants, temp2]});
  }

  handleShortlist(applicant_id){
    console.log(applicant_id + " has been shortlisted");
    let temp = this.state.undecided_applicants.findIndex((e) => {return e.id === applicant_id});
    let temp2 = this.state.undecided_applicants[temp];
    let updated_applicants = [...this.state.undecided_applicants];
    updated_applicants.splice(temp,1);
    let updateObj = {
      undecided_applicants: updated_applicants,
      shortlisted_applicants: [...this.state.shortlisted_applicants, temp2],
      rejected_applicants: this.state.rejected_applicants,
      display_undecided: this.state.display_undecided,
      display_shortlisted: this.state.display_shortlisted,
      display_rejected: this.state.display_rejected
    };
    window.localStorage.setItem('state', JSON.stringify(updateObj));
    this.setState({undecided_applicants: updated_applicants, shortlisted_applicants: [...this.state.shortlisted_applicants, temp2]});
  }



  render() {
    if(window.location.pathname!='/' && window.location.pathname!='' && window.location.pathname!='/shortlisted' && window.location.pathname!='/rejected'){
      let temp = window.location.pathname;
      console.log(temp);
      let e = this.state.undecided_applicants.find((element) => {return (('/'+element.id) == temp)});
      //console.log("printing e");
      console.log(e);
      return <Card key={e.id} name={e.name} image={e.Image} id={e.id} status='Undecided' rejectHandler={this.handleReject} shortlistHandler={this.handleShortlist}/>
    }

    let applicants1 = this.state.undecided_applicants.map((e,i)=>{
      return (<Card key={e.id} name={e.name} image={e.Image} id={e.id} status='Undecided' rejectHandler={this.handleReject} shortlistHandler={this.handleShortlist}/>);
    });
    let applicants2 = this.state.shortlisted_applicants.map((e,i)=>{
      return (<Card key={e.id} name={e.name} image={e.Image} id={e.id} status='Shortlisted' rejectHandler={this.handleReject} shortlistHandler={this.handleShortlist}/>);
    });
    let applicants3 = this.state.rejected_applicants.map((e,i)=>{
      return (<Card key={e.id} name={e.name} image={e.Image} id={e.id} status='Rejected' rejectHandler={this.handleReject} shortlistHandler={this.handleShortlist}/>);
    });
  
    return (
              <div id="allList">
                <button onClick={this.refreshList}>Reset</button>
                <a href="/">All Applicants</a>
                <a href="/shortlisted">Shortlisted Applicants</a>
                <a href="/rejected">Rejected Applicants</a>
                {this.state.display_undecided && <div className="underConsiderationList">{applicants1}</div>}
                {this.state.display_shortlisted && <div className="shortlistedList">{applicants2}</div>}
                {this.state.display_rejected && <div className="rejectedList">{applicants3}</div>} 
              </div>
           );
  }

};

export default App;