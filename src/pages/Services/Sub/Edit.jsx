import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import TextBox from "@/Components/FormsComponents/Inputs/TextBox"
import TextErea from "@/Components/FormsComponents/Inputs/TextErea"
import api from "@/api/api"
import { fetchServices } from "@/api/fetchData"
import Layout from "@/layout/Layout"
import LoadingIndicator from "@/utils/LoadingIndicator"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export default function EditService() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const [services, setServices] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    construction_service_id: "",
  })

  const [oldformData, setOldformData] = useState({
    name: "",
    image: null,
    description: "",
    construction_service_id: "",
  })
  async function fetchServiceData() {
    const authToken = localStorage.getItem("authToken")
    try {
      const servicesData = await fetchServices(authToken)

      setServices(servicesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const fetchSubServiceData = async () => {
    const authToken = localStorage.getItem("authToken")
    try {
      const subServiceData = await api.get(`subServices/${id}`, authToken)
      setFormData({
        name: subServiceData.attributes.name,
        image: subServiceData.attributes.image,
        description: subServiceData.attributes.description,
        construction_service_id:
          subServiceData.attributes.construction_service_id,
        imageUrl: subServiceData.attributes.image,
      })

      setOldformData({
        name: subServiceData.attributes.name,
        image: subServiceData.attributes.image,
        description: subServiceData.attributes.description,
        construction_service_id:
          subServiceData.attributes.construction_service_id,
      })
    } catch (error) {
      console.error("Error fetching SubService data:", error)
      toast.error("فشل جلب البيانات")
    }
    setLoading(true)
  }
  useEffect(() => {
    if (id) {
      fetchServiceData()
      fetchSubServiceData()
    }
  }, [id])

  const handleUpdate = async () => {
    const authToken = localStorage.getItem("authToken")
    try {
      const formDataForApi = new FormData()
      if (formData.name && formData.name !== oldformData.name) {
        formDataForApi.append("name", formData.name)
      }
      if (
        formData.description &&
        formData.description !== oldformData.description
      ) {
        formDataForApi.append("description", formData.description)
      }
      if (formData.image) {
        if (
          formData.image instanceof File &&
          formData.image.type.startsWith("image/")
        ) {
          formDataForApi.append("image", formData.image)
        }
      }
      if (
        formData.construction_service_id !== oldformData.construction_service_id
      ) {
        formDataForApi.append(
          "construction_service_id",
          formData.construction_service_id
        )
      }
      if (
        formData.name == "" ||
        formData.description == "" ||
        (formData.name === oldformData.name &&
          formData.description === oldformData.description &&
          formData.image === oldformData.image &&
          formData.construction_service_id ===
          oldformData.construction_service_id)
      ) {
        toast.warning("لم تقم بتعديل أي شيء")
        router.push("/Services")
      } else {
        const response = await api.post(
          `subServices/${id}/edit`,
          formDataForApi,
          authToken
        )
        toast.success("تم تحديث البيانات بنجاح")
        router.push("/Services")
      }
    } catch (error) {
      if (error.response.data.message === "Some specific error message") {
        console.error("Error updating Service:", error.response.data.message)
        toast.error("اسم الخدمة مستخدم من قبل")
      } else {
        console.error("Error updating Service:", error)
        toast.error("حدث خطأ أثناء تحديث البيانات.")
      }
    }
  }

  return (
    <>
      {!loading ? (
        <LoadingIndicator />
      ) : (
        <Layout>
          <div className='flex mt-5 flex-col w-full items-center justify-between pb-4 bg-white dark:bg-white rounded-md text-black'>
            <div className='flex items-center space-x-4 w-full p-4' dir='rtl'>
              <form className='w-full'>
                <DropDownList
                  title='الخدمة الرئيسية'
                  options={services}
                  selectedValue={formData.construction_service_id}
                  onSelect={(e) =>
                    setFormData({ ...formData, construction_service_id: e })
                  }
                />
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
                />
                <div className='flex flex-col'>
                  <label className='text-right mb-2'>الصورة الحالية</label>
                  {formData.image && (
                    <Image
                      width={500}
                      height={500}
                      src={formData.imageUrl}
                      alt='صورة الخدمة'
                      className='w-40 h-40 object-cover rounded'
                    />
                  )}
                </div>
                <TextBox
                  type='file'
                  id='image'
                  label='صورة الخدمة'
                  name='image'
                  placeholder='ادخل صورة الخدمة'
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
