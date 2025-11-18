import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneOptical, getAllProducts, createCatalogue } from "../../services/api";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import styles from "./addProduct.module.css";

export default function AddProduct() {
  const { id } = useParams(); // id de la óptica
  const navigate = useNavigate();
  const [opticName, setOpticName] = useState("");
  const [products, setProducts] = useState<{ id_product: number; nameProduct: string }[]>([]);
  const [formData, setFormData] = useState({
    id_product: "",
    description: "",
    price: "",
    image: null as File | null,
  });

  useEffect(() => {
    if (!id) return;
    const fetchOptical = async () => {
      try {
        const optic = await getOneOptical(Number(id));
        setOpticName(optic.nameOp);
      } catch (err) {
        console.error("Error cargando óptica:", err);
      }
    };
    fetchOptical();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(); // obtiene productos base (id, nameProduct)
        setProducts(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
        console.log("Error data:", err.response?.data);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!id) return;

  try {

    const data = new FormData();
    data.append("optical", id); 
    data.append("nameP", formData.id_product);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.image) data.append("image", formData.image);

    await createCatalogue(data);

    // 🟢 Mensaje de éxito
    await Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: "El producto se agregó correctamente al catálogo.",
      timer: 2000,
      showConfirmButton: false,
    });

    navigate(`/viewO/${id}`);

  } catch (err) {
    console.error("Error registrando producto:", err);

    // 🔴 Mensaje de error
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al registrar el producto.",
    });
  }
};


  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Agregar productos a: {opticName}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Producto base:
            <select
              name="id_product"
              value={formData.id_product}
              onChange={handleChange}
              required
              className={styles.input}
            >
              <option value="">Selecciona un producto</option>
              {products.map((p) => (
                <option key={p.id_product} value={p.id_product}>
                  {p.nameProduct}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Descripción:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ejemplo: Lentes de contacto blandos de uso diario"
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Precio:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ejemplo: 150000"
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Imagen:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.input_file}
            />
          </label>

          <button type="submit" className={styles.submit_btn}>
            Guardar producto
          </button>
        </form>
      </div>
    </>
  );
}
