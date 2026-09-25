export default function Button({ children, className = '', ...props }) {
  return <button className={`stickynote-button ${className}`} {...props}>{children}</button>;
}
