import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import TextBox from "@/Components/FormsComponents/Inputs/TextBox"
import TextErea from "@/Components/FormsComponents/Inputs/TextErea"
import Spinner from "@/Components/Spinner"
import api from "@/api/api"
import { fetchLocations, fetchTypes } from "@/api/fetchData"
import Layout from "@/layout/Layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export default function New() {
  const [isUpload, setIsUpload] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const router = useRouter()
  const [types, setTypes] = useState([])
  const [locations, setLocations] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    location: "",
    photo: null,
    firstType: "",
    locationInfo: "",
    rooms: "",
    floors: "",
    vision: "",
    baptism: "",
    area: "",
    secondType: "", // An array to hold selected event types
    images: [], // Uploaded file (event image)
  })

  useEffect(() => {
    // جلب بيانات النوع والمواقع وتخزينها في الحالة عند تحميل المكون
    async function fetchData() {
      const authToken = localStorage.getItem("authToken")
      try {
        const typesData = await fetchTypes(authToken)
        const locationsData = await fetchLocations(authToken)
        setTypes(typesData)
        setLocations(locationsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const checkFormValidity = () => {
    const requiredFields = [
      "name",
      "price",
      "description",
      "location",
      "locationInfo",
      "firstType",
      "secondType",
      "photo",
      "area",
    ]

    for (const field of requiredFields) {
      if (!formData[field]) {
        return false
      }
    }

    // Check if images array has at least one image selected
    if (formData.images.length === 0) {
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
      const formDataForApi = new FormData()

      formDataForApi.append("name", formData.name)
      formDataForApi.append("description", formData.description)
      formDataForApi.append("price", parseInt(formData.price))
      formDataForApi.append("location", formData.location)
      formDataForApi.append("locationInfo", formData.locationInfo)
      formDataForApi.append("firstType", formData.firstType)
      formDataForApi.append("secondType", formData.secondType)

      formDataForApi.append("rooms", formData.rooms)
      formDataForApi.append("floors", formData.floors)
      formDataForApi.append("vision", formData.vision)
      formDataForApi.append("baptism", formData.baptism)
      formDataForApi.append("area", formData.area)
      formDataForApi.append("photo", formData.photo)
      // Multiple images handling
      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataForApi.append("images[]", image)
        })
      }

      const savedData = await api.post(
        "realEstate/realty",
        formDataForApi,
        authToken
      )
      setIsUpload(false);
      toast.success("تم حفظ البيانات بنجاح")
      router.push("/RealEstate") // أعد توجيه المستخدم إلى الصفحة المطلوبة بعد الحفظ
    } catch (error) {
      setIsUpload(false);
      console.error("Error saving data:", error)
      toast.error("حدث خطأ أثناء حفظ البيانات.")
    }
  }

  const array = {
    data: [
      {
        id: "for rent",
        attributes: {
          name: "ايجار",
        },
      },

      {
        id: "for sale",
        attributes: {
          name: "بيع",
        },
      },
    ],
  }

  const onChange = (e) => {
    setFormData({
      ...formData,
      location: e.target.value,
    })
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
              label='اسم العقار'
              name='name'
              placeholder='ادخل اسم العقار'
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
              type='number'
              id='price'
              label='سعر العقار'
              name='price'
              placeholder='ادخل سعر العقار'
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              error={
                formData.price == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <TextErea
              id='description'
              label='وصف العقار'
              name='description'
              placeholder='ادخل وصف العقار'
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
            <DropDownList
              title='موقع العقار'
              options={locations}
              onSelect={(e) => setFormData({ ...formData, location: e })}
              error={
                formData.location == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <TextBox
              type='text'
              id='locationInfo'
              label='عنوان العقار'
              name='locationInfo'
              placeholder='ادخل عنوان العقار'
              value={formData.locationInfo}
              onChange={(e) =>
                setFormData({ ...formData, locationInfo: e.target.value })
              }
              error={
                formData.locationInfo == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <DropDownList
              title='نوع العقار'
              options={types}
              onSelect={(e) => setFormData({ ...formData, firstType: e })}
              error={
                formData.firstType == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />{" "}
            <DropDownList
              title='طبيعة العقار'
              options={array.data}
              onSelect={(e) => setFormData({ ...formData, secondType: e })}
              error={
                formData.secondType == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <TextBox
              type='text'
              id='rooms'
              label='عدد الغرف'
              name='rooms'
              placeholder='ادخل عدد الغرف '
              value={formData.rooms}
              onChange={(e) =>
                setFormData({ ...formData, rooms: e.target.value })
              }
            />
            <TextBox
              type='text'
              id='floors'
              label='عدد الادوار '
              name='floors'
              placeholder='   ادخل عدد الادوار'
              value={formData.floors}
              onChange={(e) =>
                setFormData({ ...formData, floors: e.target.value })
              }

            />
            <TextBox
              type='text'
              id='vision'
              label=' البصيرة'
              name='vision'
              placeholder='ادخل البصيرة '
              value={formData.vision}
              onChange={(e) =>
                setFormData({ ...formData, vision: e.target.value })
              }

            />
            <TextBox
              type='text'
              id='baptism'
              label=' التعميد'
              name='baptism'
              placeholder='ادخل  التعميد'
              value={formData.baptism}
              onChange={(e) =>
                setFormData({ ...formData, baptism: e.target.value })
              }

            />
            <TextBox
              type='text'
              id='area'
              label=' المساحة'
              name='area'
              placeholder='ادخل  المساحة'
              value={formData.area}
              onChange={(e) =>
                setFormData({ ...formData, area: e.target.value })
              }
              error={
                formData.area == "" && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <TextBox
              type='file'
              id='photo'
              label=' صورة العقار الرئيسية'
              name='photo'
              placeholder='ادخل صورة العقار'
              onChange={(e) =>
                setFormData({ ...formData, photo: e.target.files[0] })
              }
              error={
                formData.photo === null && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
            />
            <TextBox
              type='file'
              id='images'
              label=' صور العقار '
              name='images'
              placeholder='ادخل صور العقار'
              onChange={(e) =>
                setFormData({ ...formData, images: Array.from(e.target.files) })
              }
              error={
                formData.images.length === 0 && isFormSubmitted
                  ? "هذا الحقل إجباري"
                  : false
              }
              multiple
            />
            <button
              type='button'
              //   disabled={!isFormValid}
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
