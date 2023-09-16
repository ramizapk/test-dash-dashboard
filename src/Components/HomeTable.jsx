const HomeTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  extraButtonType,
  myFunction,
  itemsPerPage = 10,
}) => {
  // Remove the pagination-related code
  // ...

  return (
    <div className='w-full'>
      <table
        className='w-full text-sm text-right text-blue-100 dark:text-blue-100'
        dir='rtl'
      >
        {/* Table header */}
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
        {/* Table body */}
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
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
                  {/* Buttons for actions */}
                  {/* ... */}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HomeTable
