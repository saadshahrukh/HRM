import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SideBarOptions } from "@/services/Options"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

 function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Image 
        src={"/logo.png"} width={550} height={150}  alt="logo" 
        className="p-5 "
        />
        <Button  className="w-full " > Create New Interview <Plus /> </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
            <SidebarContent >
                <SidebarMenu>
                    {SideBarOptions.map((option, index)=> (
                        <SidebarMenuItem key={index} className="p-1"  >
                            <SidebarMenuButton  asChild  className="p-5" >
                                <Link href={option.path}  >
                                <option.icon />
                                <span>{option.name}</span>
                                </Link>

                            </SidebarMenuButton>
                        </SidebarMenuItem>

                    ))}
                </SidebarMenu>
            </SidebarContent>
        </SidebarGroup> 
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar 