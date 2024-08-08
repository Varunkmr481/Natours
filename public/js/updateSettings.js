import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
    
    try{

        const url = type==='data' ? 'http://localhost:3000/api/v1/users/updateMe' : 'http://localhost:3000/api/v1/users/updateMyPassword';
        
        const res = await axios({
            method : 'PATCH',
            url : url,
            data : data
        });

        if(res.data.status === 'success'){
            showAlert('success', `${type.toUpperCase()} Updated Succesfully!`);

            window.setTimeout(()=> {
                location.reload(true);
                location.assign('/');
            })
        }

    }catch(err){
        showAlert('error', err.response.data.message);
    }
}