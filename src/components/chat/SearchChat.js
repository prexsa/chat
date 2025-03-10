import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Box, InputAdornment, TextField } from '@mui/material';

const SearchChat = ({ roomList, setList, user }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredRoomsByTermFound = roomList.filter((room) => {
      const found = room.mates.filter((mate) => {
        // filter out auth user
        return (
          mate.userId !== user.userId &&
          mate.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      if (found.length > 0) return room;
    });
    // console.log('filteredRoomsByTermFound: ', filteredRoomsByTermFound);
    setList([...filteredRoomsByTermFound]);
  };

  useEffect(() => {
    if (roomList.length > 0) {
      setList([...roomList]);
    }
  }, [roomList]);

  useEffect(() => {
    if (searchTerm === '') {
      setList([...roomList]);
    }
  }, [searchTerm]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0px 10px',
        // boxShadow: '1px 1px 4px 1px rgba(192,192,192,0.5)',
        backgroundColor: '#fdfdfe',
      }}
    >
      {roomList && roomList.length > 0 ? (
        <>
          <TextField
            variant="standard"
            // label="Type to search"
            onChange={handleInputChange}
            placeholder="Search"
            value={searchTerm}
            inputProps={{
              sx: { '&::placeholder': { color: '#636363', opacity: 1 } },
            }}
            sx={{ width: '100%' }}
            slotProps={{
              input: {
                startAdornment: (
                  <SearchIcon
                    sx={{
                      color: 'action.active',
                      mr: 1,
                      my: 0.5,
                    }}
                  />
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <CloseIcon
                      sx={{
                        '&:hover': {
                          cursor: 'pointer',
                          boxShadow: '0 0 5px 0 rgba(0,0,0,0.5)',
                          borderRadius: '50%',
                        },
                      }}
                      onClick={() => setSearchTerm('')}
                    />
                  </InputAdornment>
                ),
              },
            }}
            // InputProps={{}}
          />
        </>
      ) : null}
    </Box>
  );
};

SearchChat.propTypes = {
  roomList: PropTypes.array,
  setList: PropTypes.func,
  user: PropTypes.object,
};

export default SearchChat;
