import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import Button from '@mui/material/Button'
import { useCreateNewCommentMutation, useGetCommentByIdQuery } from '../reducers/api';
import { CircularProgress } from '@mui/material';

const PreviewParent = ({parentId, clear} : {parentId: number, clear: () => void}) => {
    const {
        data: comment,
        isLoading,
        isSuccess,
        isError,
    } = useGetCommentByIdQuery(parentId);

    let content; 
    if (isLoading) {
        content = <CircularProgress />
    } else if (isSuccess) {
        content = 
        <>
            <p>{comment.Commenttext.substring(0, 20) + "..."}</p>
            <Button onClick={clear}>Clear parent</Button>
        </>
    } else if (isError) {
        clear()
    }

    return (
        <div>
            {content}
        </div>
    )
}

const CommentForm = ({threadId, user, parent, clear} : {threadId : number, user: string, parent: number | null, clear: () => void} ) => {
    const [comment, setComment] = useState('')
    const [addNewComment, { isLoading }] = useCreateNewCommentMutation()
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)
    const handleSubmit = async () => {
        try {
            await addNewComment({Commenttext: comment, Parentcomment: parent, Threadid: threadId, Author: user}).unwrap()
            clear()
            setComment('')
        } catch (e) {
            console.error(e)
        }
    }

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <>
            {parent && <PreviewParent parentId={parent} clear={clear}/>}
            <FormControl>
                <TextField 
                    required
                    id="comment"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Write your comment"
                />
                <Button disabled={comment === ''} onClick={handleSubmit}>Comment</Button>
            </FormControl>
        </>
    )
}

export default CommentForm;