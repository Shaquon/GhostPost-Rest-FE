import React from 'react';
// import './App.css';
import PostList from "./PostList"
import { Route, Switch, NavLink} from "react-router-dom";

const url = 'http://localhost:8000/ghostpost/'

let _csrfToken = null;

async function getCsrfToken() {
  if (_csrfToken === null) {
    const response = await fetch(`${url}csrf/`, {
      credentials: "include"
    });
    const data = await response.json();
    _csrfToken = data.csrfToken;
  }
  return _csrfToken;
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_boast: false,
      posts: [],
      sort_by_votes: false,
      content: ""
    }
  }


  componentDidMount() {
    this.goFetch()
  }


  
  goFetch() {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then((res) => res.json())
      .then(result => {
        this.setState({ posts: result })
        // console.log(this.state, "test")
        return result
      })
      .catch(err => {
        console.log(`The error - ${err}`)
      });
  };


  onSubmit = (evt) => {
    evt.preventDefault();
    // console.log(this.state)

    const contentData = {
      is_boast: this.state.is_boast,
      content: this.state.content
    }

    document.getElementById("areaText").value = ""
    this.setState({ is_boast: false, content: "" })

    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(contentData)
    })
      .then((res) => res.json())
      .then(result => {
        // console.log("fetch for get req: ", result)
        return result
      })
      .catch(err => {
        console.log(err)
        return err
      })
    this.goFetch()
  }

  toggle = () => {
    this.setState({ is_boast: !this.state.is_boast })
    // console.log("Toggle for is_boast: ", this.state.is_boast)
  }

  handleContentChange = (evt) => {
    this.setState({ content: evt.target.value });
    // console.log("change in content", this.state.content)
  }

  handleSort = async evt => {
    evt.preventDefault();
    let orderedPosts;
    if (!this.state.sort_by_votes) {
      orderedPosts = this.state.posts.sort((a, b) => {
        let x = b.upvotes - b.downvotes;
        let y = a.upvotes - a.downvotes;
        return x - y;
      });
    } else {
      orderedPosts = this.state.posts.sort((a, b) => {
        let x = new Date(a.submit_time);
        let y = new Date(b.submit_time);
        return y - x;
      });
    }
    this.setState({
      posts: orderedPosts,
      sort_by_votes: !this.state.sort_by_votes
    });
  };

  upvoteHandler = async id => {
    const response = await fetch(`${url}boasts/${id}/upvote/`, {
      method: "POST",
      'Access-Control-Allow-Credentials': true,
      headers: { "X-CSRFToken": await getCsrfToken() },
      credentials: "include"
    });
    const data = await response.json();
    console.log("testing Upvote!")
    return data;
  };

  downvoteHandler = (id) => {
    const response = fetch(`${url}boasts/${id.id}/downvote/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": getCsrfToken()
      },
      credentials: "include"
    });
    const data = response.json();
    return data;
  };

  // filterPosts(){
  //   setTimeout(console.log("test this real quick"),1000)
    
  // }
  render() {
    return (
      <React.Fragment>
        <h1>Ghost Post Frontend</h1>
     
        <div className="links">
          <NavLink exact to="/"> All Posts </NavLink>
          <NavLink to="/roasts"> Only Boasts </NavLink>
          <NavLink to="/boasts"> Only Roasts </NavLink>
          <button onClick={this.handleSort}>Sort By Time Submitted </button>
        </div>

        <form>
          <fieldset>
            <textarea
              id="areaText"
              defaultValue="text"
              onChange={this.handleContentChange}
            ></textarea>
            <br></br>
            Is This a Boast? 
            <input  
              type="checkbox"
              name="postcheckbox"
              id="postcheckbox"
              checked={!this.state.is_boast}
              onChange={this.toggle}
            ></input>
            <br></br>
            <button
              onClick={this.onSubmit}
            >Submit</button>
          </fieldset>
        </form>

        
          <Switch>
            <Route
            
              path="/roasts/"
              render={props => (
                <React.Fragment>
                  <PostList
                  {...props}
                    posts={this.state.posts}
                    upvote={this.upvoteHandler}
                    downvote={this.downvoteHandler}
                    host={url}
                    filterBy="roast"
                  />
                </React.Fragment>
              )}
            />

            <Route
          
              path="/boasts/"
           
              render={props => (
                
                <React.Fragment>
                  <PostList
                    {...props}
                    posts={this.state.posts}
                    upvote={this.upvoteHandler}
                    downvote={this.downvoteHandler}
                    host={url}
                    filterBy="boast"

                  />
                </React.Fragment>
              )}
            />
            <Route
              exact
                path="/"
                render={props => (
                  <React.Fragment>
                    <PostList
                      {...props}
                      posts={this.state.posts}
                      upvote={this.upvoteHandler}
                      downvote={this.downvoteHandler}
                      host={url}
                      filterBy="all"
                    />
                  </React.Fragment>
                )}
              />

          </Switch>
   
      </React.Fragment>
    );
  }
}

export default App;
