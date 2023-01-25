import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import FormLabel from '@mui/material/FormLabel'
import React, { useState } from 'react';
import Button from '@mui/material/Button'
import { useCreateNewThreadMutation, useCreateTagThreadMutation } from '../reducers/api';

const ThreadForm = ({user} : {user: string}) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [tag, setTag] = useState('')
    const [addNewThread, { isLoading: threadLoad }] = useCreateNewThreadMutation()
    const [addNewTag, {isLoading: tagLoad}] = useCreateTagThreadMutation()

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setTitle(e.target.value)
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)
    const handleTagChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setTag(e.target.value)

    const handleSubmit = async () => {
        try {
            const newThread = await addNewThread({Title: title, Threadtext: text, Author: user}).unwrap()
            addNewTag({threadId: newThread.ID, tagText: tag})
            setTitle('')
            setText('')
            setTag('')
        } catch (e) {
            console.error("Thread submission failed!")
        }
    }

    if (threadLoad || tagLoad) {
        return <CircularProgress />
    }

    return (
        <FormControl>
            <FormLabel>New Thread</FormLabel>
            <TextareaAutosize
                required
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Title"
            />
            <TextareaAutosize
                required
                id="text"
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text"
            />
            <TextareaAutosize 
                id="tag"
                value={tag}
                onChange={handleTagChange}
                placeholder="Enter a tag"
            />
            <Button onClick={handleSubmit}>Post</Button>
        </FormControl>
    )
}

export default ThreadForm;