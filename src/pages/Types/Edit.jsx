import TextBox from "@/Components/FormsComponents/Inputs/TextBox"
import Spinner from "@/Components/Spinner"
import api from "@/api/api"
import Layout from "@/layout/Layout"
import LoadingIndicator from "@/utils/LoadingIndicator"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export default function EditTypes() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [isUpload, setIsUpload] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    imageUrl: null,
  })

  const [oldformData, setOldformData] = useState({
    name: "",
    image: null,
  })
  useEffect(() => {
    if (id) {
      fetchTypeData()
    }
  }, [id])

  const fetchTypeData = async () => {
    const authToken = localStorage.getItem("authToken")
    try {
      const typeData = await api.get(`types/types/${id}`, authToken)
      setFormData({
        name: typeData.attributes.name,
        image: typeData.attributes.image,
        imageUrl: typeData.attributes.image,
      })
      setOldformData({
        name: typeData.attributes.name,
        image: typeData.attributes.image,
      })
    } catch (error) {
      console.error("Error fetching Type data:", error)
      toast.error("فشل جلب البيانات")
    }
    setLoading(true)
  }

  const handleUpdate = async () => {
    const authToken = localStorage.getItem("authToken")
    try {
      setIsUpload(true);
      const formDataForApi = new FormData()
      if (
        formData.name != "" &&
        formData.name &&
        formData.name != oldformData.name
      ) {
        formDataForApi.append("name", formData.name)
      }
      if (formData.image) {
        // Check if the uploaded file is an image
        if (
          formData.image instanceof File &&
          formData.image.type.startsWith("image/")
        ) {
          formDataForApi.append("image", formData.image)
        }
      }
      if (
        formData.name == "" ||
        (formData.name == oldformData.name &&
          formData.image == oldformData.image)
      ) {
        setIsUpload(false);
        toast.warning("لم تقم بتعديل اي شيء")
        router.push("/Types")
      } else {
        const response = await api.post(
          `types/${id}/edit`,
          formDataForApi,
          authToken
        )
        setIsUpload(false);
        toast.success("تم تحديث البيانات بنجاح")
        router.push("/Types")
      }
    } catch (error) {
      if (error.response.data.message == "The name has already been taken.")
        console.error("Error updating Type:", error.response.data.message)
      setIsUpload(false);
      toast.error("هذا الأسم مستخدم اكتب اسما اخر")
    }
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
                />

                <div className='flex flex-col'>
                  <label className='text-right mb-2'>الصورة الحالية</label>
                  {formData.image && (
                    <Image
                      width={500}
                      height={500}
                      src={formData.imageUrl}
                      alt='صورة النوع'
                      className='w-40 h-40 object-cover rounded'
                    />
                  )}
                </div>

                <TextBox
                  type='file'
                  id='image'
                  label='  صورة النوع'
                  name='image'
                  placeholder='ادخل صورة النوع'
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files[0],
                      imageUrl: URL.createObjectURL(e.target.files[0]),
                    })
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
