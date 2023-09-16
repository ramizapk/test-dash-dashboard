import { useEffect, useState } from "react"
export default function DropDownList({
  title,
  options,
  onSelect,
  selectedValue,
  error,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    setSelectedOption(selectedValue)
  }, [selectedValue])
  const handleChange = (event) => {
    const selectedId = event.target.value
    setSelectedOption(selectedId)
    onSelect(selectedId)
  }

  return (
    <div className='relative inline-block text-right w-full md:w-1/2 px-3 mb-6 md:mb-0'>
      <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-black'>
        {title}
      </label>
      <select
        id='countries'
        value={selectedOption ?? ""}
        onChange={handleChange}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500'
      >
        <option value='' disabled>
          {title}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id ?? ""}>
            {option.attributes.name}
          </option>
        ))}
      </select>
      {error && <p className='text-red-500 text-xs italic'>{error}</p>}
    </div>
  )
}
