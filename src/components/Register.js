"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/components/Button";
import ApplicationLogo from "@/components/ApplicationLogo";
import Link from "next/link";
import "@/app/globals.css";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nome: "",
        sobrenome: "",
        telefone: "",
        datanasc: "",
        email: "",
        tipousu: [],
        cpf: "",
        cnpj: "",
        cidade: "",
        cep: "",
        numero: "",
        bairro: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "cpf") {
            const unformattedCpf = value.replace(/\D/g, "").slice(0, 11);
            const formattedCpf = unformattedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); 
            setFormData({ ...formData, [name]: formattedCpf });
            setErrors({ ...errors, cpf: unformattedCpf.length < 11 ? "CPF inválido" : "" }); 
        } else if (name === "cnpj") {
            const unformattedCnpj = value.replace(/\D/g, "").slice(0, 14);
            const formattedCnpj = unformattedCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
            setFormData({ ...formData, [name]: formattedCnpj });
            setErrors({ ...errors, cnpj: unformattedCnpj.length < 14 ? "CNPJ inválido" : "" });
        } else if (name === "telefone") {
            const formattedTel = value.replace(/\D/g, "").slice(0, 11)
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d{4})$/, "$1-$2");
            setFormData({ ...formData, [name]: formattedTel });
            setErrors({ ...errors, telefone: formattedTel.length < 15 ? "Telefone inválido" : "" });
        } else if (name === "cep") {
            const unformattedCep = value.replace(/\D/g, "").slice(0, 8);
            const formattedCep = unformattedCep.replace(/(\d{5})(\d{1,3})/, "$1-$2");
    
            setFormData(prevState => ({
                ...prevState,
                [name]: formattedCep,
            }));

            setErrors({ ...errors, cep: unformattedCep.length < 8 ? "CEP inválido" : "" });
    
            if (unformattedCep.length === 8) {
                buscarCep(formattedCep);
            }
        } else if (name === "datanasc") {
            const currentDate = new Date();
            const inputDate = new Date(value);
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, datanasc: inputDate > currentDate ? "Data de nascimento inválida" : "" });
        } else if (name === "tipousu") {
            const newTipousu = formData.tipousu.includes(value)
                ? formData.tipousu.filter((tip) => tip !== value)
                : [...formData.tipousu, value];
            setFormData({ ...formData, tipousu: newTipousu });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const buscarCep = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data) {
                setFormData({
                    ...formData,
                    cidade: response.data.localidade || "",
                    bairro: response.data.bairro || "",
                });
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const response = await axios.post("http://localhost:8000/api/register", formData);
            console.log("Usuário registrado com sucesso:", response.data);
            setMessage("Usuário registrado com sucesso!");
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                router.push("/login");
            }, 2000); // Exibe o popup por 2 segundos antes de redirecionar
        } catch (error) {
            if (error.response) {
                console.error("Erro no registro:", error.response.data);
                setMessage(`Erro no registro: ${error.response.data.message || "Erro desconhecido"}`);
            } else {
                console.error("Erro na requisição:", error.message);
                setMessage(`Erro na requisição: ${error.message}`);
            }
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000); // Exibe o popup por 2 segundos
        } finally {
            setIsLoading(false);
        }
    };

    const isLocadorOrPrestador = formData.tipousu.includes("Locador") || formData.tipousu.includes("Prestador");
    const [message, setMessage] = useState(""); // Estado para armazenar a mensagem do popup
    const [showPopup, setShowPopup] = useState(false);


    return (
        <div>
            <NavBar /> {}
            <div
                className="flex flex-col items-center p-4 min-h-screen"
                style={{
                    backgroundImage: "url('/images/evento.jpg')",
                    backgroundSize: "cover", 
                    backgroundPosition: "center", 
                }}
            >
                            {showPopup && (
                <div className="fixed top-0 left-0 right-0 p-4 bg-green-500 text-white text-center z-50">
                    {message}
                </div>
            )}
                <ApplicationLogo className="mb-4" />
                <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-3xl w-full mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nome" className="block text-orange-500">Nome</label>
                            <input
                                id="nome"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="sobrenome" className="block text-orange-500">Sobrenome</label>
                            <input
                                id="sobrenome"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                name="sobrenome"
                                value={formData.sobrenome}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="block text-orange-500">Telefone</label>
                            <input
                                id="telefone"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                required
                            />
                            {errors.telefone && <p className="text-red-500">{errors.telefone}</p>}
                        </div>
                        <div>
                            <label htmlFor="datanasc" className="block text-orange-500">Data de Nascimento</label>
                            <input
                                id="datanasc"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="date"
                                name="datanasc"
                                value={formData.datanasc}
                                onChange={handleChange}
                                required
                            />
                            {errors.datanasc && <p className="text-red-500">{errors.datanasc}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-orange-500">Email</label>
                            <input
                                id="email"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-orange-500 mb-2">Tipo de Usuário</label>
                            <div className="flex flex-col md:flex-row md:space-x-4">
                                {["Locatario", "Locador", "Prestador"].map((tipo) => (
                                    <label
                                        key={tipo}
                                        className={`flex-1 cursor-pointer border rounded-lg p-4 text-center transition duration-300 ease-in-out transform hover:scale-105 ${
                                            formData.tipousu.includes(tipo) ? 'bg-orange-500 text-white border-orange-600' : 'bg-gray-700 text-white border-gray-200'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            name="tipousu"
                                            value={tipo}
                                            checked={formData.tipousu.includes(tipo)}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        {tipo}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="cpf" className="block text-orange-500">CPF</label>
                            <input
                                id="cpf"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                required
                            />
                            {errors.cpf && <p className="text-red-500">{errors.cpf}</p>}
                        </div>
                        {isLocadorOrPrestador && (
                            <div>
                                <label htmlFor="cnpj" className="block text-orange-500">CNPJ</label>
                                <input
                                    id="cnpj"
                                    className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    type="text"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                />
                                {errors.cnpj && <p className="text-red-500">{errors.cnpj}</p>}
                            </div>
                        )}
                        <div>
                            <label htmlFor="cidade" className="block text-orange-500">Cidade</label>
                            <input
                                id="cidade"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="cep" className="block text-orange-500">CEP</label>
                            <input
                                id="cep"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                name="cep"
                                value={formData.cep}
                                onChange={handleChange}
                                required
                            />
                            {errors.cep && <p className="text-red-500">{errors.cep}</p>}
                        </div>
                        <div>
                            <label htmlFor="numero" className="block text-orange-500">Número</label>
                            <input
                                id="numero"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                name="numero"
                                value={formData.numero}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="bairro" className="block text-orange-500">Bairro</label>
                            <input
                                id="bairro"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                name="bairro"
                                value={formData.bairro}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-orange-500">Senha</label>
                            <input
                                id="password"
                                className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md">
                            {isLoading ? "Carregando..." : "Registrar"}
                        </button>
                    </div>
                    <div className="mt-4 text-center text-white">
                        Já tem uma conta? 
                        <Link href="/login" className="underline text-orange-500">Faça login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;


