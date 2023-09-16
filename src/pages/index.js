// import Card from '@/Components/Card'
import Card from "@/Components/Card"
import HomeTable from "@/Components/HomeTable"
import api from "@/api/api"
import Layout from "@/layout/Layout"
import Image from "next/image"
import { useEffect, useState } from "react"
import { AiOutlineHome, AiOutlineTool } from "react-icons/ai"
import { FaClipboardCheck, FaClipboardList } from "react-icons/fa"

export default function Home() {
  const [statistics, setStatistics] = useState({
    myStatistics: [],
    latestRealEstateOrders: [],
    latestServiceOrders: [],
    latestRealEstates: [],
  })
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function fetchStatistics() {
      const authToken = localStorage.getItem("authToken")
      try {
        const statisticsData = await api.get("statistics", authToken)
        setStatistics({
          ...statistics,
          myStatistics: statisticsData.statistics,
          latestRealEstateOrders: statisticsData.latestRealEstateOrders,
          latestServiceOrders: statisticsData.latestServiceOrders,
          latestRealEstates: statisticsData.latestRealEstates,
        })
      } catch (error) {
        console.error("Error fetching real estates:", error)
      }
      setLoading(true)
    }
    fetchStatistics()
  }, [])

  const realEstateColumns = [
    { key: "id", label: "الرقم" },
    {
      key: "attributes",
      label: "العقار",
      render: (item) => (
        <div className='flex items-center'>
          <Image
            width={50}
            height={50}
            className='w-10 h-10 rounded-full ml-2'
            src={
              item.attributes.photo.startsWith("storage")
                ? `http://127.0.0.1:8000/${item.attributes.photo}`
                : item.attributes.photo
            }
            alt='Jese image'
          />
          <div className='pl-3'>
            <div className='text-base font-semibold'>
              {item.attributes.name}
            </div>
            <div className='font-normal text-gray-500'>
              {item.attributes.firstType.name}/
              {item.attributes.secondType == "for rent" ? "للايجار" : "للبيع"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "الموقع",
      render: (item) => (
        <div>
          {item.attributes.location.name}/{item.attributes.locationInfo}
        </div>
      ),
    },
    {
      key: "price",
      label: "السعر",
      render: (item) => <div>{item.attributes.price}</div>,
    },
  ]

  const orderColumns = [
    { key: "id", label: "الرقم" },
    {
      key: "realEstate",
      label: "العقار",
      render: (item) => (
        <div className='flex items-center'>
          <Image
            width={50}
            height={50}
            className='w-10 h-10 rounded-full ml-2'
            src={item.real_estate.attributes.photo}
            alt='Jese image'
          />
          <div className='pl-3'>
            <div className='text-base font-semibold'>
              {item.real_estate.attributes.name}
            </div>
            <div className='font-normal text-gray-500'>
              {item.real_estate.attributes.firstType.name}/
              {item.real_estate.attributes.secondType}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "مقدم الطلب",
      render: (item) => (
        <div className='flex items-center'>
          <Image
            width={50}
            height={50}
            className='w-10 h-10 rounded-full ml-2'
            src={item.user.userImage}
            alt='Jese image'
          />
          <div className='pl-3'>
            <div className='text-base font-semibold'>{item.user.name}</div>
            <div className='font-normal text-gray-500'>{item.user.email}</div>
            <div className='font-normal text-gray-500'>
              {item.user.phoneNumber}
            </div>
          </div>
        </div>
      ),
    },
  ]
  const servicesOrdersColumns = [
    { key: "id", label: "الرقم" },
    {
      key: "service",
      label: "الخدمة",
      render: (item) => (
        <div className='flex items-center'>
          <Image
            width={50}
            height={50}
            className='w-10 h-10 rounded-full ml-2'
            src={item.service.attributes.image}
            alt='Jese image'
          />
          <div className='pl-3'>
            <div className='text-base font-semibold whitespace-nowrap'>
              {item.service.attributes.name}
            </div>
            <div className='font-normal text-gray-500'>

              {item.service.attributes.type == 1 ? "خدمات انشائية وصيانة" : "موارد بناء وتوريدات"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "مقدم الطلب",
      render: (item) => (
        <div className='flex items-center'>
          <Image
            width={50}
            height={50}
            className='w-10 h-10 rounded-full ml-2'
            src={item.user.userImage}
            alt='Jese image'
          />
          <div className='pl-3'>
            <div className='text-base font-semibold'>{item.user.name}</div>
            <div className='font-normal text-gray-500'>{item.user.email}</div>
            <div className='font-normal text-gray-500'>
              {item.user.phoneNumber}
            </div>
          </div>
        </div>
      ),
    },
  ]
  return (
    <Layout>
      <div
        className='grid grid-cols-4 my-0 gap-4 md:grid-cols-1 py-0 text-black w-full'
        dir='rtl'
      >
        <Card
          id='1'
          icon={<AiOutlineHome size={69} color='#3498db' />} // أيقونة تمثيل عدد العقارات مع لون أزرق ملائم
          title='عدد العقارات'
          value={statistics.myStatistics.realEstatesCount}
          label='العدد الاجمالي'
          color='#3498db'
        />
        <Card
          id=''
          icon={<AiOutlineTool size={69} color='#27ae60' />} // أيقونة تمثيل عدد الخدمات مع لون أخضر ملائم
          title='عدد الخدمات'
          value={statistics.myStatistics.totalServices}
          label='العدد الاجمالي'
          color='#27ae60'
        />
        <Card
          id='1'
          icon={<FaClipboardList size={69} color='#3498db' />} // أيقونة تمثيل طلبات العقارات مع لون أزرق ملائم
          title=' طلبات العقارات'
          value={statistics.myStatistics.realEstateOrdersCount}
          label='العدد الاجمالي'
          color='#3498db'
        />
        <Card
          id='1'
          icon={<FaClipboardCheck size={69} color='#2c3e50' />} // أيقونة تمثيل طلبات الخدمات مع لون أخضر داكن ملائم
          title=' طلبات الخدمات'
          value={statistics.myStatistics.serviceOrdersCount}
          label='العدد الاجمالي'
          color='#2c3e50'
        />
      </div>

      <div
        className='grid grid-cols-2 mt-5 gap-4 md:grid-cols-1 py-0 text-black w-full'
        dir='rtl'
      >
        <div className=' py-5'>
          <h1 className='mb-0 mr-0 bg-white p-8 w-full whitespace-nowrap'>
            احدث العقارات
          </h1>
          <HomeTable
            columns={realEstateColumns}
            data={statistics.latestRealEstates}
          />
        </div>
        <div>
          <div className=' py-5'>
            <h1 className='mb-0 mr-0 bg-white p-8 w-full whitespace-nowrap'>
              احدث طلبات العقارات
            </h1>
            <HomeTable
              columns={orderColumns}
              data={statistics.latestRealEstateOrders}
            />
          </div>
          <div className=' py-5'>
            <h1 className='mb-0 mr-0 bg-white p-8 w-full whitespace-nowrap'>
              احدث طلبات الخدمات
            </h1>
            <HomeTable
              columns={servicesOrdersColumns}
              data={statistics.latestServiceOrders}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
