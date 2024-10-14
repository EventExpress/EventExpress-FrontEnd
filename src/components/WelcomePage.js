import React from 'react';

const WelcomePage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black">
            <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                    <nav className="-mx-3 flex flex-1 justify-end">
                        {/* Substitua as URLs e textos conforme necessário */}
                        <a
                            href="/dashboard"
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Dashboard
                        </a>
                        <a
                            href="/login"
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Log in
                        </a>
                        <a
                            href="/register"
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Register
                        </a>
                    </nav>
                </header>

                <main className="mt-6">
                    <h1 className="text-4xl font-bold text-center text-black dark:text-white">
                        Bem-vindo à Nossa Aplicação!
                    </h1>
                    <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                        Explore nossas funcionalidades e comece sua jornada.
                    </p>

                    <div className="grid gap-6 mt-10 lg:grid-cols-2 lg:gap-8">
                        {/* Exemplo de card de documentação */}
                        <a
                            href="https://laravel.com/docs"
                            className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-lg transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70"
                        >
                            <h2 className="text-xl font-semibold text-black dark:text-white">Documentação</h2>
                            <p className="mt-4 text-sm">
                                A documentação fornece informações detalhadas sobre todos os recursos da aplicação.
                            </p>
                        </a>

                        {/* Adicione mais cards conforme necessário */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WelcomePage;
