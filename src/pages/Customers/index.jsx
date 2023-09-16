import Card from "@/Components/Card"
import CustomTable from "@/Components/CustomTable"
import PrimaryBt from "@/Components/FormsComponents/Buttons/PrimaryBt"
import DropDownList from "@/Components/FormsComponents/Inputs/DropDownList"
import Search from "@/Components/FormsComponents/Inputs/Search"
import api from "@/api/api"
import { fetchLocations, fetchTypes } from "@/api/fetchData"
import { countMatchingItems, filterRealEstatesByPrice, tableFilters } from "@/api/filtersData"
import { realEstateTypes, status } from "@/data/arrays"
import Layout from "@/layout/Layout"
import LoadingIndicator from "@/utils/LoadingIndicator"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { GiCash, GiHouse, GiHouseKeys, GiKeyLock } from "react-icons/gi"
import { toast } from "react-toastify"
import qs from "qs"
import { BiHomeAlt, BiUser } from "react-icons/bi"
import { FaToolbox } from "react-icons/fa6"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { HiOutlineClipboardCheck, HiOutlineClock } from "react-icons/hi"
import { FaCheckCircle } from "react-icons/fa"
import { customersArray } from "@/data/arrays"
export default function index() {
    const [loading, setLoading] = useState(false)
    const [customers, setCustomers] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [statistics, setStatistics] = useState({
        totalCustomers: "",
        successfulRequests: "",
        unsuccessfulRequests: "",
        pendingRequests: "",
    })


    async function fetchCustomers() {
        const authToken = localStorage.getItem("authToken")
        try {
            const customersData = await api.get('customerRequests/getAllCustomerRequests', authToken)
            setCustomers(customersData)
            console.log(customersData);
        } catch (error) {
            console.error("Error fetching orders:", error)
        }
        setLoading(true)
    }

    async function myStatistics() {
        const status = "communication_status"
        const request_status = "request_status"
        setStatistics({
            ...statistics,
            totalCustomers: customers.length,
            successfulRequests: countMatchingItems(
                "successful",
                customers,
                status,
                true
            ),
            unsuccessfulRequests: countMatchingItems(
                "unsuccessful",
                customers,
                status,
                true
            ),
            pendingRequests: countMatchingItems(
                "pending",
                customers,
                request_status,
                true
            ),
        })
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    useEffect(() => {
        myStatistics()
    }, [customers])
    const requestStatusOptions = [
        { value: "pending", label: "قيد الانتظار", color: "text-red-700" },
        { value: "review", label: "تحت المراجعة", color: "text-yellow-600" },
        { value: "communicated", label: "تم التواصل", color: "text-green-700" },
    ];

    const communicationStatusOptions = [
        { value: "pending", label: "قيد الانتظار", color: "text-yellow-600" },
        { value: "successful", label: "تم بنجاح", color: "text-green-700" },
        { value: "unsuccessful", label: "لم يتم بنجاح", color: "text-red-700" },
    ];

    const handleDropdownChange = async (e, itemId, type) => {
        let endpoint = type == "Request" ? "editRequestStatus" : "editCommunicationStatus";
        if (type == "communication") {
            const customer = customers.find((customer) => customer.id === itemId);
            if (customer && customer.attributes.request_status != "communicated") {
                return toast.error("لتغييرها الرجاء جعل حالة الطلب تم التواصل")
            }
        }
        const authToken = localStorage.getItem("authToken")
        try {
            const formDataForApi =
                type == "Request" ? {
                    request_status: e,
                }
                    : {
                        communication_status: e,
                    }
            const encodedData = qs.stringify(formDataForApi)
            await api.put(`customerRequests/${endpoint}/${itemId}`, encodedData, authToken)
            toast.success("تم تحديث حالة الطلب بنجاح")
            const updatedCustomers = customers.map((customer) => {
                if (customer.id === itemId) {
                    return type == "Request" ? { ...customer, attributes: { ...customer.attributes, request_status: e } }
                        : { ...customer, attributes: { ...customer.attributes, communication_status: e } }
                }
                return customer
            })
            setCustomers(updatedCustomers)
        } catch (error) {
            console.error("Error updating realty data:", error)
            toast.error("حدث خطأ أثناء تحديث البيانات.")
        }
    }

    const handleStatusSelect = (selectedStatues, type) => {
        const filterField = type == "Request" ? "request_status" : "communication_status";
        const filteredResults = tableFilters(selectedStatues, customers, filterField, true);

        setSearchResults(filteredResults);
    }
    const columns = [
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
            key: "user",
            label: "مقدم الطلب",
            render: (item) => (
                <div className='flex items-center'>
                    <Image
                        width={50}
                        height={50}
                        className='w-10 h-10 rounded-full ml-2'
                        src={item.attributes.user.userImage}
                        alt='Jese image'
                    />
                    <div className='pl-3'>
                        <div className='text-base font-semibold'>{item.attributes.user.name}</div>
                        <div className='font-normal text-gray-500'>{item.attributes.user.email}</div>
                        <div className='font-normal text-gray-500'>
                            {item.attributes.user.phoneNumber}
                        </div>
                    </div>
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

        {
            key: "status",
            label: "حالة الطلب  ",
            render: (item) => (
                <div className='flex items-center'>
                    <select
                        className={
                            item.attributes.request_status === "pending"
                                ? "text-red-700"
                                : item.attributes.request_status == "communicated"
                                    ? "text-green-700"
                                    : "text-yellow-600"
                        }
                        value={item.attributes.request_status}
                        onChange={(e) => handleDropdownChange(e.target.value, item.id, "Request")}>
                        {requestStatusOptions.map((option) => (
                            <option key={option.value}
                                value={option.value}
                                className={option.color}
                                disabled={option.value === item.attributes.request_status}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            ),
        },

        {
            key: "communication",
            label: "حالة التواصل  ",
            render: (item) => (
                <div className='flex items-center'>
                    <select
                        className={
                            item.attributes.communication_status === "pending"
                                ? "text-yellow-600"
                                : item.attributes.communication_status == "successful"
                                    ? "text-green-700"
                                    : "text-red-700"
                        }
                        value={item.attributes.communication_status}
                        onChange={(e) => handleDropdownChange(e.target.value, item.id, "communication")}>
                        {communicationStatusOptions.map((option) => (
                            <option key={option.value}
                                value={option.value}
                                className={option.color}
                                disabled={option.value === item.attributes.communication_status}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            ),

        },

    ]


    const handleSearch = (searchTerm) => {
        const filteredResults = searchOrders(searchTerm, data, endpoint)
        setSearchResults(filteredResults)
        console.log("تم البحث عن:", searchTerm)
    }

    const handleStateChangeChange = async (e, itemId) => {
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
                            icon={<BiUser size={69} color='#3498db' />} // أيقونة تمثيل طلبات العقارات مع لون أزرق ملائم
                            title=' طلبات العملاء'
                            value={statistics.totalCustomers}
                            label='العدد الاجمالي'
                            color='#3498db'
                        />
                        <Card
                            id=''
                            icon={<FaCheckCircle size={69} color='#27ae60' />} // أيقونة تمثيل طلبات الخدمات مع لون برتقالي ملائم
                            title='تمت بنجاح'
                            value={statistics.successfulRequests}
                            label='العدد الاجمالي'
                            color='#27ae60 '
                        />
                        <Card
                            id='1'
                            icon={<IoMdCloseCircle size={69} color='#EE4B2B' />} // أيقونة تمثيل الموافق عليها مع لون أخضر ملائم
                            title=' لم تتم بنجاح'
                            value={statistics.unsuccessfulRequests}
                            label='العدد الاجمالي'
                            color='#EE4B2B'
                        />
                        <Card
                            id='1'
                            icon={<HiOutlineClock size={69} color='#f39c12' />} // أيقونة تمثيل تحت المراجعة مع لون أصفر ملائم
                            title='الطلبات المعلقه'
                            value={
                                statistics.pendingRequests
                            }
                            label='العدد الاجمالي'
                            color='#f39c12 '
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
                                        title='اختر حالة الطلب'
                                        options={customersArray.status}
                                        onSelect={(selectedStatus) => handleStatusSelect(selectedStatus, 'Request')}
                                    />
                                    <DropDownList
                                        title='اختر حالة التواصل'
                                        options={customersArray.communication}
                                        onSelect={(selectedStatus) => handleStatusSelect(selectedStatus, 'communication')}
                                    />


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

                        <CustomTable
                            columns={columns}
                            data={searchResults.length > 0 ? searchResults : customers}
                            onEdit={null}
                            onDelete={null}
                        />

                    </div>
                </Layout>
            )}
        </>
    )
}
