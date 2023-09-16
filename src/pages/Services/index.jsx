import Card from "@/Components/Card"
import CustomTable from "@/Components/CustomTable"
import PrimaryBt from "@/Components/FormsComponents/Buttons/PrimaryBt"
import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import Search from "@/Components/FormsComponents/Inputs/Search"
import api from "@/api/api"
import { fetchSubServices } from "@/api/fetchData"
import { tableSearch } from "@/api/filtersData"
import Layout from "@/layout/Layout"
import LoadingIndicator from "@/utils/LoadingIndicator"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { BsCardChecklist } from "react-icons/bs"
import { FaCogs, FaToolbox } from "react-icons/fa"
import Modal from "react-modal"
import { toast } from "react-toastify"
export default function Index() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [services, setServices] = useState([])
  const [subServices, setSubServices] = useState([])
  const [data, setData] = useState([])

  const [searchResults, setSearchResults] = useState([])
  const [endpoint, setEndpoint] = useState("services/services/")
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentService, setCurrentService] = useState(null)
  const [subServicesById, setSubServicesById] = useState([])

  async function fetchTypes() {
    const authToken = localStorage.getItem("authToken")

    try {
      const servicesData = await api.get(endpoint, authToken)
      setServices(servicesData)
      const subServicesData = await api.get("subServices/services/", authToken)
      setSubServices(subServicesData)
    } catch (error) {
      console.error("Error fetching Types:", error)
    }
    setLoading(true)
  }

  useEffect(() => {
    setData(services)
  }, [services])
  useEffect(() => {
    fetchTypes()
  }, [])

  const handleOptionSelect = (selectedId) => {
    if (selectedId == 1) {
      setEndpoint("services/services/")
      setSearchResults("")
      setData(services)
    } else if (selectedId == 2) {
      setEndpoint("subServices/services/")
      setSearchResults("")
      setData(subServices)
    }
    // fetchTypes();
    console.log(`Selected ID: ${selectedId}`)
  }
  const array = {
    data: [
      {
        id: "1",
        attributes: {
          name: "الخدمات الرئيسية",
        },
      },
      {
        id: "2",
        attributes: {
          name: "الخدمات الفرعية",
        },
      },
    ],
  }

  const columns1 = [
    { key: "id", label: "الرقم" },
    {
      key: "property",
      label: "الخدمة",
      render: (item) => (
        <div className='flex items-center'>
          <Image
            width={50}
            height={50}
            className='w-10 h-10 rounded-full ml-2'
            src={
              item.attributes.image.startsWith("storage")
                ? `http://127.0.0.1:8000/${item.attributes.image}`
                : item.attributes.image
            }
            alt='Jese image'
          />
          <div className='pl-3'>
            <div className='text-base font-semibold'>
              {item.attributes.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "attributes",
      label: "وصف الخدمة",
      render: (item) => <div>{item.attributes.description}</div>,
    },
    {
      key: "sub_services_count",
      label: "عدد الخدمات الفرعية",
      render: (item) =>
        // عرض الوصف إذا كان متوفرًا، وإلا عرض رسالة بدلاً منه
        item.sub_services_count ? <div>{item.sub_services_count}</div> : 0,
    },
  ]
  const columns2 = [
    { key: "id", label: "الرقم" },
    {
      key: "property",
      label: "الخدمة",
      render: (item) => (
        <div className='flex items-center'>
          <Image
            width={50}
            height={50}
            className='w-10 h-10 rounded-full ml-2'
            src={
              item.attributes.image.startsWith("storage")
                ? `http://127.0.0.1:8000/${item.attributes.image}`
                : item.attributes.image
            }
            alt='Jese image'
          />
          <div className='pl-3'>
            <div className='text-base font-semibold'>
              {item.attributes.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "attributes",
      label: "وصف الخدمة",
      render: (item) => <div>{item.attributes.description}</div>,
    },
    {
      key: "construction",
      label: "الخدمة الرئيسية", // إضافة الحقل "وصف الخدمة"
      render: (item) =>
        // عرض الوصف إذا كان متوفرًا، وإلا عرض رسالة بدلاً منه
        item.attributes.construction ? (
          <div>{item.attributes.construction}</div>
        ) : null,
    },
  ]

  const handleSearch = (searchTerm) => {
    const searchedField = "name" // تعيين الحقل الذي ترغب في البحث فيه
    const filteredResults = tableSearch(searchTerm, data, searchedField)
    setSearchResults(filteredResults)
  }

  const handleEdit = (item) => {
    if (endpoint == "services/services/") {
      router.push(`Services/Edit?id=${item.id}`)
    } else {
      router.push(`Services/Sub/Edit?id=${item.id}`)
    }
  }

  const handleDelete = async (item) => {
    const authToken = localStorage.getItem("authToken")

    try {
      await api.deleteFunc(`${endpoint}${item.id}`, authToken)

      const updatedServices = data.filter((service) => service.id !== item.id)

      setData(updatedServices)
      if (endpoint == "services/services/") {
        setServices(updatedServices)
      } else {
        setSubServices(updatedServices)
      }
      toast.success("تم حذف الخدمة بنجاح")
    } catch (error) {
      console.log(error)
      toast.error("خطأ أثناء حذف الخدمة")
    }
  }

  async function handleView(item) {
    const authToken = localStorage.getItem("authToken")

    try {
      const subServicesById = await fetchSubServices(authToken, item.id)
      setSubServicesById(subServicesById)
    } catch (error) {
      console.error("Error fetching Types:", error)
    }
    setCurrentService(item)
    setModalIsOpen(true)
  }

  console.log(`currentService: ${currentService}`)
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
              icon={<BsCardChecklist size={69} color='#3498db' />} // أيقونة تمثيل خدمات مع لون أزرق ملائم
              title='عدد كل الخدمات'
              value={services.length + subServices.length}
              label='العدد الاجمالي'
              color='#3498db'
            />
            <Card
              id='1'
              icon={<FaCogs size={69} color='#27ae60' />} // أيقونة تمثيل خدمات رئيسية مع لون أخضر ملائم
              title='عدد الخدمات الرئيسية'
              value={services.length}
              label='العدد الاجمالي'
              color='#27ae60'
            />

            <Card
              id='1'
              icon={<FaToolbox size={69} color='#e67e22' />} // أيقونة تمثيل خدمات فرعية مع لون برتقالي ملائم
              title='عدد الخدمات الفرعية'
              value={subServices.length}
              label='العدد الاجمالي'
              color='#e67e22'
            />
          </div>
          <div className='flex mt-5 flex-col w-full items-center justify-between pb-4 bg-white dark:bg-white rounded-md text-black'>
            {/* filter container */}

            <div className='flex items-center space-x-4 w-full p-4' dir='rtl'>
              <div className='flex flex-col gap-y-4 w-full'>
                <div>
                  <p>خيارات العرض</p>
                </div>
                <div className='flex w-full '>
                  <DropDownList
                    title='عرض الخدمات'
                    options={array.data}
                    onSelect={handleOptionSelect}
                  />

                  {/* <DropDownList />
							<DropDownList />
							<DropDownList /> */}
                </div>
                <div className='flex justify-between border-t-2 pt-5'>
                  <div>
                    {/* <PrimaryBt type="add" name="إضافة عقار جديد" onClick={() => { }} /> */}
                    <Link href='/Services/New'>
                      <PrimaryBt type='add' name='إضافة خدمة رئيسية جديدة' />
                    </Link>
                    <Link href='/Services/Sub/New'>
                      <PrimaryBt type='add' name='إضافة خدمة فرعية جديدة' />
                    </Link>
                    <PrimaryBt type='export' name='تصدير' onClick={() => { }} />
                  </div>

                  <div>
                    <Search onSearch={handleSearch} />
                  </div>
                </div>
              </div>
            </div>
            {/* <Table /> */}
            {endpoint == "services/services/" ? (
              <CustomTable
                columns={columns1}
                data={searchResults.length > 0 ? searchResults : data}
                onEdit={handleEdit}
                onDelete={handleDelete}
                extraButtonType={"view"}
                myFunction={handleView}
              />
            ) : (
              <CustomTable
                columns={columns2}
                data={searchResults.length > 0 ? searchResults : data}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel='تفاصيل الخدمة'
            overlayClassName='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'
          >
            <div className='flex justify-between  m-0' dir='rtl'>
              <h2 className='text-xl font-semibold text-black '>
                تفاصيل الخدمة
              </h2>
              <button
                onClick={() => setModalIsOpen(false)}
                className='text-gray-600 hover:text-gray-800 focus:outline-none'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.293 5.293a1 1 0 0 1 1.414 0L10 8.586l3.293-3.293a1 1 0 0 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 0-1.414z'
                  />
                </svg>
              </button>
            </div>

            {currentService && (
              <div className='text-black text-center '>
                <div
                  className=' my-6 flex flex-row items-center mt-9'
                  dir='rtl'
                >
                  <h1 className='ml-2 font-semibold'>اسم الخدمة :</h1>
                  <p className='font-medium'>
                    {currentService.attributes.name}
                  </p>
                </div>
                <div className=' my-6 flex flex-row items-center' dir='rtl'>
                  <h1 className='ml-2 font-semibold'>الوصف</h1>
                  <p className='font-medium'>
                    {currentService.attributes.description}
                  </p>
                </div>
                <div>
                  <CustomTable columns={columns2} data={subServicesById} />
                </div>
              </div>
            )}
          </Modal>
        </Layout>
      )}
    </>
  )
}
