import { Link } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress';
import ThreadForm from "../components/ThreadForm";
import { useGetThreadsByTagQuery } from "../reducers/api";
import { useState, useMemo } from "react"

const Home = ({user}: {user: string | null}) => {
    const [tag, setTag] = useState('')
    const [filter, setFilter] = useState('')
    const {
        data: threads = [],
        isLoading,
        isSuccess,
        isError,
    } = useGetThreadsByTagQuery(tag);
    
    // Memoized to avoid re-sorting every rerender
    const sortedThreads = useMemo(() => {
        const sortedThreads = threads.slice() // Make a copy
        // Sort threads based on ascending date order
        sortedThreads.sort((a, b) => new Date(a.Postedon).getTime() - new Date(b.Postedon).getTime())
        return sortedThreads
    }, [threads])

    let content;
    if (isLoading) {
        content = <CircularProgress />
    } else if (isSuccess) {
        content = (
            <List>
                {sortedThreads.map(t => (
                    <ListItem key={t.ID} divider>
                        <ListItemButton component={Link} to={`/thread/${t.ID}`}>{t.Title} {t.Author}</ListItemButton>
                    </ListItem>))}
            </List>
            )  
    } else if (isError) {
        content = <p>No threads found!</p>
    }

    return (
        <Box>
            <Box>
                <FormControl>
                    <TextField id="filter" value={filter} onChange={e => setFilter(e.target.value)}/>
                    <Button onClick={() => setTag(filter)}>Filter</Button>
                </FormControl>
            </Box>
            {user && <ThreadForm user={user}/>}
            <Box>
                {content}
            </Box>
        </Box>
    )
}

export default Home;