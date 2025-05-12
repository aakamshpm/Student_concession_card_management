import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { STUDENT_FRONTEND_URL } from "./constants.js";

// Format the neccessary fields for concession card
const formatData = (data) => {
  const formatedData = {
    name: data.firstName + " " + data.lastName,
    age: data.age,
    dateOfBirth: data.dateOfBirth.toLocaleDateString(),
    studentPhoto: data.studentPhoto,

    institutionDetails: data.institutionDetails,
    routes: data.routes,
    qrCode: data.qrCode,
    issuedDate: data.issuedDate.toLocaleDateString(),
    expiryDate: data.expiryDate.toLocaleDateString(),
  };

  return formatedData;
};

// function to dynamically change placeholders in template file
const populateTemplate = (templatePath, data) => {
  let template = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders with actual data
  const resolveValue = (path, obj) =>
    path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), obj);

  template = template.replace(/{{([\w.]+)}}/g, (_, key) => {
    return resolveValue(key, data) || "";
  });

  return template;
};

const generateConcessionCard = async (studentData, res) => {
  try {
    //QR generation
    const encodedURL = `${STUDENT_FRONTEND_URL}/verify?id=${studentData.id}`;

    const qrImageData = await QRCode.toDataURL(encodedURL);
    studentData.qrCode = qrImageData;

    // Student Photo URL Generation
    const studentPhotoPath = path.resolve("uploads", studentData.studentPhoto);
    const imageMime = "image/jpeg";
    const imageBuffer = fs.readFileSync(studentPhotoPath);
    const base64Image = `data:${imageMime};base64,${imageBuffer.toString(
      "base64"
    )}`;
    studentData.studentPhoto = base64Image;

    // Age Calculcation
    const today = new Date();
    const birthDateObj = new Date(studentData.dateOfBirth);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDif = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDif < 0 ||
      (monthDif === 0 && birthDateObj.getDate() > today.getDate())
    )
      age--;
    studentData.age = age;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const templatePath = path.resolve("./templates/concession-template.html");

    const htmlContent = populateTemplate(templatePath, formatData(studentData));

    await page.setContent(htmlContent);

    // Create the card pdf
    const outputFileName = `concession_card_${studentData._id}.pdf`;
    await page.pdf({
      path: `middleware/${outputFileName}`,
      width: "500px",
      height: "800px",
      printBackground: true,
      margin: {
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
      },
    });

    await browser.close();

    return outputFileName;
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(error.message);
  }
};

export { generateConcessionCard };
