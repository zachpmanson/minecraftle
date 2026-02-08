import MCButton from "@/components/MCButton.component";
import { useGlobal } from "@/context/Global/context";
import { useState } from "react";

export default function ResetPage() {
  const [newUserId, setNewUserId] = useState("");
  const { setUserId } = useGlobal();
  return (
    <div className="flex flex-col gap-4">
      <span className="text-white">Migrate Account</span>

      <input
        type="text"
        placeholder="Enter your old User ID"
        className="w-full rounded p-2"
        value={newUserId}
        onChange={(e) => setNewUserId(e.target.value)}
      />
      <MCButton
        onClick={() => {
          if (newUserId.trim().length === 0) return;
          localStorage.setItem("user_id", newUserId.trim());
          setUserId(newUserId.trim());
          alert("Account migrated successfully!");
        }}
      >
        Migrate
      </MCButton>
    </div>
  );
}
