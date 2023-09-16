export default function Card({ icon, title, value, label, color }) {
  return (
    <div className='flex bg-white p-6 rounded-lg shadow-md  justify-between items-center'>
      <div className='flex flex-col'>
        <h3 className='text-gray-500'>{title}</h3>
        <p
          className='text-3xl font-semibold mt-2 text-green-600'
          style={{ color: `${color}` }}
        >
          {value}
        </p>
        <p className='text-gray-500 mt-2'>{label}</p>
      </div>
      <div>{icon}</div>
    </div>
  )
}
