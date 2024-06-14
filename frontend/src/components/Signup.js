import { Link } from 'react-router-dom';

import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import { useForm } from 'react-hook-form';
import { ic_error_outline_outline } from 'react-icons-kit/md/ic_error_outline_outline';
import { userSignup } from '../services/home.service';
import { useNavigate } from 'react-router-dom';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Signup() {

    const { handleSubmit, register, formState: { errors }, watch } = useForm({ mode: "onChange" });

    const [setPassword] = useState("");
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const [profileImage, setProfileImage] = useState("");

    const router = useNavigate();

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text')
        } else {
            setIcon(eyeOff)
            setType('password')
        }
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const onSubmit = (value) => {
        let data = { name: value.name, username: value.username, email: value.email, password: value.password, profile_image: profileImage };
        userSignup(data).then((r) => {
            if (r.data.length > 0 && r.code === '1') {
                localStorage.setItem('user', JSON.stringify(r.data));
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
        <div className="row my-0 mx-0 my-5 p-0 d-flex justify-content-center">
            <ToastContainer />
            <div className='col-md-5 bg-white p-5 form-con'>
                <div className="row m-0 w-100">
                    <h3 className='h3 text-center w-100 mb-5'>Signup</h3>
                    <form id="login-form" className="m-1" onSubmit={handleSubmit(onSubmit)}>

                        <div className="col-md-12 mb-3">
                            <input
                                type="text"
                                className="form-control py-2 px-4"
                                id="name"
                                placeholder="Name"
                                {...register("name", {
                                    required: "Please enter name.",
                                    pattern: {
                                        value: /^[a-zA-Z]{3,}(?: [a-zA-Z]+){0,1}$/i,
                                        message: "Please enter valid name."
                                    }
                                })}
                                style={{ background: errors.name ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                            />
                            {errors.name && <p class="error"><Icon class="icon" icon={ic_error_outline_outline} size={16} />{errors.name.message}</p>}
                        </div>

                        <div className="col-md-12 mb-3">
                            <input
                                type="text"
                                className="form-control py-2 px-4"
                                id="username"
                                placeholder="Username"
                                {...register("username", {
                                    required: "Please enter user name.",
                                    pattern: {
                                        value: /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/i,
                                        message: "Please enter valid user name."
                                    }
                                })}
                                style={{ background: errors.username ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                            />
                            {errors.username && <p class="error"><Icon class="icon" icon={ic_error_outline_outline} size={16} />{errors.username.message}</p>}
                        </div>

                        <div className="col-md-12 mb-3">
                            <input
                                className="form-control py-2 px-4"
                                id="email"
                                aria-describedby="emailHelp"
                                placeholder="Email"
                                type="text"
                                {...register("email", {
                                    required: "Please enter email.",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Please enter valid email."
                                    },
                                })}
                                style={{ background: errors.email ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                            />
                            {errors.email && <p class="error"><Icon class="icon" icon={ic_error_outline_outline} size={16} />{errors.email.message}</p>}
                        </div>

                        <div className="col-md-12 mb-3">
                            <div className='position-relative'>
                                <input
                                    className="form-control py-2 px-4"
                                    id="exampleInputPassword1"
                                    placeholder="Password"
                                    // value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    type={type}
                                    {...register("password", {
                                        required: "Please enter password.",
                                        pattern: {
                                            value: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                                            message: "Password requirements: 8-20 characters, 1 number, 1 letter, 1 symbol."
                                        }
                                    })}
                                    style={{ background: errors.password ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                />
                                <span class="position-absolute bi btn" onClick={handleToggle}>
                                    <Icon class="" icon={icon} size={25} />
                                </span>
                            </div>
                            {errors.password && <p class="error"><Icon class="icon" icon={ic_error_outline_outline} size={16} />{errors.password.message}</p>}
                        </div>

                        <div className="col-md-12 mb-2">
                            <input
                                className="form-control py-2 px-4"
                                id="c-password"
                                placeholder="Confirm Password"
                                type='text'
                                {...register("cPassword", {
                                    required: "Please enter confirm password.",
                                    validate: (val) => {
                                        if (watch("password") !== val) {
                                            return "Password and confirm password are not match."
                                        }
                                    }
                                })}
                                style={{ background: errors.cPassword ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                            />
                            {errors.cPassword && <p class="error"><Icon class="icon" icon={ic_error_outline_outline} size={16} />{errors.cPassword.message}</p>}
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className='mb-1'>Profile Picture</label>
                            <div className="position-relative">
                                <input
                                    className="form-control py-2 px-3"
                                    id="profile_image"
                                    aria-describedby="emailHelp"
                                    placeholder="Profile Image"
                                    type="file"
                                    {...register("profile", {
                                        required: "Please select profile picture.",
                                        validate: {
                                            validImage: (value) => {
                                                const fileTypes = [
                                                    "image/jpeg",
                                                    "image/png",
                                                    "image/jpg",
                                                ];
                                                const validFileType = fileTypes.includes(value[0]?.type);
                                                return (
                                                    validFileType ||
                                                    "Only JPG, JPEG, or PNG images are allowed."
                                                );
                                            },
                                        },
                                    })}
                                    onChange={handleFileChange}
                                    style={{ background: errors.profile ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                />
                                <span class="position-absolute bi btn">
                                    <img src={profileImage} alt="" className='profile-preview'/>
                                </span>
                            </div>
                            {errors.profile && <p class="error"><Icon class="icon" icon={ic_error_outline_outline} size={16} />{errors.profile.message}</p>}
                        </div>

                        <div className="col-md-12">
                            <button type="submit" class="w-100 py-2 btn btn-dark" id="login-btn">Sign Up</button>
                        </div>
                        <div className='col-md-12 mx-auto text-center mt-4'>
                            <Link to="/login" className="text-secondary-emphasis" id="signup-link">
                                Already have account? login</Link>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Signup
