
import { useParams } from "react-router-dom"
import { CircularProgress, List } from "@mui/material";
import ThreadComments from "../components/ThreadComments";
import CommentForm from "../components/CommentForm";
import { useGetThreadByIdQuery } from "../reducers/api";
import { useState } from "react"

const Thread = ({user} : {user: string | null}) => {
    // Id cannot be undefined since <Thread> is called in /thread/:id  
    const { id: idParam } = useParams() as {id: string};
    const id = parseInt(idParam, 10);

    // Determine which comment to reply to
    const [parent, setParent] = useState<number | null>(null);

    const {
        data: thread,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetThreadByIdQuery(id);

    let content;
    if (isLoading) {
        content = <CircularProgress />
    } else if (isSuccess) {
        content = 
        <>
            <h2>{thread.Title}</h2>
            <p>{thread.Threadtext}</p>
            <List>
                {thread.Comments?.map(c => <ThreadComments key={c.ID} comment={c} user={user} setParent={() => setParent(c.ID)}/>)}
            </List>
            {user && <CommentForm threadId={id} user={user} parent={parent} clear={() => setParent(null)}/>}
        </>
    } else if (isError) {
        content = <p>No such thread found!</p>
        console.error(error)
    }

    return (
        <div>
            {content}
        </div>
    )
}

export default Thread;