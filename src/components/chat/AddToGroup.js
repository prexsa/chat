import { useState, useContext, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FriendContext, SocketContext } from './Chat';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { 
  Box, 
  Button,
  IconButton, 
  InputLabel, 
  FormControl, 
  FormHelperText,
  OutlinedInput, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

import List from '../List';

function AddToGroup() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { channel, setFriendList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [showResp, setShowResp] = useState("");
  const [show, setShow] = useState(false);
  const [groupAdmin, setGroupAdmin] = useState({ userId: '', username: '' })
  const [members, setMembers] = useState([]);
// console.log({ groupDetails })
  useEffect(() => {
    setTimeout(() => {
      setShowResp('')
    }, 2000)
  }, [showResp]);

  useEffect(() => {
    socket.on('exit_group_chat', ({ roomId, userId }) => {
      // console.log('exit_group_chat: ', { roomId, userId })
      // remove group chat from user's channel list
      setFriendList(prevFriends => {
        return [...prevFriends].filter(friend => friend?.roomId !== roomId)
      })
      /*setMembers(prevMembers => {
        return [...prevMembers].filter(member => member.userId !== userId)
      })*/
    })
    return () => socket.off('exit_group_chat')
  }, [socket, setFriendList])

  const populateGroupMembers = useCallback((roomId) => {
      // console.log('roomId: ', roomId)
      // console.log('channel: ', channel)
      socket.connect()
      socket.emit('get_group_members', {roomId}, ({ members }) => {
        // console.log('get_group_members ', members)
        const format4Selected = members.map((member, index) => {
          return {
            username: member.username,
            id: index,
            userId: member.userId,
            owner: channel.owner === member.userId ? true : false
          }
        })
        
        // console.log('members: ', format4Selected)
        // setSelected(format4Selected)
        setMembers(format4Selected)
      })
    }, [channel, socket])

  const handleOnSubmit = (data) => {
    console.log('handleOnSubmit; ', data)
    socket.connect()
    socket.emit('add_members', { roomId: channel.roomId, name: data.name }, (resp) => {
      console.log('resp: ', resp)
      if(resp.isFound) {
        const member = { username: resp.username, userId: resp.userId }
        setMembers(prev => [...prev, member ])
      }
    })
    // const membersLen = members.length;
    // const changeIndex = data.multiselect.map((user, index) => ({ id: membersLen + 1 + index }))
    // setMembers([...members, ...data])
    reset({ name: '' })
    // resetValues();
  }

  const handleRemoveMember = (userId, index) => {
    console.log({ userId, index })
    setMembers(members.filter((member, idx) => idx !== index))
    socket.connect()
    socket.emit('leave_group', { channelId: channel.roomId, userId }, ({ resp }) =>{ 
        console.log('resp: ', resp) 
      })
  }

  useEffect(() => {
    // console.log('channel: ', channel)
    socket.connect();
    socket.emit('get_group_admin_info', { ownerId: channel.owner }, ({ username }) => {
      // console.log('username: ', username)
      setGroupAdmin({ userId: channel.owner, username });
    })
    return () => socket.off('get_group_admin_info');
  }, [channel, socket])

// console.log('calling')

  useEffect(() => {
    // console.log('channel: ', channel)
    if(show) {
      populateGroupMembers(channel.roomId)
    }
  }, [show, populateGroupMembers, channel])

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const onErrors = errors => console.error(errors)

  return (
    <div>
      <IconButton onClick={handleShow} size="sm">
        <GroupAddIcon  />
      </IconButton>

      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Add members</DialogTitle>
        <DialogContent>
          <Box sx={{ color: 'red' }}>{showResp}</Box>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(handleOnSubmit, onErrors)}
          >
            <Box sx={{ margin: '20px 0', width: '400px'}}>
              <FormControl 
                variant="outlined" 
                fullWidth 
                // error={usrNameError.hasError}
                name="name"
                // onFocus={onFocusHandler}
              >
                <InputLabel htmlFor="outlined-adornment-password" sx={{ top: '-7px' }}>Username or email</InputLabel>
                <OutlinedInput
                  type="text"
                  size="small"
                  label="Username or email"
                  {...register('name', { required: true })}
                />
                <FormHelperText id="component-error-text">{errors?.name ? errors?.name.message : ''}</FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ marginTop: '20px' }}>
              <Button variant="contained" type="submit" fullWidth>Add</Button>
            </Box>
          </Box>
          <Box sx={{ marginTop: '25px', borderTop: '1px solid lightgrey', borderRadius: '3px', padding: '10px 5px' }}>
            <h4>Members</h4>
            <List members={members} onClickDelete={handleRemoveMember} groupAdmin={groupAdmin} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/*<Button onClick={handleClose}>Subscribe</Button>*/}
        </DialogActions>
      </Dialog>


    </div>
  )
}

export default AddToGroup;
      /*<Modal 
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
                  <ListGroup.Item key={index} action >
                    <div className="addToGroup-list-item">
                      {member.name}
                      {
                        // if owner, disable remove icon
                        !member.owner ? 
                        <div>
                          <RemoveIcon 
                            className="leave-icon" 
                            onClick={() => handleRemoveListItem(member, index)} 
                          />
                        </div>
                        :
                        null
                      }
                    </div>
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
      </Modal>*/