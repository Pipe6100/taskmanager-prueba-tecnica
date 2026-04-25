interface ErrorAlertProps {
    message: string;
    onRetry?: () => void;
  }
  
  function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
          <span className="text-red-600 text-xs font-bold">!</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">Ha ocurrido un error</p>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }
  
  export default ErrorAlert;