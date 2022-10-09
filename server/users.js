let users = [];

const addUser = (id, name) => {
  const user = { id, name }
  users.push(user)
  // console.log('user: ', user)
  return { user }
}

const getUser = id => {
  // console.log('getUser: ', users)
  let user = users.find(user => user.id == id)
  return user
}

const deleteUser = (username) => {
  const index = users.findIndex(user => user.name.trim().toLowerCase() === username.trim().toLowerCase())
  // const index = users.findIndex((user) => user.id === id);
  if(index !== -1) return users.splice(index, 1)[0];
}

const getAllUsers = () => {
  return users;
}

const getConnectedUsers = (username) => {
  const connectedUsers = users.filter(user => user.name.trim().toLowerCase() !== username.trim().toLowerCase())
  return connectedUsers;
}

const userNameExist = (username) => {
  const existingUser = users.find(user => user.name.trim().toLowerCase() === username.trim().toLowerCase())
  if(existingUser) return true;
  return false;
}

const clearUsers = () => {
  users = [];
  return users;
}

module.exports = { addUser, getUser, deleteUser, getAllUsers, userNameExist, getConnectedUsers, clearUsers }