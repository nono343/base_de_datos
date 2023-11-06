from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_uploads import UploadSet, configure_uploads, IMAGES  # Importa Flask-Uploads

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///productos.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Configuración para la carga de imágenes
photos = UploadSet('photos', IMAGES)
app.config['UPLOADED_PHOTOS_DEST'] = 'uploads'  # Directorio para almacenar las imágenes subidas
configure_uploads(app, photos)

class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    descripcion = db.Column(db.String(200))
    precio = db.Column(db.Float)
    imagen = db.Column(db.String(255))  # Campo para la ruta de la imagen

@app.route('/')
def lista_productos():
    productos = Producto.query.all()
    productos_list = [{'id': producto.id, 'nombre': producto.nombre, 'descripcion': producto.descripcion, 'precio': producto.precio, 'imagen': producto.imagen} for producto in productos]
    return jsonify(productos_list)

@app.route('/agregar_producto', methods=['POST'])
def agregar_producto():
    if request.method == 'POST':
        data = request.form
        nombre = data['nombre']
        descripcion = data['descripcion']
        precio = data['precio']

        imagen = request.files['imagen']
        if imagen:
            imagen_nombre = photos.save(imagen)  # Guarda la imagen subida
        else:
            imagen_nombre = None

        producto = Producto(nombre=nombre, descripcion=descripcion, precio=precio, imagen=imagen_nombre)
        db.session.add(producto)
        db.session.commit()

        return jsonify({'message': 'Producto agregado correctamente'})

if __name__ == '__main__':
    app.run()
