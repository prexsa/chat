import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';
import { SocketContext } from '../chat/Main';
import { Box, Button, Typography, Checkbox } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import SearchAutoCompleteNoRef from '../Inputs/SearchAutoCompleteNoRef';

const AddToGroup = ({ isDisabled }) => {
  const { socket } = useContext(SocketContext);
  const [connections, setConnections] = useState([]);
  const [checked, setChecked] = useState([]);
  // const [isDisabled, setIsDisabled] = useState(true);
  const methods = useForm({
    defaultValues: { members: [] },
  });

  useEffect(() => {
    handleTest();
  }, []);

  useEffect(() => {
    // console.log({ checked });
  }, [checked]);

  const handleCreateGroup = () => {
    console.log('handleCreateGroup');
  };

  const handleTest = () => {
    socket.connect();
    socket.emit('test', (resp) => {
      // console.log({ resp });
      const { uniqueConnections } = resp;
      setConnections(uniqueConnections);
    });
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  return (
    <div>
      <FormProvider {...methods}>
        <Box component="form">
          <Box sx={{ my: '20px' }}>
            <Typography variant="subtitle1">Add members</Typography>

            <SearchAutoCompleteNoRef
              name="members"
              label="Username or email"
              isMultiple={true}
              disabled={isDisabled}
            />
          </Box>
          <Box
            sx={{
              width: 600,
              opacity: isDisabled ? 0.5 : 1,
              pointerEvents: isDisabled ? 'none' : 'auto',
            }}
          >
            <List dense component="div" role="list">
              {connections.map((connection) => {
                const userId = connection.userId;
                const name = connection.fullname;

                return (
                  <ListItemButton
                    selected={checked.includes(userId)}
                    key={userId}
                    role="listitem"
                    onClick={handleToggle(userId)}
                  >
                    <ListItemAvatar>
                      <Avatar
                      // alt={`Avatar n°${value + 1}`}
                      // src={`/static/images/avatar/${value + 1}.jpg`}
                      />
                    </ListItemAvatar>
                    <ListItemText id={userId} primary={name} />
                    <ListItemIcon>
                      <Checkbox
                        checked={checked.includes(userId)}
                        disableRipple
                        inputProps={{ 'aria-labelledby': userId }}
                      />
                    </ListItemIcon>
                  </ListItemButton>
                );
              })}
            </List>
            <Button onClick={handleCreateGroup}>Add</Button>
          </Box>
        </Box>
      </FormProvider>
    </div>
  );
};

AddToGroup.propTypes = {
  isDisabled: PropTypes.bool,
};

export default AddToGroup;
