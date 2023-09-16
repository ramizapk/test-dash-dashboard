const LoadingIndicator = () => (
  <div className='flex flex-col items-center justify-center h-screen'>
    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-opacity-50'></div>
    <p className='mt-4 text-gray-600'>Loading...</p>
  </div>
)

export default LoadingIndicator
