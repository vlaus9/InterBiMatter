import { useAppSelector } from "../../app/hooks";
import ModalWindowComponent from "./ModalWindowComponent";

const ModalWindow: React.FC = () => {

    const configModalWindow = useAppSelector((state) => state.isOpenModalWindowSlice)

    return (
        <>
            <ModalWindowComponent config={configModalWindow} />
        </>
    )
}

export default ModalWindow