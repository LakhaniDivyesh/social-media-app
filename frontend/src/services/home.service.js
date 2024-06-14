import { fetchWrapper } from "../utils/fetch.wrapper";


export function userLogin(loginData) {
    return fetchWrapper.post(`http://localhost:3047/api/v1/auth/login`,loginData);
}

export function userSignup(signupData) {
    return fetchWrapper.post(`http://localhost:3047/api/v1/auth/signup`,signupData);
}

export function addPost(postData) {
    return fetchWrapper.post(`http://localhost:3047/api/v1/home/add-post`,postData);
}

export function getPost() {
    return fetchWrapper.post(`http://localhost:3047/api/v1/home/listing-post`,{});
}

export function likePost(post_id) {
    return fetchWrapper.post(`http://localhost:3047/api/v1/home/like-post`,{"post_id":post_id});
}

export function listingComment(post_id) {
    return fetchWrapper.post(`http://localhost:3047/api/v1/home/listing-comment`,{"post_id":post_id});
}

export function postDetails(post_id) {
    return fetchWrapper.post(`http://localhost:3047/api/v1/home/post-details`,{"post_id":post_id});
}

export function postComment(data) {
    return fetchWrapper.post(`http://localhost:3047/api/v1/home/post-comment`,data);
}

export function verifyToken(token) {
    return fetchWrapper.post(`http://localhost:3047/api/v1/auth/verify-token`,{"token":token});
}
