import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Autocomplete, TextField, Button } from '@mui/material';

// https://refine.dev/blog/material-ui-autocomplete-component/#the-useautocomplete-hook
// https://codesandbox.io/p/sandbox/clever-surf-8dmo7?file=%2Fsrc%2FForm%2FComponents%2FUsers.js%3A27%2C22
export const users = [
  {
    name: 'Andrew',
    address: {
      country: 'AQ',
    },
  },
  {
    name: 'Danniel',
    address: {
      country: 'IL',
    },
  },
  {
    name: 'Alex',
    address: {
      country: 'BE',
    },
  },
];

export default function CustomAutoComplete() {
  const { handleSubmit, control } = useForm({
    defaultValues: { search: null },
  });
  // const [value, setValue] = useState('');

  const onSubmit = (data) => console.log(data);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        render={({ field: { onChange } }) => (
          <Autocomplete
            onChange={(event, item) => {
              onChange(item);
            }}
            options={users}
            getOptionLabel={(item) => (item.name ? item.name : '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="User Name"
                margin="normal"
                variant="outlined"
              />
            )}
          />
        )}
        control={control}
        name="search"
        defaultValue=""
      />
      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" type="submit" fullWidth>
          Add
        </Button>
      </Box>
    </Box>
  );
}
