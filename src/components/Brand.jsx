import { Link } from "react-router-dom";

export default function Brand({ onNavigate }) {
  return (
    <Link
      aria-label="VIP StudioS, home"
      className="brand"
      onClick={onNavigate}
      to="/"
    >
      <img
        alt=""
        className="brand-logo"
        height="1024"
        src="/vip-studios-logo.jpeg"
        width="1536"
      />
    </Link>
  );
}
