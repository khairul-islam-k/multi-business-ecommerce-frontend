import Swal from 'sweetalert2';

export const successMessage = (message: string) => {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 1500
    });
};

export default successMessage;