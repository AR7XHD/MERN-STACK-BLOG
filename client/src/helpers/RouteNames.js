export const RouteIndex = "/"
export const RouteSignIn = "/sign-in"
export const RouteSignUp = "/sign-up"
export const RouteProfile = "/profile"
export const RouteCategory = "/category"
export const RouteCategoryEdit = (id) =>
{
    if(id){
        return `/category/edit/${id}`
    }
    else{
        return `/category/edit/:id`
    }
}
export const RouteCategoryAdd = "/category/add"

export const RouteBlog = "/blog"
export const RouteBlogEdit = (id) =>
{
    if(id){
        return `/blog/edit/${id}`
    }
    else{
        return `/blog/edit/:id`
    }
}
export const RouteBlogAdd = "/blog/add"

export const RouteSingleBlog = (category , blog , id) =>
{
    if(category && blog){
        return `/blog/${category}/${blog}/${id}`
    }
    else{
        return `/blog/:category/:blog/:id`
    }
}

export const RouteBlogByCategory = (category) =>
{
    if(category){
        return `/blog/category/${category}`
    }
    else{
        return `/blog/category/:category`
    }
}

export const RouteSearch = (query) =>
{
    if(query){
        return `/search?query=${query}`
    }
    else{
        return `/search`
    }
}

export const RouteComments = () =>
{
    return `/comments`
}

export const RouteUsers = () =>
{
    return `/users`
}
