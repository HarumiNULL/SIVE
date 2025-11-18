
import styles from "./infoModal.module.css";

interface InfoModalProps {
    isOpen: boolean;
    title: string;
    content: string;
    onClose: () => void;
}

export default function InfoModal({ isOpen, title, content, onClose }: InfoModalProps) {
    if (!isOpen) return null;

    // Separar texto de enlaces https
    const parts = content.split("https");

    return (
        <div className={styles.modal_overlay} onClick={onClose}>
            <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close_btn} onClick={onClose}>X</button>



                <h2>{title}</h2>

                <p>
                    {parts.length > 1 ? (
                        <>
                            {parts[0]}
                            <a href={`https${parts[1]}`} target="_blank" rel="noopener noreferrer">
                                https{parts[1]}
                            </a>
                        </>
                    ) : (
                        content
                    )}
                </p>
            </div>
        </div>
    );
}
