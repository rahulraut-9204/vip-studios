import { Link } from "react-router-dom";

export default function Brand({ onNavigate }) {
  return (
    <Link
      aria-label="VIP StudioS, home"
      className="brand"
      onClick={onNavigate}
      to="/"
    >
      <span aria-hidden="true" className="brand-mark">V/S</span>
      <span className="brand-wordmark">
        <span>VIP</span>
        <span>STUDIOS</span>
      </span>
    </Link>
  );
}
