from flask import Flask
from deepface import DeepFace
import datetime

import os
from flask import render_template, request, redirect, url_for, flash, send_from_directory
from werkzeug.utils import secure_filename
app = Flask(__name__)

UPLOAD_FOLDER = 'app/static/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app.config['SECRET_KEY'] = 'your_secret_key_here'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']

        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            flash('File uploaded successfully')

            objs = DeepFace.analyze(img_path=path,
                                    actions=['age', 'gender', 'race', 'emotion']
                                    )

            print(f"A pessoa tem {objs[0]['age']} anos")
            print(f"Gênero: {objs[0]['dominant_gender']}")
            print(f"Etnia: {objs[0]['dominant_race']}")

            return redirect(url_for('uploaded_file', filename=filename))
    return render_template('upload.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/teste')
def teste():
    DeepFace.stream(db_path="C:\TrabalhosDeProgramacao\Projetos\deepfaceTests\database",model_name="DeepFace")

if __name__ == '__main__':
    app.run(debug=True)
