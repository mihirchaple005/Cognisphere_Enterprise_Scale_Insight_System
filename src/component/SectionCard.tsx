import { Edit2 } from "lucide-react";

export const SectionCard: React.FC<{
  title: string;
  onEdit?: () => void;
  showEdit?: boolean;
  children: React.ReactNode;
  extraButton?: React.ReactNode;
}> = ({ title, onEdit, showEdit = false, children, extraButton }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex items-center gap-3">
        {extraButton}
        {showEdit && onEdit && (
          <button
            onClick={onEdit}
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            <Edit2 size={20} />
            Edit
          </button>
        )}
      </div>
    </div>
    {children}
  </div>
);
