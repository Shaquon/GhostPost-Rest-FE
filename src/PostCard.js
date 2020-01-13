import React from 'react';
// import { NavLink } from "react-router-dom";
import './styles/cardstyles.css'


class PostCard extends React.Component {

  render() {
    return (
      <React.Fragment>
         <div className="cardstyle">
            {this.props.content}
            <br></br>
            <button onClick={this.props.upvoteHandler}>Upvote:</button> {this.props.upvotes}
            <br></br>
            <button onClick={this.props.downvoteHandler}>Downvote:</button>{this.props.downvotes}
            <br></br>
            {this.props.submit_time}
            <br></br>
          </div>
      </React.Fragment>
    );
  }
}

export default PostCard;