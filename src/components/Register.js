"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/components/Button";
import ApplicationLogo from "@/components/ApplicationLogo";
import Link from "next/link";
import "@/app/globals.css";

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

        // Atualizações de formatação e validação para CPF, CNPJ, telefone e CEP
        if (name === "cpf") {
            const unformattedCpf = value.replace(/\D/g, "").slice(0, 11);
            setFormData({ ...formData, [name]: unformattedCpf });
            setErrors({ ...errors, cpf: unformattedCpf.length < 11 ? "CPF inválido" : "" });
        } else if (name === "cnpj") {
            const unformattedCnpj = value.replace(/\D/g, "").slice(0, 14);
            setFormData({ ...formData, [name]: unformattedCnpj });
            setErrors({ ...errors, cnpj: unformattedCnpj.length < 14 ? "CNPJ inválido" : "" });
        } else if (name === "telefone") {
            const formattedTel = value.replace(/\D/g, "").slice(0, 11)
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d{4})$/, "$1-$2");
            setFormData({ ...formData, [name]: formattedTel });
            setErrors({ ...errors, telefone: formattedTel.length < 15 ? "Telefone inválido" : "" });
        } else if (name === "cep") {
            const formattedCep = value.replace(/\D/g, "").slice(0, 8)
                .replace(/(\d{5})(\d)/, "$1-$2");
            setFormData({ ...formData, [name]: formattedCep });
            setErrors({ ...errors, cep: formattedCep.length < 9 ? "CEP inválido" : "" });
            if (formattedCep.length === 9) {
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
            router.push("/login");
        } catch (error) {
            if (error.response) {
                console.error("Erro no registro:", error.response.data);
            } else {
                console.error("Erro na requisição:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isLocadorOrPrestador = formData.tipousu.includes("Locador") || formData.tipousu.includes("Prestador");

    return (
        <div
        className="flex flex-col items-center p-4 min-h-screen"
        style={{
            backgroundImage: "url('/images/evento.jpg')", // Ajuste o caminho da imagem
            backgroundSize: "cover", // Faz a imagem cobrir toda a área
            backgroundPosition: "center", // Centraliza a imagem
        }}
    >
        <ApplicationLogo className="mb-4" />
        <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-3xl w-full mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campos de entrada com mensagens de erro */}
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
                                        className="sr-only" // Esconde o checkbox padrão
                                    />
                                    {tipo}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Campo CPF, visível para todos os tipos de usuários */}
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

                    {/* Campo CNPJ, visível apenas para Locador e Prestador */}
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
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Carregando..." : "Registrar"}
                    </Button>
                </div>

                <div className="mt-4 text-center text-white">
                Já tem uma conta?
                    <Link href="/login" className="underline  text-orange-500">Faça login</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
