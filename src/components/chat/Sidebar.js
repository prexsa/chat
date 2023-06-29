import { FaUserCircle, FaSearch } from 'react-icons/fa';
import AddFriendRFH from './AddFriend.RFH';
import Logout from '../Logout';
import ChannelList from './ChannelList';
import { useUserContext } from '../../userContext';

function Sidebar() {
  const { user } = useUserContext();
  // const user = JSON.parse(localStorage.getItem('user'))
  // console.log('user ;', user)
  return (
    <aside>
      <Logout />
      <header className="sidebar-header">
        <FaUserCircle className="faUserCircle-img" />
        <div>{user?.username}</div>
      </header>
      <div className="search-cntr">
        <FaSearch className="faSearch-img" />
        <input className="search-input" placeholder='Search friends' />
      </div>
      <AddFriendRFH />
      <ChannelList />
    </aside>
  )
}

export default Sidebar;