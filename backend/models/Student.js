import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date },
  address: {
    houseName: { type: String },
    street: { type: String },
    city: { type: String },
    pincode: { type: Number },
  },
  phone: { type: Number },
  mobile: { type: Number },
  institutionDetails: {
    institutionName: { type: String },
    course: {
      name: { type: String },
      currentYear: { type: Number },
    },
    duration: { type: Number },
    street: { type: String },
    city: { type: String },
    pincode: { type: Number },
  },

  isEligible: { type: Boolean, default: false },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
