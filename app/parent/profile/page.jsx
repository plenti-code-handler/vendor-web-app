import ParentBussinessHeader from "../../../components/navigation/ParentBussinessHeader";
import ParentProfileForm from "../../../components/sections/bussiness/profile/ParentProfileForm";

export default function ParentProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ParentBussinessHeader />

      <div className="bg-white rounded-t-3xl border-t-4 border-gray-500 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ParentProfileForm />
        </div>
      </div>
    </div>
  );
}

