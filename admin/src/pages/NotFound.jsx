import { Link } from "react-router-dom";
import { FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar would be rendered here */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="text-red-500 text-4xl" />
              </div>
            </div>

            <h1 className="text-3xl font-bold font-['Volkhov'] text-primary-color mb-3">
              404 - Page Not Found
            </h1>

            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
              <br />
              Please check the URL or navigate back to the dashboard.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-color hover:bg-primary-dark"
              >
                <FiArrowLeft className="mr-2" />
                Return to Dashboard
              </Link>

              <Link
                to="/students"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                View Students
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFound;
