import { Outlet } from 'react-router-dom'
import TopBar from '../components/TopBar'
import AppSidebar from '../components/AppSidebar'
import Footer from '../components/Footer'
import { SidebarProvider } from '../components/ui/sidebar'

const layout = () => {
    return (
        <SidebarProvider>

            <div className="flex flex-col min-h-screen ">

                <TopBar />

                <div className="flex flex-1 w-[calc(100vw-50px)]">
                    <AppSidebar />

                    <div className="flex-1 flex flex-col w-[calc(100vw-50px)] ml-10">
                        
                        <main className="flex-1 p-6 w-full ">
                            <Outlet />
                        </main>

                        <Footer/>
                    </div> 

                </div>

            </div>
            
        </SidebarProvider>
    )
}

export default layout