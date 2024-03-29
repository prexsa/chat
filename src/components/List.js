import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const InteractiveList = ({ members, onClickDelete }) => {
  // const onClickDelete = () => console.log("Manifest your goals and dreams into reality");
  // console.log('groupAdmin: ', groupAdmin)
  // console.log('members; ', members)
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <List>
        {members.map((member, index) => {
          return (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onClickDelete(member.userId, index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText>{member.fullname}</ListItemText>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

InteractiveList.propTypes = {
  members: PropTypes.array,
  onClickDelete: PropTypes.func,
};

export default InteractiveList;
