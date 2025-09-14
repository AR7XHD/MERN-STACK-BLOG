import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RouteSignIn } from '../helpers/RouteNames'

const AdminRouteProtection = () => {
    const user = useSelector((state) => state.user)
    if(user && user.isloggedin && user.user.role === 'admin'){
        return <Outlet />
    } else {
        return <Navigate to={RouteSignIn} />
    }
}

export default AdminRouteProtection