package routes

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/LeonardYam/cvwo-gossip/backend/internal/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
)


type Server struct {
	queries *database.Queries
	ctx context.Context
	tokenAuth *jwtauth.JWTAuth
}

func NewServer(q *database.Queries, c context.Context, t *jwtauth.JWTAuth) *Server {
	return &Server{queries: q, ctx: c, tokenAuth: t}
}

func (s *Server) GetAPIRoutes() func(r chi.Router) {
	return func(r chi.Router) {		
		// Public routes
		r.Group(func (r chi.Router) {
			r.Get("/threads", s.getAllThreads())
			r.Get("/threads/{id}", s.getThreadById())
			r.Get("/tags/{tag}", s.getThreadsByTag())
			r.Get("/comments/t-{threadId}", s.getCommentsByThread())
			r.Get("/comments/c-{commentId}", s.getCommentById())
			r.Post("/login", s.login())
			r.Post("/user", s.createUser())		
		})

		// Authenticated routes
		r.Group(func(r chi.Router) {
			// Find JWT tokens
			r.Use(jwtauth.Verifier(s.tokenAuth))

			// Handle valid / invalid tokens with provided middleware
			r.Use(jwtauth.Authenticator)
			r.Post("/tags", s.createTagThread())
			r.Post("/threads", s.createThread())
			r.Post("/comments", s.createComment())
		})
	}
}

func (s *Server) getAllThreads() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		threads, err := s.queries.GetAllThreads(s.ctx)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(threads)
		}
	}
}

func (s *Server) getThreadById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idParam, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 32)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		id := int32(idParam)
		thread, err := s.queries.GetThreadById(s.ctx, id);
		
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(thread)
		}
	}
}

func (s *Server) getThreadsByTag() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tag := chi.URLParam(r, "tag")
		tag = strings.ToLower(tag)
		threads, err := s.queries.GetThreadsByTag(s.ctx, tag);
		
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(threads)
		}
	}
}

func (s *Server) createTagThread() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var tagThread database.CreateTagThreadParams

		// Parse POST request body
		if err := json.NewDecoder(r.Body).Decode(&tagThread); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		lowercase := strings.ToLower(tagThread.Tagtext)
		tagThread.Tagtext = lowercase

		newTagThread, err := s.queries.CreateTagThread(s.ctx, tagThread)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(newTagThread)
		}
	}
}

func (s *Server) createThread() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var thread database.CreateThreadParams
		
		// Decode jwt token
		_, claims, _ := jwtauth.FromContext(r.Context())
		
		if user, ok := claims["user"].(string); ok {
			thread.Author = user
		} else { // No user found in token
			http.Error(w, "Invalid token!", http.StatusBadRequest)
			return
		}
		
		// Parse POST request body
		if err := json.NewDecoder(r.Body).Decode(&thread); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Insert into SQL database
		newThread, err := s.queries.CreateThread(s.ctx, thread)
		if  err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		} else {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(newThread)
		}
	}
}

func (s *Server) getCommentsByThread() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idParam, err := strconv.ParseInt(chi.URLParam(r, "threadId"), 10, 32)
		
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		id := int32(idParam)

		comments, err := s.queries.GetCommentsByThread(s.ctx, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(comments)
		}
	}
}

func (s *Server) getCommentById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idParam, err := strconv.ParseInt(chi.URLParam(r, "commentId"), 10, 32)
		
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		id := int32(idParam)

		comment, err := s.queries.GetCommentById(s.ctx, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(comment)
		}
	}
}


func (s *Server) createComment() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var comment database.CreateCommentParams
		
		// Decode jwt token
		_, claims, _ := jwtauth.FromContext(r.Context())
		
		if user, ok := claims["user"].(string); ok {
			comment.Author = user
		} else { // No user found in token
			http.Error(w, "Invalid token!", http.StatusBadRequest)
			return
		}
		
		// Parse POST request body
		if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		newComment, err := s.queries.CreateComment(s.ctx, comment)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.Header().Set("Content-type", "application/json")
			json.NewEncoder(w).Encode(newComment)
		}
	}
}

func (s *Server) login() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user database.LoginUserParams
		
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, err.Error(), http.StatusNotAcceptable)
			return
		}
		
		existingUser, err := s.queries.LoginUser(s.ctx, user)
		if err != nil { // User does not exist
			http.Error(w, "No such user exists!", http.StatusBadRequest)
		} else {
			_, tokenString, _ := s.tokenAuth.Encode(map[string]interface{}{"user":existingUser})
			w.Write([]byte(tokenString))
		}
	}	
}

func (s *Server) createUser() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user database.CreateUserParams
		
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, err.Error(), http.StatusNotAcceptable)
			return
		}

		// Check for existing user
		_, err := s.queries.GetUser(s.ctx, user.Username)
		if err == nil { // User exists
			http.Error(w, "Username already exists!", http.StatusBadRequest)
		} else {
			s.queries.CreateUser(s.ctx, user)
			w.Write([]byte("Successful user creation!"))
		}
	}
}

