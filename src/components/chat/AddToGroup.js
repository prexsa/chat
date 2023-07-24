import { useState, useContext, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FaPlus, FaUserPlus } from 'react-icons/fa';
import { Button, Modal, ListGroup } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { FriendContext, SocketContext } from './Chat';
// https://github.com/srigar/multiselect-react-dropdown
// https://10xn41w767.codesandbox.io/
function AddToGroup() {
  const multiselectRef = useRef();
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm();
  const { channel, friendList, setFriendList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [respErr, setRespErr] = useState("");
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState([]);
  const [friends, setFriends] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setRespErr('')
    }, 2000)
  }, [respErr]);

  const populateGroupMembers = (roomId) => {
    // console.log('roomId: ', roomId)
    socket.connect()
    socket.emit('get_group_members', {roomId}, ({ members }) => {
      // console.log('get_group_members ', members)
      const format4Selected = members.map((member, index) => {
        return {
          name: member.username,
          id: index,
          userId: member.userId
        }
      })
      
      // console.log('members: ', format4Selected)
      // setSelected(format4Selected)
      setMembers(format4Selected)
    })
  }

  const handleOnSubmit = (data) => {
    console.log('handleOnSubmit; ', data)
    socket.connect()
    socket.emit('add_members', { roomId: channel.roomId, members: data.multiselect })
    setMembers([...members, data.multiselect])
    resetValues();
  }

  const resetValues = () =>  {
    // By calling the belowe method will reset the selected values programatically
    multiselectRef.current.resetSelectedValues();
  }

  const handleRemoveListItem = (data, index) => {
    // console.log('onSelectedOptionsChange: ', data)
    setMembers(members.filter((member, idx) => idx !== index))
    socket.connect()
    socket.emit('remove_member_from_group', { roomId: channel.roomId, userId: data.userId }, ({ resp }) => {
      // console.log('resp: ', resp)
    })
  }

  useEffect(() => {
    // console.log('channel: ', channel)
    if(show) {
      populateGroupMembers(channel.roomId)
    }
  }, [show])

  useEffect(() => {
    // console.log('friendList: ', friendList)
    const friends = friendList
    .filter(friend => friend.hasOwnProperty('username'))
    .map((friend, index) => {
      return {
        name: friend.username,
        id: index,
        userId: friend.userId
      }
    })

    // filter data that is unique in friends list 
    const filter4AvailableMembers = friends.filter((obj) => {
      return !members.find(obj2 => obj2.userId === obj.userId)
    })
    // console.log('filter4AvailableMembers: ;', filter4AvailableMembers)
    // console.log('friends: ', friends)
    setFriends(filter4AvailableMembers)
  }, [friendList])

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  return (
    <div>
      <Button onClick={handleShow} size="sm">
        <div className="btn-icon-txt"><FaUserPlus /></div>
      </Button>
      <Modal 
        show={show} 
        onHide={handleClose}
        backdrop={'static'} // disable onHide when backdrop is clicked
      >
        <Modal.Header closeButton>
          <Modal.Title>Add to group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body-children">
            <h5>Current Members</h5>
            <ListGroup>
            {
              members.length && members.map((member, index) => {
                return (
                  <ListGroup.Item key={index} action onClick={() => handleRemoveListItem(member, index)}>
                    {member.name}
                  </ListGroup.Item>
                )
              })
            }
            </ListGroup>
          </div>
          <div className="modal-body-children">
            <h5>Add Members</h5>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
              <Controller 
                control={control}
                name="multiselect"
                render={({ field: { onChange, value }}) => (
                  <Multiselect
                    ref={multiselectRef}
                    options={friends} // Options to display in the dropdown
                    selectedValues={selected} // Preselected value to persist in dropdown
                    onSelect={onChange} // Function will trigger on select event
                    onRemove={onChange} // Function will trigger on remove event
                    displayValue="name" // Property name to display in the dropdown options
                    closeOnSelect={false}
                    style={{
                      multiselectContainer: {
                        minHeight: '100px'
                      }
                    }}
                    />
                )}
              />
              <input type="submit" />
            </form>
            
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AddToGroup;