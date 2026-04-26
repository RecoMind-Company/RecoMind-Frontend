import React, { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { closeInviteModal } from "../../redux/tasksSlice";
import type { TeamMember } from "../../types";

const MOCK_MEMBERS: TeamMember[] = [
  { id: "m1", name: "Ahmed Mohammed", role: "Developer" },
  { id: "m2", name: "Ahmed Mohammed", role: "Developer" },
  { id: "m3", name: "Ahmed Mohammed", role: "Developer" },
  { id: "m4", name: "Ahmed Mohammed", role: "Developer" },
];

interface InviteModalProps {
  onConfirm: (members: TeamMember[]) => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ onConfirm }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    const members = MOCK_MEMBERS.filter((m) => selected.includes(m.id));
    onConfirm(members);
    dispatch(closeInviteModal());
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(6,11,27,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "#0d1b3e",
          border: "1px solid rgba(126,227,255,0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-white font-semibold text-sm">Invite Team Member</span>
          <button onClick={() => dispatch(closeInviteModal())}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
            <X size={14} color="#7f7f7f" />
          </button>
        </div>

        {/* Members list */}
        <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
          {MOCK_MEMBERS.map((member, i) => {
            const isSelected = selected.includes(member.id + i);
            const uniqueId = member.id + i;
            return (
              <button
                key={uniqueId}
                onClick={() => toggle(uniqueId)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150"
                style={{
                  background: isSelected ? "rgba(126,227,255,0.06)" : "rgba(255,255,255,0.03)",
                  border: isSelected ? "1px solid rgba(126,227,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: `hsl(${(i * 70 + 200) % 360}, 45%, 35%)`, color: "#eeeeee" }}
                >
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{member.name}</p>
                  <p className="text-[#7f7f7f] text-xs">{member.role}</p>
                </div>
                {/* Checkbox */}
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    border: isSelected ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                    background: isSelected ? "#7ee3ff" : "transparent",
                  }}
                >
                  {isSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#060b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Add button */}
        <div className="p-4 pt-2">
          <button
            onClick={handleAdd}
            disabled={selected.length === 0}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #7ee3ff 0%, #4fb8d8 100%)", color: "#060b1b" }}
          >
            Add ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;