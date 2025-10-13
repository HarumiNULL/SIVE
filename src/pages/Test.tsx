/*import { useState } from "react";*/
import { Link }  from "react-router-dom";
import './test.css'
/*import { questionary } from "../services/api";*/

export default function Test(){

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="home-logo">
                    <img 
                    src="/src/assets/sunglasses.png"
                    alt="Logo"
                    className="logo-img"
                    />
                    <span>S I V E</span>
                </div>
                <div className="home-buttons">
                    <Link to="/login" className="btn cerrar">
                        Cerrar Sesión
                    </Link>
                </div>
            </header>

            <div className="banner-container">
                <h1 className="text-banner">Test de Snellen</h1>
            </div>

            <div className="grid-container">
                <div className="grid-item1">
                    <h1 className="test-title">Informacion del Test</h1>
                    <p className="test-description">
                        Es una prueba que se utiliza para determinar las letras más pequeñas que usted puede leer 
                        en una tabla (tabla de Snellen) o tarjeta estandarizada sostenida a una distancia de 20 pies (6 metros). 
                        Se utilizan tablas especiales cuando el examen se hace a distancias menores a 20 pies (6 metros).
                        Algunas tablas de Snellen son de hecho monitores de video que muestran letras o imágenes.
                    </p>
                    <h3 className="subtitle">Indicaciones</h3>
                    <p className="test-description">
                        - Asegúrese de que la iluminación de la habitación sea adecuada y configure el brillo del teléfono al 100%.
                    </p>
                    <p className="test-description">
                        - Sostenga la pantalla a 1,2 m (4 pies) del paciente (aproximadamente el extremo de una cama de hospital estándar si el paciente está sentado en posición vertical).
                    </p>
                    <p className="test-description">
                    - Examine cada ojo por separado. El paciente debe cubrir completamente el ojo opuesto.
                    </p>
                    <p className="test-description">
                    - Consulte Perlas/Errores para obtener más instrucciones.
                    </p>
                    <form className="question-form">
                        <h2>¿En cual linea se le dificulta más leer las letras? </h2>
                        <div className="question-option">
                            <label>
                            <input type="radio" name="question1" value="a" />
                            Línea 1
                            </label>
                        </div>
                        <div className="question-option">
                            <label>
                            <input type="radio" name="question1" value="b" />
                            Línea 2
                            </label>
                        </div>
                        <div className="question-option">
                            <label>
                            <input type="radio" name="question1" value="c" />
                            Línea 3
                            </label>
                        </div>
                        <div className="question-option">
                            <label>
                            <input type="radio" name="question1" value="d" />
                            Línea 4
                            </label>
                        </div>
                    </form>  
                </div>

                <div className="grid-item2">
                    <img src="src\assets\test de snellen.jpeg" className="snellen" alt="" />
                </div>
            </div>
        </div>   
    );
}