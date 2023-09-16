import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import TextBox from "@/Components/FormsComponents/Inputs/TextBox"
import Spinner from "@/Components/Spinner"
import api from "@/api/api"
import Layout from "@/layout/Layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export default function New() {
  const router = useRouter()
  const [isUpload, setIsUpload] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  })
  const checkFormValidity = () => {
    const requiredFields = [
      "name",
      "email",
      "password",
      "password_confirmation",
      "role",
    ]

    for (const field of requiredFields) {
      if (!formData[field]) {
        return false
      }
    }
    return true
  }
  useEffect(() => {
    setIsFormValid(checkFormValidity())
  }, [isFormSubmitted])
  const handleSave = async () => {
    setIsFormSubmitted(true)
    if (!(checkFormValidity() && isFormSubmitted)) {
      return
    }
    const authToken = localStorage.getItem("authToken")
    try {
      setIsUpload(true);
      const formDataForApi = new FormData() // Create a FormData object
      formDataForApi.append("name", formData.name)
      formDataForApi.append("email", formData.email)
      formDataForApi.append("password", formData.password)
      formDataForApi.append(
        "password_confirmation",
        formData.password_confirmation
      )
      formDataForApi.append("role", formData.role)
      const savedData = await api.post(
        "users/users",
        formDataForApi,
        authToken
      )
      setIsUpload(false);
      toast.success("تم حفظ البيانات بنجاح")
      router.push("/Users")
    } catch (error) {
      setIsUpload(false);
      console.error("Error saving data:", error)
      toast.error("هذا المستخدم تمت اضافتة سابقا")
    }
  }

  const array = {
    data: [
      {
        id: "user",
        attributes: {
          name: "مستخدم",
        },
      },
      {
        id: "admin",
        attributes: {
          name: "مشرف",
        },
      },
      {
        id: "marketer",
        attributes: {
          name: "مسوق",
        },
      },
      {
        id: "company",
        attributes: {
          name: "شركة",
        },
      },
    ],
  }
  return (
    <Layout>
      {isUpload && <Spinner text="...جاري الرفع" />}
      <div className='flex mt-5 flex-col w-full items-center justify-between pb-4 bg-white dark:bg-white rounded-md text-black'>
        <div className='flex items-center space-x-4 w-full p-4' dir='rtl'>
          <form className='w-full '>
            <TextBox
              type='text'
              id='name'
              label='اسم المستخدم'
              name='name'
              placeholder='ادخل اسم النوع'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={
                formData.name == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <TextBox
              type='email'
              id='email'
              label='البريد الالكتروني'
              name='email'
              placeholder='ادخل البريد الالكتروني'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={
                formData.email == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <TextBox
              type='password'
              id='password'
              label='اسم كلمة السر'
              name='password'
              placeholder='ادخل كلمة السر'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={
                formData.password == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <TextBox
              type='password'
              id='password_confirmation'
              label='التحقق من كلمة السر'
              name='password_confirmation'
              placeholder='التحقق من كلمة السر'
              value={formData.password_confirmation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password_confirmation: e.target.value,
                })
              }
              error={
                formData.password_confirmation == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />

            <DropDownList
              title='نوع المستخدم'
              options={array.data}
              onSelect={(e) => setFormData({ ...formData, role: e })}
              error={
                formData.role == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />

            <button
              type='button'
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600`}
              onClick={handleSave}
            >
              حفظ
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
