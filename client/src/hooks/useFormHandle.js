// import { useState } from 'react';
// import { useHistory } from 'react-router-dom';
//
// const useFormHandle = (authType) => {
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');
//   const history = useHistory();
//
//   const handleNameChange = e => setName(e.target.value);
//   const handlePasswordChange = e => setPassword(e.target.value);
//   const handleFormSubmit = async e => {
//     e.preventDefault();
//     await fetch(`${process.env.REACT_APP_BASE_URL}/${authType}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, password }),
//     });
//     history.push('/main');
//   };
//   return { handleNameChange, handlePasswordChange, handleFormSubmit };
// };
//
// export default useFormHandle;
