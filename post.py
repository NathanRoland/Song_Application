from sqlalchemy import create_engine, select, delete, func, update
from sqlalchemy.orm import Session
from sqlalchemy.exc import PendingRollbackError, IntegrityError
from classes import *
from sqlalchemy import text
from user import *
from pathlib import Path
from datetime import datetime
# creates the database directory
Path("database").mkdir(exist_ok=True)
engine = create_engine("sqlite:///database/main.db", echo=False)

# initializes the database
Base.metadata.create_all(engine)

def create_post(user_id, post_title, post_text, photo_path=None):
    with Session(engine) as session:
        post = Posts(user_id=user_id, post_title=post_title, post_text=post_text, photo_path=photo_path, time=datetime.now(), likes=0, comments=0)
        session.add(post)
        session.commit()

def remove_post(post_id: int):
    with Session(engine) as session:
        session.execute(delete(Posts).where(Posts.post_id == post_id))
        session.commit()

def searchforLikePosts(search):
    with Session(engine) as session:
        return session.execute(select(Posts.post_id, Posts.post_title, Posts.post_text, Posts.photo_path, Posts.time, Posts.likes, Posts.comments).where(Posts.post_title.like(search))).all()

def get_post_from_post_id(post_id: int):
    with Session(engine) as session:
        return session.execute(select(Posts.user_id, Posts.post_title, Posts.post_text, Posts.photo_path, Posts.time, Posts.likes, Posts.comments).where(Posts.post_id == post_id)).all()

def get_posts_from_user_id(user_id: int):
    with Session(engine) as session:
        return session.execute(select(Posts.post_id, Posts.post_title, Posts.post_text, Posts.photo_path, Posts.time, Posts.likes, Posts.comments).where(Posts.user_id == user_id)).all()

def add_post_like(post_id: int):
    with Session(engine) as session:
        session.execute(update(Posts).where(Posts.post_id == post_id).values(likes=Posts.likes + 1))
        session.commit()

def add_post_comment(post_id: int):
    with Session(engine) as session:
        session.execute(update(Posts).where(Posts.post_id == post_id).values(comments=Posts.comments + 1))
        session.commit()

def remove_post_comment(post_id: int):
    with Session(engine) as session:
        session.execute(update(Posts).where(Posts.post_id == post_id).values(comments=Posts.comments - 1))
        session.commit()

def remove_post_like(post_id: int):
    with Session(engine) as session:
        session.execute(update(Posts).where(Posts.post_id == post_id).values(likes=Posts.likes - 1))
        session.commit()

def create_post_comment(user_id, post_id, comment_text, time, parent_comment_id):
    with Session(engine) as session:
        session.execute(update(Posts).where(Posts.post_id == post_id).values(comments=Posts.comments + 1))
        comment = PostComments(user_id=user_id, post_id=post_id, comment_text=comment_text, time=time, likes=0, parent_comment_id=parent_comment_id)
        session.add(comment)
        session.commit()

def get_post_comment_from_comment_id(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(PostComments.user_id, PostComments.post_id, PostComments.comment_text, PostComments.time, PostComments.likes, PostComments.parent_comment_id).where(PostComments.comment_id == comment_id)).all()

def remove_post_comment(post_id: int, comment_id: int):
    with Session(engine) as session:
        session.execute(update(Posts).where(Posts.post_id == post_id).values(comments=Posts.comments - 1))
        session.execute(delete(PostComments).where(PostComments.comment_id == comment_id))
        session.commit()

def create_post_like(user_id, post_id):
    with Session(engine) as session:
        like = PostLikes(user_id=user_id, post_id=post_id)
        session.execute(update(Posts).where(Posts.post_id == post_id).values(likes=Posts.likes + 1))
        session.add(like)
        session.commit()

def get_post_like_from_user_id(user_id: int):
    with Session(engine) as session:
        return session.execute(select(PostLikes.post_id).where(PostLikes.user_id == user_id)).all()

def remove_post_like(user_id, post_id):
    with Session(engine) as session:
        session.execute(delete(PostLikes).where(PostLikes.user_id == user_id and PostLikes.post_id == post_id))
        session.execute(update(Posts).where(Posts.post_id == post_id).values(likes=Posts.likes - 1))
        session.commit()

def get_post_likes(post_id: int):
    with Session(engine) as session:
        return session.execute(select(PostLikes.user_id).where(PostLikes.post_id == post_id)).all()

def get_post_comments(post_id: int):
    with Session(engine) as session:
        return session.execute(select(PostComments.comment_id, PostComments.user_id, PostComments.post_id, PostComments.comment_text, PostComments.time, PostComments.likes, PostComments.parent_comment_id).where(PostComments.post_id == post_id)).all()

def get_post_comment_likes(comment_id: int):
    with Session(engine) as session:
        return session.execute(select(PostComments.likes).where(PostComments.comment_id == comment_id)).all()
