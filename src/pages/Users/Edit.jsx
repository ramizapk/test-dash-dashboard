import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import TextBox from "@/Components/FormsComponents/Inputs/TextBox"
import Spinner from "@/Components/Spinner"
import api from "@/api/api"
import Layout from "@/layout/Layout"
import LoadingIndicator from "@/utils/LoadingIndicator"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export default function EditUser() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [isUpload, setIsUpload] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  })

  const [oldFormData, setOldFormData] = useState({
    name: "",
    email: "",
    role: "",
  })

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    const fetchUserData = async () => {
      try {
        const userData = await api.get(`users/users/${id}`, authToken)
        setFormData({
          name: userData.attributes.name,
          email: userData.attributes.email,
          role: userData.attributes.role,
        })
        setOldFormData({
          name: userData.attributes.name,
          email: userData.attributes.email,
          role: userData.attributes.role,
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("فشل جلب البيانات")
      }
      setLoading(true)
    }

    if (id) {
      fetchUserData()
    }
  }, [id])

  const handleUpdate = async () => {
    const authToken = localStorage.getItem("authToken")
    try {
      setIsUpload(true);
      const formDataForApi = new FormData()
      if (formData.name !== oldFormData.name) {
        formDataForApi.append("name", formData.name)
      }
      if (formData.email !== oldFormData.email) {
        formDataForApi.append("email", formData.email)
      }
      if (formData.role !== oldFormData.role) {
        formDataForApi.append("role", formData.role)
      }
      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          setIsUpload(false);
          toast.warning("كلمة السر غير متطابقة")
          return
        } else {
          formDataForApi.append("password", formData.password)
          formDataForApi.append(
            "password_confirmation",
            formData.password_confirmation
          )
        }
      }

      if (
        formData.name == "" ||
        formData.email == "" ||
        formData.password == "" ||
        formData.password_confirmation == "" ||
        (formData.name == oldFormData.name &&
          formData.email == oldFormData.email &&
          formData.role == oldFormData.role &&
          formData.password != formData.password_confirmation)
      ) {
        setIsUpload(false);
        toast.warning("لم تقم بتعديل اي شيء")
        router.push("/Users")
      } else {
        const response = await api.post(
          `users/edit/${id}`,
          formDataForApi,
          authToken
        )
        setIsUpload(false);
        toast.success("تم تحديث البيانات بنجاح")
        router.push("/Users")
      }
    } catch (error) {
      setIsUpload(false);
      console.error("Error updating user data:", error)
      toast.error("حدث خطأ أثناء تحديث البيانات.")
    }
  }

  const array = {
    data: [
      { id: "user", attributes: { name: "مستخدم" } },
      { id: "admin", attributes: { name: "مشرف" } },
      { id: "marketer", attributes: { name: "مسوق" } },
      { id: "company", attributes: { name: "شركة" } },
    ],
  }

  return (
    <>
      {!loading ? (
        <LoadingIndicator />
      ) : (
        <Layout>
          {isUpload && <Spinner text="...جاري حفظ التعديلات" />}
          <div className='flex mt-5 flex-col w-full items-center justify-between pb-4 bg-white dark:bg-white rounded-md text-black'>
            <div className='flex items-center space-x-4 w-full p-4' dir='rtl'>
              <form className='w-full'>
                <DropDownList
                  title='نوع المستخدم'
                  options={array.data}
                  selectedValue={formData.role}
                  onSelect={(e) => setFormData({ ...formData, role: e })}
                />
                <TextBox
                  type='text'
                  id='name'
                  label='اسم المستخدم'
                  name='name'
                  placeholder='ادخل اسم المستخدم'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                />
                <TextBox
                  type='password'
                  id='password'
                  label='كلمة المرور'
                  name='password'
                  placeholder='ادخل كلمة المرور'
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <TextBox
                  type='password'
                  id='password_confirmation'
                  label='تأكيد كلمة المرور'
                  name='password_confirmation'
                  placeholder='أعد إدخال كلمة المرور'
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password_confirmation: e.target.value,
                    })
                  }
                  error={
                    formData.password_confirmation === ""
                      ? "هذا الحقل إجباري"
                      : false
                  }
                />
                <button
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600`}
                  type='button'
                  onClick={handleUpdate}
                >
                  تحديث
                </button>
              </form>
            </div>
          </div>
        </Layout>
      )}
    </>
  )
}
