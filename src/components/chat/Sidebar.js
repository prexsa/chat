// import { useContext } from 'react';
import AddFriend from './AddFriend';
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
      <header>
        <div>{user?.username}</div>
      </header>
      <AddFriend />
      <ChannelList />
    </aside>
  )
}

export default Sidebar;