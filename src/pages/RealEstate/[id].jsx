import Layout from "@/layout/Layout"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { FaStar, FaStarHalfAlt } from "react-icons/fa"
import RatingStars from "react-rating-stars-component"
import "tailwindcss/tailwind.css"
// import defaultPhoto from "@/images/applogo.png"
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}/${month}/${day}`
}

export default function Details() {
  const router = useRouter()
  const { query } = router
  const jsonData = JSON.parse(query.jsonData)
  const extractedDate = formatDate(jsonData.attributes.date)
  const [selectedImage, setSelectedImage] = useState(jsonData.attributes.photo)

  const handleThumbnailClick = (image) => {
    setSelectedImage(image)
  }

  return (
    <Layout>
      <div
        className='flex mt-5 flex-col w-full items-center justify-between pb-4 bg-white dark:bg-white rounded-md text-black'
        dir='ltr'
      >
        <div className='text-black' dir='rtl'>
          <div className='flex flex-row '>
            <div className='p-10 w-2/5'>
              <div className='border-b-2 pb-3'>
                <h1 className='text-2xl font-semibold mb-4'>
                  {jsonData.attributes.name}
                </h1>
                <span className='flex flex-row gap-1 items-center'>
                  <p className='font-medium'>
                    {jsonData.attributes.firstType.name}
                  </p>
                  |
                  <p className='font-medium'>
                    {jsonData.attributes.secondType == "for rent"
                      ? "للإيجار"
                      : "للبيع"}
                  </p>
                </span>
                <span className='flex flex-row gap-1'>
                  <p className='font-medium'>سعر العقار :</p>
                  <p className='text-blue-700'>{jsonData.attributes.price}</p>
                  ريال يمني
                </span>
                <p
                  className={
                    jsonData.attributes.state == "Unavailable"
                      ? "bg-red-700 text-white py-2 px-5 w-fit rounded-md mt-2"
                      : "bg-green-700 text-white py-2 px-5 w-fit rounded-md mt-2"
                  }
                >
                  {jsonData.attributes.state == "Unavailable"
                    ? "غير متاح"
                    : "متاح"}
                </p>
              </div>
              <div>
                <h1 className='text-2xl font-semibold mt-5 mb-4'>
                  وصف العقار:
                </h1>
                <h1 className='text-1xl'>{jsonData.attributes.description}</h1>
              </div>
              <div className='flex flex-row justify-start mt-6 '>
                <h1 className='text-1xl font-semibold whitespace-nowrap ml-1'>
                  {" "}
                  الموقع :
                </h1>
                <p>
                  {jsonData.attributes.location.name} /
                  {jsonData.attributes.locationInfo}
                </p>
              </div>

              <div className='flex flex-row justify-start mt-6 '>
                <h1 className='text-1xl font-semibold whitespace-nowrap ml-1'>
                  {" "}
                  عدد الغرف :
                </h1>
                <p>
                  {jsonData.attributes.rooms}
                </p>
              </div>
              <div className='flex flex-row justify-start mt-6 '>
                <h1 className='text-1xl font-semibold whitespace-nowrap ml-1'>
                  {" "}
                  عدد الادوار :
                </h1>
                <p>
                  {jsonData.attributes.floors}
                </p>
              </div>
              <div className='flex flex-row justify-start mt-6 '>
                <h1 className='text-1xl font-semibold whitespace-nowrap ml-1'>
                  {" "}
                  المساحة:
                </h1>
                <p>
                  {jsonData.attributes.area}
                </p>
              </div>
              <div className='flex flex-col justify-start py-2  mt-6 border-y-2 '>
                <h1 className="text-3xl">معلومات البصيرة</h1>
                <div className='flex flex-col justify-start mt-6 '>
                  <div className="flex flex-row justify-start mt-6 ">
                    <h1 className='text-1xl font-semibold whitespace-nowrap ml-1'>
                      البصيرة :
                    </h1>
                    <p>
                      {jsonData.attributes.vision}
                    </p>
                  </div>

                  <div className="flex flex-row justify-start mt-6 ">

                    <h1 className='text-1xl font-semibold whitespace-nowrap ml-1'>
                      التعميد :
                    </h1>
                    <p>
                      {jsonData.attributes.baptism}
                    </p>
                  </div>
                </div>
              </div>
              <div className='mt-6 flex flex-row'>
                <h1 className='text-1xl font-semibold ml-1'>التقييم:</h1>
                <RatingStars
                  value={jsonData.attributes.ratings.average_rating}
                  count={5}
                  size={24}
                  activeColor='#ffd700'
                  edit={false}
                  isHalf={true}
                  emptyIcon={<FaStar className='text-gray-300' />}
                  halfIcon={<FaStarHalfAlt className='text-yellow-500' />}
                  filledIcon={<FaStar className='text-yellow-500' />}
                />
                <p className='text-xl text-gray-600 mr-1'>
                  ({jsonData.attributes.ratings.rating_count} تقييم)
                </p>
              </div>

              <div className='flex flex-row items-center mt-6'>
                <h1 className='text-1xl font-semibold ml-1'>
                  تاريخ اضافة العقار :
                </h1>
                <p> {extractedDate}</p>
              </div>
            </div>
            <div className='photos w-3/5'>
              <div className='flex flex-row gap-2'>
                <div>
                  <Image
                    src={selectedImage}
                    alt='Selected'
                    // layout='responsive'
                    width={2000}
                    height={1000}
                    onError={(e) => {
                      e.target.src = "/images/applogo.png";
                    }}
                  />
                </div>
                <div className='flex flex-col p-0'>
                  <div className='mb-2'>
                    <Image
                      src={jsonData.attributes.photo}
                      alt={jsonData.attributes.photo}
                      width={150}
                      height={150}
                      objectFit='cover'
                      onClick={() =>
                        handleThumbnailClick(jsonData.attributes.photo)
                      }
                      onError={(e) => {
                        e.target.src = "/images/applogo.png";
                      }}
                    />
                  </div>

                  {jsonData.attributes.images.map((image, index) => (
                    <div key={index} className='mb-2'>
                      <Image
                        src={image}
                        alt={`Image ${index}`}
                        width={50}
                        height={100}
                        objectFit='cover'
                        onClick={() => handleThumbnailClick(image)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
