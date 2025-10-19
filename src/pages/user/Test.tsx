/*import { Link } from "react-router-dom";*/
import './test.css'
import Navbar from "../../components/Navbar";

export default function Test() {
    return (
        <>
            <div className="home-container">
                <Navbar />

                <div className="banner-container">
                    <h1 className="text-banner">Test de Snellen</h1>
                </div>


                <div className="info-test">
                    <h1 className="test-title">Informacion del Test</h1>
                    <p className="test-info">
                        Es una prueba que se utiliza para determinar las letras más pequeñas que usted puede leer
                        en una tabla (tabla de Snellen) o tarjeta estandarizada sostenida a una distancia de 20 pies (6 metros).
                        Se utilizan tablas especiales cuando el examen se hace a distancias menores a 20 pies (6 metros).
                        Algunas tablas de Snellen son de hecho monitores de video que muestran letras o imágenes.
                    </p>
                    <h1 className="subtitle">Indicaciones </h1>
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
                </div>

                <div className="grid-container">

                    <div className="grid-item1">
                        <form className="question-form">
                            <h2>¿En cual linea se le dificulta más leer las letras?</h2>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option1" value="a" />
                                <label htmlFor="option1">Linea 5</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option2" value="b" />
                                <label htmlFor="option2">Linea 6</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option3" value="c" />
                                <label htmlFor="option3">Linea 7</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option5" value="d" />
                                <label htmlFor="option5">Linea 8</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option6" value="d" />
                                <label htmlFor="option5">Linea 9</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option7" value="d" />
                                <label htmlFor="option5">Linea 10</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option8" value="d" />
                                <label htmlFor="option5">Linea 11</label>
                            </div>

                            <h2>¿Leyendo de izquierda a derecha, en la linea 6, que letra esta en posicion 3?</h2>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option1" value="a" />
                                <label htmlFor="option1">F</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option2" value="b" />
                                <label htmlFor="option2">E</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option3" value="c" />
                                <label htmlFor="option3">Z</label>
                            </div>

                             <h2>¿Leyendo de izquierda a derecha, en la linea 8, que letra esta en posicion 5?</h2>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option1" value="a" />
                                <label htmlFor="option1">T</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option2" value="b" />
                                <label htmlFor="option2">C</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option3" value="c" />
                                <label htmlFor="option3">O</label>
                            </div>
                            
                            <div className="question-option">
                                <h2 className="text-question">¿Leyendo de izquierda a derecha, en la linea 9, que letra esta en posicion 6?</h2>
                                <input type="radio" name="question1" id="option1" value="a" />
                                <label htmlFor="option1">F</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option2" value="b" />
                                <label htmlFor="option2">P</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option3" value="c" />
                                <label htmlFor="option3">T</label>
                            </div>

                        </form>
                    </div>

                    <div className="grid-item2">
                        <img src="src\assets\snellen_2daOpcion.svg" className="daltonismo" alt="" />
                    </div>
                    <div className="grid-item3">

                    </div>





                </div>
            </div>
        </>
    );
}