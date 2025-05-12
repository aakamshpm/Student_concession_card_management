import { Link } from "react-router-dom";

const HomeBody = () => {
  return (
    <div className="body-content mt-10 mb-10">
      {/* Quick Actions Section */}
      <div className="actions-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          to="/apply"
          className="action-card p-6 border border-gray-200 rounded-lg hover:border-primary-color transition-colors duration-150"
        >
          <h2 className="text-2xl font-semibold font-['Volkhov'] mb-3 text-primary-color">
            Apply for New Card
          </h2>
          <p className="text-[#666666]">
            Submit a new application for your student concession card.
          </p>
        </Link>

        <Link
          to="/withdraw"
          className="action-card p-6 border border-gray-200 rounded-lg hover:border-primary-color transition-colors duration-150"
        >
          <h2 className="text-2xl font-semibold font-['Volkhov'] mb-3 text-primary-color">
            Withdraw Application
          </h2>
          <p className="text-[#666666]">
            Pull back your Application if mistakenly applied.
          </p>
        </Link>

        <Link
          to="/status"
          className="action-card p-6 border border-gray-200 rounded-lg hover:border-primary-color transition-colors duration-150"
        >
          <h2 className="text-2xl font-semibold font-['Volkhov'] mb-3 text-primary-color">
            Check Status
          </h2>
          <p className="text-[#666666]">
            Track the status of your current application.
          </p>
        </Link>
      </div>

      {/* Current Card Status Section */}
      {/* <div className="current-status mb-12">
        <h2 className="text-3xl font-semibold font-['Volkhov'] mb-5">
          Your Current Card (DEMO)
        </h2>
        <div className="status-card p-6 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#666666]">Card Number</p>
              <p className="font-medium">SC-2024-78945</p>
            </div>
            <div>
              <p className="text-[#666666]">Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
            <div>
              <p className="text-[#666666]">Expiry Date</p>
              <p className="font-medium">15 June 2024</p>
            </div>
            <div>
              <p className="text-[#666666]">Days Remaining</p>
              <p className="font-medium">78 days</p>
            </div>
          </div>
          <button className="mt-6 py-2 px-4 text-base text-primary-color border-solid border-[1px] rounded-md border-primary-color outline-none hover:bg-primary-color hover:text-[#fff] transition-colors duration-150">
            Download Digital Card
          </button>
        </div>
      </div> */}

      {/* Notifications Section */}
      <div className="notifications">
        <h2 className="text-3xl font-semibold font-['Volkhov'] mb-5">
          Notifications
        </h2>
        <div className="notification-list space-y-4">
          <div className="notification-item p-4 border-l-4 border-primary-color bg-gray-50">
            <p className="font-medium">
              Your renewal application has been approved.
            </p>
            <p className="text-sm text-[#666666]">2 days ago</p>
          </div>
          <div className="notification-item p-4 border-l-4 border-yellow-400 bg-gray-50">
            <p className="font-medium">
              Your card will expire in 78 days. Renew now to avoid interruption.
            </p>
            <p className="text-sm text-[#666666]">1 week ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBody;
