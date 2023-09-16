import TextBox from "@/Components/FormsComponents/Inputs/TextBox"
import Spinner from "@/Components/Spinner"
import api from "@/api/api"
import Layout from "@/layout/Layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
export default function New() {
  const router = useRouter()
  const [isUpload, setIsUpload] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  })

  const [isFormValid, setIsFormValid] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const checkFormValidity = () => {
    if (formData.name == "") {
      return false
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
      const savedData = await api.post(
        "locations/location",
        formData,
        authToken
      )
      setIsUpload(false);
      toast.success("تم حفظ البيانات بنجاح")
      router.push("/Locations")
    } catch (error) {
      setIsUpload(false);
      console.error("Error saving data:", error)
      toast.error("هذا الموقع تمت اضافتة سابقا استخدم موقع اخر")
    }
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
              label='اسم الموقع'
              name='name'
              placeholder='ادخل اسم الموقع'
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
