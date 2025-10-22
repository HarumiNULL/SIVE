import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// 1. Datos: Array de objetos donde cada objeto es un punto en el eje X
const datosEstadisticos = [
  { nombre: 'Enero', ventas: 4000, costo: 2400 },
  { nombre: 'Febrero', ventas: 3000, costo: 1398 },
  { nombre: 'Marzo', ventas: 2000, costo: 9800 },
  { nombre: 'Abril', ventas: 2780, costo: 3908 },
  // ... más datos
];

export const GraficoDeBarrasSimple = () => {
  return (
    // ResponsiveContainer asegura que el gráfico se ajuste al tamaño del contenedor
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={datosEstadisticos} // Asignamos los datos aquí
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {/* Líneas de la cuadrícula en el fondo (opcional) */}
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* Eje X (categorías): usa la clave 'nombre' de tus datos */}
        <XAxis dataKey="nombre" />
        
        {/* Eje Y (valores) */}
        <YAxis />
        
        {/* Tooltip: la caja que aparece al pasar el ratón por la barra */}
        <Tooltip />
        
        {/* Leyenda: identifica qué representa cada barra (opcional) */}
        <Legend />
        
        {/* La primera serie de barras: usa la clave 'ventas' */}
        <Bar dataKey="ventas" fill="#8884d8" name="Ventas Totales" />
        
        {/* La segunda serie de barras (opcional): usa la clave 'costo' */}
        <Bar dataKey="costo" fill="#82ca9d" name="Costo de Productos" />

      </BarChart>
    </ResponsiveContainer>
  );
};

export default GraficoDeBarrasSimple;