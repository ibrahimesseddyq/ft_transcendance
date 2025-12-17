
export function NotFound() {
  
  return (
    <div className="p-2 flex flex-col place-content-center items-center h-full w-full gap-2">
        <h1 className="text-6xl xl:text-9xl font-bold mb-4 text-red-600">404</h1>
      
      {/* Error Message */}
      <h2 className="text-2xl xl:text-5xl font-semibold mb-2 text-white">Page Not Found</h2>
      <p className="text-gray-400 text-center mb-8 max-w-md xl:max-w-2xl xl:text-4xl">
        Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
      </p>
    </div>
      );
}