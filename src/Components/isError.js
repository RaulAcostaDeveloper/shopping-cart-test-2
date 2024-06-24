'use client'
export const IsError = ({errorInfo}) => {
    const onRetry = () => {
        console.log('retry');
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800">
            <div className="text-3xl font-bold mb-4">¡Algo salió mal!</div>
            <div className="text-lg mb-4">{errorInfo ? <span>{errorInfo}</span>: <span>Es probable que haya un error al obtener los datos del host</span>}</div>
            <button 
                onClick={()=>onRetry()} 
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
            >
                Por favor, recarga la página
            </button>
        </div>
    )
}