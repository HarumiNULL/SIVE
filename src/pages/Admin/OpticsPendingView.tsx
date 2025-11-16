import { useEffect, useState } from "react";
import { getPendingOptics, approveOptic, rejectOptic } from "../../services/acceptOwner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModalOptical from "../../components/ModalOptical";
import Navbar from "../../components/Navbar";

interface PendingOptic {
    id_optical: number;
    name: string;
    user_id: number;
    user_email: string;
    peding: boolean;
    
}

export default function OpticsPendingView() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [optics, setOptics] = useState<PendingOptic[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);


    useEffect(() => {
        loadPendingOptics();
    }, []);

    const loadPendingOptics = async () => {
        try {
            setLoading(true);
            const data = await getPendingOptics();
            setOptics(data);
        } catch (error: any) {
            console.error(error);
            Swal.fire("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id_optical: number) => {
        const confirm = await Swal.fire({
            title: "¿Aprobar dueño?",
            text: "El usuario será marcado como dueño verificado.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, aprobar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await approveOptic(id_optical);
            Swal.fire("Aprobado", "El dueño ha sido aprobado.", "success");
            loadPendingOptics();
        } catch (error: any) {
            Swal.fire("Error", error.message, "error");
        }
    };

    const handleReject = async (id_optical: number) => {
        const confirm = await Swal.fire({
            title: "¿Rechazar óptica?",
            text: "La óptica será eliminada y el usuario no será verificado.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, rechazar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await rejectOptic(id_optical);
            Swal.fire("Rechazada", "La óptica ha sido eliminada.", "success");
            loadPendingOptics();
        } catch (error: any) {
            Swal.fire("Error", error.message, "error");
        }
    };

    if (loading) return <p className="text-center mt-10">Cargando...</p>;

    return (
        <>
            <Navbar />

            {/* MODAL — SIEMPRE FUERA DE LA TABLA */}
            {selectedId !== null && (
                <ModalOptical
                    open={open}
                    onClose={() => setOpen(false)}
                    id={selectedId}
                />
            )}

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Ópticas pendientes de aprobación</h1>

                {optics.length === 0 ? (
                    <p>No hay ópticas pendientes.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    
                                    <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                                    <th className="px-4 py-2 text-left font-semibold">Correo dueño</th>
                                    <th className="px-4 py-2 text-center font-semibold">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {optics.map((opt) => (
                                    <tr key={opt.id_optical} className="border-t hover:bg-gray-50">

                                        <td className="px-4 py-2">{opt.name}</td>
                                        <td className="px-4 py-2">{opt.user_email}</td>

                                        <td className="px-4 py-2 flex flex-wrap gap-2 justify-center">

                                            {/* Ver */}
                                            <button
                                                onClick={() => {
                                                    setSelectedId(opt.id_optical);
                                                    setOpen(true);
                                                }}
                                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                                            >
                                                Ver
                                            </button>

                                            {/* Aprobar */}
                                            <button
                                                onClick={() => handleApprove(opt.id_optical)}
                                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                                            >
                                                Aprobar
                                            </button>

                                            {/* Rechazar */}
                                            <button
                                                onClick={() => handleReject(opt.id_optical)}
                                                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                                            >
                                                Rechazar
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}