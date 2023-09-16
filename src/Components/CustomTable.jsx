import { useState } from "react"
import {
  FaCheck,
  FaEye,
  FaRegPenToSquare,
  FaRegTrashCan,
  FaXmark,
} from "react-icons/fa6"

const CustomTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  extraButtonType,
  myFunction,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const visibleData = data.slice(startIndex, endIndex)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className='w-full'>
      <table
        className='w-full text-sm text-right text-blue-100 dark:text-blue-100'
        dir='rtl'
      >
        <thead className='text-xs text-white uppercase bg-gradient-to-br from-minueActiveGraideint-100  to-minueActiveGraideint-100'>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope='col' className='px-6 py-3'>
                {column.label}
              </th>
            ))}
            {!(onEdit || onDelete || extraButtonType) ? (
              ""
            ) : (
              <th key='Actions' scope='col' className='px-6 py-3'>
                خيارات
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {visibleData.map((item, index) => (
            <tr
              key={startIndex + index}
              className={`bg-${
                index % 2 === 0 ? "white" : "gray-50"
              } border-b dark:bg-white text-black`}
            >
              {columns.map((column) => (
                <td key={column.key} className='px-6 py-4'>
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
              {!(onEdit || onDelete || extraButtonType) ? (
                ""
              ) : (
                <td
                  key='Actions'
                  className='px-0 py-7 flex flex-row items-center justify-evenly'
                >
                  {extraButtonType === "view" && (
                    <button
                      className='font-medium text-black dark:text-black hover:underline'
                      onClick={() => myFunction(item)}
                    >
                      <FaEye size={20} />
                    </button>
                  )}
                  {extraButtonType === "approve" && (
                    <button
                      className='font-medium text-green-500 dark:text-green-500 hover:underline'
                      onClick={() => onDelete(item)}
                    >
                      <FaCheck size={20} />
                    </button>
                  )}
                  {extraButtonType === "cancel" && (
                    <button
                      className='font-medium text-red-600 dark:text-red-500 hover:underline'
                      onClick={() => onDelete(item)}
                    >
                      <FaXmark size={20} />
                    </button>
                  )}
                  {!onEdit ? (
                    ""
                  ) : (
                    <button
                      className='font-medium text-yellow-500 dark:text-yellow-500 hover:underline'
                      onClick={() => onEdit(item)}
                    >
                      <FaRegPenToSquare size={20} />
                    </button>
                  )}

                  {!onDelete ? (
                    ""
                  ) : (
                    <button
                      className='font-medium text-red-600 dark:text-red-500 hover:underline'
                      onClick={() => onDelete(item)}
                    >
                      <FaRegTrashCan size={20} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='mt-4 flex justify-center'>
        <nav aria-label='Page navigation'>
          <ul className='pagination flex flex-row w-full'>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className='page-link'
                onClick={() => handlePageChange(currentPage - 1)}
              >
                السابق
              </button>
            </li>
            {Array.from(
              { length: totalPages },
              (_, index) =>
                (index + 1 === 1 ||
                  index + 1 === totalPages ||
                  (index + 1 >= currentPage - 1 &&
                    index + 1 <= currentPage + 1)) && (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className='page-link'
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                )
            )}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className='page-link'
                onClick={() => handlePageChange(currentPage + 1)}
              >
                التالي
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default CustomTable
