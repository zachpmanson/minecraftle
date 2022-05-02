from flask import render_template, url_for

from app import app 

@app.route('/')
@app.route('/index')
def index():
    render_args = {
        "title":"Minecrafdle"
    }
    return render_template(
        'index.html',
        **render_args
    )

@app.route('/how-to-play')
def rules():
    render_args = {
        "title":"How To Play"        
    }
    return render_template(
        'how-to-play.html',
        **render_args
    )
