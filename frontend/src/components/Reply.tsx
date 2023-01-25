import { CircularProgress, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGetCommentByIdQuery } from "../reducers/api";

const Reply = ({commentId} : {commentId: number}) => {
    const {
        data: comment,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetCommentByIdQuery(commentId);

    let content;
    if (isLoading) {
        content = <CircularProgress />
    } else if (isSuccess) {
        content = 
        <ListItem disablePadding>
            <ListItemIcon>
                <ArrowForwardIosIcon />
            </ListItemIcon>
            <ListItemText primary={comment.Author} secondary={comment.Commenttext} />
        </ListItem>
    } else if (isError) {
        content = <p>Error fetching parent!</p>
        console.error(error)
    }

    return (
        <div>
            {content}
        </div>
    )
}

export default Reply;