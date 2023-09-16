import React from 'react'

export default function TextErea({ label, placeholder, error, value, onChange }) {
    return (
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">

            <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                {label}
            </label>
            <textarea
                id="message"
                rows="5"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={placeholder}
                value={value}
                onChange={onChange}

            ></textarea>
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
    )
}
