import Card from "@/Components/Card"
import CustomTable from "@/Components/CustomTable"
import PrimaryBt from "@/Components/FormsComponents/Buttons/PrimaryBt"
import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import Search from "@/Components/FormsComponents/Inputs/Search"
import api from "@/api/api"
import {
  countMatchingItems,
  tableFilters,
  tableSearch,
} from "@/api/filtersData"
import { usersFiltersArray } from "@/data/arrays"
// import avatar from "@/images/user.png"
import Layout from "@/layout/Layout"
import LoadingIndicator from "@/utils/LoadingIndicator"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import qs from "qs"
import { useEffect, useState } from "react"
import { AiFillBank } from "react-icons/ai"
import { FaUserTie } from "react-icons/fa"
import { FiCheckCircle, FiUsers } from "react-icons/fi"
import { toast } from "react-toastify"
import Modal from "react-modal"
export default function Index() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [statistics, setStatistics] = useState({
    totalUsers: "",
    totalMarketers: "",
    totalCompany: "",
    usersNotActive: "",
  })
  const [loading, setLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  async function fetchUsers() {
    const authToken = localStorage.getItem("authToken")

    try {
      const usersData = await api.get("users/users", authToken)
      setUsers(usersData)
    } catch (error) {
      console.error("Error fetching Users:", error)
    }
    setLoading(true)
  }
  async function myStatistics() {
    const type = "role"
    const status = "activated"
    setStatistics({
      ...statistics,
      totalUsers: users.length,
      totalCompany: countMatchingItems("company", users, type, true),
      totalMarketers: countMatchingItems("marketer", users, type, true),
      usersNotActive: countMatchingItems("no", users, status, true),
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])
  useEffect(() => {
    myStatistics()
  }, [users])
  const handleDropdownChange = async (e, itemId) => {
    const authToken = localStorage.getItem("authToken")
    try {
      const formDataForApi = {
        role: e,
      }
      const encodedData = qs.stringify(formDataForApi)
      const response = await api.put(
        `users/changeType/${itemId}`,
        encodedData,
        authToken
      )
      toast.success("تم تحديث نوع المستخدم بنجاح")
      const updatedUser = users.map((user) => {
        if (user.id === itemId) {
          return { ...user, attributes: { ...user.attributes, role: e } }
        }
        return user
      })
      setUsers(updatedUser)
    } catch (error) {
      console.error("Error updating realty data:", error)
      toast.error("حدث خطأ أثناء تحديث البيانات.")
    }

    // toast.success(`${e} ${itemId}`);
  }

  const getUserType = (item) => {
    const textColor = () => {
      switch (item.attributes.role) {
        case "user":
          return "#2980b9"
        case "marketer":
          return "#f39c12"
        case "company":
          return "#2ecc71"
        case "admin":
          return "#EA2027"
        default:
          return ""
      }
    }
    return (
      <div className='flex items-center'>
        <select
          style={{ color: textColor() }}
          value={item.attributes.role}
          onChange={(e) => handleDropdownChange(e.target.value, item.id)}
        >
          <option
            value='user'
            style={{ color: "#2980b9" }}
            disabled={item.attributes.role == "user"}
          >
            مستخدم
          </option>
          <option
            value='marketer'
            style={{ color: "#f39c12" }}
            disabled={item.attributes.role == "marketer"}
          >
            مسوق
          </option>
          <option
            value='company'
            style={{ color: "#2ecc71" }}
            disabled={item.attributes.role == "company"}
          >
            شركة
          </option>
          <option
            value='admin'
            style={{ color: "#EA2027" }}
            disabled={item.attributes.role == "admin"}
          >
            مدير
          </option>
        </select>
      </div>
    )
  }
  function handleView(item) {

    setCurrentUser(item)
    setModalIsOpen(true)
  }

  const handleOptionSelect = (selectedId) => {
    console.log(`Selected ID: ${selectedId}`)
  }
  const handleUserTypeSelect = (selectedType) => {
    const filterdField = "role"
    const filteredResults = tableFilters(
      selectedType,
      users,
      filterdField,
      true
    )

    setSearchResults(filteredResults)
    // هنا يمكنك تنفيذ الفلترة باستخدام النوع المحدد
  }

  const handleUserStatusSelect = (selectedType) => {
    const filterdField = "activated"
    const filteredResults = tableFilters(
      selectedType,
      users,
      filterdField,
      true
    )

    setSearchResults(filteredResults)
    // هنا يمكنك تنفيذ الفلترة باستخدام النوع المحدد
  }
  const findUserById = (userId) => {
    const foundUser = users.find((user) => user.id == userId)
    return foundUser ? foundUser.attributes.name : ""
  }
  const columns = [
    { key: "id", label: "الرقم" },
    {
      key: "attributes",
      label: "المستخدم",
      render: (item) => (
        <div className='flex items-center'>
          {!item.attributes.avatar ? (
            <Image
              width={50}
              height={50}
              className='w-10 h-10 rounded-full ml-2'
              src="/images/user.png"
              alt='Jese image'
            />
          ) : (
            <Image
              width={50}
              height={50}
              className='w-10 h-10 rounded-full ml-2'
              src={item.attributes.avatar}
              alt='Jese image'
            />
          )}
          {/* <Image width={50} height={50} className="w-10 h-10 rounded-full ml-2" src={item.attributes.avatar} alt="Jese image" /> */}
          <div className='pl-3'>
            <div className='text-base font-semibold'>
              {!item.attributes.name ? "لايوجد" : item.attributes.name}
            </div>
            <div className='font-normal text-gray-500'>
              {item.attributes.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "نوع المستخدم",
      render: (item) =>
        // <div>{getUserType(item.attributes.role)}</div>
        getUserType(item),
    },
    {
      key: "phone",
      label: "رقم الهاتف",
      render: (item) => (
        <div>{!item.attributes.phone ? "لايوجد" : item.attributes.phone}</div>
      ),
    },
    {
      key: "reg-by",
      label: "التسجيل عبر",
      render: (item) => (
        <div
          className={
            item.attributes.registered_by == null
              ? "text-green-600"
              : "text-red-700"
          }
        >
          {item.attributes.registered_by == null
            ? "عبر التطبيق"
            : findUserById(item.attributes.registered_by)}
        </div>
      ),
    },
    {
      key: "statues",
      label: "الحالة",
      render: (item) => (
        <div
          className={
            item.attributes.activated == "yes"
              ? "text-green-600"
              : "text-red-700"
          }
        >
          {item.attributes.activated == "yes" ? "مفعل" : "غير مفعل"}
        </div>
      ),
    },
  ]
  const columns2 = [
    { key: "id", label: "الرقم" },
    {
      key: "realEstate",
      label: "العقار",
      render: (item) => (
        <div>
          {item.attributes.property}
        </div>
      ),
    },
    {
      key: "customer",
      label: "العميل",
      render: (item) => <div className='flex flex-col'>
        <div>{item.attributes.customer.name}</div>
        <div>{item.attributes.customer.phone_number}</div>
      </div>,
    },
    {
      key: "location",
      label: "الموقع ",
      render: (item) => <div>{item.attributes.location.name}</div>,
    },
    {
      key: "type",
      label: "النوع ",
      render: (item) => <div>{item.attributes.type.name}</div>,
    },
    {
      key: "budget",
      label: "الميزانية",
      render: (item) => <div dir="ltr">{item.attributes.budget.from} - {item.attributes.budget.to} {item.attributes.budget.currency}</div>,
    },
    {
      key: "message",
      label: "تفاصيل الطلب ",
      render: (item) => <div>{item.attributes.other_details}</div>,
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
    const searchedField = "name"
    const filteredResults = tableSearch(searchTerm, users, searchedField)
    setSearchResults(filteredResults)
  }

  const handleEdit = (item) => {
    router.push(`Users/Edit?id=${item.id}`)
  }

  const handleDelete = async (item) => {
    const authToken = localStorage.getItem("authToken")
    try {
      await api.deleteFunc(`users/users/${item.id}`, authToken)

      const updatedUsers = users.filter((user) => user.id !== item.id)
      setUsers(updatedUsers)
      toast.success("تم حذف المستخدم بنجاح")
    } catch (error) {
      console.log(error)
      toast.error("خطأ أثناء حذف المستخدم")
    }
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
              icon={<FiUsers size={69} color='#3498db' />} // أيقونة تمثيل عدد المستخدمين مع لون أزرق ملائم
              title='عدد المستخدمين'
              value={statistics.totalUsers}
              label='العدد الاجمالي'
              color='#3498db'
            />
            <Card
              id=''
              icon={<AiFillBank size={69} color='#e67e22' />} // أيقونة تمثيل عدد الشركات مع لون برتقالي ملائم
              title='عدد الشركات'
              value={statistics.totalCompany}
              label='العدد الاجمالي'
              color='#e67e22'
            />
            <Card
              id='1'
              icon={<FaUserTie size={69} color='#27ae60' />} // أيقونة تمثيل عدد المسوقين مع لون أخضر ملائم
              title='عدد المسوقين'
              value={statistics.totalMarketers}
              label='العدد الاجمالي'
              color='#27ae60'
            />
            <Card
              id='1'
              icon={<FiCheckCircle size={69} color='#f39c12' />} // أيقونة تمثيل عدد المستخدمين المفعلين مع لون أصفر ملائم
              title='عدد المستخدمين المفعلين'
              value={statistics.usersNotActive}
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
                    title='اختر نوع المستخدم'
                    options={usersFiltersArray.userType}
                    onSelect={handleUserTypeSelect}
                  />
                  <DropDownList
                    title='اختر حالة المستخدم'
                    options={usersFiltersArray.userStatues}
                    onSelect={handleUserStatusSelect}
                  />
                  {/* <DropDownList />
                            <DropDownList />
                            <DropDownList /> */}
                </div>
                <div className='flex justify-between border-t-2 pt-5'>
                  <div>
                    {/* <PrimaryBt type="add" name="إضافة عقار جديد" onClick={() => { }} /> */}
                    <Link href='/Users/New'>
                      <PrimaryBt type='add' name='إضافة مستخدم جديد' />
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
              data={searchResults.length > 0 ? searchResults : users}
              onEdit={handleEdit}
              onDelete={handleDelete}
              extraButtonType='view'
              myFunction={handleView}
            />
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel='تفاصيل الخدمة'
            overlayClassName='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'
          >
            <div className='flex justify-between  m-0' dir='rtl'>
              <h2 className='text-xl font-semibold text-black '>
                تفاصيل المستخدم
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

            {currentUser && (
              <div className='text-black text-center '>
                <div
                  className=' my-6 flex flex-row items-center mt-9'
                  dir='rtl'
                >
                  <h1 className='ml-2 font-semibold'>اسم المستخدم :</h1>
                  <p className='font-medium'>
                    {currentUser.attributes.name}
                  </p>
                </div>
                <div className=' my-6 flex flex-row items-center' dir='rtl'>
                  <h1 className='ml-2 font-semibold'>ايميل المستخدم :</h1>
                  <p className='font-medium'>
                    {currentUser.attributes.email}
                  </p>
                </div>
                <div className=' my-6 flex flex-row items-center' dir='rtl'>
                  <h1 className='ml-2 font-semibold'> رقم الهاتف :</h1>
                  <p className='font-medium'>
                    {currentUser.attributes.phone}
                  </p>
                </div>
                <div className=' my-6 flex flex-row items-center' dir='rtl'>
                  <h1 className='ml-2 font-semibold'> نوع المستخدم  :</h1>
                  <p className='font-medium'>
                    {currentUser.attributes.role == "admin"
                      ? "مدير" : currentUser.attributes.role == "company"
                        ? "شركة" : currentUser.attributes.role == "marketer"
                          ? "مسوق" : "مستخدم"}
                  </p>
                </div>
                <div className=' my-6 flex flex-row items-center' dir='rtl'>
                  <h1 className='ml-2 font-semibold'> عدد العملاء  :</h1>
                  <p className='font-medium'>
                    {currentUser.attributes.customers_count}
                  </p>
                </div>
                <div>
                  {
                    currentUser.attributes.customer_requests.length > 0 &&
                    <CustomTable columns={columns2} data={currentUser.attributes.customer_requests} />
                  }

                </div>
              </div>
            )}
          </Modal>
        </Layout>
      )}
    </>
  )
}
