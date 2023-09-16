const TextBox = ({
  label,
  placeholder,
  error,
  onChange,
  type,
  value,
  id,
  name,
  ...props
}) => {
  return (
    <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
      <label
        className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
        htmlFor='textbox-input'
      >
        {label}
      </label>
      <input
        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
          error ? "border-red-500" : "border-gray-500"
        } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        autoComplete={type === "password" ? "off" : "on"}
        onChange={onChange}
        {...props}
      />
      {error && <p className='text-red-500 text-xs italic'>{error}</p>}
    </div>
  )
}

export default TextBox
