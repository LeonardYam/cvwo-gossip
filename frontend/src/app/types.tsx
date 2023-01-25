export type Thread = {ID: number, Title:string, Threadtext: string, Postedon: string, Author: string}

export type NewThread = Omit<Thread, "ID" | "Postedon">

export type Comment = {ID: number, Commenttext: string, Postedon: string, Threadid: number, Parentcomment: number | null, Author: string}

export type NewComment = Omit<Comment, "ID" | "Postedon">

export type TagThread = {threadId: number, tagText: string}

export type ThreadWithComments = {ID: number, Title:string, Threadtext: string, Postedon: string, Author: string, Comments: Comment[]}

export type LoginUser = {Username: string, pw: string}