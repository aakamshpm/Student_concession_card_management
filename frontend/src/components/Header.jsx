const Header = () => {
  return (
    <div className="header mt-[3em]">
      <div className="title  text-4xl font-semibold">
        <h1 className="font-['Volkhov']">
          Welcome{" "}
          <span className="text-primary-color font-['Volkhov']">Bruce </span>
        </h1>
      </div>
      <p className="mt-5 w-[50%] text-sm text-[#666666] leading-7">
        Easily manage your bus pass application, renewal, and status check
        online. Our platform is designed for students to streamline the process
        of applying for bus passes, tracking their status, and updating their
        profiles—all from one convenient location. Get started today and make
        your daily commute hassle-free
      </p>
      <button className="mt-3 py-3 px-4 text-xs text-primary-color border-solid border-[1px] rounded-md border-primary-color outline-none hover:bg-primary-color hover:text-[#fff] transition-colors duration-150">
        View Profile
      </button>
    </div>
  );
};

export default Header;
