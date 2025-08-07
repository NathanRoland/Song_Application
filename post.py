from sqlalchemy import create_engine, select, delete, func, update, text
from sqlalchemy.orm import Session
from sqlalchemy.exc import PendingRollbackError, IntegrityError
from classes import *
import os
from database_manager import engine, execute_with_retry

from pathlib import Path
from datetime import datetime

# creates the database directory
Path("database").mkdir(exist_ok=True)

# initializes the database
Base.metadata.create_all(engine)

def create_post(user_id, post_title, post_text, photo_path=None):
    def _create_post(session):
        post = Posts(user_id=user_id, post_title=post_title, post_text=post_text, photo_path=photo_path, time=datetime.now(), likes=0, comments=0)
        session.add(post)
    
    execute_with_retry(_create_post)

def remove_post(post_id: int):
    def _remove_post(session):
        session.execute(delete(Posts).where(Posts.post_id == post_id))
    
    execute_with_retry(_remove_post)

def searchforLikePosts(search):
    def _search_posts(session):
        return session.execute(select(Posts.post_id, Posts.post_title, Posts.post_text, Posts.photo_path, Posts.time, Posts.likes, Posts.comments).where(Posts.post_title.like(search))).all()
    
    return execute_with_retry(_search_posts)

def get_post_from_post_id(post_id: int):
    def _get_post(session):
        return session.execute(select(Posts.user_id, Posts.post_title, Posts.post_text, Posts.photo_path, Posts.time, Posts.likes, Posts.comments).where(Posts.post_id == post_id)).all()
    
    return execute_with_retry(_get_post)

def get_posts_from_user_id(user_id: int):
    def _get_posts(session):
        return session.execute(select(Posts.post_id, Posts.post_title, Posts.post_text, Posts.photo_path, Posts.time, Posts.likes, Posts.comments).where(Posts.user_id == user_id)).all()
    
    return execute_with_retry(_get_posts)

def add_post_like(post_id: int):
    def _add_like(session):
        session.execute(update(Posts).where(Posts.post_id == post_id).values(likes=Posts.likes + 1))
    
    execute_with_retry(_add_like)

def add_post_comment(post_id: int):
    def _add_comment(session):
        session.execute(update(Posts).where(Posts.post_id == post_id).values(comments=Posts.comments + 1))
    
    execute_with_retry(_add_comment)

def remove_post_comment(post_id: int):
    def _remove_comment(session):
        session.execute(update(Posts).where(Posts.post_id == post_id).values(comments=Posts.comments - 1))
    
    execute_with_retry(_remove_comment)

def remove_post_like(post_id: int):
    def _remove_like(session):
        session.execute(update(Posts).where(Posts.post_id == post_id).values(likes=Posts.likes - 1))
    
    execute_with_retry(_remove_like)

def create_post_comment(user_id, post_id, comment_text, time, parent_comment_id):
    def _create_comment(session):
        session.execute(update(Posts).where(Posts.post_id == post_id).values(comments=Posts.comments + 1))
        comment = PostComments(user_id=user_id, post_id=post_id, comment_text=comment_text, time=time, likes=0, parent_comment_id=parent_comment_id)
        session.add(comment)
    
    execute_with_retry(_create_comment)

def get_post_comment_from_comment_id(comment_id: int):
    def _get_comment(session):
        return session.execute(select(PostComments.user_id, PostComments.post_id, PostComments.comment_text, PostComments.time, PostComments.likes, PostComments.parent_comment_id).where(PostComments.comment_id == comment_id)).all()
    
    return execute_with_retry(_get_comment)

def remove_post_comment(post_id: int, comment_id: int):
    def _remove_comment(session):
        session.execute(update(Posts).where(Posts.post_id == post_id).values(comments=Posts.comments - 1))
        session.execute(delete(PostComments).where(PostComments.comment_id == comment_id))
    
    execute_with_retry(_remove_comment)

def create_post_like(user_id, post_id):
    def _create_like(session):
        like = PostLikes(user_id=user_id, post_id=post_id)
        session.execute(update(Posts).where(Posts.post_id == post_id).values(likes=Posts.likes + 1))
        session.add(like)
    
    execute_with_retry(_create_like)

def get_post_like_from_user_id(user_id: int):
    def _get_likes(session):
        return session.execute(select(PostLikes.post_id).where(PostLikes.user_id == user_id)).all()
    
    return execute_with_retry(_get_likes)

def remove_post_like(user_id, post_id):
    def _remove_like(session):
        session.execute(delete(PostLikes).where(PostLikes.user_id == user_id and PostLikes.post_id == post_id))
        session.execute(update(Posts).where(Posts.post_id == post_id).values(likes=Posts.likes - 1))
    
    execute_with_retry(_remove_like)

def get_post_likes(post_id: int):
    def _get_likes(session):
        return session.execute(select(PostLikes.user_id).where(PostLikes.post_id == post_id)).all()
    
    return execute_with_retry(_get_likes)

def get_post_comments(post_id: int):
    def _get_comments(session):
        return session.execute(select(PostComments.comment_id, PostComments.user_id, PostComments.comment_text, PostComments.time, PostComments.likes, PostComments.parent_comment_id).where(PostComments.post_id == post_id)).all()
    
    return execute_with_retry(_get_comments)

def get_post_comment_likes(comment_id: int):
    def _get_comment_likes(session):
        return session.execute(select(PostComments.likes).where(PostComments.comment_id == comment_id)).all()
    
    return execute_with_retry(_get_comment_likes)
