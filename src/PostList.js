import React from 'react';
import './App.css';
import BoastCard from "./PostCard"



class PostList extends React.Component {

  render() {
    let filteredPosts;

    // switch (this.props.filterBy) {
    //   case "boast":
    //     filteredPosts = this.props.posts;
    //     break;
    //   case "roast":
    //     filteredPosts = this.props.posts.filter(post => !post.is_boast);
    //     break;
    //   default:
    //     filteredPosts = this.props.posts;
    // 

    // console.log("bats", this.props)
    if(this.props.filterBy === "boast"){
      // console.log("hello")
      filteredPosts = this.props.posts.filter(post => post.is_boast)

    }else if (this.props.filterBy === "roast"){
      filteredPosts = this.props.posts.filter(post => !post.is_boast)
    }else{
      filteredPosts = this.props.posts;
    }
  
    return (
      <React.Fragment>
          <ul>
              {
                  filteredPosts.map(post => (
                   <BoastCard
                   id={this.props.posts.indexOf(post)}
                   key={this.props.posts.indexOf(post)}
                   is_boast={post.is_boast}
                   content={post.content}
                   upvotes={post.upvotes}
                   downvotes={post.downvotes}
                   upvoteHandler={this.props.upvote}
                   downvoteHandler={this.props.downvote}
                   host={this.props.url}
                   submit_time={post.submit_time}
                   />
                  ))
              }
          </ul>
        
      </React.Fragment>
    );
  }
}

export default PostList;
