import AddFriendRFH from './AddFriend.RFH';
import CreateGroup from './CreateGroup';
import Logout from '../Logout';
import ChannelList from './ChannelList';
import { useUserContext } from '../../userContext';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Sidebar = ({ showDrawer, setShowDrawer }) => {
  const { user } = useUserContext();
  // const user = JSON.parse(localStorage.getItem('user'))
  // console.log('user ;', user)

  return (
    <aside>
      <Logout />
      <header className="sidebar-header">
        <AccountCircleIcon />
        <div className="username" onClick={() => setShowDrawer(!showDrawer)}>{user?.username}</div>
      </header>
      <Box sx={{ margin: '10px', padding: '5px', textAlign: 'left' }}>
        <AddFriendRFH />
        <CreateGroup />
      </Box>
      <ChannelList />
    </aside>
  )
}

export default Sidebar;