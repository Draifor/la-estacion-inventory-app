import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function showAlert(type: string, message: string) {
  const props = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    // theme: "light",
  };

  const successProps = {
    ...props,
    type: toast.TYPE.SUCCESS,
  };

  const errorProps = {
    ...props,
    type: toast.TYPE.ERROR,
  };

  const warningProps = {
    ...props,
    type: toast.TYPE.WARNING,
  };

  const infoProps = {
    ...props,
    type: toast.TYPE.INFO,
  };

  switch (type) {
    case "success":
      toast.success(message, successProps);
      break;
    case "error":
      toast.error(message, errorProps);
      break;
    case "warning":
      toast.warning(message, warningProps);
      break;
    case "info":
      toast.info(message, infoProps);
      break;
    default:
      toast(message, props);
      break;
  }


}
