import Navbar from "../components/Navbar"
import './testIshihara.css'


export default function TestIshihara() {
    return (
        <>
            <Navbar />

            <div className="home-container">


                <div className="banner-container">
                    <h1 className="text-banner">Test de Ishihara</h1>
                </div>


                <div className="info-test">
                    <h1 className="test-title">Informacion del Test</h1>
                    <p className="test-info">
                        El test de Ishihara consiste en una serie de tableros o placas que contienen puntos de colores
                        dispuestos de manera que forman números o figuras, visibles solo para personas con una visión normal
                        del color. Las personas con daltonismo, o dificultades para distinguir ciertos colores, no podrán ver
                        correctamente los números o figuras formadas por los puntos.
                        Tipos de daltonismo detectados:
                         <ul>
                            <li>Protanopia: dificultad para distinguir los colores rojos.</li>
                            <li>Deuteranopia: dificultad para distinguir los colores verdes.</li>
                            <li>Tritanopia: dificultad para distinguir los colores azules.</li>
                            <li>Daltonismo total: dificultad para distinguir todos los colores.</li>
                        </ul>
                       
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
                            <h2>¿Que ves?</h2>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option1" value="a" />
                                <label htmlFor="option1">El numero 12</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option2" value="b" />
                                <label htmlFor="option2">nada</label>
                            </div>
                          
                        </form>
                    </div>

                    <div className="grid-item2">
                        <img src="src\assets\ishihara-1.jpg" className="Ishihara" alt="" />
                        
                        
                    </div>
                    <div className="grid-item3">
                        <form action="" className="question-form">
                            <h2>¿Que ves en la imagen?</h2>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option1" value="a" />
                                <label htmlFor="option1">8</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option2" value="b" />
                                <label htmlFor="option2">3</label>
                            </div>
                        </form>
                           
                    </div>
                    <div className="grid-item4">
                                 <img src="src\assets\ishihara2.jpg" className="Ishihara" alt="" />
                    </div>
                    <div className="grid-item5">
                        <form action=""className="question-form">
                             <h2>¿Que ves en la imagen?</h2>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option1" value="a" />
                                <label htmlFor="option1">5</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option2" value="b" />
                                <label htmlFor="option2">2</label>
                            </div>
                            </form>
                    </div>
                    <div className="grid-item6">
                        <img src="src\assets\ishihara3.jpg" className="Ishihara" alt="" />

                    </div>
                    <div className="grid-item7">
                        <form action="" className="question-form">
                            <div className="question-option">
                                <h2 className="text-question">¿Que ves en la imagen?</h2>
                                <input type="radio" name="question1" id="option1" value="a" />
                                <label htmlFor="option1">nada significativo</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option2" value="b" />
                                <label htmlFor="option2">2</label>
                            </div>
                        </form>
                    </div>
                    <div className="grid-item8">
                             <img src="src\assets\ishihara4.jpg" className="Ishihara" alt="" />

                    </div>
                    <div className="grid-item9">
                        <form action="" className="question-form">
                            <div className="question-option">
                                <h2 className="text-question">¿Que ves en la imagen?</h2>
                                <input type="radio" name="question1" id="option1" value="a" />
                                <label htmlFor="option1">Nada coherente</label>
                            </div>
                            <div className="question-option">
                                <input type="radio" name="question1" id="option2" value="b" />
                                <label htmlFor="option2">5</label>
                            </div>
                           
                        </form>

                    </div>
                    <div className="grid-item10">
                        <img src="src\assets\ishihara5.jpg" className="Ishihara" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}