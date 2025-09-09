const AppendedMeta = ({ appended, openAccount }) => (
  <>
    <span
      onClick={(e) => {
        e.stopPropagation();
        openAccount(appended.user._id);
      }}
      className="text-sm text-black mt-1 opacity-0 group-hover:opacity-100 transition block hover:underline cursor-pointer"
    >
      {appended.name}
    </span>
    {appended.createdAt && !isNaN(new Date(appended.createdAt).getTime()) && (
      <span className="text-xs text-gray-600 mt-1">
        Appended on {new Date(appended.createdAt).toLocaleString()}
      </span>
    )}
  </>
);

export default AppendedMeta;
