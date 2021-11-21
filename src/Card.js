import React from 'react';

const UNDECIDED = 'Undecided';
const SELECTED = 'Shortlisted';
const REJECTED = 'Rejected';

class Card extends React.Component {
  constructor(props) {
      super(props);
      this.state={
          status: this.props.status
      }
      this.handleClickShortlist=this.handleClickShortlist.bind(this);
      this.handleClickReject=this.handleClickReject.bind(this);
  }

  handleClickShortlist(){
    this.setState({status:SELECTED});
    this.props.shortlistHandler(this.props.id);
  }
  handleClickReject(){
    this.setState({status:REJECTED});
    this.props.rejectHandler(this.props.id);
  }

  render() {
    let cardStyle = {
      border: '6px solid #D3D3D3',
      margin: '2em',
      padding: '0.1em 1.2em 1.2em 1.2em',
    };
    let imgStyle = {
      height: '175px',
      width: 'auto'
    }
    if(this.state.status === SELECTED){
      cardStyle.border = '6px solid green'
    }
    if(this.state.status === REJECTED){
      cardStyle.border = '6px solid red'
    }
    return (
      <div className="card" style={cardStyle}>
        <p>{this.props.name}</p>
        <p>{this.state.status}</p>
        <button className="shortlistButton" onClick={this.handleClickShortlist}>Shortlist</button>
        <button className="rejectButton" onClick={this.handleClickReject}>Reject</button>
        <img src={this.props.image} style={imgStyle}/>
      </div>
    );
  }
};
  
export default Card;