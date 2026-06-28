import json
from urllib.parse import urlparse

from flask import Flask
from flask import jsonify
from flask import request

app = Flask(__name__)

# Keys: integer post IDs
# Values: post dict objects matching API spec
posts = {
    1: {
        "id": 1,
        "upvotes": 1,
        "title": "My First Post",
        "link": "https://example.com",
        "username": "user1",
        "name": "Comment 1",
        "text": "Hello world!",
        "comments": [
            {
                "id": 0,
                "upvotes": 1,
                "text": "Hello world!",
                "username": "user1"
            }
        ]
    }
}
post_id_counter = 2

@app.route("/")
def home():
    return "Server is running!"

# Route 1: GET all posts
@app.route("/api/posts/", methods = ["GET"])
def get_posts():
    """Return a list of all posts."""
    return jsonify({"posts": list(posts.values())}), 200

# Route 2: Create a post
@app.route("/api/posts/", methods = ["POST"])
def create_post():
    """Create a new post. Return the new post created."""
    global post_id_counter
    body = request.get_json()

    post = {
        "id": post_id_counter,
        "upvotes": 1,
        "title": body.get("title", ""),
        "link": body.get("link", ""),
        "username": body.get("username", ""),
        "name": body.get("name", ""),
        "text": body.get("text", ""),
        "comments": []
        }

    posts[post_id_counter] = post
    post_id_counter += 1
    
    return jsonify({"post": post}), 201

# Route 3: GET a specific post
@app.route("/api/posts/<int:post_id>/", methods = ["GET"])
def get_post(post_id):
    """Return a specific post by ID."""
    post = posts.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify({"post": post}), 200

# Route 4: Delete a specific post
@app.route("/api/posts/<int:post_id>/", methods = ["DELETE"])
def delete_post(post_id):
    """Delete a specific post by ID."""
    post = posts.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    del posts[post_id]
    return jsonify({"post": post}), 200

# Route 5: GET all comments for a post
@app.route("/api/posts/<int:post_id>/comments/", methods = ["GET"])
def get_comments(post_id):
    """Return all comments for a specific post."""
    post = posts.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify({"comments": post["comments"]}), 200

# Route 6: Create a comment on a post
@app.route("/api/posts/<int:post_id>/comments/", methods = ["POST"])
def create_comment(post_id):
    """Create a comment on a specific post."""
    post = posts.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    
    body = request.get_json()
    comment_id = len(post["comments"])

    comment = {
        "id": comment_id,
        "upvotes": 1,
        "text": body.get("text", ""),
        "username": body.get("username", "")
    }

    post["comments"].append(comment)
    return jsonify({"comment": comment}), 201

# Route 7: Edit a comment (upvote / update a comment)
@app.route("/api/posts/<int:post_id>/comments/<int:comment_id>/", methods=["POST"])
def edit_comment(post_id, comment_id):
    """Edit (upvote) a specific comment."""
    post = posts.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404

    comment = None
    for c in post["comments"]:
        if c["id"] == comment_id:
            comment = c
            break

    if comment is None:
        return jsonify({"error": "Comment not found"}), 404

    body = request.get_json()
    if "upvotes" in body:
        comment["upvotes"] = body["upvotes"]
    if "text" in body:
        comment["text"] = body["text"]
    if "username" in body:
        comment["username"] = body["username"]

    return jsonify({"comment": comment}), 200

# Extra credit
def is_valid_url(url):
    try:
        result = urlparse(url)
        return result.scheme in ("http", "https") and bool(result.netloc)
    except Exception:
        return False

# Helper: validate post body fields
def validate_post_body(body):
    """Returns an error message string if invalid, else None."""
    if not isinstance(body, dict):
        return "Body must be a JSON object"
    if "title" in body and not isinstance(body["title"], str):
        return "title must be a string"
    if "title" in body and body["title"].strip() == "":
        return "title cannot be empty"
    if "link" in body and body["link"] != "" and not is_valid_url(body["link"]):
        return "link must be a valid URL (http or https)"
    if "username" in body and not isinstance(body["username"], str):
        return "username must be a string"
    if "username" in body and body["username"].strip() == "":
        return "username cannot be empty"
    return None

# Helper: validate comment body fields
def validate_comment_body(body):
    if not isinstance(body, dict):
        return "Body must be a JSON object"
    if "text" in body and not isinstance(body["text"], str):
        return "text must be a string"
    if "text" in body and body["text"].strip() == "":
        return "text cannot be empty"
    if "username" in body and not isinstance(body["username"], str):
        return "username must be a string"
    if "username" in body and body["username"].strip() == "":
        return "username cannot be empty"
    if "upvotes" in body and not isinstance(body["upvotes"], int):
        return "upvotes must be an integer"
    if "upvotes" in body and body["upvotes"] < 0:
        return "upvotes cannot be negative"
    return None

# Tier I: Create post with validation
@app.route("/api/extra/posts/", methods=["POST"])
def extra_create_post():
    global post_id_counter
    body = request.get_json(silent=True)
 
    if body is None:
        return jsonify({"error": "Missing or invalid JSON body"}), 400
 
    # Required fields
    for field in ["title", "link", "username"]:
        if field not in body:
            return jsonify({"error": f"Missing required field: {field}"}), 400
 
    error = validate_post_body(body)
    if error:
        return jsonify({"error": error}), 400
 
    post = {
        "id": post_id_counter,
        "upvotes": 1,
        "title": body["title"],
        "link": body["link"],
        "username": body["username"],
        "name": body.get("name", ""),
        "text": body.get("text", ""),
        "comments": []
    }
 
    posts[post_id_counter] = post
    post_id_counter += 1
    return jsonify({"post": post}), 201

# Tier I: Create comment with validation
@app.route("/api/extra/posts/<int:post_id>/comments/", methods=["POST"])
def extra_create_comment(post_id):
    post = posts.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
 
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"error": "Missing or invalid JSON body"}), 400
 
    for field in ["text", "username"]:
        if field not in body:
            return jsonify({"error": f"Missing required field: {field}"}), 400
 
    error = validate_comment_body(body)
    if error:
        return jsonify({"error": error}), 400
 
    comment_id = len(post["comments"])
    comment = {
        "id": comment_id,
        "upvotes": 1,
        "text": body["text"],
        "username": body["username"]
    }
 
    post["comments"].append(comment)
    return jsonify({"comment": comment}), 201
 
 
# Tier I: Edit comment with validation
@app.route("/api/extra/posts/<int:pid>/comments/<int:cid>/", methods=["POST"])
def extra_edit_comment(pid, cid):
    post = posts.get(pid)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
 
    comment = None
    for c in post["comments"]:
        if c["id"] == cid:
            comment = c
            break
 
    if comment is None:
        return jsonify({"error": "Comment not found"}), 404
 
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"error": "Missing or invalid JSON body"}), 400
 
    error = validate_comment_body(body)
    if error:
        return jsonify({"error": error}), 400
 
    if "upvotes" in body:
        comment["upvotes"] = body["upvotes"]
    if "text" in body:
        comment["text"] = body["text"]
    if "username" in body:
        comment["username"] = body["username"]
 
    return jsonify({"comment": comment}), 200

# Tier II: GET posts with optional sort parameter
@app.route("/api/extra/posts/", methods=["GET"])
def extra_get_posts():
    sort = request.args.get("sort")  # URL param: ?sort=increasing or ?sort=decreasing
 
    post_list = list(posts.values())
 
    if sort == "increasing":
        post_list = sorted(post_list, key=lambda p: p["upvotes"])
    elif sort == "decreasing":
        post_list = sorted(post_list, key=lambda p: p["upvotes"], reverse=True)
 
    return jsonify({"posts": post_list}), 200
 
# Tier II: Upvote a post
@app.route("/api/extra/posts/<int:post_id>/", methods=["POST"])
def upvote_post(post_id):
    post = posts.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
 
    body = request.get_json(silent=True)
 
    # Default: increment by 1 if no body provided
    if body is None or "upvotes" not in body:
        increment = 1
    else:
        increment = body["upvotes"]
        if not isinstance(increment, int):
            return jsonify({"error": "upvotes must be an integer"}), 400
 
    post["upvotes"] += increment
 
    return jsonify({
        "id": post["id"],
        "upvotes": post["upvotes"],
        "title": post["title"],
        "link": post["link"],
        "username": post["username"]
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)