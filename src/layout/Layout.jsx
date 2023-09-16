import Nav from "@/Components/Navbar"
import Sidebar from "@/Components/Sidebar"
import { useState } from "react"

export default function Layout({ children }) {
  const [mainServicesOpen, setMainServicesOpen] = useState(true)

  return (
    <div className='flex flex-row bg-backGraound' dir='rtl'>
      <Sidebar
        mainServicesOpen={mainServicesOpen}
        setMainServicesOpen={setMainServicesOpen}
      />
      <div className='flex-1 flex-col w-full p-4 bg-backGraound'>
        <Nav
          mainServicesOpen={mainServicesOpen}
          setMainServicesOpen={setMainServicesOpen}
        />
        {children}
      </div>
    </div>
  )
}
