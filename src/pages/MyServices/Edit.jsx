import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import TextBox from "@/Components/FormsComponents/Inputs/TextBox"
import TextErea from "@/Components/FormsComponents/Inputs/TextErea"
import Spinner from "@/Components/Spinner"
import api from "@/api/api"
import Layout from "@/layout/Layout"
import LoadingIndicator from "@/utils/LoadingIndicator"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function EditService() {
  const [loading, setLoading] = useState(false)
  const [isUpload, setIsUpload] = useState(false);
  const router = useRouter()
  const { id } = router.query
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    type: "",
    imageUrl: null,
  })

  const [oldformData, setOldformData] = useState({
    name: "",
    image: null,
    type: "",
    description: "",
  })

  useEffect(() => {
    if (id) {
      fetchServiceData()
    }
  }, [id])

  const fetchServiceData = async () => {
    const authToken = localStorage.getItem("authToken")
    try {
      const serviceData = await api.get(`NewServices/services/${id}`, authToken)
      setFormData({
        name: serviceData.attributes.name,
        image: serviceData.attributes.image,
        description: serviceData.attributes.description,
        type: serviceData.attributes.type,
        imageUrl: serviceData.attributes.image,
      })
      setOldformData({
        name: serviceData.attributes.name,
        image: serviceData.attributes.image,
        type: serviceData.attributes.type,
        description: serviceData.attributes.description,
      })
    } catch (error) {
      console.error("Error fetching Service data:", error)
      toast.error("فشل جلب البيانات")
    }
    setLoading(true)
  }

  const handleUpdate = async () => {
    const authToken = localStorage.getItem("authToken")
    try {
      setIsUpload(true);
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

      if (
        formData.type &&
        formData.type !== oldformData.type
      ) {
        formDataForApi.append("type", formData.type)
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
        formData.name == "" ||
        formData.description == "" ||
        formData.type == "" ||
        (formData.name === oldformData.name &&
          formData.description === oldformData.description &&
          formData.type === oldformData.type &&
          formData.image === oldformData.image)
      ) {
        setIsUpload(false);
        toast.warning("لم تقم بتعديل أي شيء")
        router.push("/MyServices")
      } else {
        const response = await api.post(
          `NewServices/${id}/edit`,
          formDataForApi,
          authToken
        )
        setIsUpload(false);
        toast.success("تم تحديث البيانات بنجاح")
        router.push("/MyServices")
      }
    } catch (error) {
      if (error.response.data.message === "Some specific error message") {
        setIsUpload(false);
        console.error("Error updating Service:", error.response.data.message)
        toast.error("رسالة الخطأ الخاصة بك هنا")
      } else {
        setIsUpload(false);
        console.error("Error updating Service:", error)
        toast.error("حدث خطأ أثناء تحديث البيانات.")
      }
    }
  }
  const array = {
    data: [
      {
        id: "1",
        attributes: {
          name: "خدمات انشائية وصيانة",
        },
      },
      {
        id: "2",
        attributes: {
          name: "موارد بناء وتوريدات",
        },
      },
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
                  title='الخدمة الرئيسية'
                  selectedValue={formData.type}
                  options={array.data}
                  onSelect={(e) =>
                    setFormData({ ...formData, type: e })
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
