import Applogo from "@/images/applogo.png"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { FaSignOutAlt } from "react-icons/fa"
import {
  FaBars,
  FaBuilding,
  FaHouse,
  FaInbox,
  FaMapLocationDot,
  FaSitemap,
  FaToolbox,
  FaUserTie,
  FaUsers,
} from "react-icons/fa6"
export default function Sidebar({ mainServicesOpen, setMainServicesOpen }) {
  // const [mainServicesOpen, setMainServicesOpen] = useState(false)
  const [subServicesOpen, setSubServicesOpen] = useState(false)
  const router = useRouter()
  const isActiveLink = (link) => {
    console.log(link)
    return router.pathname === link // Compare the router pathname with the link href
  }

  return (
    <div
      className={`${mainServicesOpen
        ? " bg-minueBg w-1/4 h-screen  text-minueColor p-4 text-right shadow-slate-50 show"
        : "hidden hide"
        } sm:hidden `}
    >
      <div
        dir='ltr'
        className='flex flex-row-reverse items-center gap-5 mb-16 align-middle justify-between'
      >
        <div dir='ltr' className='flex flex-row-reverse items-center gap-5 '>
          <Image src={Applogo} alt='وصف الصورة' width={50} height={50} />
          <p className='font-bold text-4xl'>تدلل عقار</p>
        </div>
        <button
          onClick={() => setMainServicesOpen(!mainServicesOpen)}
          className='focus:outline-none text-black ml-2 minue'
        >
          {mainServicesOpen ? (
            <FaBars />
          ) : (
            <FaBars className='hamburger-icon-vertical' />
          )}
        </button>
      </div>
      <ul className='space-y-4 nav-item'>
        <li>
          <Link
            href='/'
            className={`block ${isActiveLink("/")
              ? "text-white bg-gradient-to-br from-minueActiveGraideint-100 to-minueActiveGraideint-70"
              : "hover:bg-munueHover"
              } px-2 py-1 rounded`}
          >
            {/* <AiFillHome /> */}
            <FaHouse />
            الرئيسية
          </Link>
        </li>
        <li>
          <Link
            href='/RealEstate'
            className={`block ${isActiveLink("/RealEstate") || router.pathname.startsWith("/RealEstate/")
              ? "text-white bg-gradient-to-br from-minueActiveGraideint-100 to-minueActiveGraideint-70"
              : "hover:bg-munueHover"
              } px-2 py-1 rounded`}
          >
            <FaBuilding />
            العقارات
          </Link>
        </li>
        <li>
          <Link
            href='/Locations'
            className={`block ${isActiveLink("/Locations") || router.pathname.startsWith("/Locations/")
              ? "text-white bg-gradient-to-br from-minueActiveGraideint-100 to-minueActiveGraideint-70"
              : "hover:bg-munueHover"
              } px-2 py-1 rounded`}
          >
            <FaMapLocationDot />
            المواقع
          </Link>
        </li>

        <li>
          <Link
            href='/Types'
            className={`block ${isActiveLink("/Types") || router.pathname.startsWith("/Types/")
              ? "text-white bg-gradient-to-br from-minueActiveGraideint-100 to-minueActiveGraideint-70"
              : "hover:bg-munueHover"
              } px-2 py-1 rounded`}
          >
            <FaSitemap />
            انواع العقارات
          </Link>
        </li>

        <li>
          <Link
            href='/MyServices'
            className={`block ${isActiveLink("/MyServices") || router.pathname.startsWith("/MyServices/")
              ? "text-white bg-gradient-to-br from-minueActiveGraideint-100 to-minueActiveGraideint-70"
              : "hover:bg-munueHover"
              } px-2 py-1 rounded`}
          >
            <FaToolbox />
            خدمات انشائية وتوريدات
          </Link>
        </li>

        <li>
          <Link
            href='/Orders'
            className={`block ${isActiveLink("/Orders") || router.pathname.startsWith("/Orders/")
              ? "text-white bg-gradient-to-br from-minueActiveGraideint-100 to-minueActiveGraideint-70"
              : "hover:bg-munueHover"
              } px-2 py-1 rounded`}
          >
            <FaInbox />
            الطلبات
          </Link>
        </li>
        <li>
          <Link
            href='/Customers'
            className={`block ${isActiveLink("/Customers") || router.pathname.startsWith("/Customers/")
              ? "text-white bg-gradient-to-br from-minueActiveGraideint-100 to-minueActiveGraideint-70"
              : "hover:bg-munueHover"
              } px-2 py-1 rounded`}
          >
            <FaUserTie />
            طلبات العملاء
          </Link>
        </li>
        <li>
          <Link
            href='/Users'
            className={`block ${isActiveLink("/Users") || router.pathname.startsWith("/Users/")
              ? "text-white bg-gradient-to-br from-minueActiveGraideint-100 to-minueActiveGraideint-70"
              : "hover:bg-munueHover"
              } px-2 py-1 rounded`}
          >
            <FaUsers />
            المستخدمين
          </Link>
        </li>
        <li>
          <Link
            href='/Logout'
            className='block hover:bg-munueHover px-2 py-1 rounded'
          >
            <FaSignOutAlt />
            تسجيل خروج
          </Link>
        </li>
      </ul>
    </div>
  )
}
