import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="px-6 py-2 bg-primary-foreground text-primary rounded-lg hover:bg-muted transition-colors duration-300"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}

