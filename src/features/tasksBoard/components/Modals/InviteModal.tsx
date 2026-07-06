import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  closeInviteModal,
  useAddUserToTaskMutation,
  useGetTeamMembersQuery,
} from "../../redux/tasksSlice";
import type { TeamMember } from "../../types";

interface TeamMembersResponse {
  teamId: string;
  employeesId: string[];
}

interface InviteModalProps {
  questId?: string;
  onClose?: () => void;
  onConfirm: (members: TeamMember[]) => void | Promise<void>;
}

const toTitleCase = (value: string) =>
  value
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const mapEmployeeToMember = (employeeId: string, teamId: string): TeamMember => {
  const parts = employeeId.split("-");
  const department = parts[0] || "Team";
  const rawName = parts[1] || employeeId;
  const rawRole = parts[2] || "member";

  return {
    id: employeeId,
    name: toTitleCase(rawName),
    role: `${toTitleCase(department)} ${toTitleCase(rawRole)}`,
    teamId,
  };
};

const InviteModal: React.FC<InviteModalProps> = ({ questId, onClose, onConfirm }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, isError } = useGetTeamMembersQuery(undefined);
  const [addUserToTask, { isLoading: isAssigning }] = useAddUserToTaskMutation();

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const members = useMemo(() => {
    const response = data as TeamMembersResponse | undefined;
    if (!response?.teamId || !Array.isArray(response.employeesId)) return [];
    return response.employeesId.map((employeeId) =>
      mapEmployeeToMember(employeeId, response.teamId),
    );
  }, [data]);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    return members.filter((member) =>
      `${member.name} ${member.role} ${member.id}`.toLowerCase().includes(normalizedSearch),
    );
  }, [members, search]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    const selectedMembers = members.filter((member) => selected.includes(member.id));

    try {
      if (questId) {
        for (const member of selectedMembers) {
          await addUserToTask({
              userId: member.id,
              questId,
              teamId: member.teamId || "",
          }).unwrap();
        }
      }

      await onConfirm(selectedMembers);
      onClose?.();
      dispatch(closeInviteModal());
    } catch (err) {
      console.error("Failed to assign team members:", err);
    }
  };

  const handleClose = () => {
    onClose?.();
    dispatch(closeInviteModal());
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
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
            onClick={handleClose}
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
          {isLoading && (
            <div className="py-8 text-center text-[#7F8499] text-sm">
              Loading team members...
            </div>
          )}

          {isError && !isLoading && (
            <div className="py-8 text-center text-[#df5d5d] text-sm">
              Failed to load team members
            </div>
          )}

          {!isLoading && !isError && filteredMembers.length === 0 && (
            <div className="py-8 text-center text-[#7F8499] text-sm">
              No team members found
            </div>
          )}

          {!isLoading && !isError && filteredMembers.map((member, index) => {
            const isSelected = selected.includes(member.id);

            return (
              <button
                key={member.id}
                onClick={() => toggle(member.id)}
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
            disabled={selected.length === 0 || isAssigning}
            className="w-full h-11 rounded-xl font-semibold text-[#060B1B] transition-all disabled:opacity-40 hover:opacity-90"
            style={{
              background: "linear-gradient(180deg,#7EE3FF,#69CAE6)",
            }}
          >
            {isAssigning ? "Assigning..." : "Add"}
            {!isAssigning && selected.length > 0 && ` (${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
