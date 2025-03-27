import { Link } from "react-router-dom";

const Guidelines = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-semibold font-['Volkhov'] mb-2 text-primary-color">
        Bus Concession Card Guidelines
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Important rules and procedures for applying for your student bus
        concession card
      </p>

      <div className="space-y-8">
        {/* Eligibility Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold font-['Volkhov'] text-primary-color mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-color text-white rounded-full flex items-center justify-center mr-3">
              1
            </span>
            Eligibility Criteria
          </h2>
          <ul className="space-y-3 list-disc pl-6 text-gray-700">
            <li>
              Exclusively for <strong>currently enrolled</strong> school and
              college students
            </li>
            <li>
              Valid student ID from recognized educational institution required
            </li>
            <li>
              Must apply <strong>every academic year</strong> - no renewal
              option
            </li>
            <li>Students must be between 12-25 years of age</li>
          </ul>
        </div>

        {/* Application Process */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold font-['Volkhov'] text-primary-color mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-color text-white rounded-full flex items-center justify-center mr-3">
              2
            </span>
            Application Process
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-color rounded-full"></div>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  Step 1: Complete Profile
                </h3>
                <p className="text-gray-600 mt-1">
                  Fill all required student details in your{" "}
                  <Link
                    to="/profile"
                    className="text-primary-color hover:underline"
                  >
                    profile section
                  </Link>{" "}
                  before verification
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-color rounded-full"></div>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  Step 2: ID Verification
                </h3>
                <p className="text-gray-600 mt-1">
                  Upload clear photo of your current student ID card for
                  verification (2-3 business days processing)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-color rounded-full"></div>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  Step 3: Apply for Card
                </h3>
                <p className="text-gray-600 mt-1">
                  Only after successful verification can you apply for the
                  concession card
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Delivery */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold font-['Volkhov'] text-primary-color mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-color text-white rounded-full flex items-center justify-center mr-3">
              3
            </span>
            Card Delivery & Usage
          </h2>
          <ul className="space-y-3 list-disc pl-6 text-gray-700">
            <li>
              <strong>Digital Pass:</strong> Available immediately after
              approval in your account
            </li>
            <li>
              <strong>Physical Card:</strong> Optional delivery to your
              institution (allow 10-14 business days)
            </li>
            <li>
              Bus conductors will verify your digital pass via{" "}
              <strong>unique QR code</strong> that shows active status
            </li>
            <li>
              Must present either digital pass or physical card when boarding
            </li>
          </ul>
        </div>

        {/* Withdrawal Policy */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold font-['Volkhov'] text-primary-color mb-4 flex items-center">
            <span className="w-8 h-8 bg-primary-color text-white rounded-full flex items-center justify-center mr-3">
              4
            </span>
            Application Withdrawal Policy
          </h2>
          <ul className="space-y-3 list-disc pl-6 text-gray-700">
            <li>
              You may <strong>withdraw</strong> your card application at any
              time before approval
            </li>
            <li>
              <strong>Cannot withdraw</strong> ID verification once submitted
            </li>
            <li>
              If card application is withdrawn, you may{" "}
              <strong>re-verify</strong> yourself once more
            </li>
            <li>
              After second verification attempt, you must wait for the next
              academic year
            </li>
          </ul>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-800 mb-3">
            ⚠️ Important Notes
          </h2>
          <ul className="space-y-2 list-disc pl-6 text-yellow-700">
            <li>
              Apply <strong>at least 3 weeks</strong> before your current card
              expires
            </li>
            <li>
              False information will result in permanent ban from the program
            </li>
            <li>
              Digital pass must be shown from official app - screenshots not
              accepted
            </li>
            <li>
              Physical cards cannot be replaced if lost - use digital option
              instead
            </li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/apply"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-color hover:bg-primary-dark focus:outline-none"
          >
            Begin Your Application
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
