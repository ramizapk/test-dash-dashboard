import TextBox from "@/Components/FormsComponents/Inputs/TextBox"
import TextErea from "@/Components/FormsComponents/Inputs/TextErea"
import api from "@/api/api"
import Layout from "@/layout/Layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export default function AddTypes() {
  const router = useRouter()
  const [isFormValid, setIsFormValid] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
  })

  const checkFormValidity = () => {
    const requiredFields = ["name", "image", "description"]

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
      const formDataForApi = new FormData()
      formDataForApi.append("name", formData.name)
      formDataForApi.append("description", formData.description)
      formDataForApi.append("image", formData.image)
      const savedData = await api.post(
        "services/services/",
        formDataForApi,
        authToken
      )
      toast.success("تم حفظ البيانات بنجاح")
      router.push("/Services") // أعد توجيه المستخدم إلى الصفحة المطلوبة بعد الحفظ
    } catch (error) {
      console.error("Error saving data:", error)
      toast.error("حدث خطأ أثناء حفظ البيانات.")
    }
  }
  return (
    <Layout>
      <div className='flex mt-5 flex-col w-full items-center justify-between pb-4 bg-white dark:bg-white rounded-md text-black'>
        <div className='flex items-center space-x-4 w-full p-4' dir='rtl'>
          <form className='w-full '>
            <TextBox
              type='text'
              id='name'
              label='اسم الخدمة'
              name='name'
              placeholder='ادخل اسم الخدمة'
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
            <TextErea
              id='description'
              label='وصف الخدمة'
              name='description'
              placeholder='ادخل وصف الخدمة'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              error={
                formData.description == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <TextBox
              type='file'
              id='photo'
              label='  صورة الخدمة    '
              name='price'
              placeholder='ادخل صورة النوع'
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              error={
                formData.image === null && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <button
              type='button'
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 `}
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
