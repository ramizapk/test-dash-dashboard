import Card from "@/Components/Card"
import CustomTable from "@/Components/CustomTable"
import PrimaryBt from "@/Components/FormsComponents/Buttons/PrimaryBt"
import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import Search from "@/Components/FormsComponents/Inputs/Search"
import api from "@/api/api"
import { searchOrders } from "@/api/filtersData"
import Layout from "@/layout/Layout"
import LoadingIndicator from "@/utils/LoadingIndicator"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BiHomeAlt } from "react-icons/bi"
import { FaToolbox } from "react-icons/fa"
import { HiOutlineClipboardCheck } from "react-icons/hi"
import { IoMdCheckmarkCircle } from "react-icons/io"
import { toast } from "react-toastify"
export default function Index() {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [sevices, setSevices] = useState([])
  const [data, setData] = useState([])

  const [endpoint, setEndpoint] = useState("orders")
  const [searchResults, setSearchResults] = useState([])

  async function fetchOrders() {
    const authToken = localStorage.getItem("authToken")
    try {
      const ordersData = await api.get(endpoint, authToken)
      setOrders(ordersData.orders)

      const servicesOrdersData = await api.get("NewServicesOrders", authToken)
      setSevices(servicesOrdersData.orders)


    } catch (error) {
      console.error("Error fetching orders:", error)
    }
    setLoading(true)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    setData(orders)
  }, [orders])

  const handleOptionSelect = (selectedId) => {
    if (selectedId == 1) {
      setEndpoint("orders")
      setSearchResults("")
      setData(orders)
    } else if (selectedId == 2) {
      setEndpoint("NewServicesOrders")
      setSearchResults("")
      setData(sevices)
    }

    console.log(`Selected ID: ${selectedId}`)
  }

  const handleStatusSelect = (selectedId) => {
    const filteredResults = data.filter((item) => item.status === selectedId)
    setSearchResults(filteredResults)
  }

  const getApprovedServicesCount = () => {
    const approvedServicesCount = sevices.filter(
      (item) => item.status === "Approved"
    ).length
    return approvedServicesCount
  }

  // حساب عدد الطلبات بحالة "Under Review" في جدول الخدمات
  const getUnderReviewServicesCount = () => {
    const underReviewServicesCount = sevices.filter(
      (item) => item.status === "Under Review"
    ).length
    return underReviewServicesCount
  }

  // حساب عدد الطلبات بحالة "Approved" في جدول العقارات
  const getApprovedOrdersCount = () => {
    const approvedOrdersCount = orders.filter(
      (item) => item.status === "Approved"
    ).length
    return approvedOrdersCount
  }

  // حساب عدد الطلبات بحالة "Under Review" في جدول العقارات
  const getUnderReviewOrdersCount = () => {
    const underReviewOrdersCount = orders.filter(
      (item) => item.status === "Under Review"
    ).length
    return underReviewOrdersCount
  }

  const handleSearch = (searchTerm) => {
    const filteredResults = searchOrders(searchTerm, data, endpoint)
    setSearchResults(filteredResults)
    console.log("تم البحث عن:", searchTerm)
  }

  const handleEdit = (item) => {
    console.log(item.id)
  }

  const handleDelete = async (item) => {
    const authToken = localStorage.getItem("authToken")

    try {
      await api.post(`${endpoint}/delete/${item.id}`, null, authToken)
      // إزالة العنصر المحذوف من القائمة
      const updatedOrders = data.filter((odrer) => odrer.id !== item.id)
      setData(updatedOrders)
      if (endpoint == "orders") {
        setOrders(updatedOrders)
      } else {
        setSevices(updatedOrders)
      }
      toast.success("تم حذف الطلب بنجاح")
    } catch (error) {
      toast.error("خطأ أثناء حذف الطلب")
    }
  }

  const array = {
    data: [
      {
        id: "1",
        attributes: {
          name: "طلبات العقارات",
        },
      },
      {
        id: "2",
        attributes: {
          name: "طلبات الخدمات",
        },
      },
    ],
  }

  const array2 = {
    data: [
      {
        id: "Under Review",
        attributes: {
          name: "تحت المراجعة",
        },
      },
      {
        id: "Approved",
        attributes: {
          name: "تمت الموافقة علية",
        },
      },
    ],
  }
  const status = (item, type) => {
    if (item.status == "Under Review") {
      return (
        <div className='flex flex-row'>
          <p className='text-red-700 ml-5'>تحت المراجعه</p>[
          <button
            className='text-blue-600'
            onClick={() => {
              changeOrderStatus(item.id, type)
            }}
          >
            الموافقه على الطلب
          </button>
          ]
        </div>
      )
    } else {
      return (
        <div className='flex flex-row'>
          <p className='text-green-700 ml-5'>تمت الموافقة </p>[
          <button
            className='text-red-600'
            onClick={() => {
              changeOrderStatus(item.id, type)
            }}
          >
            الغاء الموافقة
          </button>
          ]
        </div>
      )
    }
  }
  const changeOrderStatus = async (itemId, type) => {
    const authToken = localStorage.getItem("authToken")
    let approveLink
    if (type == "realEstate") {
      approveLink = "/orders/approve/"
    }
    if (type == "service") {
      approveLink = "NewServicesOrders/approve/"
    }
    try {
      const formDataForApi = new FormData()
      const response = await api.put(`${approveLink}${itemId}`, null, authToken)
      toast.success("تم تحديث حالة الطلب بنجاح")
      const updatedOrders = data.map((order) => {
        if (order.id === itemId) {
          return {
            ...order,
            status:
              order.status == "Under Review" ? "Approved" : "Under Review",
          }
        }
        return order
      })
      setData(updatedOrders)
    } catch (error) {
      console.error("Error updating realty data:", error)
      toast.error("حدث خطأ أثناء تحديث البيانات.")
    }
  }

  const columns = [
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
    {
      key: "message",
      label: "نص الطلب",
      render: (item) => <div>{item.message}</div>,
    },
    {
      key: "status",
      label: "حالة الطلب",
      render: (item) => <div>{status(item, "realEstate")}</div>,
    },
  ]

  const columns2 = [
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
            <div className='font-normal text-gray-500'> {item.service.attributes.type == 1 ? "خدمات انشائية وصيانة" : "موارد بناء وتوريدات"}</div>
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
    {
      key: "message",
      label: "نص الطلب",
      render: (item) => <div>{item.message}</div>,
    },
    {
      key: "status",
      label: "حالة الطلب",
      render: (item) => <div> {status(item, "service")}</div>,
    },
  ]

  return (
    <>
      {!loading ? (
        <LoadingIndicator />
      ) : (
        <Layout>
          {/* // page container */}
          <div
            className='grid grid-cols-4 my-0 gap-4 md:grid-cols-1 py-0 text-black w-full'
            dir='rtl'
          >
            <Card
              id='1'
              icon={<BiHomeAlt size={69} color='#3498db' />} // أيقونة تمثيل طلبات العقارات مع لون أزرق ملائم
              title='طلبات العقارات'
              value={orders.length}
              label='العدد الاجمالي'
              color='#3498db'
            />
            <Card
              id=''
              icon={<FaToolbox size={69} color='#e67e22' />} // أيقونة تمثيل طلبات الخدمات مع لون برتقالي ملائم
              title='طلبات الخدمات'
              value={sevices.length}
              label='العدد الاجمالي'
              color='#e67e22'
            />
            <Card
              id='1'
              icon={<IoMdCheckmarkCircle size={69} color='#27ae60' />} // أيقونة تمثيل الموافق عليها مع لون أخضر ملائم
              title='الموافق عليها'
              value={getApprovedServicesCount() + getApprovedOrdersCount()}
              label='العدد الاجمالي'
              color='#27ae60'
            />
            <Card
              id='1'
              icon={<HiOutlineClipboardCheck size={69} color='#f39c12' />} // أيقونة تمثيل تحت المراجعة مع لون أصفر ملائم
              title='تحت المراجعة'
              value={
                getUnderReviewServicesCount() + getUnderReviewOrdersCount()
              }
              label='العدد الاجمالي'
              color='#f39c12'
            />
          </div>
          <div className='flex mt-5 flex-col w-full items-center justify-between pb-4 bg-white dark:bg-white rounded-md text-black'>
            {/* filter container */}

            <div className='flex items-center space-x-4 w-full p-4' dir='rtl'>
              <div className='flex flex-col gap-y-4 w-full'>
                <div>
                  <p>خيارات البحث</p>
                </div>
                <div className='flex w-full '>
                  <DropDownList
                    title='اختر نوع الطلب'
                    options={array.data}
                    onSelect={handleOptionSelect}
                  />
                  <DropDownList
                    title='اختر حالة الطلب'
                    options={array2.data}
                    onSelect={handleStatusSelect}
                  />

                  {/* <DropDownList />
                            <DropDownList />
                            <DropDownList /> */}
                </div>
                <div className='flex justify-between border-t-2 pt-5'>
                  <div>

                    <PrimaryBt type='export' name='تصدير' onClick={() => { }} />
                  </div>

                  <div>
                    <Search onSearch={handleSearch} />
                  </div>
                </div>
              </div>
            </div>
            {/* <Table /> */}

            {endpoint == "orders" ? (
              <CustomTable
                columns={columns}
                data={searchResults.length > 0 ? searchResults : data}
                onEdit={null}
                onDelete={handleDelete}
              />
            ) : (
              <CustomTable
                data={searchResults.length > 0 ? searchResults : data}
                columns={columns2}
                onEdit={null}
                onDelete={handleDelete}
              />
            )}
          </div>
        </Layout>
      )}
    </>
  )
}
