const getUsers = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/getUsers`, {
      headers: { 'authToken': localStorage.getItem('token')}
    });
    const { users } = await response.json();
    return users;
  } catch (error) {
    console.error(error);
  }
};

const getFriends = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/getFriends`, {
      method: 'GET',
      headers: { 'authToken': token }
    });
    const { friends } = await response.json();
    return friends;
  } catch (error) {
    console.error(error);
  }
};

const createConversation = async (currentUserID, userID) => {
  const token = localStorage.getItem('token');
  try {
    await fetch(`${process.env.REACT_APP_BASE_URL}/messages/createConversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authToken': token
      },
      body: JSON.stringify({ currentUserID, userID })
    });
  } catch (error) {
    console.error(error);
  }
};

export { getUsers, getFriends, createConversation };
