// import React from 'react'
import { Icon } from 'react-icons-kit';
import { ic_error_outline_outline } from 'react-icons-kit/md/ic_error_outline_outline';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { addPost } from '../services/home.service';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

function AddPost() {
    const { handleSubmit, register, formState: { errors } } = useForm({ mode: "onChange" });

    const [postImage, setPostImage] = useState("");
    const [media, setMedia] = useState('');
    const [loader, setLoader] = useState(false);

    const router = useNavigate();

    function handleFileChange(e) {
        const file = e.target.files[0];
        setMedia(e.target.files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPostImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const onSubmit = (value) => {
        let formData = new FormData();
        setLoader(true);
        formData.append("media", media);
        formData.append("caption", value.caption)
        addPost(formData).then((r) => {
            setLoader(false);
            if (r.code === '1') {
                toast.success(r.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                setTimeout(() => {
                    router('/');
                }, 1400);
            } else {
                setLoader(false);
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


    return (
        <div className="row my-0 mx-0 my-2 p-0 d-flex justify-content-center">
            <ToastContainer />
            <div className='col-md-5 bg-white p-5 form-con'>
                <div className="row m-0 w-100">
                    <h3 className='h3 text-center w-100 mb-5'>New Post</h3>
                    <form id="login-form" className="m-1" onSubmit={handleSubmit(onSubmit)}>

                        <div className="col-md-12 mb-3">
                            <textarea
                                className="form-control py-2 px-4"
                                id="name"
                                placeholder="Write caption..."
                                rows={5}
                                {...register("caption", {
                                })}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className='mb-1'>Media</label>
                            <div className="position-relative">
                                <input
                                    className="form-control py-2 px-3"
                                    id="post_image"
                                    type="file"
                                    {...register("post_image", {
                                        required: "Please select profile picture.",
                                        validate: {
                                            validImage: (value) => {
                                                const fileTypes = [
                                                    "image/jpeg",
                                                    "image/png",
                                                    "image/jpg",
                                                    "video/mp4",
                                                ];
                                                const validFileType = fileTypes.includes(value[0]?.type);
                                                return (
                                                    validFileType ||
                                                    "Only JPG, JPEG, PNG images or MP4,MKV video are allowed."
                                                );
                                            },
                                        },
                                    })}
                                    onChange={handleFileChange}
                                    style={{ background: errors.post_image ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                />
                                <span class="position-absolute bi btn">
                                    <img src={postImage} alt="" className='post-preview' />
                                </span>
                            </div>
                            {errors.post_image && <p class="error"><Icon class="icon" icon={ic_error_outline_outline} size={16} />{errors.post_image.message}</p>}
                        </div>

                        <div className="col-md-12">
                            {loader ?
                                <button class="btn btn-primary w-100 py-2" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                                    <span role="status">Posting...</span>
                                </button>
                                :
                                <button type="submit" class="w-100 py-2 btn btn-primary" id="login-btn">Post</button>
                            }

                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default AddPost
