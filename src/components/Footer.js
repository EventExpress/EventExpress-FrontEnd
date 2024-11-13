import React from 'react';
import ApplicationLogo from '../components/ApplicationLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 py-4"> {}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-around">
                <div className="w-full sm:w-1/3 md:w-1/4 mb-4"> {}
                    <h4 className="text-lg font-semibold mb-1">Sobre Nós</h4> {}
                    <p className="text-sm">
                        Somos uma empresa especializada na locação de espaços para eventos, oferecendo uma variedade de locais para atender diferentes necessidades.
                    </p>
                </div>
                <div className="w-full sm:w-1/3 md:w-1/4 mb-4"> {}
                    <h4 className="text-lg font-semibold mb-1">Navegação</h4> {}
                    <ul className="space-y-1"> {}
                        <li><a href="/anuncios" className="hover:text-orange-500 transition-colors duration-200">Anúncios</a></li>
                        <li><a href="/relatorios" className="hover:text-orange-500 transition-colors duration-200">Relatórios</a></li>
                        <li><a href="/" className="hover:text-orange-500 transition-colors duration-200">Contato</a></li>
                    </ul>
                </div>
                <div className="w-full sm:w-1/3 md:w-1/4 mb-4"> {}
                    <h4 className="text-lg font-semibold mb-1">Redes Sociais</h4> {}
                    <ul className="space-y-1"> {}
                        <li>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-orange-500 transition-colors duration-200">
                                <FontAwesomeIcon icon={faFacebook} className="mr-2" /> Facebook
                            </a>
                        </li>
                        <li>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-orange-500 transition-colors duration-200">
                                <FontAwesomeIcon icon={faInstagram} className="mr-2" /> Instagram
                            </a>
                        </li>
                        <li>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-orange-500 transition-colors duration-200">
                                <FontAwesomeIcon icon={faTwitter} className="mr-2" /> Twitter
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-center mb-4"> {}
                <ApplicationLogo className="h-10 w-auto" /> {}
            </div>
            <div className="border-t border-gray-700 mt-4 pt-2 text-center"> {}
                <p className="text-xs">&copy; {new Date().getFullYear()} EventExpress. Todos os direitos reservados.</p> {}
            </div>
        </footer>
    );
};

export default Footer;
