import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { closeInviteModal } from "../../redux/tasksSlice";
import type { TeamMember } from "../../types";

const MOCK_MEMBERS: TeamMember[] = [
  { id: "m1", name: "Ahmed Mohammed", role: "Developer" },
  { id: "m2", name: "Ramadan Alaa", role: "Marketer" },
  { id: "m3", name: "Ali Hasan", role: "Designer" },
  { id: "m4", name: "Saleh Zaki", role: "Project Manager" },
];

interface InviteModalProps {
  onConfirm: (members: TeamMember[]) => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ onConfirm }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    return MOCK_MEMBERS.filter((member) =>
      member.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    const members = MOCK_MEMBERS.filter((_, index) =>
      selected.includes(`m${index + 1}-${index}`)
    );

    onConfirm(members);
    dispatch(closeInviteModal());
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        background: "rgba(6,11,27,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "#060B1B",
          border: "1px solid rgba(126,227,255,0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white font-semibold text-sm">
            Invite Team Member
          </span>

          <button
            onClick={() => dispatch(closeInviteModal())}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
          >
            <X size={18} color="#ffffff" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7F8499]"
            />

            <input
              type="text"
              placeholder="Find Team Member"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-11
                rounded-full
                bg-[#1C2233]
                pl-11
                pr-4
                text-sm
                text-white
                placeholder:text-[#7F8499]
                outline-none
                border border-transparent
                focus:border-[#7EE3FF]/40
                transition-all
              "
            />
          </div>
        </div>

        {/* Members */}
        <div
          className="
            px-4
            pb-4
            space-y-3
            max-h-72
            overflow-y-auto
            scrollbar-thin
            scrollbar-thumb-[#7EE3FF]
            scrollbar-track-transparent
            scrollbar-thumb-rounded-full
          "
        >
          {filteredMembers.length === 0 && (
            <div className="py-8 text-center text-[#7F8499] text-sm">
              No team members found
            </div>
          )}

          {filteredMembers.map((member, index) => {
            const uniqueId = `${member.id}-${index}`;
            const isSelected = selected.includes(uniqueId);

            return (
              <button
                key={uniqueId}
                onClick={() => toggle(uniqueId)}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                style={{
                  background: "#161C2D",
                  border: isSelected
                    ? "1px solid rgba(126,227,255,.25)"
                    : "1px solid rgba(255,255,255,.04)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shrink-0"
                  style={{
                    background: `hsl(${(index * 70 + 210) % 360},40%,40%)`,
                  }}
                >
                  {member.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    {member.name}
                  </p>

                  <p className="text-[#B7BCC9] text-sm">{member.role}</p>
                </div>

                {/* Checkbox */}
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{
                    background: isSelected ? "#DDF5FF" : "transparent",
                    border: isSelected
                      ? "none"
                      : "1.5px solid rgba(221,245,255,.8)",
                  }}
                >
                  {isSelected && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#060B1B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 pt-2">
          <button
            onClick={handleAdd}
            disabled={selected.length === 0}
            className="w-full h-11 rounded-xl font-semibold text-[#060B1B] transition-all disabled:opacity-40 hover:opacity-90"
            style={{
              background: "linear-gradient(180deg,#7EE3FF,#69CAE6)",
            }}
          >
            Add
            {selected.length > 0 && ` (${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;