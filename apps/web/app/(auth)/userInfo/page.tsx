import ProfileCard from "~/components/profile-card";

export default function UserInfoPage() {
  return (
    <div className="flex w-full items-start justify-center p-6">
      <div className="w-full max-w-md">
        <ProfileCard />
      </div>
    </div>
  );
}
