-- name: GetAllThreads :many
SELECT * FROM threads;

-- name: GetThreadById :one
SELECT * FROM threads
WHERE id = $1;

-- name: GetCommentsByThread :many
SELECT * FROM comments
WHERE threadId = $1
ORDER BY id ASC;

-- name: GetThreadsByTag :many
SELECT * FROM threads t, threads_tags tags
WHERE t.id = tags.threadId AND tags.tagText = $1;

-- name: GetCommentById :one
SELECT * FROM comments
WHERE id = $1;

-- name: CreateThread :one
INSERT INTO threads (title, threadText, postedOn, author) 
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: CreateComment :one
INSERT INTO comments (commentText, postedOn, threadId, parentComment, author) 
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetTagsByCount :many
SELECT tagText FROM threads_tags
GROUP BY tagText
ORDER BY COUNT(tagText) DESC;

-- name: CreateTagThread :one
INSERT INTO threads_tags (threadId, tagText) 
VALUES ($1, $2)
RETURNING *;

-- name: GetUser :one
SELECT username FROM users
WHERE username = $1;

-- name: CreateUser :one
INSERT INTO users (username, pw) 
VALUES ($1, $2)
RETURNING username;

-- name: LoginUser :one
SELECT username FROM users
WHERE username = $1 AND pw = $2;