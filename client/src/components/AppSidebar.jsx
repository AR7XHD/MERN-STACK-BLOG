import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import logo from "../assets/images/logo-white.png"
import { HomeIcon, InfoIcon, PhoneIcon } from "lucide-react"
import { FaHome } from "react-icons/fa";
import { TbFileCode } from "react-icons/tb";
import { TbUsers } from "react-icons/tb";
import { TbMessageCircle } from "react-icons/tb";
import { Link } from "react-router-dom"
import { RouteIndex, RouteCategory,RouteBlog,RouteBlogByCategory } from "../helpers/RouteNames"
import { useFetch } from "../hooks/usefetch"
import { getEnv } from "../helpers/getEnv"
import { BiCategory } from "react-icons/bi";
import { useSelector } from "react-redux";


const menuItems = [
    {
        title: "Home",
        href: RouteIndex,
        icon: <FaHome /> ,
        role: "all"
    },
    
    {
        title: "Blog",
        href: RouteBlog,
        icon: <TbFileCode /> ,
        role: "all"
    },
    {
      title: "Comments",
      href: "/comments",
      icon: <TbMessageCircle /> ,
      role: "all"
  },
    {
      title: "Categories",
      href: RouteCategory,
      icon: <BiCategory /> ,
      role: "admin"
  },
    {
        title: "Users",
        href: "/users",
        icon: <TbUsers /> ,
        role: "admin"
    }
    

]

function AppSidebar() {

  const user = useSelector((state) => state.user)

  const Categoryresponse  = useFetch(`${getEnv("VITE_BASE_URL")}/category/all-category`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
})

const { data:categoryData, loading:categoryLoading, error:categoryError } = Categoryresponse;

  return (
    <Sidebar>
      <SidebarHeader>
        <img src={logo} alt="logo" className="w-32" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
             {menuItems.map((item) => (

                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    {item.role === "all" || item.role === user.user.role ? (
                      <Link to={item.href} className="flex items-center gap-2">
                        {item.icon}
                        {item.title}
                      </Link>
                    ) : null}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
            {categoryData?.category?.map((item) => (
                <SidebarMenuItem key={item._id}>
                  <SidebarMenuButton>
                    <BiCategory />
                    <Link to={RouteBlogByCategory(item.name)} className="flex items-center gap-2">
                        {item.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar