import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date },
  address: {
    houseName: { type: String },
    houseStreet: { type: String },
    houseCity: { type: String },
    housePincode: { type: Number },
  },
  phone: { type: Number },
  mobile: { type: Number },
  institutionDetails: {
    institutionName: { type: String },
    course: {
      courseName: { type: String },
      currentYear: { type: Number },
      courseDuration: { type: Number },
    },
    institutionStreet: { type: String },
    institutionCity: { type: String },
    institutionPincode: { type: Number },
  },

  isEligible: { type: Boolean, default: false },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
