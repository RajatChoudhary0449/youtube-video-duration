import { toast } from 'react-toastify';
import { isMobile } from '../constant/values';

const toastNotification = (message, type = 'success') => {
    toast(message, {
        type: type,
        position: 'top-right',
        autoClose: 3000,
        style: {
            paddingRight: "0.5rem",
            maxWidth: isMobile ? '50%' : '100%',
        },
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
    });
};

export default toastNotification;
