import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Page404 from "./components/Page404";
import Home from "./components/Home";
import Protected from "./utils/protected.config";
import AddPost from "./components/AddPost";
import ViewPost from "./components/ViewPost";

function App() {
  // return (
  //   <BrowserRouter>
  //     {/* <Navbar/> */}
  //     <Routes>
  //       <Route path="/login" element={[<Login />]} />
  //       <Route path="/signup" element={[<Signup />]} />
  //       <Route path="/" element={
  //         <Protected>
  //           <Navbar /><Home />
  //         </Protected>
  //       } />

  //       <Route path="/add-post" element={
  //         <Protected>
  //           <Navbar /><AddPost />
  //         </Protected>
  //       } />

  //       <Route path="/post-details/:username/:post_id" element={[<ViewPost />]} />
  //       <Route path="*" element={[<Page404 />]} />
  //     </Routes>
  //   </BrowserRouter>
  // );

  const Layout = () => {
    return (
      <div>
        <Navbar />
        <Outlet />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Protected>
            <Layout />
          </Protected>
        </>
      ),
      children: [
        {
          path: "/",
          element: [<Home />],
        },
        {
          path: "/add-post",
          element: <AddPost />,
        }
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/post-details/:username/:post_id",
      element: <ViewPost />,
    },
    { 
      path:"*",
      element:<Page404 /> 
    }
  ]);

  return <RouterProvider router={router} />;

}

export default App;
