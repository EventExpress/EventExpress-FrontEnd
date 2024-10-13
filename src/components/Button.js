// src/components/Button.js

import React from 'react';

const Button = ({ type = 'button', onClick, loading, children, className }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${className} ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            disabled={loading} // Desabilita o botão se estiver em estado de loading
        >
            {loading ? (
                <>
                    <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 mr-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5C100 78.8431 78.8431 100 50 100C21.1569 100 0 78.8431 0 50.5C0 22.1569 21.1569 1 50 1C78.8431 1 100 22.1569 100 50.5Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.3005 50.5C93.3005 77.0342 77.0342 93.3005 50.5 93.3005C23.9658 93.3005 7.69948 77.0342 7.69948 50.5C7.69948 23.9658 23.9658 7.69948 50.5 7.69948C77.0342 7.69948 93.3005 23.9658 93.3005 50.5Z"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Carregando...
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
