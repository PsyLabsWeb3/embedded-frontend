import Logo from '../atoms/Logo';
import SearchIcon from '../atoms/SearchIcon';
import ConnectWalletButton from '../atoms/ConnectWalletButton';
import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/Navbar.css';
import '../../styles/sections/Logo.css';
import '../../styles/sections/ConnectWalletButton.css';
import '../../styles/sections/SearchIcon.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar__content mx-container">
      <Logo />
      <div className="navbar__actions">
        <button className="navbar__search-btn" aria-label="Buscar">
          <SearchIcon />
        </button>
        <ConnectWalletButton />
      </div>
    </div>
  </nav>
);

export default Navbar;
