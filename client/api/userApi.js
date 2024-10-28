import axios from 'axios';

export const deleteUser = async (userId) => {
    const response = await axios.delete(`${process.env.URL}/user/${userId}`); // Adjust the URL as needed
    return response.data;
};
