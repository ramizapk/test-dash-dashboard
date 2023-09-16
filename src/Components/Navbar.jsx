// import Avatar from "@/images/User.png"
import Image from "next/image"
import { useState } from "react"
import { FaBars } from "react-icons/fa6"
const Nav = ({ mainServicesOpen, setMainServicesOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const toggleSidebar = () => {
    setMainServicesOpen(!mainServicesOpen) // تحديث حالة القائمة الجانبية
  }

  return (
    <div
      dir='ltr'
      className='bg-minueBg h-16 flex items-center  justify-between px-4 rounded-md shadow-slate-400 mb-4'
    >
      <div className='flex items-center'>
        <div className='relative flex flex-row items-center'>
          <div className='flex flex-row- items-center'>
            <Image
              src="/images/user.png"
              alt='Admin'
              width={500}
              height={500}
              className='w-10 h-10 rounded-full cursor-pointer'
            />
            <p className='text-minueColor'>Admin</p>
          </div>
        </div>
      </div>
      <div className='flex flex-row'>
        <h1 className='text-minueColor text-lg font-semibold'>لوحة التحكم</h1>
        <button
          onClick={() => setMainServicesOpen(!mainServicesOpen)}
          className='focus:outline-none text-black ml-2'
        >
          {mainServicesOpen ? (
            <FaBars />
          ) : (
            <FaBars className='hamburger-icon-vertical' />
          )}
        </button>
      </div>
    </div>
  )
}

export default Nav
