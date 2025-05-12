
import React from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EmailConfirmation = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-purple-500" />
          </div>
          <h1 className="text-xl font-bold mb-2">Confirme seu email</h1>
          <p className="text-gray-600">
            Enviamos um email de confirmação para você. Clique no link para ativar sua conta.
          </p>
        </div>

        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Não recebeu?</AlertTitle>
          <AlertDescription>
            Verifique sua pasta de spam ou solicite um novo email.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-3">
          <Button className="w-full">
            Reenviar email
          </Button>
          <Button variant="outline" asChild>
            <Link to="/" className="w-full">
              Voltar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
