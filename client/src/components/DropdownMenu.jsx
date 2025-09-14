import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { Button } from "./ui/button"
  import { useSelector } from "react-redux"
  import { FaUser } from "react-icons/fa";
  import { IoLogOut } from "react-icons/io5";
  import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RemoveUser } from "@/redux/user/userSlice";
import { RouteIndex,RouteProfile,RouteBlogAdd } from "@/helpers/RouteNames";
import { Link } from "react-router-dom";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showtoast";
// import AddBlog from "@/pages/Blog/AddBlog";

  const DropdownMenuComponent = () => {

    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = async () => {
         const response = await fetch(`${getEnv("VITE_BASE_URL")}/auth/logout`, {
                 method: "GET",
                 headers: {
                     "Content-Type": "application/json",
                 },
                 credentials: "include",
             })
           
             const data = await response.json();
        
        
         
             if(!response.ok){
                 showToast("error",data.message);
                 return;
             }
        
             dispatch(RemoveUser());
        
             showToast("success",data.message);
         
             navigate(RouteIndex);
         
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="w-10 h-10 rounded-full overflow-hidden bg-white">
                        <AvatarImage src={user.user.profilePicture}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; /* or set src to fallback */ }}
                        />
                        <AvatarFallback>{user.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="flex flex-col gap-1">
                    <p>{user.user.username}</p>
                    <p>{user.user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to={RouteProfile} className="flex items-center w-full">
                        <FaUser className="mr-2 text-blue-400" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                    <Link to={RouteBlogAdd} className="flex items-center w-full">
                    <IoIosAdd className="mr-2 text-green-400" />
                    Create Post
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <IoLogOut className="mr-2 text-red-400" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownMenuComponent
