import { Modal } from "antd";
import AppointmentBooking from "./appointment-booking";

export const AppointmentModal = ({ open, onClose }: any) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title={<span className="text-xl font-bold">Book an Appointment</span>}
    >
      <AppointmentBooking />
    </Modal>
  );
};
