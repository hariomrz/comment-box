import React, { useState, useEffect } from "react";
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [replyIndex, setReplyIndex] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState(false)

  useEffect(() => {
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const createComment = (e) => {
    e.preventDefault();
    if(!newComment){
        setError(true);
        return false
    }
    if (editMode) {
      const updatedComments = [...comments];
      updatedComments[editIndex].text = newComment;
      setComments(updatedComments);
      setEditMode(false);
      setEditIndex(null);
    } else {
      setComments((data) => {
        return [...data, { text: newComment, replies: [] }];
      });
    }
    setNewComment("");
  };

  const handleEdit = (index) => {
    setEditMode(true);
    setEditIndex(index);
    setNewComment(comments[index].text);
  };

  const openReplyInput = (index) => {
    setReplyIndex(index);
    setReplyText("");
  };

  const addReply = () => {
    if (replyText) {
      const updatedComments = [...comments];
      updatedComments[replyIndex].replies.push(replyText);
      setComments(updatedComments);
      setReplyIndex(null);
      setReplyText("");
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{background:'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)', height:'100vh'}}>
      
    <div className="container-fluid m-3"  >
    <h4>Comments :</h4>
      <form className="areatext m-3 ">
        <textarea
          value={newComment}
          className="form-control w-25"
          placeholder="Enter your comment..."
          rows={4}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        {error && !newComment && <p style={{color:'red'}}>Please Enter Comment</p>}

        <button
          type="submit"
          className="btn btn-dark btn-sm  h-25 mt-2 text-center"
          onClick={createComment}
        >
          {editMode ? "Update Comment" : "Submit Comment"}
        </button>
      </form>
      <ul>
        {comments.map((list, index) => (
          <li key={index} className="m-3" style={{fontSize:"1.2rem", width:'600px'}}>
            {list.text}{" "}
            <Tooltip title="Edit">
            <span
            
              className="bi bi-pencil-fill m-1"
              onClick={() => handleEdit(index)}
            >
              
            </span></Tooltip>
            <Tooltip title="Reply">
            <span
            
              className="bi bi-reply-fill"
              onClick={() => openReplyInput(index)}
            >
              
            </span></Tooltip>
            {replyIndex === index && (
              <div className="d-flex">
                 <TextField id="standard-basic" label="Reply" variant="standard" value={replyText} onChange={(e) => setReplyText(e.target.value)}/>
                <button onClick={addReply} className="btn btn-outline-dark btn-sm ms-2 h-25">Add Reply</button>
              </div>
            )}
            {list.replies.length > 0 && (
              <ul style={{listStyle:'none'}}>
                {list.replies.map((reply, replyIndex) => (
                  <li key={replyIndex} style={{ paddingLeft: "20px" }}>
                    {reply}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
     
   
    </div>
      
    </div>
  );
};

export default CommentList;
