import { useState, useRef } from "react";
import { FiUpload, FiCamera, FiX } from "react-icons/fi";

const PhotoUploadSection = ({ student, onPhotoUpload }) => {
  const [preview, setPreview] = useState(student?.studentPhoto || null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onPhotoUpload(file); // Pass file to parent component
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Student Photo
      </label>

      <div
        className={`relative w-40 h-40 rounded-full border-2 border-dashed ${
          preview ? "border-transparent" : "border-gray-300"
        } overflow-hidden cursor-pointer group`}
        onClick={() => fileInputRef.current.click()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Student"
              className="w-full h-full object-cover"
            />
            {(isHovering || !student?.studentPhoto) && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
                <FiUpload className="text-white text-xl mb-1" />
                <span className="text-white text-sm text-center">
                  Click to change
                </span>
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <FiX className="text-sm" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <FiCamera className="text-2xl mb-2" />
            <span className="text-sm">Upload Photo</span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        JPG or PNG, max 2MB. Face should be clearly visible.
      </p>
    </div>
  );
};

export default PhotoUploadSection;
