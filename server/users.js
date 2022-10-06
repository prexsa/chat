const users = [];

const addUser = (id, name) => {
  const existingUser = users.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase())

  if (existingUser) return { error: "Username has already been taken" }

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

const deleteUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if(index !== -1) return users.splice(index, 1)[0];
}

const getAllUsers = () => {
  // console.log('getAllUsers: ', users)
  return users
}

module.exports = { addUser, getUser, deleteUser, getAllUsers }