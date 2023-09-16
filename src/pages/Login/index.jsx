import myLogo from "@/images/applogo.png"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"
const URL = process.env.NEXT_PUBLIC_API_LOGIN_URL;
export default function Index() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const headers = {
      "Content-Type": `application/vnd.api+json`,
      Accept: `application/vnd.api+json`,
    }
    let data = new FormData()
    data.append("email", email)
    data.append("password", password)

    try {
      const response = await axios({
        method: "post",
        url: "login",
        baseURL: URL,
        data: data,
        headers: headers,
      })

      localStorage.setItem("authToken", response.data.data.token)
      localStorage.setItem("UserName", response.data.data.admin.name)
      console.log(response)
      toast.success("تم تسجيل الدخول بنجاح!")
      router.replace("/")
    } catch (error) {
      if (error.response.data.message == "Credentials do not match") {
        toast.error("  المدخلات ليست صحيحة")
      } else {
        toast.error("حدث خطأ أثناء تسجيل الدخول السيرفر لا يستجيب")
      }
    }
  }

  return (
    <div className='flex flex-row items-center justify-center w-full h-screen md:flex-row md:h-screen'>
      <div className='flex items-center p-10 justify-center w-full md:w-1/2'>
        <Image src={myLogo} alt='Login Image' width={400} height={400} />
      </div>

      <div
        className='flex flex-col items-center justify-center w-full md:w-1/4'
        dir='rtl'
      >
        <div className='w-full max-w-md space-y-8'>
          <div>
            <h1 className='text-2xl text-black font-bold'>
              مرحبًا بك، مدير النظام!
            </h1>
            <p className='mt-2 text-gray-600'>يرجى تسجيل الدخول إلى حسابك.</p>
          </div>
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email' className='block font-bold text-gray-700'>
                البريد الإلكتروني
              </label>
              <input
                dir='ltr'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='أدخل عنوان بريدك الإلكتروني'
                className='w-full px-4 py-3 mt-1 text-black border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200'
                required
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block font-bold text-gray-700'
              >
                كلمة المرور
              </label>
              <input
                dir='ltr'
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='أدخل كلمة المرور'
                className='w-full px-4 py-3 mt-1 text-black border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200'
                required
              />
            </div>
            <div>
              <button
                type='submit'
                className='w-full px-4 py-3 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700'
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
