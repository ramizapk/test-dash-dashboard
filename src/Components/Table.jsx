import React from 'react';
import H from "@/images/9-17.jpg";
import Image from 'next/image';
const Table = () => {
    return (






        <table className="w-full text-sm text-right  text-blue-100 dark:text-blue-100" dir="rtl">
            <thead className="text-xs text-white uppercase  bg-gradient-to-br from-minueActiveGraideint-100  to-minueActiveGraideint-100">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        الرقم
                    </th>
                    <th scope="col" className="px-6 py-3">
                        العقار
                    </th>
                    <th scope="col" className="px-6 py-3">
                        الموقع
                    </th>
                    {/* <th scope="col" className="px-6 py-3">
                            النوع
                        </th> */}
                    <th scope="col" className="px-6 py-3">
                        السعر
                    </th>
                    <th scope="col" className="px-6 py-3">
                        الحالة
                    </th>
                    <th scope="col" className="px-6 py-3">
                        خيارات
                    </th>
                </tr>
            </thead>
            <tbody>

                <tr className="bg-white border-b dark:bg-white text-black ">
                    <td className="px-6 py-4">
                        1
                    </td>
                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-black">
                        <Image className="w-10 h-10 rounded-full ml-2" src={H} alt="Jese image" />
                        <div className="pl-3">
                            <div className="text-base font-semibold">بيت للبيع في شارع القصر</div>
                            <div className="font-normal text-gray-500">   بيت / بيع</div>
                        </div>
                    </th>
                    {/* <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            بيت للبيع في شارع القصر
                        </th> */}
                    <td className="px-6 py-4">
                        عدن/ المنصورة / بلوك5
                    </td>
                    {/* <td className="px-6 py-4">
                            بيت / ايجار
                        </td> */}
                    <td className="px-6 py-4">
                        $2999
                    </td>
                    <td className="px-6 py-4">
                        متاح
                    </td>
                    <td className="px-6 py-4">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">تعديل</a>
                        <span> | </span>
                        <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">حذف</a>
                    </td>
                </tr>

                <tr className="border-b bg-gray-50 text-black dark:bg-gray-200 ">
                    <td className="px-6 py-4">
                        2
                    </td>
                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-black">
                        <Image className="w-10 h-10 rounded-full ml-2" src={H} alt="Jese image" />
                        <div className="pl-3">
                            <div className="text-base font-semibold">بيت للبيع في شارع القصر</div>
                            <div className="font-normal text-gray-500">   بيت / بيع</div>
                        </div>
                    </th>
                    {/* <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            بيت للبيع في شارع القصر
                        </th> */}
                    <td className="px-6 py-4">
                        عدن/ المنصورة / بلوك5
                    </td>
                    {/* <td className="px-6 py-4">
                            بيت / ايجار
                        </td> */}
                    <td className="px-6 py-4">
                        $2999
                    </td>
                    <td className="px-6 py-4">
                        متاح
                    </td>
                    <td className="px-6 py-4">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">تعديل</a>
                        <span> | </span>
                        <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">حذف</a>
                    </td>
                </tr>





                {/* ... والصفوف الأخرى */}
            </tbody>
        </table>

    );
};

export default Table;
