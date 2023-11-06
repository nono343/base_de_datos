import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: null, // Nuevo estado para la imagen
    };
  }

  handleInputChange = (event) => {
    const { name, value, type } = event.target;
    if (type === 'file') {
      this.setState({ imagen: event.target.files[0] }); // Almacena el archivo de imagen
    } else {
      this.setState({ [name]: value });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { nombre, descripcion, precio, imagen } = this.state;

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('imagen', imagen);

    fetch('http://localhost:5000/agregar_producto', {
      method: 'POST',
      body: formData, // Usa FormData para enviar archivos
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message); // Mensaje del servidor
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del Producto"
              value={this.state.nombre}
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción del Producto"
              value={this.state.descripcion}
              onChange={this.handleInputChange}
            />
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={this.state.precio}
              onChange={this.handleInputChange}
            />
            <input
              type="file" // Campo para subir la imagen
              name="imagen"
              accept="image/*" // Acepta solo imágenes
              onChange={this.handleInputChange}
            />
            <button type="submit">Agregar Producto</button>
          </form>
        </header>
      </div>
    );
  }
}

export default App;
