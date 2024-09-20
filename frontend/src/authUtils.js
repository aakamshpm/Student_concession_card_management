export const isAuthenticated = () => {
  const studentInfo = localStorage.getItem("studentInfo")
    ? JSON.parse(localStorage.getItem("studentInfo"))
    : null;
  return studentInfo;
};
