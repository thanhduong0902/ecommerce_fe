import { Link, useMatch } from "react-router-dom";

export default function RegisterHeader() {
  const registerMatch = useMatch("/register");
  const isRegister = Boolean(registerMatch);

  return (
    <header className="py-2 bg-yellow">
      <div className="grid grid-cols-12 items-center gap-4">
        <Link to="/" className="col-span-2">
          <img src={require("../../assets/images/Logo.png")} />
        </Link>
        <div className="ml-5 text-xl lg:text-2xl col-span-4">
          {isRegister ? "Đăng ký" : "Đăng nhập"}
        </div>
      </div>
    </header>
  );
}
