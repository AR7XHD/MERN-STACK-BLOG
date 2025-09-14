import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout/layout'
import {
  RouteIndex, RouteSignIn, RouteSignUp, RouteProfile,
  RouteCategory, RouteCategoryEdit, RouteCategoryAdd, RouteBlog,
  RouteBlogEdit, RouteBlogAdd, RouteSingleBlog
} from './helpers/RouteNames'
import Index from './pages/index'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/profile'
import CatergoryDetails from './pages/Category/CatergoryDetails'
import CatergoryEdit from './pages/Category/CatergoryEdit'
import AddCategory from './pages/Category/AddCategory'
import BlogDetails from './pages/Blog/BlogDetails'
import BlogEdit from './pages/Blog/BlogEdit'
import AddBlog from './pages/Blog/AddBlog'
import SingleBlog from './pages/Blog/SingleBlog'
import BlogByCategory from './pages/Blog/BlogByCategory'
import { RouteBlogByCategory, RouteSearch, RouteComments, RouteUsers } from './helpers/RouteNames'
import Search from './pages/Search'
import Comments from './pages/Comments'
import Users from './pages/Users'
import AuthRouteProtection from './components/AuthRouteProtection'
import AdminRouteProtection from './components/AdminRouteProtection'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={RouteIndex} element={<Layout />} >
            <Route index element={<Index />} />

            <Route path={RouteSingleBlog()} element={<SingleBlog />} />

            <Route path={RouteBlogByCategory()} element={<BlogByCategory />} />

            <Route path={RouteSearch()} element={<Search />} />





            <Route element={<AdminRouteProtection />} >

              <Route path={RouteCategory} element={<CatergoryDetails />} />
              <Route path={RouteCategoryEdit()} element={<CatergoryEdit />} />
              <Route path={RouteCategoryAdd} element={<AddCategory />} />

              <Route path={RouteUsers()} element={<Users />} />


            </Route>

            <Route element={<AuthRouteProtection />} >


              <Route path={RouteProfile} element={<Profile />} />

             

              
              <Route path={RouteBlog} element={<BlogDetails />} />
              <Route path={RouteBlogEdit()} element={<BlogEdit />} />
              <Route path={RouteBlogAdd} element={<AddBlog />} />
              <Route path={RouteComments()} element={<Comments />} />


            </Route>

          </Route>
          <Route path={RouteSignIn} element={<SignIn />} />
          <Route path={RouteSignUp} element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
