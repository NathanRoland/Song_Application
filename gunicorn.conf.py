# Gunicorn configuration file
import os

# Server socket
bind = "0.0.0.0:{}".format(os.environ.get("PORT", "5001"))
backlog = 2048

# Worker processes
workers = 2
worker_class = "sync"
timeout = 30
keepalive = 2

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "song-application"

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (not needed on Render as they handle SSL)
keyfile = None
certfile = None 