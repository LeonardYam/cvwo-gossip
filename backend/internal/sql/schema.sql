CREATE TABLE users (
    username text PRIMARY KEY,
    pw text NOT NULL
);

CREATE TABLE threads (
    id serial PRIMARY KEY,
    title text NOT NULL,
    threadText text NOT NULL,
    postedOn date NOT NULL, 
    author text REFERENCES users (username) NOT NULL
);

CREATE TABLE comments (
    id serial PRIMARY KEY,
    commentText text NOT NULL,
    postedOn date NOT NULL,
    threadId serial REFERENCES threads (id) NOT NULL, 
    parentComment serial REFERENCES comments (id),
    author text REFERENCES users (username) NOT NULL
);

-- Store relation between threads and tags
CREATE TABLE threads_tags (
    threadId serial REFERENCES threads (id) NOT NULL,
    tagText text NOT NULL
);
