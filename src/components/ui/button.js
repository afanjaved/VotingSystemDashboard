export function Button({ children, onClick, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
