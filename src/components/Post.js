import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'
import { connect } from 'react-redux'
import { setPostComments } from './../actions'
import * as ReadableAPI from './../utils/readableAPI'
import { showDate } from '../utils/utils'
import { Link } from 'react-router-dom'
import VoteScore from './VoteScore'

class Post extends Component {

  componentWillMount() {
      this.props.setPostComments(this.props.postId);
  }

	render() {

    const {postsInfo, comments, postId} = this.props

    let thePost = false
    let theComments = false

    if (postsInfo) {
      thePost = postsInfo.find((post) => (post.id === postId))
      console.log(thePost)
    }

    if (comments) {
      theComments = comments[postId]
      console.log('THE COMMENTS')
      console.log(theComments)
    }
		return (
			<div>
				<Header />
          { thePost &&
            <div className="container content" style={{marginTop: '25px', marginBottom: '50px'}}>

              <div className="columns is-mobile">
                <div className="column" style={{maxWidth: '115px'}}>
                  <VoteScore voteScore={thePost.voteScore} postId={thePost.id}/>
                </div>
                <div className="column">
                  <h1>
                    {thePost.title}
                  </h1>
                  <blockquote>
                    {thePost.body}
                  </blockquote>

                  <p>
                    posted by <strong>{thePost.author}</strong>,
                    &nbsp;
                    {showDate(thePost.timestamp)}
                    <br />
                    category: <Link to={'category/' + thePost.category}>{thePost.category}</Link>
                  </p>

                  { theComments &&
                    <div>
                      {theComments.map( (comment, index) =>
                        <p key={index}>

                          <div className="box">
                              <div className="media-content">
                                <div className="content">
                                  <p>
                                    <strong>{comment.author}</strong> <small>{showDate(comment.timestamp)}</small>
                                    <br />
                                    {comment.body}
                                  </p>
                                </div>
                                <nav className="level is-mobile">
                                  <div className="level-left">
                                    <a className="level-item">
                                      <span className="icon is-small"><i className="fa fa-edit"></i></span>
                                    </a>
                                    <a className="level-item">
                                      <span className="icon is-small"><i className="fa fa-trash-o"></i></span>
                                    </a>
                                  </div>
                                </nav>
                              </div>
                          </div>

                        </p>
                      )}
                    </div>
                  }

                </div>

              </div>

            </div>
          }
        <Footer />
			</div>
		)
	}
}

function mapStateToProps(state, props) {
  return {
    postsInfo: state.posts.posts,
    comments: state.comments
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    setPostComments: () =>
      ReadableAPI.getCommentsByPostId(ownProps.postId).then( (comments) => {
        dispatch(setPostComments(ownProps.postId, comments))
      }
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Post)

