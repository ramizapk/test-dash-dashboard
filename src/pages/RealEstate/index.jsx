import Card from "@/Components/Card"
import CustomTable from "@/Components/CustomTable"
import PrimaryBt from "@/Components/FormsComponents/Buttons/PrimaryBt"
import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import Search from "@/Components/FormsComponents/Inputs/Search"
import api from "@/api/api"
import { fetchLocations, fetchTypes } from "@/api/fetchData"
import { countMatchingItems, filterRealEstatesByPrice } from "@/api/filtersData"
import { realEstateTypes, status } from "@/data/arrays"
import Layout from "@/layout/Layout"
import LoadingIndicator from "@/utils/LoadingIndicator"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { GiCash, GiHouse, GiHouseKeys, GiKeyLock } from "react-icons/gi"
import { toast } from "react-toastify"
export default function Index() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [realEstates, setRealEstates] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [minPrice, setMinPrice] = useState(""); // حد الأدنى للسعر
  const [maxPrice, setMaxPrice] = useState(""); // حد الأقصى للسعر
  const [typesOptions, setTypesOptions] = useState([])
  const [locationsOptions, setLocationsOptions] = useState([])
  const [statistics, setStatistics] = useState({
    totalRealEstates: "",
    availableRealEstates: "",
    realEstatesForSale: "",
    realEstatesForRent: "",
  })

  async function fetchRealEstates() {
    const authToken = localStorage.getItem("authToken")
    try {
      const realEstatesData = await api.get("realEstate/realty", authToken)
      setRealEstates(realEstatesData)
      const locations = await fetchLocations(authToken)
      const types = await fetchTypes(authToken)

      setTypesOptions(types)
      setLocationsOptions(locations)
    } catch (error) {
      console.error("Error fetching real estates:", error)
    }
    setLoading(true)
  }

  async function myStatistics() {
    const state = "state"
    const secondType = "secondType"
    setStatistics({
      ...statistics,
      totalRealEstates: realEstates.length,
      availableRealEstates: countMatchingItems(
        "available",
        realEstates,
        state,
        true
      ),
      realEstatesForSale: countMatchingItems(
        "for sale",
        realEstates,
        secondType,
        true
      ),
      realEstatesForRent: countMatchingItems(
        "for rent",
        realEstates,
        secondType,
        true
      ),
    })
  }
  useEffect(() => {
    fetchRealEstates()
    myStatistics()
  }, [])

  useEffect(() => {
    myStatistics()
  }, [realEstates])
  const handleDropdownChange = async (e, itemId) => {
    const authToken = localStorage.getItem("authToken")
    try {
      const formDataForApi = new FormData()
      formDataForApi.append("state", e)
      const response = await api.post(
        `realEstate/${itemId}/edit`,
        formDataForApi,
        authToken
      )
      toast.success("تم تحديث حالة العقار بنجاح")
      const updatedRealEstates = realEstates.map((estate) => {
        if (estate.id === itemId) {
          return { ...estate, attributes: { ...estate.attributes, state: e } }
        }
        return estate
      })
      setRealEstates(updatedRealEstates)
    } catch (error) {
      console.error("Error updating realty data:", error)
      toast.error("حدث خطأ أثناء تحديث البيانات.")
    }
  }
  const columns = [
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
    {
      key: "statues",
      label: "الحالة",
      render: (item) => (
        <div className='flex items-center'>
          <select
            className={
              item.attributes.state === "available"
                ? "text-green-700"
                : "text-red-700"
            }
            value={item.attributes.state}
            onChange={(e) => handleDropdownChange(e.target.value, item.id)}
          >
            {item.attributes.state === "available" ? (
              <>
                <option value='available' style={{ color: "#34D399" }} disabled>
                  متاح
                </option>
                <option value='Unavailable' style={{ color: "#EF4444" }}>
                  غير متاح
                </option>
              </>
            ) : (
              <>
                <option
                  value='Unavailable'
                  style={{ color: "#EF4444" }}
                  disabled
                >
                  غير متاح
                </option>
                <option value='available' style={{ color: "#34D399" }}>
                  متاح
                </option>
              </>
            )}
          </select>
        </div>
      ),
    },
  ]

  const data = [
    {
      number: 1,
      property: {
        name: "بيت للبيع في شارع القصر",
        imageSrc: "https://via.placeholder.com/640x480.png/00ee11?text=ullam",
        type: "بيت / بيع",
      },
      location: "عدن/ المنصورة / بلوك5",
      price: "$2999",
      status: "متاح",
    },
    {
      number: 2,
      property: {
        name: "بيت للبيع في شارع القصر",
        imageSrc: "https://via.placeholder.com/640x480.png/00ee11?text=ullam",
        type: "بيت / بيع",
      },
      location: "عدن/ المنصورة / بلوك5",
      price: "$2999",
      status: "متاح",
    },
  ]
  const handleSearch = (searchTerm) => {
    const searchedField = "name" // تعيين الحقل الذي ترغب في البحث فيه
    const filteredResults = tableSearch(searchTerm, realEstates, searchedField)
    setSearchResults(filteredResults)
  }
  const handleSearchByPrice = () => {
    // تطبيق الفلترة باستخدام الدالة الجديدة
    const filteredResults = filterRealEstatesByPrice(minPrice, maxPrice, realEstates);

    // قم بتحديث نتائج البحث
    setSearchResults(filteredResults);
  };

  const handleTypeSelect = (selectedType) => {
    const filterdField = "firstType"
    const filteredResults = tableFilters(
      selectedType,
      realEstates,
      filterdField
    )

    setSearchResults(filteredResults)
    // هنا يمكنك تنفيذ الفلترة باستخدام النوع المحدد
  }

  const handleLocationSelect = (selectedType) => {
    const filterdField = "location"
    const filteredResults = tableFilters(
      selectedType,
      realEstates,
      filterdField
    )

    setSearchResults(filteredResults)
    // هنا يمكنك تنفيذ الفلترة باستخدام الموقع المحدد
  }
  const handleStatusSelect = (selectedType) => {
    const filterdField = "state"
    const filteredResults = tableFilters(
      selectedType,
      realEstates,
      filterdField,
      true
    )

    setSearchResults(filteredResults)
    // هنا يمكنك تنفيذ الفلترة باستخدام النوع المحدد
  }

  const handleSeconTypeSelect = (selectedType) => {
    const filterdField = "secondType"
    const filteredResults = tableFilters(
      selectedType,
      realEstates,
      filterdField,
      true
    )

    setSearchResults(filteredResults)
    // هنا يمكنك تنفيذ الفلترة باستخدام الموقع المحدد
  }

  const handleEdit = (item) => {
    router.push(`RealEstate/Edit?id=${item.id}`)
  }
  const handleDelete = async (item) => {
    const authToken = localStorage.getItem("authToken")
    try {
      await api.deleteFunc(`realEstate/realty/${item.id}`, authToken)

      // إزالة العنصر المحذوف من القائمة
      const updatedRealEstates = realEstates.filter(
        (estate) => estate.id !== item.id
      )
      setRealEstates(updatedRealEstates)
      toast.success("تم حذف العقار بنجاح")
    } catch (error) {
      toast.error("خطأ أثناء حذف العقار")
    }
  }


  const handleView = (item) => {
    router.push({
      pathname: `/RealEstate/${item.id}`,
      query: { jsonData: JSON.stringify(item) },
    })
  }
  return (
    <>
      {!loading ? (
        <LoadingIndicator />
      ) : (
        <Layout>
          <div
            className='grid grid-cols-4 my-0 gap-4 md:grid-cols-1 py-0 text-black w-full'
            dir='rtl'
          >
            <Card
              id='1'
              icon={<GiHouse color='#f584' size={69} />}
              title='عدد العقارات'
              value={statistics.totalRealEstates}
              label='العدد الاجمالي'
              color='#f584'
            />
            <Card
              id=''
              icon={<GiKeyLock color='#2ecc71' size={69} />}
              title='العقارات المتاحة'
              value={statistics.availableRealEstates}
              label='العدد الاجمالي'
              color='#2ecc71'
            />
            <Card
              id='1'
              icon={<GiCash color='#3498db' size={69} />}
              title='عقارات للبيع'
              value={statistics.realEstatesForSale}
              label='العدد الاجمالي'
              color='#3498db'
            />
            <Card
              id='1'
              icon={<GiHouseKeys color='#e74c3c' size={69} />}
              title='عقارات للايجار'
              value={statistics.realEstatesForRent}
              label='العدد الاجمالي'
              color='#e74c3c'
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
                    title='اختر نوع العقار'
                    options={typesOptions}
                    onSelect={handleTypeSelect}
                  />
                  <DropDownList
                    title='اختر موقع العقار'
                    options={locationsOptions}
                    onSelect={handleLocationSelect}
                  />
                  <DropDownList
                    title='اختر حالة العقار'
                    options={realEstateTypes.data}
                    onSelect={handleSeconTypeSelect}
                  />
                  <DropDownList
                    title='اختر الاتاحة'
                    options={status.data}
                    onSelect={handleStatusSelect}
                  />
                  <div>
                    <p>اكتب حدود السعر</p>
                    <div className="flex flex-row flex-nowrap pt-2 justify-center">
                      <div className="flex flex-row flex-nowrap h-9 items-center">

                        <input
                          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-16  dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500'
                          name="from"
                          type="text"
                          placeholder="الحد الأدنى للسعر"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-row flex-nowrap  h-9  items-center">
                        <p className="whitespace-nowrap">الى</p>
                        <input
                          type="text"
                          placeholder="الحد الأقصى للسعر"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block  p-2.5 w-16 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                      </div>
                      <button
                        className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-1"
                        onClick={handleSearchByPrice}>عرض</button>
                    </div>

                  </div>
                </div>
                <div className='flex justify-between border-t-2 pt-5'>
                  <div>
                    {/* <PrimaryBt type="add" name="إضافة عقار جديد" onClick={() => { }} /> */}
                    <Link href='/RealEstate/New'>
                      <PrimaryBt type='add' name='إضافة عقار جديد' />
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
              columns={columns}
              data={searchResults.length > 0 ? searchResults : realEstates}
              onEdit={handleEdit}
              onDelete={handleDelete}
              extraButtonType={"view"}
              myFunction={handleView}
            />
          </div>
        </Layout>
      )}
    </>
  )
}
