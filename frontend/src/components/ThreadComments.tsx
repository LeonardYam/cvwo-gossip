import { ListItem, ListItemText, Typography, ListItemAvatar, Avatar, IconButton } from "@mui/material"
import ReplyIcon from '@mui/icons-material/Reply';
import Reply from "./Reply"
import { Comment } from "../app/types"

const ThreadComments = ({comment, user, setParent} : {comment: Comment, user: string | null, setParent: () => void}) => {
    return (
        <ListItem divider alignItems="flex-start" secondaryAction={user &&
            <IconButton onClick={setParent} edge="start">
                <ReplyIcon />
            </IconButton>
        }>
            <ListItemAvatar>
                <Avatar>
                    {comment.Author[0]} 
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={comment.Author} secondary={
                <>
                    {comment.Parentcomment !== null && <Reply commentId={comment.Parentcomment}/>}
                    <Typography variant="body1" color="text.primary">{comment.Commenttext}</Typography>
                </>
            }
            />
        </ListItem>
    )
}

export default ThreadComments