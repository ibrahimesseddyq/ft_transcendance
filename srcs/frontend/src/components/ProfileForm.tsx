export function ProfileForm({ user }: { user: any }) {
  const fields = [
    { label: 'First Name', value: user?.firstName },
    { label: 'Last Name', value: user?.lastName },
    { label: 'Email', value: user?.email },
    { label: 'Phone Number', value: user?.phone || 'Not provided' },
    { label: 'Position', value: user?.currentTitle || 'Full Stack Developer' }
  ];

  return (
    <div className="flex flex-col gap-4 px-4 items-center">
      <h1 className="font-bold text-white text-lg">My Information:</h1>
      <div className="flex flex-wrap lg:flex-col gap-3 place-content-center w-full">
        {fields.map((field, index) => (
          <div key={index} className="relative w-full max-w-64">
            <label className="absolute top-2 left-3 text-xs text-gray-400 font-medium">
              {field.label}
            </label>
            <div className="h-14 w-full pt-6 pb-2 pl-3 text-sm text-white border border-[#5F88B8] border-opacity-40 rounded bg-[#09122C] bg-opacity-20">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}