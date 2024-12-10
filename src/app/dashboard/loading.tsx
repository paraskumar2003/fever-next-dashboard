'use client';
const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 h-14 w-14"></div>
            <style jsx>{`
        .loader {
          border-top-color: #F44336;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
};

export default Loader;
