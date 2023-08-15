import { FaUserCircle, FaSearch } from 'react-icons/fa';
import AddFriendRFH from './AddFriend.RFH';
import CreateGroup from './CreateGroup';
import Logout from '../Logout';
import ChannelList from './ChannelList';
import { useUserContext } from '../../userContext';

const Sidebar = ({ showDrawer, setShowDrawer }) => {
  const { user } = useUserContext();
  // const user = JSON.parse(localStorage.getItem('user'))
  // console.log('user ;', user)

  return (
    <aside>
      <Logout />
      <header className="sidebar-header">
        <FaUserCircle className="faUserCircle-img" />
        <div className="username" onClick={() => setShowDrawer(!showDrawer)}>{user?.username}</div>
      </header>
      <div className="search-cntr">
        <FaSearch className="faSearch-img" />
        <input className="search-input" placeholder='Search friends' />
      </div>
      <AddFriendRFH />
      <CreateGroup />
      <ChannelList />
    </aside>
  )
}

export default Sidebar;