import ParentLoginForm from "../../../components/sections/auth/ParentLoginForm";
import AuthLeftContent from "../../../components/auth/AuthLeftContent";

export default function ParentLoginPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-10">
        <AuthLeftContent />
        <div className="flex flex-col w-full lg:w-[60%] bg-white h-[85vh] lg:min-h-[85vh] lg:h-[95vh] max-h-[850px] rounded-[24px] shadow-lg overflow-hidden mt-10 lg:mt-20">
          <div className="flex flex-col items-center flex-1 w-full px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto justify-center">
            <ParentLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

