import React, { useState, useRef, useEffect } from 'react';
import './RoundImageInput.css';
import { useParams } from 'react-router-dom';
import { savePicture } from '../../network/ApiAxios';

const RoundImageInput = ({ userProfilePicture, setUserProfilePicture }) => {
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    setUserProfilePicture(user.profilePicture);
  }, [user.profilePicture, setUserProfilePicture]);
  const handleImageChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0]; // get the selected file
    if (!file) {
      setError('Please select an image');
      return;
    }
    const formData = new FormData();
    formData.append('profilePicture', file);
    try {
      const response = await savePicture(user._id, formData);
      const { data } = response;
      if (data.success) { 
        console.log(data.user)
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        setError(data.message || 'Unknown error');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to upload image');
    }
  };
  
 
  return (
    <form ref={formRef} onSubmit={handleImageChange}>
      <div className="round-image-input-container">
        <label htmlFor="image" className="round-image-input-label">
          {userProfilePicture && (
            <img src={`http://localhost:5100/uploads/${userProfilePicture}`} 
              alt="Profile"
              className="round-image-input-image"
              
            />
          )}
        </label>
        <input type="file" id="image" accept="image/*" className="round-image-input-field" onChange={handleImageChange} />
      </div>
      {error && <div className="round-image-input-error">{error}</div>}
    </form>
  );
};

export default RoundImageInput;
