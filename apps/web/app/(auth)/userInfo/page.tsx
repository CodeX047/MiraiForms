import { UserProfile } from "@clerk/nextjs";

export default function UserInfoPage() {
  return (
    <div className="flex w-full items-start justify-center p-6">
      <div className="w-full max-w-2xl">
        <UserProfile />
      </div>
    </div>
  );
}
