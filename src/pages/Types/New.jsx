import TextBox from "@/Components/FormsComponents/Inputs/TextBox"
import Spinner from "@/Components/Spinner"
import api from "@/api/api"
import Layout from "@/layout/Layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export default function AddTypes() {
  const router = useRouter()
  const [isUpload, setIsUpload] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const checkFormValidity = () => {
    const requiredFields = ["name", "image"]
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
      formDataForApi.append("image", formData.image) // Append the image file to FormData

      const savedData = await api.post(
        "types/types",
        formDataForApi,
        authToken
      )
      setIsUpload(false);
      toast.success("تم حفظ البيانات بنجاح")
      router.push("/Types")
    } catch (error) {
      setIsUpload(false);
      console.error("Error saving data:", error)
      toast.error("هذا النوع تمت اضافتة سابقا استخدم نوع اخر")
    }
  }
  return (
    <Layout>
      {isUpload && <Spinner text="جاري الرفع" />}
      <div className='flex mt-5 flex-col w-full items-center justify-between pb-4 bg-white dark:bg-white rounded-md text-black'>
        <div className='flex items-center space-x-4 w-full p-4' dir='rtl'>
          <form className='w-full '>
            <TextBox
              type='text'
              id='name'
              label='اسم النوع'
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
              type='file'
              id='image'
              label='  صورة النوع'
              name='image'
              placeholder='ادخل صورة النوع'
              value={formData.price}
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
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600`}
              type='button'
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
