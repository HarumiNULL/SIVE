import Navbar from "../../components/Navbar";
import "./Home.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";

export default function Home() {
  const{ role } = useAuth();
  const getStartPath = () => {
    if(role === 1){
      return "/homeAdmin";
    }
    if(role === 3 || role === 2){
      return"/listOptical";
    }
    return"/login";
  }
  const getTestsPath = () => {
    if (role === 2) {
      return "/viewO";
    }
    if (role === 3)
    return "/listTest";
    return"/login";
  };

  const getTestsText = () => {
    if (role === 2) {
      return "Ver mis opticas";
    }
    return "Ir a Tests Visuales";
  }

  const getStartText = () =>{
    if (role === 2 || role === 3) {
      return "Ver Opticas";
    }
    return "Comenzar";
  }

  const startPath = getStartPath();
  const testsPath = getTestsPath();
  const testsText = getTestsText();
  const startText = getStartText();
  return (
    <>
      <Navbar />
      <div className="home">
        {/* ==== Sección principal ==== */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Tu visión <span className="highlight">es importante</span>
            </h1>
            <p className="hero-subtitle">
             SIVE Ponemos la tecnología a trabajar por tus ojos, asegurando tu acceso directo a ópticas de calidad
            </p>

            <Link to ={startPath} className = "hero-btn">{startText}</Link>
          </div>
        </section>

        {/* ==== Sección de beneficios ==== */}
        <section className="features-section">
          <h2>¿Qué ofrece SIVE?</h2>
          <div className="features-container">
            <div className="feature-card">
              <img src="/public/test.jpg" alt="Test visual" />
              <h3>Tests Inteligentes</h3>
              <p>Evalúa tu visión de forma sencilla</p>
            </div>

            <div className="feature-card">
              <img src="/public/optica.jpg" alt="Ópticas" />
              <h3>Encuentra Ópticas</h3>
              <p>Ubica ópticas certificadas a un clic</p>
            </div>
          </div>
        </section>

        {/* ==== Sección final ==== */}
        <section className="cta-section">
          <h2>Empieza a cuidar tu visión hoy mismo</h2>
          <Link to ={testsPath} className="cta-btn">{testsText}</Link>
        </section>
      </div>
    </>
  );
}
