import React, { useEffect, useState } from 'react'
import { Icon } from 'react-icons-kit';
import { heartO } from 'react-icons-kit/fa/heartO'
import { heart } from 'react-icons-kit/fa/heart'
import { commentO } from 'react-icons-kit/fa/commentO'
import { sendO } from 'react-icons-kit/fa/sendO'
import { getPost, likePost, listingComment, postComment } from '../services/home.service';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactPlayer from 'react-player'
import Loader from "react-js-loader";

import { Waypoint } from 'react-waypoint';

function Home() {

    const [postData, setPostData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [commentPostID, setCommentPostId] = useState('');
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        getPost().then((r) => {
            setTimeout(() => {
                setLoader(false);
                setPostData(r.data)
            }, 1000);
        })
    }, []);

    const like = (post_id) => {
        likePost(post_id).then((r) => {
            if (r.code === "1") {
                getPost().then((r) => {
                    setPostData(r.data)
                })
            } else {
                toast.error(r.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }

        })
    }

    const comments = (post_id) => {
        listingComment(post_id).then((r) => {
            if (r.code === "1") {
                setCommentData(r.data)
                setCommentPostId(post_id);
            } else {
                toast.error(r.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }

        })
    }


    const inputComment = (e) => {
        console.log(commentPostID);
        if (e.target.value !== "") {
            if (e.key === "Enter") {
                // console.log(e.target.value);
                postComment({ "post_id": commentPostID, "comment": e.target.value }).then((r) => {
                    if (r.code === "1") {
                        document.querySelector('#inputmsg').value = "";
                        listingComment(commentPostID).then((r) => {
                            setCommentData(r.data)
                        })
                        getPost().then((r) => {
                            setPostData(r.data)
                        })
                    } else {
                        toast.error(r.message, {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                            transition: Bounce,
                        });
                    }
                })
            }
        }
    }

    const sendLink = (post_id, username) => {
        const postUrl = `${window.location.origin}/post-details/@${username}/${post_id}`;
        navigator.clipboard.writeText(postUrl);
        toast.success("link copy to clipboard.", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    }

    const [playing, setPlaying] = useState(0);

    // const [play, setPlay] = useState(false);

    // const handelPlay = () =>{
    //     if(play){
    //         console.log("pause")
    //         setPlay(false);
    //     }else{
    //         console.log('play')
    //         setPlay(true);
    //     }
    // }

    return (

        <div className="p-0" style={{ with: '100%', height: '89.8vh', overflowY: 'auto',backgroundColor:'#31363F',color:'#ffffff' }}>

            <ToastContainer />
            {postData.length > 0 ? (
                postData.map((v, i) => (
                    <div className="row m-0 " key={"post" + i} >
                        <div className="col-md-5 mx-auto my-2 px-0" style={{backgroundColor:'#222831'}}>
                            <div className="row m-0 py-2 px-3">
                                <div className="col-1 px-0 d-flex align-items-center me-3">
                                    <img src={v.profile_image} alt="user-profile" className='profile' />
                                </div>
                                <div className="col-5 d-flex align-items-center p-0">
                                    {v.name}
                                </div>
                            </div>
                            <div className="row m-0">

                                {v.media_type === "image" ?

                                    <div className="col-12 px-0 post-media d-flex align-items-center justify-content-center">
                                        <img src={v.media} alt="Image_not_found!" className='post-image' />
                                    </div>

                                    :
                                    <Waypoint
                                        onEnter={() => setPlaying(v.post_id)}
                                        onLeave={() => setPlaying(0)}
                                    >
                                        <div className="col-12 px-0 post-media d-flex align-items-center justify-content-center">
                                            <ReactPlayer url={v.media} width='100%' playing={playing === v.post_id} onPlay={() => setPlaying(v.post_id)} loop={true} controls={true} />
                                        </div>
                                    </Waypoint>
                                }

                            </div>
                            <div className="row m-0 py-3 px-3 d-flex align-items-center">
                                {v.is_like === "1" ? (
                                    <span className='w-auto d-flex align-items-center p-0'>
                                        <Icon class="icon w-auto d-flex align-items-center justify-content-center p-0" icon={heart} size={18} style={{ color: "red", cursor: "pointer" }} onClick={() => like(v.post_id)} /><label className='ms-1 me-3 w-auto d-flex align-items-center justify-content-center p-0'>{v.total_likes} likes</label>
                                    </span>
                                ) : (
                                    <span className='w-auto d-flex align-items-center p-0'>
                                        <Icon class="icon w-auto d-flex align-items-center justify-content-center p-0" icon={heartO} size={18} style={{ color: "#686868", cursor: "pointer" }} onClick={() => like(v.post_id)} /><label className='ms-1 me-3 w-auto d-flex align-items-center justify-content-center p-0'>{v.total_likes} likes</label>
                                    </span>
                                )}

                                <Icon class="icon w-auto d-flex align-items-center justify-content-center p-0" icon={commentO} size={18} style={{ color: "#686868", cursor: "pointer" }} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => comments(v.post_id)} /><label className='ms-1 me-3 w-auto d-flex align-items-center justify-content-center p-0'>{v.total_comments} comments</label>


                                <div class="modal fade p-0" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                        <div class="modal-content bg-light">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Post Comments</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                {commentData.length > 0 ? (
                                                    commentData.map((v, i) => (
                                                        <div className='mb-2' key={i}>
                                                            <div className="d-flex align-items-center py-1 ">
                                                                <img src={v.profile_image} alt="profile_image" className='comment-user-image' />
                                                                <label className='w-auto p-0 ms-2 label-name'>{v.name}</label>
                                                                <label className='w-auto p-0 ms-1  label-username'>@{v.username}</label><br />
                                                            </div>
                                                            <div className="w-75 p-2 pt-0 ms-3">
                                                                <p className='m-0 label-name'>{v.comment}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="w-75 p-2 pt-0 ms-3">
                                                        <p className='m-0 label-name'>no comments !</p>
                                                    </div>
                                                )}


                                            </div>
                                            <div class="modal-footer">
                                                <input type='text' className='form-control w-100 px-2 py-2' placeholder='Write comment..' id="inputmsg" onKeyUp={(e) => inputComment(e)}></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Icon class="icon w-auto d-flex align-items-center justify-content-center p-0" icon={sendO} size={16} style={{ color: "#686868", cursor: "pointer" }} onClick={() => sendLink(v.post_id, v.username)} />

                            </div>
                            <div className="row m-0">
                                <div className="col-12 px-3 pt-1 pb-3 caption">
                                    <p className='w-100 m-0 '>{v.caption}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (

                <div className="row m-0">
                    {loader ?

                        <div className='w-100 d-flex align-items-center justify-content-center' style={{ height: "89vh" }}>
                            <Loader type="box-rectangular" color={'#55555'} bgColor={'#555'} size={80} />
                        </div>

                        :

                        <div className="col-md-5 bg-white mx-auto my-2 px-0">
                            <p>no post found!</p>
                        </div>

                    }
                </div>
            )}

        </div>
    )
}

export default Home
