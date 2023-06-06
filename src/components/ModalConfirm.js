import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteUser } from "../services/UserService";

const ModalConfirm = ({
  show,
  handleClose,
  dataUserDelete,
  handleDeleteUserFromModal,
}) => {
  const confirmDelete = async () => {
    let res = await deleteUser(dataUserDelete.id);
    if (res && +res.statusCode === 204) {
      toast.success("Delete User Success");
      handleClose();
      handleDeleteUserFromModal(dataUserDelete);
    } else {
      toast.error("Delete User Error");
    }
    console.log(res);
  };
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete A User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            Are you sure you want to delete
            <br />
            <b>delete Email: {dataUserDelete.email}?</b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => confirmDelete()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalConfirm;
