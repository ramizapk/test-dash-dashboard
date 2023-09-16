import Card from "@/Components/Card"
import CustomTable from "@/Components/CustomTable"
import PrimaryBt from "@/Components/FormsComponents/Buttons/PrimaryBt"
import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import Search from "@/Components/FormsComponents/Inputs/Search"
import api from "@/api/api"
import { fetchSubServices } from "@/api/fetchData"
import { countMatchingItems, tableFilters, tableSearch } from "@/api/filtersData"
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
  const [statistics, setStatistics] = useState({
    totalservices: "",
    services1: "",
    services2: "",
  })
  const [searchResults, setSearchResults] = useState([])


  async function myStatistics() {
    const type = "type"
    setStatistics({
      ...statistics,
      totalservices: services.length,
      services1: countMatchingItems(
        1,
        services,
        type,
        true
      ),
      services2: countMatchingItems(
        2,
        services,
        type,
        true
      ),
    })
  }


  async function fetchData() {
    const authToken = localStorage.getItem("authToken")

    try {
      const servicesData = await api.get('NewServices/services', authToken)
      setServices(servicesData)
      console.log(servicesData);
    } catch (error) {
      console.error("Error fetching Types:", error)
    }
    setLoading(true)
  }


  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    myStatistics()
  }, [services])
  const handleOptionSelect = (selectedId) => {
    const filterField = "type";
    const filteredResults = tableFilters(selectedId, services, filterField, true);

    setSearchResults(filteredResults);
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

  const columns1 = [
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
            src={item.attributes.image}
            alt='Jese image'
          />
          <div className='pl-3'>
            <div className='text-base font-semibold whitespace-nowrap'>
              {item.attributes.name}
            </div>
            <div className='font-normal text-gray-500'> {item.attributes.type == 1 ? "خدمات انشائية وصيانة" : "موارد بناء وتوريدات"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "وصف الخدمة",
      render: (item) => <div>{item.attributes.description}</div>,
    },

  ]

  const handleSearch = (searchTerm) => {
    const searchedField = "name" // تعيين الحقل الذي ترغب في البحث فيه
    const filteredResults = tableSearch(searchTerm, services, searchedField)
    setSearchResults(filteredResults)
  }

  const handleEdit = (item) => {

    router.push(`MyServices/Edit?id=${item.id}`)

  }

  const handleDelete = async (item) => {
    const authToken = localStorage.getItem("authToken")

    try {
      await api.deleteFunc(`NewServices/services/${item.id}`, authToken)

      const updatedServices = services.filter((service) => service.id !== item.id)

      setServices(updatedServices)

      toast.success("تم حذف الخدمة بنجاح")
    } catch (error) {
      console.log(error)
      toast.error("خطأ أثناء حذف الخدمة")
    }
  }




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
              value={statistics.totalservices}
              label='العدد الاجمالي'
              color='#3498db'
            />
            <Card
              id='1'
              icon={<FaCogs size={69} color='#27ae60' />} // أيقونة تمثيل خدمات رئيسية مع لون أخضر ملائم
              title='خدمات انشائية وصيانة'
              value={statistics.services1}
              label='العدد الاجمالي'
              color='#27ae60'
            />

            <Card
              id='1'
              icon={<FaToolbox size={69} color='#e67e22' />} // أيقونة تمثيل خدمات فرعية مع لون برتقالي ملائم
              title=' مواد بناء وتوريدات '
              value={statistics.services2}
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
                    <Link href='/MyServices/New'>
                      <PrimaryBt type='add' name='إضافة خدمة جديدة' />
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

            <CustomTable
              columns={columns1}
              data={searchResults.length > 0 ? searchResults : services}
              onEdit={handleEdit}
              onDelete={handleDelete}

            />

          </div>

        </Layout>
      )}
    </>
  )
}
