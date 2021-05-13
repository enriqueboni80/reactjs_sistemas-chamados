import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { Link } from "react-router-dom";
import avatar from "../../assets/avatar.png";
import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import "./header.css";

function Header() {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl === null ? avatar : user.avatarUrl}
          alt="Foto avatar"
        />
      </div>
      <Link to="/dashboard">
        <FiHome color="#FFF" size={24} />
        Chamados
      </Link>
      <Link to="/customers">
        <FiUser color="#FFF" size={24} />
        Clientes
      </Link>
      <Link to="/profile">
        <FiSettings color="#FFF" size={24} />
        Configuracoes
      </Link>
    </div>
  );
}

export default Header;
