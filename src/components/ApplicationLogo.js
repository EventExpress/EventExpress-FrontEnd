// src/components/ApplicationLogo.js
const ApplicationLogo = (props) => (
    <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        fill="none"        // Sem preenchimento
        stroke="orange"    // Cor da borda laranja
        strokeWidth="4"    // Espessura da borda
        width="50"         // Tamanho ajustável
        height="50"        // Tamanho ajustável
    >
        <path d="M32 12l-20 16v22h12V40h16v10h12V28L32 12zm0-8l24 20v26a2 2 0 0 1-2 2h-14V40H24v12H10a2 2 0 0 1-2-2V24L32 4z" />
    </svg>
);

export default ApplicationLogo;
