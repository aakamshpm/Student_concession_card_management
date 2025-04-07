export const isAuthenticated = () => {
  const adminInfo =
    localStorage.getItem("role") === "admin" &&
    localStorage.getItem("adminInfo")
      ? localStorage.getItem("role")
      : null;

  return adminInfo;
};
