import React from 'react'
import { Link } from 'react-router-dom'

function Page404() {
  return (
    <div>
    <div className="container-fluid m-0 p-0 d-flex align-items-center justify-content-center flex-column w-75 m-auto">
        <img src="/assets/images/404.png" alt="404" className='page404'/>
        <Link to="/"><button className='btn btn-info py-2 px-3'>Go to Home</button></Link>
    </div>
    </div>
  )
}

export default Page404
