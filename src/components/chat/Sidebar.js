import { FaUserCircle } from 'react-icons/fa';
import AddFriendRFH from './AddFriend.RFH';
import CreateGroup from './CreateGroup';
import Logout from '../Logout';
import ChannelList from './ChannelList';
import { useUserContext } from '../../userContext';
// import AutocompleteSearch from './AutocompleteSearch';
import { Box } from '@mui/material';

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
      {/*<div className="search-cntr">
        <FaSearch className="faSearch-img" />
        <input className="search-input" placeholder='Search friends' />
        <AutocompleteSearch />
      </div>*/}
      <Box sx={{ margin: '10px', padding: '5px', textAlign: 'left' }}>
        <AddFriendRFH />
        <CreateGroup />
      </Box>
      <ChannelList />
    </aside>
  )
}

export default Sidebar;