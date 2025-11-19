export const FileInput: React.FC<{
  label: string;
  file: File | null;
  onChange: (file: File) => void;
  error?: string;
  required?: boolean;
}> = ({ label, file, onChange, error, required = false }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type="file"
      onChange={(e) => {
        if (e.target.files?.[0]) onChange(e.target.files[0]);
      }}
      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
    />
    {file && <p className="text-green-400 text-xs mt-1">✓ {file.name}</p>}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);