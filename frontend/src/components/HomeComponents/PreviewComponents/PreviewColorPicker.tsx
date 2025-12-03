import { Box } from "@mui/material";
import BackgroundModal from "../EditComponents/EditParts/BackgroundModal";


function PreviewColorPicker() {
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
                <BackgroundModal />
            </Box>
        </>
    )
}

export default PreviewColorPicker;