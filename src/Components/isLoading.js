export const IsLoading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            <span>Loading...</span>
        </div>
    )
}