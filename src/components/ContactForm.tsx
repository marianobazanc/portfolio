import React, { useState, useRef } from "react"
import emailjs from '@emailjs/browser';

interface FormData {
    nombre: string;
    email: string;
    mensaje: string;
}

export const ContactForm: React.FC = () => {
    const [status, setStatus] = useState("start")
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        email: '',
        mensaje: ''
    })
    const formRef = useRef<HTMLFormElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (formRef.current) {
            try {
                setStatus("loading")
                emailjs.sendForm('SERVICE_KEY', 'TEMPLATE_KEY', formRef.current, 'PUBLIC_KEY')
                    .then((result) => {
                        console.log("Cargando...")
                        setStatus("correct")
                        setTimeout(() => {
                            setStatus("start")
                        }, 5000)
                    }, (error) => {
                        console.log(error.text);
                        setStatus("error")
                        setTimeout(() => {
                            setStatus("start")
                        }, 5000)
                    });
            } catch (error) {
                setStatus("error")
            }
        } else {
            console.error("Form element not found");
        }

        setFormData({
            nombre: '',
            email: '',
            mensaje: ''
        })
    }
    return (
        <form
            onSubmit={handleSubmit}
            ref={formRef}
            className="mt-6 flex flex-col gap-2 items-center"
        >
            <div className="flex flex-col w-2/3 lg:w-1/3">
                <label>Nombre</label>
                <input
                    className="bg-transparent border rounded ps-2 py-1 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                    pattern="^[a-zA-ZáéíóúÁÉÍÓÚ\s]{3,50}$"
                />
            </div>
            <div className="flex flex-col w-2/3 lg:w-1/3">
                <label>Email</label>
                <input
                    className="bg-transparent border rounded ps-2 py-1 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@correo.com"
                    required
                />
            </div>
            <div className="flex flex-col w-2/3 lg:w-1/3">
                <label>Mensaje</label>
                <textarea
                    className="bg-transparent border rounded ps-2 py-1 pb-4 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Tu mensaje"
                    required></textarea>
            </div>
            <button
                type="submit"
                className="mt-2 border rounded w-2/3 lg:w-1/3 py-1 transition duration-300 ease-in-out hover:bg-slate-600">
                {status === "loading" ? "Cargando..." : "Enviar"}
            </button>
            {
                status === "correct" &&
                (
                    <div className="w-2/3 md:w-1/3 mt-4 p-4 text-center mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <span className="font-medium">¡Mensaje enviado correctamente!</span>.
                    </div>
                )

            }
            {
                status === "error" &&
                (
                    <div className="w-2/3 md:w-1/3 mt-4 p-4 text-center mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">¡Error al enviar!</span>.
                    </div>
                )

            }

        </form>
    )
}
