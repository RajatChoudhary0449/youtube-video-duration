import { toast } from 'react-toastify';

const toastNotification = (message, type = 'success') => {
    const isMobile = window.innerWidth <= 768;
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
