import {DataGrid} from "@mui/x-data-grid";
import {styled} from "@mui/material/styles";

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    "& .MuiDataGrid-columnHeader": {
        backgroundColor: theme.palette.primary.dark,
    },
    "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: "bold",
        color: theme.palette.text.secondary,
    },
    "& .MuiDataGrid-row": {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.secondary.main,
        },
        "&:nth-of-type(even)": {
            backgroundColor: theme.palette.secondary.dark,
        },
        "&:hover": {},
    },
    // row and selected
    "& .MuiDataGrid-row.Mui-selected": {
        // backgroundColor: theme.palette.primary.light,
    },
    "& .MuiDataGrid-cell": {
        color: theme.palette.text.secondary,
        "&:hover": {
            cursor: "pointer",
        },
    },
}));

export default StyledDataGrid;
